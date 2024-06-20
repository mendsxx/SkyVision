import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
//import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import AddProductPage from './pages/AddProductPage';
import EditProductPage from './pages/EditProductPage';
import SuppliersPage from './pages/SuppliersPage';
import AddSupplierPage from './pages/AddSupplierPage';
import EditSupplierPage from './pages/EditSupplierPage';
import SalesPage from './pages/SalesPage';
import AddSalePage from './pages/AddSalePage';
import EditSalePage from './pages/EditSalePage';
import StockPage from './pages/StockPage';
import AddStockPage from './pages/AddStockPage';
import DashboardPage from './pages/DashboardPage'; // Importe a página do Dashboard
import Layout from './components/Layout';

function App() {
  return (
    <SnackbarProvider maxSnack={3}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/add" element={<AddProductPage />} />
            <Route path="/products/edit/:id" element={<EditProductPage />} />
            <Route path="/suppliers" element={<SuppliersPage />} />
            <Route path="/suppliers/add" element={<AddSupplierPage />} />
            <Route path="/suppliers/edit/:id" element={<EditSupplierPage />} />
            <Route path="/sales" element={<SalesPage />} />
            <Route path="/sales/add" element={<AddSalePage />} />
            <Route path="/sales/edit/:id" element={<EditSalePage />} />
            <Route path="/stock" element={<StockPage />} />
            <Route path="/stock/add" element={<AddStockPage />} />
          </Routes>
        </Layout>
      </Router>
    </SnackbarProvider>
  );
}

export default App;
