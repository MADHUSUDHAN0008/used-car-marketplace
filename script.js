const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 5000;

app.get('/cars', (req, res) => {
  fs.readFile('cars.json', (err, data) => {
    if (err) return res.status(500).send('Error reading data');
    res.json(JSON.parse(data));
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
