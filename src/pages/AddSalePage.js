import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import SaleForm from '../components/SaleForm';

const AddSalePage = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [products, setProducts] = useState([]);
  const [stock, setStock] = useState({});

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/products/available');
      setProducts(response.data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  const fetchStock = async () => {
    try {
      const response = await axios.get('http://localhost:3001/stock');
      const stockData = response.data.reduce((acc, item) => {
        acc[item.product_id] = item.quantity;
        return acc;
      }, {});
      setStock(stockData);
    } catch (error) {
      console.error('Erro ao buscar estoque:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchStock();
  }, []);

  const handleAddSale = async (items) => {
    try {
      await axios.post('http://localhost:3001/sales', { items });
      enqueueSnackbar('Venda adicionada com sucesso', { variant: 'success' });
      navigate('/sales');
    } catch (error) {
      console.error('Erro ao adicionar venda:', error);
      enqueueSnackbar('Erro ao adicionar venda', { variant: 'error' });
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Cadastrar Venda</Typography>
      <SaleForm onSubmit={handleAddSale} products={products} stock={stock} />
    </div>
  );
};

export default AddSalePage;
