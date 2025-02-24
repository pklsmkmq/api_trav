const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const wisataRoutes = require('./routes/wisataRoutes');
const cors = require('cors');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/categories', categoryRoutes);
app.use('/wisata', wisataRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));