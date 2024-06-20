import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Pagination, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const fetchProducts = async (page) => {
    try {
      const response = await axios.get(`http://localhost:3001/products?page=${page}&limit=10`);
      console.log('Dados recebidos:', response.data);
      setProducts(response.data.products || []); 
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      setProducts([]); 
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleEditProduct = (product) => {
    navigate(`/products/edit/${product.id}`);
  };

  const handleDeleteProduct = async (id) => {
    await axios.delete(`http://localhost:3001/products/${id}`);
    fetchProducts(currentPage);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Produtos</Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => navigate('/products/add')}
      >
        Cadastrar
      </Button>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Preço</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Grupo</TableCell>
              <TableCell>Subgrupo</TableCell>
              <TableCell>Unidade</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>{product.status}</TableCell>
                <TableCell>{product.grupo}</TableCell>
                <TableCell>{product.subgrupo}</TableCell>
                <TableCell>{product.unidade}</TableCell>
                <TableCell>
                  <Button color="primary" onClick={() => handleEditProduct(product)}>Editar</Button>
                  <Button color="secondary" onClick={() => handleDeleteProduct(product.id)}>Deletar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="center" marginTop={2}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </div>
  );
};

export default ProductsPage;
