import React, { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { Link, Navigate } from "react-router-dom";

export default function LoginPage() {
  const { user, login, trimString } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const loggedInUser = await login(trimString(email), trimString(password));
      console.log(loggedInUser);
      return;
    } catch (error) {
      console.log(error);
    }
  };

  return user ? (
    <Navigate to="/dashboard" />
  ) : (
    <div className="authForm">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
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
        <button>Login</button>
      </form>
      <div className="footText">
        <p>New here?</p>
        <p>
          <Link to="/signup">Signup Instead</Link>
        </p>
      </div>
    </div>
  );
}
