import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Box } from '@mui/material';

const SupplierForm = ({ onSubmit, selectedSupplier }) => {
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
    status: 'ativo'
  });

  useEffect(() => {
    if (selectedSupplier) {
      setSupplier(selectedSupplier);
    } else {
      setSupplier({
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
        status: 'ativo'
      });
    }
  }, [selectedSupplier]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSupplier({ ...supplier, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(supplier);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="CNPJ"
        name="cnpj"
        value={supplier.cnpj}
        onChange={handleChange}
        required
      />
      <TextField
        label="Fornecedor"
        name="fornecedor"
        value={supplier.fornecedor}
        onChange={handleChange}
        required
      />
      <TextField
        label="CEP"
        name="cep"
        value={supplier.cep}
        onChange={handleChange}
        required
      />
      <TextField
        label="Inscrição Estadual"
        name="ie"
        value={supplier.ie}
        onChange={handleChange}
      />
      <TextField
        label="Nome Fantasia"
        name="nome_fantasia"
        value={supplier.nome_fantasia}
        onChange={handleChange}
        required
      />
      <TextField
        label="Cidade"
        name="cidade"
        value={supplier.cidade}
        onChange={handleChange}
        required
      />
      <TextField
        label="Estado"
        name="estado"
        value={supplier.estado}
        onChange={handleChange}
        required
      />
      <TextField
        label="Endereço"
        name="endereco"
        value={supplier.endereco}
        onChange={handleChange}
        required
      />
      <TextField
        label="Número"
        name="numero"
        value={supplier.numero}
        onChange={handleChange}
      />
      <TextField
        label="Complemento"
        name="complemento"
        value={supplier.complemento}
        onChange={handleChange}
      />
      <TextField
        select
        label="Status"
        name="status"
        value={supplier.status}
        onChange={handleChange}
        required
      >
        <MenuItem value="ativo">Ativo</MenuItem>
        <MenuItem value="inativo">Inativo</MenuItem>
      </TextField>
      <Button type="submit" variant="contained" color="primary">
        {selectedSupplier ? 'Update Supplier' : 'Salvar'}
      </Button>
    </Box>
  );
};

export default SupplierForm;
