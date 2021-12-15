require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage: storage });

// const mysql = require('mysql2/promise');
// const dbConfig = require('./dbConfig');

const PORT = process.env.SERVER_PORT || 3000;

const app = express();

// middleware
app.use(morgan('common'));
app.use(cors());
app.use(express.json());
console.log('path', path.resolve('public', 'uploads'));
app.use('/skelbiu-img', express.static(path.resolve('public', 'uploads')));

app.get('/', (req, res) => {
  res.send('Hello express');
});

app.post('/api/new-listing', upload.single('mainImage'), (req, res) => {
  console.log('req.body ===', req.body);
  console.log('req.file ===', req.file);
  if (req.file.size >= 500000) {
    res.status(400).json({ error: 'Too big' });
  }
  res.json({ msg: 'image saved', data: req.file.filename });
});

// Routes import
// const sampleRoutes = require('./routes/v1/sampleRoute');
const userRoutes = require('./routes/v1/users');
const listingsRoutes = require('./routes/v1/listings')

// Use Routes
app.use('/', userRoutes);
app.use('/api/auth/listings', listingsRoutes)

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));



