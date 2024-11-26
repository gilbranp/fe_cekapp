/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate(); // Gunakan navigate di dalam komponen

  // Redirect jika sudah login (token ada)
  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard'); // Redirect ke dashboard
    }
  }, [navigate]); // Tambahkan dependensi navigate

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username || !password) {
      setError('Username dan password harus diisi.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/login', {
        username,
        password,
      });

      if (response.data.success) {
        setSuccess(response.data.message);
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard'); // Redirect ke dashboard setelah login berhasil
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Terjadi kesalahan. Coba lagi nanti.');
      }
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-body-tertiary">
      <div className="card shadow-lg p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Masuk</h2>
        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}
        {success && (
          <div className="alert alert-success text-center" role="alert">
            {success}
          </div>
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Kata Sandi</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>

        <hr />
        <div className="text-center">
          <p>Belum punya akun? <a href="#/register" onClick={() => navigate('/register')} style={{ color: '#0d6efd', textDecoration: 'none' }}>Register</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
