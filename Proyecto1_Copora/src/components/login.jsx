import React, { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';  
import 'bootstrap/dist/css/bootstrap.min.css';  

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const token = await user.getIdToken();

            // Enviar los datos al backend Flask con el token
            const response = await fetch('http://127.0.0.1:5000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`  // Enviar el token en la cabecera Authorization
                }
            });

            const data = await response.json();
            console.log(data);
            alert("Login Success")

        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card p-5 shadow-lg rounded" style={{ maxWidth: '400px', width: '100%' }}>
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
                            style={{ borderRadius: '10px' }}
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
                            style={{ borderRadius: '10px' }}
                        />
                    </div>
                    {error && <div className="alert alert-danger text-center">{error}</div>}
                    <button
                        className="btn btn-primary w-100 py-2"
                        onClick={handleLogin}
                        style={{ borderRadius: '10px' }}
                    >
                        Login
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <small className="text-muted">Don't have an account? <a href="#">Sign up</a></small>
                </div>
            </div>
        </div>
    );
};

export default Login;