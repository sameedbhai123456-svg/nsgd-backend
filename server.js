const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://nsgd:nsgd1234@nsgd-cluster.mongodb.net/nsgd_db?retryWrites=true&w=majority';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Ledger Entry Schema
const ledgerSchema = new mongoose.Schema({
  username: { type: String, required: true },
  date: String,
  narration: String,
  income: Number,
  expense: Number,
  createdAt: { type: Date, default: Date.now }
});

const Ledger = mongoose.model('Ledger', ledgerSchema);

// Register Route
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
      username,
      password: hashedPassword
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login Route
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET || 'your_jwt_secret_key', {
      expiresIn: '24h'
    });

    res.json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add Ledger Entry Route
app.post('/api/ledger', async (req, res) => {
  try {
    const { username, date, narration, income, expense } = req.body;

    const entry = new Ledger({
      username,
      date,
      narration,
      income: income || 0,
      expense: expense || 0
    });

    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Ledger Entries Route
app.get('/api/ledger/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const entries = await Ledger.find({ username }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend server is running' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
