import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [product, setProduct] = useState({ name: '', price: '' });

  const fetchProduct = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:3001/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3001/products/${id}`, product);
      enqueueSnackbar('Produto atualizado com sucesso', { variant: 'success' });
      navigate('/products');
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      enqueueSnackbar('Erro ao atualizar produto', { variant: 'error' });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h4" gutterBottom>Editar Produto</Typography>
      <TextField
        label="Nome"
        name="name"
        value={product.name}
        onChange={handleInputChange}
        required
      />
      <TextField
        label="Preço"
        name="price"
        type="number"
        value={product.price}
        onChange={handleInputChange}
        required
      />
      <Button type="submit" variant="contained" color="primary">Salvar Produto</Button>
    </Box>
  );
};

export default EditProductPage;
