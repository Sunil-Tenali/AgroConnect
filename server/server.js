const express = require("express");
const cors = require("cors");
const pool = require("./database");

const app = express();

app.use(express.json());
app.use(cors());

// Farmer registration endpoint - calls stored procedure to create farmer account
app.post("/farmersignup", (req, res) => {
  const email = req.body["email"];
  const fname = req.body["fname"];
  const lname = req.body["lname"];
  const password = req.body["password"];
  // Call database stored procedure to register farmer
  const functionstmt = `call register_farmer('${email}','${fname}','${lname}','${password}')`;  // Note: Use parameterized queries in production
  pool
    .query(functionstmt)
    .then((response) => {
      console.log("Farmer registered successfully");
    })
    .catch((err) => {
      console.error("Registration error:", err);
    });

  res.send("Response Received: " + req.body);
});

// Customer registration endpoint - calls stored procedure to create customer account
app.post("/customersignup", (req, res) => {
  const email = req.body["email"];
  const fname = req.body["fname"];
  const lname = req.body["lname"];
  const password = req.body["password"];
  // Call database stored procedure to register customer
  const functionstmt = `call register_customer('${email}','${fname}','${lname}','${password}')`;  // Note: Use parameterized queries in production
  pool
    .query(functionstmt)
    .then((response) => {
      console.log("Customer registered successfully");
    })
    .catch((err) => {
      console.error("Registration error:", err);
    });

  res.send("Response Received: " + req.body);
});

// Unified login endpoint for both farmers and customers
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {

    // Query user from database using parameterized query (secure against SQL injection)
    const user = await pool.query(
      "SELECT email, password FROM f2c_user WHERE email = $1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Verify password matches
    if (password !== user.rows[0].password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // TODO: Implement JWT token generation for session management
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Farmer product listing endpoint - adds new product to marketplace
app.post("/farmerdashboard/products", (req, res) => {
  const name = req.body["name"];
  const farmer_id = req.body["farmer_id"];
  const price = req.body["price"];
  const category_id = req.body["category_id"];
  const description = req.body["description"];
  const available_units = req.body["available_units"];
  const carrier_phone = req.body["carrier_phone"];

  // Call stored procedure to add product to inventory
  const functionstmt = `call add_product('${name}','${farmer_id}','${price}','${category_id}','${description}','${available_units}','${carrier_phone}')`;  // Note: Use parameterized queries in production
  pool
    .query(functionstmt)
    .then((response) => {
      console.log("Product added successfully");
    })
    .catch((err) => {
      console.error("Error adding product:", err);
    });

  res.send("Response Received: " + req.body);
});

// Get all available products for customer to browse
app.get("/customerdashboard/productHome", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM product");
    client.release();
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Error fetching products" });
  }
});

// Add products to shopping cart
app.post("/customerdashboard/productHome", async (req, res) => {
  const { customer_id, product_ids } = req.body;
  try {
    // Check if product_id is an array
    if (!Array.isArray(product_ids)) {
      throw new Error("Product ID must be an array");
    }

    // Insert into product_shoppingcart table for each product ID
    for (const id of product_ids) {
      await pool.query("CALL add_to_shopping_cart($1, $2)", [customer_id, id]);
    }
    res.status(201).send("Added to cart successfully");
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).send("Error adding to cart");
  }
});

//////////////////////////////////////////////////////////////////////////

app.post("/customerdashboard/placeorder", (req, res) => {
  const customer_id = req.body["customer_id"];

  // Call stored procedure to process order from shopping cart
  const functionstmt = `call place_order('${customer_id}')`;  // Note: Use parameterized queries in production
  pool
    .query(functionstmt)
    .then((response) => {
      console.log("Order placed successfully");
    })
    .catch((err) => {
      console.log("Error placing order:", err);
    });

  res.send("Response Received: " + req.body);
});

// Add or update customer contact and delivery address information
app.post("/customerdashboard/customercontact", (req, res) => {
  const user_id = req.body["user_id"];
  const street1 = req.body["street1"];
  const street2 = req.body["street2"];
  const city = req.body["city"];
  const state = req.body["state"];
  const country = req.body["country"];
  const zipcode = req.body["zipcode"];
  const phone = req.body["phone"];

  // Call stored procedure to save customer contact and address details
  const functionstmt = `call add_contact_details('${user_id}','${street1}','${street2}','${city}','${state}','${country}','${zipcode}','${phone}')`;  // Note: Use parameterized queries in production
  pool
    .query(functionstmt)
    .then((response) => {
      console.log("Contact details saved successfully");
    })
    .catch((err) => {
      console.log("Error saving contact details:", err);
    });

  res.send("Response Received: " + req.body);
});

// Retrieve customer contact and delivery address information
app.get("/customerdashboard/customercontact", async (req, res) => {
  try {
    const { user_id } = req.query;
    const client = await pool.connect();
    const result = await client.query(
      "SELECT * FROM contact_detail WHERE user_id = $1",
      [user_id]
    );
    client.release();
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching contact details:", err);
    res.status(500).json({ error: "Error fetching contact details" });
  }
});

// Start server
const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
