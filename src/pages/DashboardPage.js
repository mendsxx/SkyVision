import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import './DashboardPage.css';
import { CSVLink } from 'react-csv';
import { DataGrid } from '@mui/x-data-grid';
import { Grid, Button } from '@mui/material';

const DashboardPage = () => {
  const [totalSalesValue, setTotalSalesValue] = useState(0);
  const [totalSalesVolume, setTotalSalesVolume] = useState(0);
  const [totalStockVolume, setTotalStockVolume] = useState(0);
  const [salesData, setSalesData] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [filter, setFilter] = useState('group');
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:3001/dashboard');
        const data = await response.json();

        setTotalSalesValue(parseFloat(data.totalSalesValue));
        setTotalSalesVolume(parseInt(data.totalSalesVolume));
        setTotalStockVolume(parseInt(data.totalStockVolume));

        switch (filter) {
          case 'group':
            setSalesData(data.salesByGroup.map(group => ({
              label: group.name,
              salesValue: group.totalSalesValue,
              salesVolume: group.totalSalesVolume
            })));
            setStockData(data.stockByGroup.map(group => ({
              label: group.name,
              stockVolume: group.totalStockVolume
            })));
            break;
          case 'subgroup':
            const salesBySubgroupResponse = await fetch('http://localhost:3001/dashboard/sales-by-subgroup');
            const salesBySubgroupData = await salesBySubgroupResponse.json();
            setSalesData(salesBySubgroupData.map(subgroup => ({
              label: subgroup.subgroup_name,
              salesValue: subgroup.total_value,
              salesVolume: subgroup.total_quantity
            })));
            const stockBySubgroupResponse = await fetch('http://localhost:3001/dashboard/stock-by-subgroup');
            const stockBySubgroupData = await stockBySubgroupResponse.json();
            setStockData(stockBySubgroupData.map(subgroup => ({
              label: subgroup.subgroup_name,
              stockVolume: subgroup.totalStockVolume
            })));
            break;
          case 'product':
            const salesByProductResponse = await fetch('http://localhost:3001/dashboard/sales-by-product');
            const salesByProductData = await salesByProductResponse.json();
            setSalesData(salesByProductData.map(product => ({
              label: product.product_name,
              salesValue: product.total_value,
              salesVolume: product.total_quantity
            })));
            setStockData(data.stockVolumeByProduct.map(product => ({
              label: product.name,
              stockVolume: product.totalStockVolume
            })));
            break;
          default:
            break;
        }
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
      }
    };

    const fetchTableData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/dashboard/products');
        const data = await response.json();
        setTableData(data);
      } catch (error) {
        console.error('Erro ao buscar dados da tabela:', error);
      }
    };

    fetchDashboardData();
    fetchTableData();
  }, [filter]);

  const combinedChartData = {
    labels: salesData.map(data => data.label),
    datasets: [
      {
        label: 'Valor de Vendas',
        data: salesData.map(data => data.salesValue),
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1
      },
      {
        label: 'Volume de Vendas',
        data: salesData.map(data => data.salesVolume),
        backgroundColor: 'rgba(153,102,255,0.4)',
        borderColor: 'rgba(153,102,255,1)',
        borderWidth: 1
      }
    ]
  };

  const stockChartData = {
    labels: stockData.map(data => data.label),
    datasets: [
      {
        label: 'Volume de Estoque',
        data: stockData.map(data => data.stockVolume),
        backgroundColor: 'rgba(255,159,64,0.4)',
        borderColor: 'rgba(255,159,64,1)',
        borderWidth: 1
      }
    ]
  };

  const columns = [
    { field: 'Grupo', headerName: 'Grupo', width: 150 },
    { field: 'Subgrupo', headerName: 'Subgrupo', width: 150 },
    { field: 'Produto', headerName: 'Produto', width: 150 },
    { field: 'Preço', headerName: 'Preço', width: 150, type: 'number' },
    { field: 'Estoque', headerName: 'Estoque', width: 150, type: 'number' },
    { field: 'VolumeDeVendas', headerName: 'Volume de Vendas', width: 150, type: 'number' },
    { field: 'ValorDeVendas', headerName: 'Valor de Vendas', width: 150, type: 'number' },
  ];

  return (
    <div className="dashboard-container">
      <div className="kpi-container">
        <div className="kpi-card">
          <h2>Valor Total de Vendas</h2>
          <p>R${totalSalesValue.toFixed(2)}</p>
        </div>
        <div className="kpi-card">
          <h2>Volume Total de Vendas</h2>
          <p>{totalSalesVolume}</p>
        </div>
        <div className="kpi-card">
          <h2>Volume Total de Estoque</h2>
          <p>{totalStockVolume}</p>
        </div>
      </div>
      <div className="filter-container">
        <label>Filtro:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="group">Grupo</option>
          <option value="subgroup">Subgrupo</option>
          <option value="product">Produto</option>
        </select>
      </div>
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Vendas</h3>
          <div className="chart-container">
            <Bar data={combinedChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="chart-card">
          <h3>Estoque</h3>
          <div className="chart-container">
            <Bar data={stockChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
      <div className="table-container">
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <div className="data-grid">
              <DataGrid rows={tableData} columns={columns} pageSize={5} />
            </div>
            <div className="button-container">
              <Button variant="contained" color="primary">
                <CSVLink data={tableData} filename={"dados-de-vendas-e-estoque.csv"} style={{ textDecoration: 'none', color: 'white' }}>
                  Exportar CSV
                </CSVLink>
              </Button>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default DashboardPage;
