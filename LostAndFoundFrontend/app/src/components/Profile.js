import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";
import { Link } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    reportedItems: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user info
        const userResponse = await axios.get("http://localhost:8081/user/me");
        setUser(userResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle delete profile
  const handleDeleteProfile = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your profile? This action cannot be undone."
      )
    ) {
      try {
        await axios.delete(`http://localhost:8081/user/delete-user`);
        alert("Profile deleted successfully.");
        logout();
        navigate("/");
      } catch (error) {
        console.error("Error deleting profile:", error);
        alert("Failed to delete profile. Please try again.");
      }
    }
  };

  const handleCardClick = (itemId) => {
    navigate(`/item/${itemId}`); 
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }
  return (
    <div className="profile-page">
      <div className="user-info">
        <h2>Profile</h2>
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>User ID:</strong> {user.id}
        </p>
        <button className="delete-button" onClick={handleDeleteProfile}>
          Delete Profile
        </button>
      </div>

      <div className="uploaded-items">
        <h3>Your Uploaded Items</h3>
        {user.reportedItems.length > 0 ? (
          <div className="items-grid">
            {user.reportedItems.map((item) => (
              <div
                key={item.id}
                className="item-card"
                onClick={() => handleCardClick(item.id)}
                role="button"
                tabIndex={0} // Makes the div focusable
              >
                <img
                  src={item.imageUrl || "/placeholder.png"}
                  alt={item.itemName}
                />
                <h4>{item.itemName}</h4>
                <p>{item.description}</p>
                <p>Location: {item.location}</p>
                <p>Status: {item.status}</p>
                <Link to={`/item/${item.id}`} className="custom-link">View Details</Link>
              </div>
            ))}
          </div>
        ) : (
          <p>You haven't uploaded any items yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
