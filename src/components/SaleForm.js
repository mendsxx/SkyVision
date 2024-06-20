import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Autocomplete } from '@mui/material';

const SaleForm = ({ onSubmit, products, initialItems = [] }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [items, setItems] = useState(initialItems);

  const handleAddItem = () => {
    if (!selectedProduct) return;

    const newItem = {
      product_id: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      quantity,
      total: selectedProduct.price * quantity
    };

    setItems([...items, newItem]);
    setSelectedProduct(null);
    setQuantity(1);
  };

  const handleRemoveItem = (index) => {
    const newItems = items.slice();
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(items);
  };

  const totalSale = items.reduce((total, item) => total + item.total, 0);

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6">Adicionar Item</Typography>
      <Autocomplete
        options={products}
        getOptionLabel={(option) => option.name}
        onChange={(event, value) => setSelectedProduct(value)}
        renderInput={(params) => <TextField {...params} label="Produto" />}
      />
      <TextField
        label="Quantidade"
        name="quantity"
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        required
      />
      <Button variant="contained" color="primary" onClick={handleAddItem}>Adicionar Item</Button>

      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Produto</TableCell>
              <TableCell>Preço Unitário</TableCell>
              <TableCell>Quantidade</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.total}</TableCell>
                <TableCell>
                  <Button color="secondary" onClick={() => handleRemoveItem(index)}>Remover</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6">Total da Venda: R${totalSale.toFixed(2)}</Typography>
      <Button type="submit" variant="contained" color="primary">Salvar</Button>
    </Box>
  );
};

export default SaleForm;
