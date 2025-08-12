import React, { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { Link, Navigate } from "react-router-dom";

export default function LoginPage() {
  const { user, login, trimString } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await login(trimString(email), trimString(password));
    } catch (error) {
      console.log(error);
    }
  };

  return user ? (
    <Navigate to="/dashboard" />
  ) : (
    <div>
      <h1>Login</h1>
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
      <button onClick={handleLogin}>Login</button>
      <p>New here?</p>
      <p>
        <Link to="/signup">Signup Instead</Link>
      </p>
    </div>
  );
}
