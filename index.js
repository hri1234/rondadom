// server.js
const express = require('express');
const multer = require('multer');
const csv = require('csvtojson');
const mongoose = require('mongoose');
const cors = require("cors")

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb+srv://pawaryash2411:yash123456789@cluster0.1z5taia.mongodb.net/ghtnhj', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors())
const csvDataSchema = new mongoose.Schema({
  data: [{}],
});

const CsvData = mongoose.model('CsvData', csvDataSchema);

// Set up Multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Route for file upload
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    // Convert CSV to JSON
    const jsonData = await csv().fromFile(req.file.path);

    // Save data to MongoDB
    const csvData = new CsvData({ data: jsonData });
    await csvData.save();

    // Return JSON data
    res.json(jsonData);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error uploading file');
  }
});

app.listen(4000, () => {
  console.log('Server started on port 4000');
});