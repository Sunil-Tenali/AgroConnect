import React, { useEffect, useState } from "react";
import "../stylesheets/dashboard-pages.css";
import api from "../api";

export default function Rented() {
  const userId = sessionStorage.getItem("userEmail");

  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState("");

  const fetchRentals = async () => {
    if (!userId) {
      setError("User email is missing. Please login again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await api.get(
        `/farmerdashboard/rented?user_id=${encodeURIComponent(userId)}`
      );
      setRentals(response.data);
    } catch (err) {
      console.error("Error fetching rentals:", err);
      setError(err.response?.data?.error || "Unable to fetch rented items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleReturn = async (rentalId) => {
    try {
      setSavingId(rentalId);
      await api.post("/farmerdashboard/return-machinery", { rental_id: rentalId });
      alert("Machinery returned successfully.");
      await fetchRentals();
    } catch (err) {
      console.error("Error returning machinery:", err);
      alert(err.response?.data?.error || "Unable to return machinery.");
    } finally {
      setSavingId(null);
    }
  };

  const activeRentals = rentals.filter((rental) => rental.status === "Active");

  return (
    <div className="dashboard-page-container">
      <h1>Rented Machinery</h1>
      <p>User ID: {userId || "Not logged in"}</p>

      <div className="dashboard-info-grid">
        <div className="info-card">
          <h3>Total Rentals</h3>
          <div className="value">{rentals.length}</div>
        </div>
        <div className="info-card">
          <h3>Active Rentals</h3>
          <div className="value">{activeRentals.length}</div>
        </div>
        <div className="info-card">
          <h3>Returned</h3>
          <div className="value">
            {rentals.filter((rental) => rental.status === "Returned").length}
          </div>
        </div>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Your Rented Items</h2>
      <p>View and manage your currently rented machinery below.</p>

      {loading ? (
        <p>Loading rented items...</p>
      ) : rentals.length > 0 ? (
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Equipment Name</th>
                <th>Owner</th>
                <th>Rental Date</th>
                <th>Return Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rentals.map((rental) => (
                <tr key={rental.rental_id}>
                  <td>{rental.equipment_name}</td>
                  <td>{rental.owner_name}</td>
                  <td>{rental.rental_date}</td>
                  <td>{rental.return_date || "-"}</td>
                  <td>{rental.status}</td>
                  <td>
                    {rental.status === "Active" ? (
                      <button
                        type="button"
                        onClick={() => handleReturn(rental.rental_id)}
                        disabled={savingId === rental.rental_id}
                      >
                        {savingId === rental.rental_id ? "Returning..." : "Return"}
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <p>No rented machinery found.</p>
        </div>
      )}
    </div>
  );
}
