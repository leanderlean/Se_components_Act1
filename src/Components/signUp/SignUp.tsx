import React, { useState } from "react";
import "./signUp.css";

type SignUpProps = {};

const SignUp: React.FC<SignUpProps> = () => {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isValidEmail = (email: string) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  };

  const handleSubmit = async () => {
    if (!email || !userName || !password) {
      setError("Please fill up all fields");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Invalid email format");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email, userName, password})
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        return;
      }

    console.log("Account created!");
    alert(`Welcome ${userName}!`);
    window.location.href = "/Home";
    } catch(error) {
      setError("Something went Wrong!")
    }
    
  };

  return (
    <div className="body">
      <div className="signUpContainer">
        <h2 className="signUpLabel">Sign Up</h2>

        <input
          type="text"
          className="signUpInputs"
          placeholder="User name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />

        <input
          type="email"
          className="signUpInputs"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="signUpInputs"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleSubmit} className="signUpButt">Sign Up</button>
        <p className="link">Already have an account? <a href="/login">Log In</a></p>

        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default SignUp;
