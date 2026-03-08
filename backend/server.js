const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// This allows Express to understand JSON data sent from React
app.use(express.json());

// The absolute path to your JSON database file
const DATA_FILE = path.join(__dirname, 'data', 'corps.json');

// --- GET: Send the corporations to React ---
app.get('/api/corps', (req, res) => {
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read data' });
    }
    res.json(JSON.parse(data));
  });
});

// --- POST: Save a new corp OR update an existing corp ---
app.post('/api/corps', (req, res) => {
  const incomingCorp = req.body;

  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read data' });
    
    let corps = JSON.parse(data);

    // Check if the corporation already exists (by name)
    const existingIndex = corps.findIndex(c => c.name === incomingCorp.name);

    if (existingIndex >= 0) {
      // It exists! Overwrite it (this handles new transactions)
      corps[existingIndex] = incomingCorp;
    } else {
      // It's brand new! Add it to the array
      corps.push(incomingCorp);
    }

    // Save the updated array back to the JSON file
    fs.writeFile(DATA_FILE, JSON.stringify(corps, null, 2), (err) => {
      if (err) return res.status(500).json({ error: 'Failed to save data' });
      
      // Tell React it was successful
      res.json({ success: true, message: 'Saved successfully!' });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});