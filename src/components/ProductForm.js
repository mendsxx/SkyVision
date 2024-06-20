import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Box } from '@mui/material';

const ProductForm = ({ onSubmit, selectedProduct }) => {
  const [product, setProduct] = useState({
    name: '',
    price: '',
    status: 'active',
    grupo: '',
    subgrupo: '',
    unidade: ''
  });

  useEffect(() => {
    if (selectedProduct) {
      setProduct(selectedProduct);
    } else {
      setProduct({ name: '', price: '', status: 'active', grupo: '', subgrupo: '', unidade: '' });
    }
  }, [selectedProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(product);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="Produto"
        name="name"
        value={product.name}
        onChange={handleChange}
        required
      />
      <TextField
        label="Preço"
        name="price"
        type="number"
        value={product.price}
        onChange={handleChange}
        required
      />
      <TextField
        select
        label="Status"
        name="status"
        value={product.status}
        onChange={handleChange}
        required
      >
        <MenuItem value="active">Ativo</MenuItem>
        <MenuItem value="inactive">Inativo</MenuItem>
      </TextField>
      <TextField
        label="Grupo"
        name="grupo"
        value={product.grupo}
        onChange={handleChange}
        required
      />
      <TextField
        label="Subgrupo"
        name="subgrupo"
        value={product.subgrupo}
        onChange={handleChange}
        required
      />
      <TextField
        label="Unidade"
        name="unidade"
        value={product.unidade}
        onChange={handleChange}
        required
      />
      <Button type="submit" variant="contained" color="primary">
        {selectedProduct ? 'Update Product' : 'Salvar'}
      </Button>
    </Box>
  );
};

export default ProductForm;
