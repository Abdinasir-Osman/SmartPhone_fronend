// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { CartProvider } from "./context/CartContext";
import AppealPage from "./pages/AppealPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/appeal" element={<AppealPage />} />
          <Route path="/*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  </React.StrictMode>
);
