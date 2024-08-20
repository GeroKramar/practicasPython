import React, { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Obtener el token de Firebase
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
            alert("login success")

        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Login</h2>
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                {error && <div className="alert alert-danger">Login Error</div>}
                <button className="btn btn-primary" onClick={handleLogin}>Login</button>
            </form>
        </div>
    );
};

export default Login;