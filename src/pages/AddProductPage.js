import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import ProductForm from '../components/ProductForm';

const AddProductPage = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleAddProduct = async (product) => {
    try {
      await axios.post('http://localhost:3001/products', product);
      enqueueSnackbar('Produto adicionado com sucesso', { variant: 'success' });
      navigate('/products');
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      enqueueSnackbar('Erro ao adicionar produto', { variant: 'error' });
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Adicionar Novo Produto</Typography>
      <ProductForm onSubmit={handleAddProduct} />
    </div>
  );
};

export default AddProductPage;
