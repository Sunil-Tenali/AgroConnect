/**
 * AgroConnect Backend API Server
 * 
 * RESTful API for the AgroConnect farmer-customer marketplace platform.
 * Handles user authentication, product management, cart operations, orders, reviews, and machinery rental.
 * 
 * Key Features:
 * - User registration and authentication for farmers and customers
 * - Product and machinery management for farmers
 * - Shopping cart and order placement for customers
 * - Review system for quality assurance
 * - Machinery rental marketplace
 * 
 * Database: PostgreSQL with stored procedures for business logic
 * Session Management: Email-based (stored in localStorage on client)
 * Future: Consider implementing JWT tokens for stateless authentication
 */

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./database");

const app = express();
const PORT = Number(process.env.PORT || 4000);

// CORS configuration: allow frontend to communicate with this API
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// Wrapper to handle async errors in route handlers and pass them to error middleware
const asyncHandler = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

// Normalize email addresses to lowercase and trim whitespace for case-insensitive lookups
const normalizeEmail = (email) => String(email || "").trim().toLowerCase();


// ========================
// HEALTH CHECK ENDPOINT
// ========================

app.get("/health", asyncHandler(async (_req, res) => {
  const result = await pool.query("SELECT NOW() AS now");
  res.json({ ok: true, database_time: result.rows[0].now });
}));

// ========================
// AUTHENTICATION ENDPOINTS
// ========================
// Handles user registration and login for both farmers and customers.
// Note: Passwords are stored in plaintext (SECURITY ISSUE - use bcrypt in production)
// Credentials validation is done server-side with immediate database feedback.

app.post("/farmersignup", async (req, res) => {
  const { email, fname, lname, password } = req.body;

  if (!email || !fname || !password) {
    return res.status(400).json({
      error: "Email, first name, and password are required",
    });
  }

  try {
    // Calls PostgreSQL stored procedure to handle farmer registration
    // Procedure checks for duplicate email and creates farmer record
    await pool.query(
      "CALL register_farmer($1, $2, $3, $4)",
      [email.toLowerCase().trim(), fname, lname, password]
    );

    res.status(201).json({
      message: "Farmer registered successfully",
      user: {
        email: email.toLowerCase().trim(),
        fname,
        lname,
        user_type: 1,
      },
    });
  } catch (error) {
    console.error("Farmer registration error:", error);

    res.status(500).json({
      error: error.message || "Farmer registration failed",
    });
  }
});

app.post("/customersignup", async (req, res) => {
  const { email, fname, lname, password } = req.body;

  if (!email || !fname || !password) {
    return res.status(400).json({
      error: "Email, first name, and password are required",
    });
  }

  try {
    // Calls PostgreSQL stored procedure to handle customer registration
    // Procedure checks for duplicate email and creates customer record
    await pool.query(
      "CALL register_customer($1, $2, $3, $4)",
      [email.toLowerCase().trim(), fname, lname, password]
    );

    res.status(201).json({
      message: "Customer registered successfully",
      user: {
        email: email.toLowerCase().trim(),
        fname,
        lname,
        user_type: 0,
      },
    });
  } catch (error) {
    console.error("Customer registration error:", error);

    res.status(500).json({
      error: error.message || "Customer registration failed",
    });
  }
});

app.post("/login", asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query(
    `SELECT email, fname, lname, password, user_type
     FROM f2c_user
     WHERE email = $1`,
    [normalizeEmail(email)]
  );

  // SECURITY: Plain password comparison is used here. In production, use bcrypt.
  if (result.rows.length === 0 || result.rows[0].password !== password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const user = result.rows[0];
  res.json({
    message: "Login successful",
    user: {
      email: user.email,
      fname: user.fname,
      lname: user.lname,
      user_type: user.user_type,
      role: user.user_type === 1 ? "farmer" : "customer",
    },
  });
}));


// ========================
// PRODUCT METADATA ENDPOINTS
// ========================

app.get("/categories", asyncHandler(async (_req, res) => {
  const result = await pool.query(
    "SELECT category_id, category_name FROM category ORDER BY category_id"
  );
  res.json(result.rows);
}));

app.get("/carriers", asyncHandler(async (_req, res) => {
  const result = await pool.query(
    `SELECT carrier_id, carrier_name, carrier_phone, carrier_email
     FROM carrier
     ORDER BY carrier_name`
  );
  res.json(result.rows);
}));

app.get("/customerdashboard/productHome", asyncHandler(async (_req, res) => {
  const result = await pool.query(
    `SELECT
       p.product_id,
       p.name,
       p.farmer_id,
       CONCAT(u.fname, ' ', COALESCE(u.lname, '')) AS farmer_name,
       p.price,
       p.rating,
       p.review_count,
       p.category_id,
       c.category_name,
       p.description,
       p.available_units,
       p.in_stock,
       cr.carrier_name,
       cr.carrier_phone
     FROM product p
     JOIN farmer f ON f.farmer_id = p.farmer_id
     JOIN f2c_user u ON u.email = f.farmer_id
     JOIN category c ON c.category_id = p.category_id
     LEFT JOIN carrier cr ON cr.carrier_id = p.carrier_id
     WHERE p.in_stock = TRUE
     ORDER BY p.product_id DESC`
  );

  res.json(result.rows);
}));

app.post("/customerdashboard/productHome", asyncHandler(async (req, res) => {
  const { customer_id, product_ids } = req.body;

  if (!customer_id) {
    return res.status(400).json({ error: "customer_id is required" });
  }

  if (!Array.isArray(product_ids) || product_ids.length === 0) {
    return res.status(400).json({ error: "product_ids must be a non-empty array" });
  }

  for (const productId of product_ids) {
    await pool.query("CALL add_to_shopping_cart($1, $2)", [
      normalizeEmail(customer_id),
      Number(productId),
    ]);
  }

  const cart = await pool.query("SELECT * FROM get_customer_cart($1)", [
    normalizeEmail(customer_id),
  ]);

  res.status(201).json({ message: "Added to cart successfully", cart: cart.rows });
}));

app.get("/customerdashboard/cart", asyncHandler(async (req, res) => {
  const customerId = normalizeEmail(req.query.customer_id);

  if (!customerId) {
    return res.status(400).json({ error: "customer_id query parameter is required" });
  }

  const result = await pool.query("SELECT * FROM get_customer_cart($1)", [customerId]);
  res.json(result.rows);
}));

app.patch("/customerdashboard/cart/:product_id", asyncHandler(async (req, res) => {
  const customerId = normalizeEmail(req.body.customer_id || req.query.customer_id);
  const productId = Number(req.params.product_id);
  const quantity = Number(req.body.quantity);

  if (!customerId || !productId || Number.isNaN(quantity)) {
    return res.status(400).json({ error: "customer_id, product_id, and quantity are required" });
  }

  await pool.query("CALL update_cart_quantity($1, $2, $3)", [customerId, productId, quantity]);
  const result = await pool.query("SELECT * FROM get_customer_cart($1)", [customerId]);
  res.json({ message: "Cart updated", cart: result.rows });
}));

app.delete("/customerdashboard/cart/:product_id", asyncHandler(async (req, res) => {
  const customerId = normalizeEmail(req.query.customer_id || req.body.customer_id);
  const productId = Number(req.params.product_id);

  if (!customerId || !productId) {
    return res.status(400).json({ error: "customer_id and product_id are required" });
  }

  await pool.query("CALL remove_from_shopping_cart($1, $2)", [customerId, productId]);
  const result = await pool.query("SELECT * FROM get_customer_cart($1)", [customerId]);
  res.json({ message: "Removed from cart", cart: result.rows });
}));

app.post("/customerdashboard/placeorder", asyncHandler(async (req, res) => {
  const customerId = normalizeEmail(req.body.customer_id);

  if (!customerId) {
    return res.status(400).json({ error: "customer_id is required" });
  }

  await pool.query("CALL place_order($1)", [customerId]);

  const result = await pool.query(
    `SELECT order_id, customer_id, total_price, order_date, shipping_price,
            delivery_address_id, delivery_date, order_status, quantity
     FROM f2c_order
     WHERE customer_id = $1
     ORDER BY order_id DESC
     LIMIT 1`,
    [customerId]
  );

  res.status(201).json({ message: "Order placed successfully", order: result.rows[0] });
}));

app.get("/customerdashboard/orders", asyncHandler(async (req, res) => {
  const customerId = normalizeEmail(req.query.customer_id);

  if (!customerId) {
    return res.status(400).json({ error: "customer_id query parameter is required" });
  }

  const result = await pool.query("SELECT * FROM get_customer_orders($1)", [customerId]);
  res.json(result.rows);
}));

app.post("/customerdashboard/customercontact", asyncHandler(async (req, res) => {
  const {
    user_id,
    street1,
    street2,
    city,
    state,
    country,
    zipcode,
    phone,
    is_default = true,
  } = req.body;

  if (!user_id || !street1 || !city || !state || !country || !zipcode || !phone) {
    return res.status(400).json({ error: "Required contact fields are missing" });
  }

  await pool.query("CALL add_contact_details($1, $2, $3, $4, $5, $6, $7, $8, $9)", [
    normalizeEmail(user_id),
    street1,
    street2 || "",
    city,
    state,
    country,
    String(zipcode),
    String(phone),
    Boolean(is_default),
  ]);

  res.status(201).json({ message: "Contact details saved successfully" });
}));

app.get("/customerdashboard/customercontact", asyncHandler(async (req, res) => {
  const userId = normalizeEmail(req.query.user_id);

  if (!userId) {
    return res.status(400).json({ error: "user_id query parameter is required" });
  }

  const result = await pool.query(
    `SELECT address_id, user_id, street1, street2, city, state, country, zipcode, phone, is_default
     FROM contact_detail
     WHERE user_id = $1
     ORDER BY is_default DESC, address_id DESC`,
    [userId]
  );

  res.json(result.rows);
}));

app.get("/customerdashboard/reviews", asyncHandler(async (req, res) => {
  const customerId = normalizeEmail(req.query.customer_id);

  if (!customerId) {
    return res.status(400).json({ error: "customer_id query parameter is required" });
  }

  const result = await pool.query(
    `SELECT
       r.review_id,
       r.product_id,
       p.name AS product_name,
       CONCAT(u.fname, ' ', COALESCE(u.lname, '')) AS farmer_name,
       r.rating,
       r.review AS comment,
       r.review_date AS date
     FROM review r
     JOIN product p ON p.product_id = r.product_id
     JOIN f2c_user u ON u.email = p.farmer_id
     WHERE r.customer_id = $1
     ORDER BY r.review_date DESC, r.review_id DESC`,
    [customerId]
  );

  res.json(result.rows);
}));

app.get("/customerdashboard/purchased-products", asyncHandler(async (req, res) => {
  const customerId = normalizeEmail(req.query.customer_id);

  if (!customerId) {
    return res.status(400).json({ error: "customer_id query parameter is required" });
  }

  const result = await pool.query(
    `SELECT DISTINCT
       p.product_id,
       p.name AS product_name,
       CONCAT(u.fname, ' ', COALESCE(u.lname, '')) AS farmer_name
     FROM f2c_order o
     JOIN order_product op ON op.order_id = o.order_id
     JOIN product p ON p.product_id = op.product_id
     JOIN f2c_user u ON u.email = p.farmer_id
     WHERE o.customer_id = $1
     ORDER BY p.name`,
    [customerId]
  );

  res.json(result.rows);
}));

app.post("/customerdashboard/reviews", asyncHandler(async (req, res) => {
  const { customer_id, product_id, rating, comment } = req.body;

  if (!customer_id || !product_id || !rating) {
    return res.status(400).json({ error: "customer_id, product_id, and rating are required" });
  }

  await pool.query("CALL add_review($1, $2, $3, $4)", [
    normalizeEmail(customer_id),
    Number(product_id),
    Number(rating),
    comment || "",
  ]);

  res.status(201).json({ message: "Review saved successfully" });
}));

app.get("/farmerdashboard/summary", asyncHandler(async (req, res) => {
  const farmerId = normalizeEmail(req.query.farmer_id);

  if (!farmerId) {
    return res.status(400).json({ error: "farmer_id query parameter is required" });
  }

  const result = await pool.query(
    `SELECT
       f.farmer_id,
       f.description,
       f.average_rating,
       f.rating_count,
       COUNT(DISTINCT p.product_id)::int AS total_products,
       COALESCE(SUM(op.quantity), 0)::int AS total_units_sold,
       COALESCE(SUM(op.quantity * op.price_at_order_time), 0)::numeric AS total_sales
     FROM farmer f
     LEFT JOIN product p ON p.farmer_id = f.farmer_id
     LEFT JOIN order_product op ON op.product_id = p.product_id
     WHERE f.farmer_id = $1
     GROUP BY f.farmer_id, f.description, f.average_rating, f.rating_count`,
    [farmerId]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Farmer not found" });
  }

  res.json(result.rows[0]);
}));

app.patch("/farmerdashboard/profile", asyncHandler(async (req, res) => {
  const farmerId = normalizeEmail(req.body.farmer_id);
  const { description } = req.body;

  if (!farmerId || description === undefined) {
    return res.status(400).json({ error: "farmer_id and description are required" });
  }

  await pool.query("CALL update_farmer_description($1, $2)", [farmerId, description]);
  res.json({ message: "Description updated" });
}));

app.get("/farmerdashboard/products", asyncHandler(async (req, res) => {
  const farmerId = normalizeEmail(req.query.farmer_id);

  if (!farmerId) {
    return res.status(400).json({ error: "farmer_id query parameter is required" });
  }

  const result = await pool.query(
    `SELECT
       p.product_id,
       p.name,
       p.price,
       p.category_id,
       c.category_name,
       p.description,
       p.available_units,
       p.in_stock,
       p.rating,
       p.review_count,
       cr.carrier_name,
       cr.carrier_phone
     FROM product p
     JOIN category c ON c.category_id = p.category_id
     LEFT JOIN carrier cr ON cr.carrier_id = p.carrier_id
     WHERE p.farmer_id = $1
     ORDER BY p.product_id DESC`,
    [farmerId]
  );

  res.json(result.rows);
}));

app.post("/farmerdashboard/products", asyncHandler(async (req, res) => {
  const {
    name,
    farmer_id,
    price,
    category_id,
    description,
    available_units,
    carrier_phone,
  } = req.body;

  if (!name || !farmer_id || !price || !category_id || !available_units || !carrier_phone) {
    return res.status(400).json({ error: "Required product fields are missing" });
  }

  await pool.query("CALL add_product($1, $2, $3, $4, $5, $6, $7)", [
    name,
    normalizeEmail(farmer_id),
    Number(price),
    Number(category_id),
    description || "",
    Number(available_units),
    String(carrier_phone),
  ]);

  res.status(201).json({ message: "Product added successfully" });
}));

app.patch("/farmerdashboard/products/:product_id", asyncHandler(async (req, res) => {
  const productId = Number(req.params.product_id);
  const farmerId = normalizeEmail(req.body.farmer_id);
  const { price, description, available_units } = req.body;

  if (!productId || !farmerId) {
    return res.status(400).json({ error: "product_id and farmer_id are required" });
  }

  const result = await pool.query(
    `UPDATE product
     SET
       price = COALESCE($1, price),
       description = COALESCE($2, description),
       available_units = COALESCE($3, available_units)
     WHERE product_id = $4 AND farmer_id = $5
     RETURNING *`,
    [
      price === undefined ? null : Number(price),
      description === undefined ? null : description,
      available_units === undefined ? null : Number(available_units),
      productId,
      farmerId,
    ]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.json({ message: "Product updated", product: result.rows[0] });
}));

app.delete("/farmerdashboard/products/:product_id", asyncHandler(async (req, res) => {
  const productId = Number(req.params.product_id);
  const farmerId = normalizeEmail(req.query.farmer_id || req.body.farmer_id);

  if (!productId || !farmerId) {
    return res.status(400).json({ error: "product_id and farmer_id are required" });
  }

  const result = await pool.query(
    "DELETE FROM product WHERE product_id = $1 AND farmer_id = $2 RETURNING product_id",
    [productId, farmerId]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.json({ message: "Product deleted" });
}));

app.get("/farmerdashboard/reviews", asyncHandler(async (req, res) => {
  const farmerId = normalizeEmail(req.query.farmer_id);

  if (!farmerId) {
    return res.status(400).json({ error: "farmer_id query parameter is required" });
  }

  const result = await pool.query(
    `SELECT
       r.review_id,
       r.customer_id,
       CONCAT(u.fname, ' ', COALESCE(u.lname, '')) AS customer_name,
       p.name AS product_name,
       r.rating,
       r.review AS comment,
       r.review_date AS date
     FROM review r
     JOIN product p ON p.product_id = r.product_id
     JOIN f2c_user u ON u.email = r.customer_id
     WHERE p.farmer_id = $1
     ORDER BY r.review_date DESC, r.review_id DESC`,
    [farmerId]
  );

  res.json(result.rows);
}));

app.get("/farmerdashboard/machinery", asyncHandler(async (req, res) => {
  const farmerId = normalizeEmail(req.query.farmer_id);

  if (!farmerId) {
    return res.status(400).json({ error: "farmer_id query parameter is required" });
  }

  const result = await pool.query(
    `SELECT machinery_id, farmer_id, name, description, price_per_day, location, available, created_at
     FROM machinery
     WHERE farmer_id = $1
     ORDER BY machinery_id DESC`,
    [farmerId]
  );

  res.json(result.rows);
}));

app.post("/farmerdashboard/machinery", asyncHandler(async (req, res) => {
  const { farmer_id, name, description, price_per_day, location } = req.body;

  if (!farmer_id || !name || !price_per_day) {
    return res.status(400).json({ error: "farmer_id, name, and price_per_day are required" });
  }

  await pool.query("CALL add_machinery($1, $2, $3, $4, $5)", [
    normalizeEmail(farmer_id),
    name,
    description || "",
    Number(price_per_day),
    location || "",
  ]);

  res.status(201).json({ message: "Machinery added successfully" });
}));

app.get("/farmerdashboard/available-machinery", asyncHandler(async (_req, res) => {
  const result = await pool.query(
    `SELECT
       m.machinery_id,
       m.name,
       m.description,
       m.price_per_day,
       m.location,
       m.available,
       m.farmer_id,
       CONCAT(u.fname, ' ', COALESCE(u.lname, '')) AS owner_name,
       f.average_rating
     FROM machinery m
     JOIN farmer f ON f.farmer_id = m.farmer_id
     JOIN f2c_user u ON u.email = f.farmer_id
     WHERE m.available = TRUE
     ORDER BY m.price_per_day ASC`
  );

  res.json(result.rows);
}));

app.get("/farmerdashboard/rented", asyncHandler(async (req, res) => {
  const userId = normalizeEmail(req.query.user_id || req.query.farmer_id);

  if (!userId) {
    return res.status(400).json({ error: "user_id query parameter is required" });
  }

  const result = await pool.query(
    `SELECT
       r.rental_id,
       r.machinery_id,
       m.name AS equipment_name,
       m.price_per_day,
       m.location,
       r.rental_date,
       r.return_date,
       r.status,
       r.notes,
       m.farmer_id AS owner_id,
       CONCAT(owner.fname, ' ', COALESCE(owner.lname, '')) AS owner_name
     FROM machinery_rental r
     JOIN machinery m ON m.machinery_id = r.machinery_id
     JOIN f2c_user owner ON owner.email = m.farmer_id
     WHERE r.renter_id = $1 OR m.farmer_id = $1
     ORDER BY r.rental_date DESC, r.rental_id DESC`,
    [userId]
  );

  res.json(result.rows);
}));

app.post("/farmerdashboard/rent-machinery", asyncHandler(async (req, res) => {
  const { machinery_id, renter_id, rental_date, return_date } = req.body;

  if (!machinery_id || !renter_id) {
    return res.status(400).json({ error: "machinery_id and renter_id are required" });
  }

  await pool.query("CALL rent_machinery($1, $2, $3, $4)", [
    Number(machinery_id),
    normalizeEmail(renter_id),
    rental_date || null,
    return_date || null,
  ]);

  res.status(201).json({ message: "Machinery rented successfully" });
}));

app.post("/farmerdashboard/return-machinery", asyncHandler(async (req, res) => {
  const { rental_id } = req.body;

  if (!rental_id) {
    return res.status(400).json({ error: "rental_id is required" });
  }

  await pool.query("CALL return_machinery($1)", [Number(rental_id)]);
  res.json({ message: "Machinery returned successfully" });
}));

app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((error, _req, res, _next) => {
  console.error("API error:", error);

  const message = error.message || "Server error";
  const status = message.includes("duplicate key") ? 409 : 500;

  res.status(status).json({ error: message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
