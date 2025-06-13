const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 9000; // Set port to 9000 as required

// --- Database Setup ---
const dbPath = path.join(__dirname, 'clinic.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database at', dbPath);
        db.run(`CREATE TABLE IF NOT EXISTS appointments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            appointment_date TEXT NOT NULL,
            appointment_time TEXT NOT NULL,
            message TEXT,
            submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('Error creating table', err.message);
            } else {
                console.log('Table "appointments" is ready.');
            }
        });
    }
});

// --- Middleware ---
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// --- HTML Page Routes ---
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/services', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'services.html'));
});

app.get('/doctors', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'doctors.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

app.get('/appointment', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'appointment.html'));
});

// --- API Routes ---
app.post('/api/book-appointment', (req, res) => {
    const { name, email, phone, date, time, message } = req.body;

    if (!name || !email || !phone || !date || !time) {
        return res.status(400).json({ success: false, message: 'Please fill all required fields.' });
    }

    const sql = `INSERT INTO appointments (name, email, phone, appointment_date, appointment_time, message) VALUES (?, ?, ?, ?, ?, ?)`;
    const params = [name, email, phone, date, time, message || ''];

    db.run(sql, params, function(err) {
        if (err) {
            console.error('Error inserting data', err.message);
            return res.status(500).json({ success: false, message: 'An error occurred while booking your appointment. Please try again later.' });
        }
        // Return a success message; client-side will handle redirect or UI update
        res.status(201).json({ success: true, message: 'Appointment request received successfully! We will contact you shortly.', appointmentId: this.lastID });
    });
});

// --- Server Start ---
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log('Ensure all files are in their correct locations, especially HTML files in the /public directory.');
    console.log('To start, run "npm install" and then "npm start" or use startup.sh.');
});
