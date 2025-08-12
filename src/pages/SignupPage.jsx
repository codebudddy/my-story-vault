import React, { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function SignupPage() {
  const { signup, trimString } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await signup(trimString(email), trimString(password));
    } catch (error) {
      console.log(error);
    }
    navigate("/login");
  };

  return (
    <div>
      <h1>Create a free account</h1>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleSignup}>Signup</button>
      <p>Got an account?</p>
      <p>
        <Link to="/login">Login Instead</Link>
      </p>
    </div>
  );
}
