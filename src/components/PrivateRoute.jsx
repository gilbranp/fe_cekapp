/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React from 'react'
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({ children }) => {
  const authToken = localStorage.getItem('token'); // Harus sama dengan nama saat menyimpan

  // Jika tidak ada token, arahkan ke halaman login
  if (!authToken) {
    return <Navigate to="/login" />;
  }

  // Jika sudah ada token, tampilkan halaman yang diakses
  return children;
};


export default PrivateRoute
