import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const token = await user.getIdToken();
      setToken(token);

      // Enviar los datos al backend Flask con el token
      const response = await fetch("http://127.0.0.1:5000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Enviar el token en la cabecera Authorization
        },
      });

      const data = await response.json();
      console.log(data);
      Swal.fire({
        position: "top-center",
        icon: "success",
        title: "Login Success",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      setError(error.message);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
        footer: '<a href="#">Why do I have this issue?</a>',
      });
    }
  };

  const handleVerifyToken = async () => {
    try {
      // Enviar el token al backend
      const response = await fetch("http://127.0.0.1:5000/verify_token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.status === 201) {
        setMessage(`Welcome! Token is valid for ${data.message}`);
      } else {
        setMessage("Invalid credentials!");
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      setMessage("An error occurred!");
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div
          className="card p-5 shadow-lg rounded"
          style={{ maxWidth: "400px", width: "100%" }}
        >
          <h2 className="text-center mb-4 text-primary">Login</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="mb-4">
              <label className="form-label text-secondary">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                style={{ borderRadius: "10px" }}
              />
            </div>
            <div className="mb-4">
              <label className="form-label text-secondary">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{ borderRadius: "10px" }}
              />
            </div>
            {error && (
              <div className="alert alert-danger text-center">Invalid credentials!</div>
            )}
            <button
              className="btn btn-primary w-100 py-2"
              onClick={handleLogin}
              style={{ borderRadius: "10px" }}
            >
              Login
            </button>
          </form>
          <div className="mt-4 text-center">
            <small className="text-muted">
              Don't have an account? <a href="#">Sign up</a>
            </small>
          </div>
        </div>
      </div>

      {/* Sección para el botón de verificar token */}
      <div className="d-flex justify-content-center align-items-center flex-column mt-4">
        <button
          className="btn btn-success w-50 py-2"
          onClick={handleVerifyToken}
          style={{ borderRadius: "10px" }}
        >
          Verify Token
        </button>
        {message && <p className="mt-3 text-center text-primary">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
