const express = require('express');
const path = require('path');
const port = process.env.PORT ||3000
const app = express();
const cors = require('cors')
const publicDirectory = path.join(__dirname, 'build');
app.use(express.static(publicDirectory));
app.use(cors())
app.get('*', (req, res) => {
  res.sendFile(path.join(publicDirectory, 'index.html'));
});
app.use((req, res) => {
  res.status(404).json({ message: 'Request not found.' });
});

app.listen(port, () => console.log('Web server started.'+port));
