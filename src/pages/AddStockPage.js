import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Autocomplete } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const AddStockPage = () => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const fetchProducts = async (query = '') => {
    try {
      const response = await axios.get('http://localhost:3001/api/products', { params: { query } });
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  const fetchSuppliers = async (query = '') => {
    try {
      const response = await axios.get('http://localhost:3001/api/suppliers', { params: { query } });
      setSuppliers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Erro ao buscar fornecedores:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
  }, []);

  const handleAddStock = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !selectedSupplier) return;

    try {
      await axios.post('http://localhost:3001/stock', {
        product_id: selectedProduct.id,
        supplier_id: selectedSupplier.id,
        quantity,
      });
      enqueueSnackbar('Estoque adicionado com sucesso', { variant: 'success' });
      navigate('/stock');
    } catch (error) {
      console.error('Erro ao adicionar Estoque:', error);
      enqueueSnackbar('Erro ao adicionar Estoque', { variant: 'error' });
    }
  };

  return (
    <Box component="form" onSubmit={handleAddStock} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h4" gutterBottom>Cadastrar Estoque</Typography>
      <Autocomplete
        options={products}
        getOptionLabel={(option) => option.name}
        onInputChange={(event, value) => fetchProducts(value)}
        onChange={(event, value) => setSelectedProduct(value)}
        renderInput={(params) => <TextField {...params} label="Produto" />}
      />
      <Autocomplete
        options={suppliers}
        getOptionLabel={(option) => option.fornecedor}
        onInputChange={(event, value) => fetchSuppliers(value)}
        onChange={(event, value) => setSelectedSupplier(value)}
        renderInput={(params) => <TextField {...params} label="Fornecedor" />}
      />
      <TextField
        label="Quantidade"
        name="quantity"
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        required
      />
      <Button type="submit" variant="contained" color="primary">Salvar</Button>
    </Box>
  );
};

export default AddStockPage;
