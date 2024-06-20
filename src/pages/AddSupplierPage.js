import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import SupplierForm from '../components/SupplierForm';

const AddSupplierPage = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleAddSupplier = async (supplier) => {
    try {
      await axios.post('http://localhost:3001/suppliers', supplier);
      enqueueSnackbar('Fornecedor cadastrado com sucessso', { variant: 'success' });
      navigate('/suppliers');
    } catch (error) {
      console.error('Erro ao adicionar fornecedor:', error);
      enqueueSnackbar('Error adicionar fornecedor', { variant: 'error' });
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Cadastrar fornecedor</Typography>
      <SupplierForm onSubmit={handleAddSupplier} />
    </div>
  );
};

export default AddSupplierPage;
