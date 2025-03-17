import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import styles from "./registeruser.module.css";

const RegisterUser: React.FC = () => {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    groupName: "",
    expectedSalary: "", // Default as number
    expectedDateOfDefense: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); 

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.name === "expectedSalary"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return; 
    setLoading(true);

    if (
      Object.values(formData).some((value) => value === "" || value === null)
    ) {
      setError("Need to input all fields");
      setLoading(false);
      return;
    }

    setError("");

    try {
      const response = await fetch("http://localhost:5000/registerUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("API Error Response:", response);
        console.error("API Error Data:", data);
        setError(data.error || "Something went wrong");
        return;
      }

      alert(`Registered User: ${formData.firstName}`);
      setFormData({
        firstName: "",
        lastName: "",
        groupName: "",
        expectedSalary: "",
        expectedDateOfDefense: "",
      });

      navigate("/display"); // Redirect after successful registration
    } catch (error) {
      setError("Failed to connect to the server");
      console.error("ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        className={styles.viewButton}
        onClick={() => navigate("/display")}
      >
        Go to Display Users
      </button>

      <div className={styles.formContainer}>
        <h2 className={styles.label}>Register User</h2>

        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleRegister}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
          />

          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
          />

          <input
            type="text"
            name="groupName"
            placeholder="Group Name"
            value={formData.groupName}
            onChange={handleChange}
          />

          <input
            type="number"
            name="expectedSalary"
            placeholder="Expected Salary"
            value={formData.expectedSalary}
            onChange={handleChange}
          />

          <input
            type="date"
            name="expectedDateOfDefense"
            placeholder="Expected Date of Defense"
            value={formData.expectedDateOfDefense}
            onChange={handleChange}
          />

          <button className={styles.regButton} type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register User"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterUser;
