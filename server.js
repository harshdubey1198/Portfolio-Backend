const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());

const uri = "mongodb+srv://maharaaj:maharaaj@portfolio.exwn9uz.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

app.post('/submit-form', upload.single('resume'), async (req, res) => {
  try {
    const { name, email, mobile, message } = req.body;
    const resume = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    };

    await Contact.create({ name, email, mobile, message, resume });

    res.status(200).send('Form submitted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Handle the process interruption signal
process.on('SIGINT', async () => {
  try {
    // Close the MongoDB connection gracefully before shutting down
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error during server shutdown:', error);
    process.exit(1);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
