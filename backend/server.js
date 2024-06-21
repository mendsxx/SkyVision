const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

// Configurar middleware
app.use(cors());
app.use(bodyParser.json());

// Configurar a conexão com o banco de dados
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'G@r4g3m@2023',
  database: 'skyvision'
});

db.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conectado ao banco de dados MySQL.');
  }
});


// Rotas de CRUD para produtos

// Ler todos os produtos para a venda
app.get('/api/products', (req, res) => {
  const query = 'SELECT * FROM products';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar produtos:', err);
      return res.status(500).send('Erro ao buscar produtos');
    }
    res.json(results);
  });
});

// Ler produtos disponíveis com estoque
app.get('/api/products/available', (req, res) => {
  const query = `
    SELECT p.id, p.name, p.price
    FROM products p
    JOIN stock s ON p.id = s.product_id
    WHERE s.quantity > 0
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar produtos disponíveis:', err);
      return res.status(500).send('Erro ao buscar produtos disponíveis');
    }
    res.json(results);
  });
});

// Ler todos os produtos com paginação
app.get('/products', (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  const query = 'SELECT * FROM products LIMIT ?, ?';
  db.query(query, [parseInt(offset), parseInt(limit)], (err, results) => {
    if (err) {
      console.error('Erro ao buscar produtos:', err);
      return res.status(500).send('Erro ao buscar produtos');
    }

    console.log('Produtos buscados:', results); // Adicionando log

    // Query to get total number of products
    const countQuery = 'SELECT COUNT(*) AS count FROM products';
    db.query(countQuery, (countErr, countResult) => {
      if (countErr) {
        console.error('Erro ao contar produtos:', countErr);
        return res.status(500).send('Erro ao contar produtos');
      }

      const totalProducts = countResult[0].count;
      const totalPages = Math.ceil(totalProducts / limit);

      res.json({
        products: results || [], // Garantir que results não seja undefined
        totalPages,
        currentPage: parseInt(page)
      });
    });
  });
});

// Criar um produto
app.post('/products', (req, res) => {
  const { name, price, status, grupo, subgrupo, unidade } = req.body;
  console.log('Dados recebidos:', req.body); // Log dos dados recebidos

  if (!name || !price || !status || !grupo || !subgrupo || !unidade) {
    console.error('Erro: Todos os campos são obrigatórios'); // Log do erro
    return res.status(400).send('Todos os campos são obrigatórios');
  }

  const query = 'INSERT INTO products (name, price, status, grupo, subgrupo, unidade) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [name, price, status, grupo, subgrupo, unidade], (err, result) => {
    if (err) {
      console.error('Erro ao inserir produto:', err); // Log do erro
      return res.status(500).send('Erro ao inserir produto');
    }
    console.log('Produto inserido com sucesso:', result); // Log do sucesso
    res.status(201).send('Produto criado com sucesso.');
  });
});

// Buscar um produto por ID
app.get('/products/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM products WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Erro ao buscar produto:', err); // Log do erro
      return res.status(500).send('Erro ao buscar produto');
    }
    if (result.length === 0) {
      return res.status(404).send('Produto não encontrado');
    }
    res.json(result[0]);
  });
});

// Atualizar um produto
app.put('/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, price, status, grupo, subgrupo, unidade } = req.body;
  console.log('Dados recebidos para atualização:', req.body); // Log dos dados recebidos

  if (!name || !price || !status || !grupo || !subgrupo || !unidade) {
    console.error('Erro: Todos os campos são obrigatórios'); // Log do erro
    return res.status(400).send('Todos os campos são obrigatórios');
  }

  const query = 'UPDATE products SET name = ?, price = ?, status = ?, grupo = ?, subgrupo = ?, unidade = ? WHERE id = ?';
  db.query(query, [name, price, status, grupo, subgrupo, unidade, id], (err, result) => {
    if (err) {
      console.error('Erro ao atualizar produto:', err); // Log do erro
      return res.status(500).send('Erro ao atualizar produto');
    }
    console.log('Produto atualizado com sucesso:', result); // Log do sucesso
    res.send('Produto atualizado com sucesso.');
  });
});

// Deletar um produto
app.delete('/products/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM products WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Erro ao deletar produto:', err); // Log do erro
      return res.status(500).send('Erro ao deletar produto');
    }
    res.send('Produto deletado com sucesso.');
  });
});

// Rotas de CRUD para fornecedores

// Ler todos os fornecedores com paginação
app.get('/suppliers', (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  const query = 'SELECT * FROM suppliers LIMIT ?, ?';
  db.query(query, [parseInt(offset), parseInt(limit)], (err, results) => {
    if (err) {
      console.error('Erro ao buscar fornecedores:', err);
      return res.status(500).send('Erro ao buscar fornecedores');
    }

    console.log('Fornecedores buscados:', results); // Adicionando log

    // Query to get total number of suppliers
    const countQuery = 'SELECT COUNT(*) AS count FROM suppliers';
    db.query(countQuery, (countErr, countResult) => {
      if (countErr) {
        console.error('Erro ao contar fornecedores:', countErr);
        return res.status(500).send('Erro ao contar fornecedores');
      }

      const totalSuppliers = countResult[0].count;
      const totalPages = Math.ceil(totalSuppliers / limit);

      res.json({
        suppliers: results || [], // Garantir que results não seja undefined
        totalPages,
        currentPage: parseInt(page)
      });
    });
  });
});

// Buscar todos os fornecedores para estoque
app.get('/api/suppliers', (req, res) => {
  const query = 'SELECT * FROM suppliers';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar fornecedores:', err);
      return res.status(500).send('Erro ao buscar fornecedores');
    }
    res.json(results);
  });
});

// Criar um fornecedor
app.post('/suppliers', (req, res) => {
  const { cnpj, fornecedor, cep, ie, nome_fantasia, cidade, estado, endereco, numero, complemento, status } = req.body;
  console.log('Dados recebidos:', req.body); // Log dos dados recebidos

  if (!cnpj || !fornecedor || !cep || !nome_fantasia || !cidade || !estado || !endereco || !status) {
    console.error('Erro: Todos os campos obrigatórios exceto IE e Complemento devem ser preenchidos'); // Log do erro
    return res.status(400).send('Todos os campos obrigatórios exceto IE e Complemento devem ser preenchidos');
  }

  const query = 'INSERT INTO suppliers (cnpj, fornecedor, cep, ie, nome_fantasia, cidade, estado, endereco, numero, complemento, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [cnpj, fornecedor, cep, ie, nome_fantasia, cidade, estado, endereco, numero, complemento, status], (err, result) => {
    if (err) {
      console.error('Erro ao inserir fornecedor:', err); // Log do erro
      return res.status(500).send('Erro ao inserir fornecedor');
    }
    console.log('Fornecedor inserido com sucesso:', result); // Log do sucesso
    res.status(201).send('Fornecedor criado com sucesso.');
  });
});

// Buscar um fornecedor por ID
app.get('/suppliers/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM suppliers WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Erro ao buscar fornecedor:', err); // Log do erro
      return res.status(500).send('Erro ao buscar fornecedor');
    }
    if (result.length === 0) {
      return res.status(404).send('Fornecedor não encontrado');
    }
    res.json(result[0]);
  });
});

// Atualizar um fornecedor
app.put('/suppliers/:id', (req, res) => {
  const { id } = req.params;
  const { cnpj, fornecedor, cep, ie, nome_fantasia, cidade, estado, endereco, numero, complemento, status } = req.body;
  console.log('Dados recebidos para atualização:', req.body); // Log dos dados recebidos

  if (!cnpj || !fornecedor || !cep || !nome_fantasia || !cidade || !estado || !endereco || !status) {
    console.error('Erro: Todos os campos obrigatórios exceto IE e Complemento devem ser preenchidos'); // Log do erro
    return res.status(400).send('Todos os campos obrigatórios exceto IE e Complemento devem ser preenchidos');
  }

  const query = 'UPDATE suppliers SET cnpj = ?, fornecedor = ?, cep = ?, ie = ?, nome_fantasia = ?, cidade = ?, estado = ?, endereco = ?, numero = ?, complemento = ?, status = ? WHERE id = ?';
  db.query(query, [cnpj, fornecedor, cep, ie, nome_fantasia, cidade, estado, endereco, numero, complemento, status, id], (err, result) => {
    if (err) {
      console.error('Erro ao atualizar fornecedor:', err); // Log do erro
      return res.status(500).send('Erro ao atualizar fornecedor');
    }
    console.log('Fornecedor atualizado com sucesso:', result); // Log do sucesso
    res.send('Fornecedor atualizado com sucesso.');
  });
});

// Deletar um fornecedor
app.delete('/suppliers/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM suppliers WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Erro ao deletar fornecedor:', err); // Log do erro
      return res.status(500).send('Erro ao deletar fornecedor');
    }
    res.send('Fornecedor deletado com sucesso.');
  });
});

// Rotas de CRUD para vendas

// Criar uma venda
app.post('/sales', (req, res) => {
  const { items } = req.body;
  let total = 0;

  items.forEach(item => {
    total += item.quantity * item.price;
  });

  const saleQuery = 'INSERT INTO sales (total) VALUES (?)';
  db.query(saleQuery, [total], (err, saleResult) => {
    if (err) {
      console.error('Erro ao inserir venda:', err);
      return res.status(500).send('Erro ao inserir venda');
    }

    const saleId = saleResult.insertId;

    const saleItemsQuery = 'INSERT INTO sale_items (sale_id, product_id, quantity, price, total) VALUES ?';
    const saleItemsValues = items.map(item => [
      saleId,
      item.product_id,
      item.quantity,
      item.price,
      item.quantity * item.price
    ]);

    db.query(saleItemsQuery, [saleItemsValues], (err, saleItemsResult) => {
      if (err) {
        console.error('Erro ao inserir itens da venda:', err);
        return res.status(500).send('Erro ao inserir itens da venda');
      }

      // Calcular o total_volume após inserir os itens da venda
      const totalVolumeQuery = 'SELECT SUM(quantity) AS total_volume FROM sale_items WHERE sale_id = ?';
      db.query(totalVolumeQuery, [saleId], (err, volumeResult) => {
        if (err) {
          console.error('Erro ao calcular o volume total:', err);
          return res.status(500).send('Erro ao calcular o volume total');
        }

        const totalVolume = volumeResult[0].total_volume;

        // Atualizar a venda com o volume total
        const updateSaleQuery = 'UPDATE sales SET total_volume = ? WHERE id = ?';
        db.query(updateSaleQuery, [totalVolume, saleId], (err) => {
          if (err) {
            console.error('Erro ao atualizar o volume total da venda:', err);
            return res.status(500).send('Erro ao atualizar o volume total da venda');
          }

          updateStock(items, '-'); // Atualizando o estoque
          res.status(201).send('Venda criada com sucesso');
        });
      });
    });
  });
});

// Atualizar uma venda
app.put('/sales/:id', (req, res) => {
  const { id } = req.params;
  const { items } = req.body;
  let total = 0;
  let totalVolume = 0;

  items.forEach(item => {
    total += item.quantity * item.price;
    totalVolume += item.quantity;
  });

  const updateSaleQuery = 'UPDATE sales SET total = ?, total_volume = ? WHERE id = ?';
  db.query(updateSaleQuery, [total, totalVolume, id], (err) => {
    if (err) {
      console.error('Erro ao atualizar venda:', err);
      return res.status(500).send('Erro ao atualizar venda');
    }

    const deleteItemsQuery = 'DELETE FROM sale_items WHERE sale_id = ?';
    db.query(deleteItemsQuery, [id], (err) => {
      if (err) {
        console.error('Erro ao deletar itens da venda:', err);
        return res.status(500).send('Erro ao deletar itens da venda');
      }

      const saleItemsQuery = 'INSERT INTO sale_items (sale_id, product_id, quantity, price, total) VALUES ?';
      const saleItemsValues = items.map(item => [
        id,
        item.product_id,
        item.quantity,
        item.price,
        item.quantity * item.price
      ]);

      db.query(saleItemsQuery, [saleItemsValues], (err) => {
        if (err) {
          console.error('Erro ao inserir itens da venda:', err);
          return res.status(500).send('Erro ao inserir itens da venda');
        }

        updateStock(items, '-');
        res.status(200).send('Venda atualizada com sucesso');
      });
    });
  });
});

// Deletar uma venda
app.delete('/sales/:id', (req, res) => {
  const { id } = req.params;

  const getItemsQuery = 'SELECT * FROM sale_items WHERE sale_id = ?';
  db.query(getItemsQuery, [id], (err, items) => {
    if (err) {
      console.error('Erro ao buscar itens da venda:', err);
      return res.status(500).send('Erro ao buscar itens da venda');
    }

    const deleteItemsQuery = 'DELETE FROM sale_items WHERE sale_id = ?';
    db.query(deleteItemsQuery, [id], (err) => {
      if (err) {
        console.error('Erro ao deletar itens da venda:', err);
        return res.status(500).send('Erro ao deletar itens da venda');
      }

      const deleteSaleQuery = 'DELETE FROM sales WHERE id = ?';
      db.query(deleteSaleQuery, [id], (err) => {
        if (err) {
          console.error('Erro ao deletar venda:', err);
          return res.status(500).send('Erro aodeletar venda');
        }

        updateStock(items, '+');
        res.status(200).send('Venda deletada com sucesso');
      });
    });
  });
});

// Buscar todas as vendas
app.get('/sales', (req, res) => {
  const query = 'SELECT * FROM sales';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar vendas:', err);
      return res.status(500).send('Erro ao buscar vendas');
    }

    res.json(results);
  });
});

// Buscar itens de uma venda por ID da venda
app.get('/sales/:id/items', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM sale_items WHERE sale_id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Erro ao buscar itens da venda:', err);
      return res.status(500).send('Erro ao buscar itens da venda');
    }

    const items = results.map(item => ({
      product_id: item.product_id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      total: item.total
    }));

    res.json(items);
  });
});

// Rotas de CRUD para o estoque

// Criar uma entrada de estoque
app.post('/stock', (req, res) => {
  const { product_id, supplier_id, quantity } = req.body;
  const query = 'INSERT INTO stock (product_id, supplier_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)';
  db.query(query, [product_id, supplier_id, quantity], (err, result) => {
    if (err) {
      console.error('Erro ao inserir entrada de estoque:', err);
      return res.status(500).send('Erro ao inserir entrada de estoque');
    }
    res.status(201).send('Entrada de estoque criada com sucesso.');
  });
});

// Função para atualizar o estoque
const updateStock = (items, operation) => {
  items.forEach(item => {
    const query = `UPDATE stock SET quantity = quantity ${operation} ? WHERE product_id = ?`;
    db.query(query, [item.quantity, item.product_id], (err) => {
      if (err) {
        console.error('Erro ao atualizar estoque:', err);
      }
    });
  });
};

// Ler todos os itens de estoque com paginação
app.get('/stock', (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  const query = `
    SELECT stock.*, products.name 
    FROM stock 
    JOIN products ON stock.product_id = products.id
    WHERE stock.quantity > 0
    LIMIT ?, ?`;
  db.query(query, [parseInt(offset), parseInt(limit)], (err, results) => {
    if (err) {
      console.error('Erro ao buscar estoque:', err);
      return res.status(500).send('Erro ao buscar estoque');
    }

    // Query to get total number of stock items
    const countQuery = 'SELECT COUNT(*) AS count FROM stock';
    db.query(countQuery, (countErr, countResult) => {
      if (countErr) {
        console.error('Erro ao contar estoque:', countErr);
        return res.status(500).send('Erro ao contar estoque');
      }

      const totalStockItems = countResult[0].count;
      const totalPages = Math.ceil(totalStockItems / limit);

      res.json({
        stock: results || [],
        totalPages,
        currentPage: parseInt(page),
      });
    });
  });
});

// Dashboard analytics endpoints
app.get('/analytics/total-sales-value', (req, res) => {
  const query = 'SELECT SUM(total) AS total_sales_value FROM sales';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao calcular valor total de vendas:', err);
      return res.status(500).send('Erro ao calcular valor total de vendas');
    }
    res.json(results[0]);
  });
});

app.get('/analytics/total-sales-volume', (req, res) => {
  const query = 'SELECT SUM(total_volume) AS total_sales_volume FROM sales';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao calcular volume total de vendas:', err);
      return res.status(500).send('Erro ao calcular volume total de vendas');
    }
    res.json(results[0]);
  });
});

app.get('/analytics/total-stock-volume', (req, res) => {
  const query = 'SELECT SUM(quantity) AS total_stock_volume FROM stock';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao calcular volume total de estoque:', err);
      return res.status(500).send('Erro ao calcular volume total de estoque');
    }
    res.json(results[0]);
  });
});

app.get('/analytics/total-sales-value-by-group', (req, res) => {
  const query = `
    SELECT p.grupo, SUM(si.total) AS total_sales_value
    FROM sale_items si
    JOIN products p ON si.product_id = p.id
    GROUP BY p.grupo
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao calcular valor total de vendas por grupo:', err);
      return res.status(500).send('Erro ao calcular valor total de vendas por grupo');
    }
    res.json(results);
  });
});

app.get('/analytics/total-sales-volume-by-group', (req, res) => {
  const query = `
    SELECT p.grupo, SUM(si.quantity) AS total_sales_volume
    FROM sale_items si
    JOIN products p ON si.product_id = p.id
    GROUP BY p.grupo
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao calcular volume de vendas por grupo:', err);
      return res.status(500).send('Erro ao calcular volume de vendas por grupo');
    }
    res.json(results);
  });
});

app.get('/analytics/total-stock-volume-by-group', (req, res) => {
  const query = `
    SELECT p.grupo, SUM(s.quantity) AS total_stock_volume
    FROM stock s
    JOIN products p ON s.product_id = p.id
    GROUP BY p.grupo
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao calcular volume de estoque por grupo:', err);
      return res.status(500).send('Erro ao calcular volume de estoque por grupo');
    }
    res.json(results);
  });
});

// Adicionar rotas no backend para obter dados agrupados por grupo, subgrupo e produto
app.get('/dashboard/sales-by-group', (req, res) => {
  const query = `
    SELECT p.grupo as group_name, SUM(si.quantity) as total_quantity, SUM(si.total) as total_value
    FROM sale_items si
    JOIN products p ON si.product_id = p.id
    GROUP BY p.grupo
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar vendas por grupo:', err);
      return res.status(500).send('Erro ao buscar vendas por grupo');
    }
    res.json(results);
  });
});

app.get('/dashboard/sales-by-subgroup', (req, res) => {
  const query = `
    SELECT p.subgrupo as subgroup_name, SUM(si.quantity) as total_quantity, SUM(si.total) as total_value
    FROM sale_items si
    JOIN products p ON si.product_id = p.id
    GROUP BY p.subgrupo
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar vendas por subgrupo:', err);
      return res.status(500).send('Erro ao buscar vendas por subgrupo');
    }
    res.json(results);
  });
});

app.get('/dashboard/sales-by-product', (req, res) => {
  const query = `
    SELECT p.name as product_name, SUM(si.quantity) as total_quantity, SUM(si.total) as total_value
    FROM sale_items si
    JOIN products p ON si.product_id = p.id
    GROUP BY p.name
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar vendas por produto:', err);
      return res.status(500).send('Erro ao buscar vendas por produto');
    }
    res.json(results);
  });
});

app.get('/dashboard', async (req, res) => {
  try {
    const totalSalesValueQuery = 'SELECT SUM(total) as totalSalesValue FROM sales';
    const totalSalesVolumeQuery = 'SELECT SUM(total_volume) as totalSalesVolume FROM sales';
    const totalStockVolumeQuery = 'SELECT SUM(quantity) as totalStockVolume FROM stock';

    const salesByGroupQuery = `
      SELECT p.grupo as name, SUM(si.total) as totalSalesValue, SUM(si.quantity) as totalSalesVolume
      FROM sale_items si
      JOIN products p ON si.product_id = p.id
      GROUP BY p.grupo
    `;

    const stockByGroupQuery = `
      SELECT p.grupo as name, SUM(s.quantity) as totalStockVolume
      FROM stock s
      JOIN products p ON s.product_id = p.id
      GROUP BY p.grupo
    `;

    const stockVolumeByProductQuery = `
      SELECT p.name, SUM(s.quantity) as totalStockVolume
      FROM stock s
      JOIN products p ON s.product_id = p.id
      GROUP BY p.name
    `;

    const [totalSalesValue] = await db.promise().query(totalSalesValueQuery);
    const [totalSalesVolume] = await db.promise().query(totalSalesVolumeQuery);
    const [totalStockVolume] = await db.promise().query(totalStockVolumeQuery);
    const [salesByGroup] = await db.promise().query(salesByGroupQuery);
    const [stockByGroup] = await db.promise().query(stockByGroupQuery);
    const [stockVolumeByProduct] = await db.promise().query(stockVolumeByProductQuery);

    res.json({
      totalSalesValue: totalSalesValue[0].totalSalesValue || 0,
      totalSalesVolume: totalSalesVolume[0].totalSalesVolume || 0,
      totalStockVolume: totalStockVolume[0].totalStockVolume || 0,
      salesByGroup,
      stockByGroup,
      stockVolumeByProduct,
    });
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    res.status(500).send('Erro ao buscar dados do dashboard');
  }
});


app.get('/api/dashboard/products', (req, res) => {
  const query = `
    SELECT p.id, p.name AS Produto, p.grupo AS Grupo, p.subgrupo AS Subgrupo, 
           COALESCE(SUM(si.total), 0) AS ValorDeVendas, 
           COALESCE(SUM(si.quantity), 0) AS VolumeDeVendas, 
           COALESCE(SUM(s.quantity), 0) AS Estoque,
           MAX(sa.created_at) AS Data,
           p.price AS Preço
    FROM products p
    LEFT JOIN sale_items si ON p.id = si.product_id
    LEFT JOIN sales sa ON si.sale_id = sa.id
    LEFT JOIN stock s ON p.id = s.product_id
    GROUP BY p.id, p.name, p.grupo, p.subgrupo, p.price
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar produtos para dashboard:', err);
      return res.status(500).send('Erro ao buscar produtos para dashboard');
    }
    res.json(results);
  });
});

  app.get('/dashboard/stock-by-subgroup', (req, res) => {
    const query = `
      SELECT p.subgrupo as subgroup_name, SUM(s.quantity) as totalStockVolume
      FROM stock s
      JOIN products p ON s.product_id = p.id
      GROUP BY p.subgrupo
    `;
    db.query(query, (err, results) => {
      if (err) {
        console.error('Erro ao buscar estoque por subgrupo:', err);
        return res.status(500).send('Erro ao buscar estoque por subgrupo');
      }
      res.json(results);
    });
  });

app.get('/', (req, res) => {
  res.redirect('/dashboard');
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
