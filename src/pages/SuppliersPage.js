import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Pagination, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const fetchSuppliers = async (page) => {
    try {
      const response = await axios.get(`http://localhost:3001/suppliers?page=${page}&limit=10`);
      console.log('Dados recebidos:', response.data); // Adicionando log
      setSuppliers(response.data.suppliers || []); // Garantir que suppliers não seja undefined
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
    } catch (error) {
      console.error('Erro ao buscar fornecedores:', error);
      setSuppliers([]); // Definir como array vazio em caso de erro
    }
  };

  useEffect(() => {
    fetchSuppliers(currentPage);
  }, [currentPage]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleEditSupplier = (supplier) => {
    navigate(`/suppliers/edit/${supplier.id}`);
  };

  const handleDeleteSupplier = async (id) => {
    await axios.delete(`http://localhost:3001/suppliers/${id}`);
    fetchSuppliers(currentPage);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Fornecedores</Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => navigate('/suppliers/add')}
      >
        Cadastrar
      </Button>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>CNPJ</TableCell>
              <TableCell>Fornecedor</TableCell>
              <TableCell>CEP</TableCell>
              <TableCell>IE</TableCell>
              <TableCell>Nome Fantasia</TableCell>
              <TableCell>Cidade</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Endereço</TableCell>
              <TableCell>Número</TableCell>
              <TableCell>Complemento</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell>{supplier.cnpj}</TableCell>
                <TableCell>{supplier.fornecedor}</TableCell>
                <TableCell>{supplier.cep}</TableCell>
                <TableCell>{supplier.ie}</TableCell>
                <TableCell>{supplier.nome_fantasia}</TableCell>
                <TableCell>{supplier.cidade}</TableCell>
                <TableCell>{supplier.estado}</TableCell>
                <TableCell>{supplier.endereco}</TableCell>
                <TableCell>{supplier.numero}</TableCell>
                <TableCell>{supplier.complemento}</TableCell>
                <TableCell>{supplier.status}</TableCell>
                <TableCell>
                  <Button color="primary" onClick={() => handleEditSupplier(supplier)}>Editar</Button>
                  <Button color="secondary" onClick={() => handleDeleteSupplier(supplier.id)}>Deletar</Button>
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

export default SuppliersPage;
