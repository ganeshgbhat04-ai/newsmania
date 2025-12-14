require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const cron = require('node-cron');

const authRoutes = require('./routes/authRoutes');
const newsRoutes = require('./routes/newsRoutes');
const adminRoutes = require('./routes/adminRoutes');
const fetchNewsJob = require('./cron/fetchNews');
const personalizeRoutes = require('./routes/personalizeRoutes');
const savedRoutes = require("./routes/savedRoutes");
const adRoutes=require("./routes/adRoutes");
const commentsRoutes = require("./routes/commentRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

app.use('/auth', authRoutes);
app.use('/news', newsRoutes);
app.use('/admin', adminRoutes);
app.use("/saved", savedRoutes);
app.use('/personalize', personalizeRoutes);
app.use('/ads', adRoutes);
app.use('/comments', commentsRoutes);

app.get('/', (req, res) => {
  res.render('home');
});

cron.schedule('*/15 * * * *', () => {
  console.log('Running scheduled news fetch...');
  fetchNewsJob();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
