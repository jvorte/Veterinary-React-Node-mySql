const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Σύνδεση με τη βάση δεδομένων
const db = mysql.createConnection({
    host: 'localhost', // Ή το IP του server
    user: 'root',      // Χρήστης MySQL
    password: '',      // Κωδικός MySQL
    database: 'furry_friends_vet' // Όνομα βάσης δεδομένων
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL!');
});

// API για δημιουργία νέου ραντεβού
app.post('/appointments', async (req, res) => {
    try {
        const { ownerName, petName, service, date, time } = req.body;
        console.log('Received data:', req.body); // Log request data
        
        const query = 'INSERT INTO appointments (ownerName, petName, service, date, time) VALUES (?, ?, ?, ?, ?)';
        console.log('Executing query:', query, [ownerName, petName, service, date, time]); // Log query and parameters
        
        db.query(query, [ownerName, petName, service, date, time], (err, result) => {
            if (err) {
                console.error('Error inserting appointment:', err);
                res.status(500).json({ message: 'Error inserting appointment' });
                return;
            }
            res.status(200).json({ message: 'Appointment created successfully' });
        });
    } catch (error) {
        console.error('Error inserting appointment:', error);
        res.status(500).json({ message: 'Error inserting appointment' });
    }
});

// Ξεκινάμε τον server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
