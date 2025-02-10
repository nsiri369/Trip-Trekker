const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3019;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// MongoDB Connection
mongoose.connect('mongodb+srv://revathi3634:dtDQZWopM8oacqYZ@mango.95fcp.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connection successful'))
    .catch(err => console.error('MongoDB connection error:', err));

// Schema and Model
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
});

const Users = mongoose.model('User', userSchema);

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});

// Handle Registration
app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if email or username already exists
        const existingUser = await Users.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({
                error: 'Email or username already exists. Please use different credentials.',
            });
        }

        // Save new user
        const user = new Users({ username, email, password });
        await user.save();
        console.log('New user registered:', user);
        res.status(200).json({ message: 'Registration successful!' });
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ error: 'An error occurred during registration. Please try again.' });
    }
});

// Handle Login
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user in the database
        const user = await Users.findOne({ username });
        if (!user || user.password !== password) {
            return res.status(400).json({ error: 'Invalid username or password.' });
        }

        console.log('Login successful for user:', username);
        res.status(200).json({ message: 'Login successful!', username });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'An error occurred during login. Please try again later.' });
    }
});

// Dashboard Route
app.get('/preview', (req, res) => {
    res.sendFile(path.join(__dirname, 'preview.html'));
});

// Start Server
app.listen(port, () => {
    console.log(Server started on http://localhost:${port});
});