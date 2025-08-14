import React, { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function SignupPage() {
  const { signup, trimString } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!email || !password || !firstName || !lastName) {
      alert("all fields are required");
      return;
    }

    try {
      const newUser = await signup(
        trimString(email),
        trimString(password),
        trimString(firstName),
        trimString(lastName)
      );
      console.log(newUser);
    } catch (error) {
      console.log(error);
    }
    navigate("/login");
  };

  return (
    <div className="authForm">
      <h1>Create a free account</h1>
      <form onSubmit={handleSignup} autoComplete="off">
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Name"
          autoComplete="off"
        />
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Surname"
          autoComplete="off"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          autoComplete="off"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoComplete="off"
        />
        <button type="submit">Signup</button>
      </form>
      <div className="footText">
        <p>Got an account?</p>
        <p>
          <Link to="/login">Login Instead</Link>
        </p>
      </div>
    </div>
  );
}
