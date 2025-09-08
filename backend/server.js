require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const video = require('./models/Video')
const videoRoutes = require('./routes/videoRoutes');
const authRoutes = require('./routes/authRoutes')

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/api/videos', videoRoutes);
app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI)

    .then(() => console.log('MongoDB Connected!'))
    .catch(err => console.log('MongoDB Error: ', err));

app.get('/', (req, res) => {
    res.send('Cloud Video Transcriber API is running');
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port http://localhost:${PORT}`);
})
