const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ silent: process.env.NODE_ENV === 'production'});

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

const coursesRouter = require('./routes/courses');
const lecturesRouter = require('./routes/lectures');
const usersRouter = require('./routes/users');
const sessionsRouter = require('./routes/sessions');

app.use('/api/courses', coursesRouter);
app.use('/api/lectures', lecturesRouter);
app.use('/api/users', usersRouter);
app.use('/api/sessions', sessionsRouter);

app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('*', (req,res) =>{
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port: http://localhost:${port}/`);
});