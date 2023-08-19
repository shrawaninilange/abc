const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/project', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/home.html');
});

 
app.get('/signup', (req, res) => {
  res.sendFile(__dirname + '/views/signup.html');
});

app.get('/course', (req, res) => {
    res.sendFile(__dirname + '/views/course.html');
  });
  
 

app.get('/login', (req, res) => {
    console.log('Accessing /login route');
    res.sendFile(__dirname + '/views/login.html');
  });

app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const newUser = new User({ username, password });
    await newUser.save();
    req.session.user = newUser;
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.redirect('/signup');
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    
    if (user) {
      req.session.user = user;
        res.redirect('/');
    } else {
      res.send('Invalid credentials');
    }
  } catch (error) {
    console.error(error);
    res.send('An error occurred');
  }
});



  
// ... Start server ...





const courseSchema = new mongoose.Schema({
  id: Number,
  title: String,
  duration: Number,
});
const Course = mongoose.model('Course', courseSchema);

// Middleware
app.use(express.json()); // Parse JSON request bodies

// Routes
app.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});



  

  // Middleware to check if the user is logged in
const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    res.redirect('/login'); // Redirect to the login page if not logged in
  } else {
    next();
  }
};

// Protected route that requires the user to be logged in
app.get('/protected', requireLogin, (req, res) => {
  res.send('You are logged in and can access this page.');
});


app.get('/course', async (req, res) => {
  try {
    const courses = await course.find(); // Retrieve all courses from the "courses" collection
    res.render('course', { courses }); // Render the EJS view and pass the courses data
  } catch (error) {
    console.error(error);
    res.send('An error occurred');
  }
});


 

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
