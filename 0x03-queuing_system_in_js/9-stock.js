const express = require('express');
const redis = require('redis');

const listProducts = [
  {
    itemId: 1,
    itemName: 'Suitcase 250',
    price: 50,
    initialAvailableQuantity: 4,
  },
];

const getItemById = (id) => listProducts.find((obj) => obj.itemId === id);

const app = express();
const client = redis.createClient();

const PORT = 1245;

const reserveStockById = async (itemId, stock) => {
  await client.set(`item.${itemId}`, stock);
};

const getCurrentReservedStockById = async (itemId) => {
  const reservedStock = await client.get(`item.${itemId}`);
  return parseInt(reservedStock || 0);
};

app.get('/list_products', (req, res) => {
  res.json(listProducts);
});

app.get('/list_products/:itemId(\\d+)', async (req, res) => {
  const itemId = parseInt(req.params.itemId);
  const productItem = getItemById(itemId);

  if (!productItem) {
    return res.json({ status: 'Product not found' });
  }

  const reservedStock = await getCurrentReservedStockById(itemId);
  productItem.currentQuantity = productItem.initialAvailableQuantity - reservedStock;
  res.json(productItem);
});

app.get('/reserve_product/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId);
  const productItem = getItemById(itemId);

  if (!productItem) {
    return res.json({ status: 'Product not found' });
  }

  const reservedStock = await getCurrentReservedStockById(itemId);

  if (reservedStock >= productItem.initialAvailableQuantity) {
    return res.json({ status: 'Not enough stock available', itemId });
  }

  await reserveStockById(itemId, reservedStock + 1);
  res.json({ status: 'Reservation confirmed', itemId });
});

const resetProductsStock = async () => {
  const commands = listProducts.map((item) => ['SET', `item.${item.itemId}`, 0]);
  await client.multi(commands).exec();
};

app.listen(PORT, async () => {
  await resetProductsStock();
  console.log(`API available on localhost port ${PORT}`);
});

module.exports = app;
