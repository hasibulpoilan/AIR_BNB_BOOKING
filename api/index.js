require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const JWT_SECRET = 'hwduhhijiwdjikdwo';
const imageDownloader = require('image-downloader');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { userInfo } = require('os');
const { error, log } = require('console');



const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
    console.log('Created uploads directory');
}

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const pool = new Pool({
    user: 'postgres',     
    host: 'localhost',    
    database: 'flags',    
    password: '092003',   
    port: 3000,    
});


app.use(cors({
    credentials: true,
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['content-Type', 'Authorization'],
}));

app.get('/test', (req, res) => {
    res.json('test ok');
})

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const bcryptSalt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, bcryptSalt);

        const result = await pool.query(
            'INSERT INTO bookinguser (name,email,password) VALUES ($1,$2,$3) RETURNING *',
            [name, email, hashedPassword]
        );

        res.json({ message: 'user register successfully', user: result.rows[0] });
        console.log({ user: result.rows[0] })
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'failed to register user' });
    }
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const userResult = await pool.query('SELECT * FROM bookinguser WHERE email = $1', [email]);
        const user = userResult.rows[0];

        if (!user) {
            return res.status(400).json({ error: 'user not found' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(400).json({ error: 'incorrect passwword' });
        }

        const token = jwt.sign({ userId: user.id, email: user.email, name: user.name }, JWT_SECRET);

        res.cookie('token', token, { httpOnly: true })
            .json({ message: 'login successful', token, user: { userId: user.id, name: user.name, email: user.email } });
    } catch (err) {
        console.error(err);
    }
})

app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    console.log('Received token:', token);
    if (token) {
        jwt.verify(token, JWT_SECRET, {}, (err, user) => {
            if (err) {
                console.error('Token verification error:', err);
                return res.status(403).json({ error: 'Token verification failed' });
            }
            console.log('Verified user:', user);
            res.json({ userId: user.userId, email: user.email, name: user.name });
        });
    } else {
        console.log('No token found');
        res.json(null);
    }
});

app.post('/logout', (req, res) => {
    res.cookie('token', '').json(true);
})

app.post('/upload-by-link', async (req, res) => {
    const { link } = req.body;
    
    if (!link.startsWith('http://') && !link.startsWith('https://')) {
        return res.status(400).json({ error: 'Invalid URL format. Must start with http:// or https://' });
    }

    try {
        const newName = 'photo' + Date.now() + '.jpg';
        await imageDownloader.image({
            url: link,
            dest: path.join(__dirname, 'uploads', newName),
        });
        res.json({ message: 'Image downloaded successfully', fileName: newName });
    } catch (error) {
        console.error('Image download error:', error);
        res.status(500).json({ error: 'Failed to download the image', details: error.message });
    }
});


const photoMiddleware = multer({ dest: 'uploads' });

app.post('/upload', photoMiddleware.array('photos', 100), (req, res) => {
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
        const { path, originalname } = req.files[i];
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newPath = `${path}.${ext}`;
        fs.renameSync(path, newPath); // Rename the file to include the correct extension
        uploadedFiles.push(newPath.replace(/\\/g, '/').replace('uploads/', '')); // Normalize path and push it to the array
    }
    res.json(uploadedFiles); 
});

app.post('/places', async (req, res) => {
    const { token } = req.cookies;
    const {
        title, address, addedPhotos, description,
        perks, extraInfo, checkIn, checkOut, maxGuests,price,
    } = req.body;
    console.log('Request body:', req.body);
    console.log('maxGuest:', maxGuests); 

    jwt.verify(token, JWT_SECRET, {}, async (err, user) => {
        if (err) return res.status(403).json({ error: 'Token verification failed' });


        try {
            const insertPlaceQuery = `
            INSERT INTO place (user_id, title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests,price)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11) 
            RETURNING *;
            `;
            const result = await pool.query(insertPlaceQuery,
                [user.userId, title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests,price]);
                res.json({message:'place added successfully',place:result.rows[0]});
        } catch (error) {
            console.error('Error inserting place:', error);
            res.status(500).json({ error: 'Failed to add place' });
        }
    })
})

app.get('/user-places', async (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, JWT_SECRET, {}, async (err, user) => {
        if (err) return res.status(403).json({ error: 'Token verification failed' });
        
        try {
            const result = await pool.query('SELECT * FROM place WHERE user_id = $1', [user.userId]);
            res.json(result.rows);
        } catch (error) {
            console.error('Error retrieving places:', error);
            res.status(500).json({ error: 'Failed to retrieve places' });
        }
    });
});
app.get('/places/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM place WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Place not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching place by ID:', error);
        res.status(500).json({ error: 'Failed to fetch place' });
    }
});
app.put('/places/:id', async (req, res) => {
    const { id } = req.params;
    const { title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests,price } = req.body;
    
    try {
        const query = `
            UPDATE place
            SET 
                title = $1, 
                address = $2, 
                addedPhotos = $3, 
                description = $4, 
                perks = $5, 
                extraInfo = $6, 
                checkIn = $7, 
                checkOut = $8, 
                maxGuests = $9,
                price = $10
            WHERE id = $11
            RETURNING *;
        `;
        const values = [title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests,price, id];
        
        const result = await pool.query(query, values); 
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Place not found" });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

app.get('/places', async (req, res) => {
    const { page = 1, limit = 16 } = req.query;
    const offset = (page - 1) * limit;

    try {
        const result = await pool.query(
            'SELECT * FROM place ORDER BY id DESC LIMIT $1 OFFSET $2',
            [limit, offset]
        );

        res.json(result.rows || []);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Failed to retrieve places' });
    }
});

app.post('/bookings',async(req,res)=>{
    const {place,checkIn,checkOut,numberOfGuest,name,phone,price} = req.body;

    if (!checkIn || !checkOut || !name || !phone || !place || !price) {
        return res.status(400).send({ error: "Missing required fields" });
    }

    try {
        const newBoking = await pool.query(
            `INSERT INTO booking (place,checkIn,checkOut,numberOfGuest,name,phone,price)
            VALUES($1,$2,$3,$4,$5,$6,$7)
            RETURNING *`,
            [place,checkIn,checkOut,numberOfGuest,name,phone,price]
        );
        res.status(201).json(newBoking.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
})

app.get('/bookings', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM booking');
      res.json(result.rows); 
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  });
  
  app.get('/bookings/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query('SELECT * FROM booking WHERE id = $1', [id]);
      if (result.rows.length > 0) {
        res.json(result.rows[0]);
      } else {
        res.status(404).send('Booking not found');
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  });
  
  app.delete('/places/:id', async (req, res) => {
    const { id } = req.params;
    console.log("Incoming request to delete place with ID:", id);
    try {
        const result = await pool.query('DELETE FROM place WHERE id = $1', [id]);
        console.log("Query result:", result);
        if (result.rowCount === 0) {
            console.log("No place found with the given ID.");
            return res.status(404).send("Place not found.");
        }
        res.status(200).send("Place deleted successfully.");
    } catch (err) {
        console.error("Error during deletion:", err);
        res.status(500).send("Failed to delete place.");
    }
});



app.listen(4000);