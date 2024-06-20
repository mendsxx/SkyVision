import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

const SalesPage = () => {
  const [sales, setSales] = useState([]);
  const navigate = useNavigate();

  const fetchSales = async () => {
    try {
      const response = await axios.get('http://localhost:3001/sales');
      setSales(response.data);
    } catch (error) {
      console.error('Erro ao buscar vendas:', error);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleEditSale = (sale) => {
    navigate(`/sales/edit/${sale.id}`);
  };

  const handleDeleteSale = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/sales/${id}`);
      fetchSales();
    } catch (error) {
      console.error('Erro ao deletar venda:', error);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Gerenciamento de Vendas</Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => navigate('/sales/add')}
      >
        Cadastrar
      </Button>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Data/Hora</TableCell>
              <TableCell>Volume</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>{new Date(sale.created_at).toLocaleString()}</TableCell>
                <TableCell>{sale.total_volume}</TableCell>
                <TableCell>R${Number(sale.total).toFixed(2)}</TableCell>
                <TableCell>
                  <Button color="primary" onClick={() => handleEditSale(sale)}>Editar</Button>
                  <Button color="secondary" onClick={() => handleDeleteSale(sale.id)}>Deletar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default SalesPage;
