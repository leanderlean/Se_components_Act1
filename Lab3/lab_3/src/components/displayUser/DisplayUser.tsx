import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./displayUser.module.css";

interface User {
  firstName: string;
  lastName: string;
  groupName: string;
  expectedSalary: string;
  expectedDateOfDefense: string;
  id: string;
}

const DisplayUser = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string>("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/getUsers");
        const data = await response.json();

        if (response.ok) {
          setUsers(data.data);
        } else {
          setError(data.error || "Failed to fetch user data");
        }
      } catch (error) {
        setError("Failed to connect to the server");
        console.error("Error:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/deleteUser/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        setUsers(users.filter((user) => user.id !== id));
      } else {
        setError(data.error || "Failed to delete user");
      }
    } catch (error) {
      setError("Failed to connect to the server");
      console.error("Error:", error);
    }
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setFormData(user);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!editingUser) return;

    try {
      const updatedUser: Partial<User> = {
        firstName: formData.firstName || editingUser.firstName,
        lastName: formData.lastName || editingUser.lastName,
        groupName: formData.groupName || editingUser.groupName,
        expectedSalary: formData.expectedSalary || editingUser.expectedSalary,
        expectedDateOfDefense:
          formData.expectedDateOfDefense || editingUser.expectedDateOfDefense,
      };

      const response = await fetch(
        `http://localhost:5000/updateUser/${editingUser.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedUser),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setUsers(
          users.map((user) =>
            user.id === editingUser.id ? { ...user, ...updatedUser } : user
          )
        );
        setEditingUser(null);
      } else {
        setError(data.error || "Failed to update user");
      }
    } catch (error) {
      setError("Failed to connect to the server");
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <button className={styles.backButton} onClick={() => navigate("/")}>
        Register User
      </button>
      <h1 className={styles.label}>Registered Users</h1>
      {error && <p className={styles.error}>{error}</p>}

      {editingUser ? (
        <div className={styles.editForm}>
          <h2>Edit User</h2>
          <input
            name="firstName"
            value={formData.firstName || ""}
            onChange={handleInputChange}
            placeholder="First Name"
          />
          <input
            name="lastName"
            value={formData.lastName || ""}
            onChange={handleInputChange}
            placeholder="Last Name"
          />
          <input
            name="groupName"
            value={formData.groupName || ""}
            onChange={handleInputChange}
            placeholder="Group Name"
          />
          <input
            name="expectedSalary"
            value={formData.expectedSalary || ""}
            onChange={handleInputChange}
            placeholder="Expected Salary"
          />
          <input
            name="expectedDateOfDefense"
            value={formData.expectedDateOfDefense || ""}
            onChange={handleInputChange}
            placeholder="Expected Date of Defense"
          />
          <button className={styles.save} onClick={handleSave}>
            Save
          </button>
          <button
            className={styles.cancel}
            onClick={() => setEditingUser(null)}
          >
            Cancel
          </button>
        </div>
      ) : users.length > 0 ? (
        users.map((user) => (
          <div key={user.id} className={styles.individualContainer}>
            <p className={styles.info}>First name: {user.firstName}</p>
            <p className={styles.info}>Last name: {user.lastName}</p>
            <p className={styles.info}>Group name: {user.groupName}</p>
            <p className={styles.info}>
              Expected salary: {user.expectedSalary}
            </p>
            <p className={styles.info}>
              Expected date of defense: {user.expectedDateOfDefense}
            </p>
            <button
              className={styles.edit}
              onClick={() => handleEditClick(user)}
            >
              Edit
            </button>
            <button
              className={styles.delete}
              onClick={() => handleDelete(user.id)}
            >
              Delete
            </button>
          </div>
        ))
      ) : (
        <p>No users registered yet.</p>
      )}
    </div>
  );
};

export default DisplayUser;
