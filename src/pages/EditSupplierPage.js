import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';

const EditSupplierPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [supplier, setSupplier] = useState({
    cnpj: '',
    fornecedor: '',
    cep: '',
    ie: '',
    nome_fantasia: '',
    cidade: '',
    estado: '',
    endereco: '',
    numero: '',
    complemento: '',
    status: ''
  });

  const fetchSupplier = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:3001/suppliers/${id}`);
      setSupplier(response.data);
    } catch (error) {
      console.error('Erro ao buscar fornecedor:', error);
    }
  }, [id]);

  useEffect(() => {
    fetchSupplier();
  }, [fetchSupplier]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSupplier({ ...supplier, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3001/suppliers/${id}`, supplier);
      enqueueSnackbar('Fornecedor atualizado com sucesso', { variant: 'success' });
      navigate('/suppliers');
    } catch (error) {
      console.error('Erro ao atualizar fornecedor:', error);
      enqueueSnackbar('Erro ao atualizar fornecedor', { variant: 'error' });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h4" gutterBottom>Editar Fornecedor</Typography>
      <TextField
        label="CNPJ"
        name="cnpj"
        value={supplier.cnpj}
        onChange={handleInputChange}
        required
      />
      <TextField
        label="Fornecedor"
        name="fornecedor"
        value={supplier.fornecedor}
        onChange={handleInputChange}
        required
      />
      <TextField
        label="CEP"
        name="cep"
        value={supplier.cep}
        onChange={handleInputChange}
        required
      />
      <TextField
        label="IE"
        name="ie"
        value={supplier.ie}
        onChange={handleInputChange}
      />
      <TextField
        label="Nome Fantasia"
        name="nome_fantasia"
        value={supplier.nome_fantasia}
        onChange={handleInputChange}
        required
      />
      <TextField
        label="Cidade"
        name="cidade"
        value={supplier.cidade}
        onChange={handleInputChange}
        required
      />
      <TextField
        label="Estado"
        name="estado"
        value={supplier.estado}
        onChange={handleInputChange}
        required
      />
      <TextField
        label="Endereço"
        name="endereco"
        value={supplier.endereco}
        onChange={handleInputChange}
        required
      />
      <TextField
        label="Número"
        name="numero"
        value={supplier.numero}
        onChange={handleInputChange}
        required
      />
      <TextField
        label="Complemento"
        name="complemento"
        value={supplier.complemento}
        onChange={handleInputChange}
      />
      <TextField
        label="Status"
        name="status"
        value={supplier.status}
        onChange={handleInputChange}
        required
      />
      <Button type="submit" variant="contained" color="primary">Salvar</Button>
    </Box>
  );
};

export default EditSupplierPage;
