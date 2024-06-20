import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import SaleForm from '../components/SaleForm';

const EditSalePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);

  const fetchSaleItems = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/sales/${id}/items`);
      setItems(response.data);
    } catch (error) {
      console.error('Erro ao buscar itens da venda:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/products/available');
      setProducts(response.data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  useEffect(() => {
    fetchSaleItems();
    fetchProducts();
  }, [id]);

  const handleEditSale = async (updatedItems) => {
    try {
      await axios.put(`http://localhost:3001/sales/${id}`, { items: updatedItems });
      enqueueSnackbar('Venda atualizada com sucesso', { variant: 'success' });
      navigate('/sales');
    } catch (error) {
      console.error('Erro ao atualizar venda:', error);
      enqueueSnackbar('Erro ao atualizar venda', { variant: 'error' });
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Salvar</Typography>
      <SaleForm onSubmit={handleEditSale} initialItems={items} products={products} />
    </div>
  );
};

export default EditSalePage;
