const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors'); // Import the cors middleware
const path = require('path');

const app = express();
const port = process.env.PORT || 10000;

// Enable CORS for all routes
app.use(cors());

// Connect to MongoDB Atlas
const uri = "mongodb+srv://maharaaj:maharaaj@portfolio.exwn9uz.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Define the MongoDB schema
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: String,
  message: String,
  resume: {
    data: Buffer,
    contentType: String,
  },
});

const Contact = mongoose.model('Contact', contactSchema);

app.use(express.json());

// Handle form submissions
app.post('/submit-form', upload.single('resume'), async (req, res) => {
  try {
    const { name, email, mobile, message } = req.body;
    const resume = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    };

    // Save form data to MongoDB
    await Contact.create({ name, email, mobile, message, resume });

    res.status(200).send('Form submitted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
