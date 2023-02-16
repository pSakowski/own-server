const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const app = express();
const PORT = 8000;

app.engine('hbs', hbs());
app.set('view engine', 'hbs');

app.use(express.urlencoded({ extended: false }));

// Set up middleware
app.use(express.static(path.join(__dirname, '/public')));

// Set up routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/about', (req, res) => {
  res.render('about', { layout: 'dark' });
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.get('/info', (req, res) => {
  res.render('info');
});

app.get('/history', (req, res) => {
  res.render('history');
});

app.get('/hello/:name', (req, res) => {
  res.render('hello', { name: req.params.name });
});

app.post('/contact/send-message', upload.single('file'), (req, res) => {
  const { author, sender, title, message } = req.body;
  if (author && sender && title && message && req.file) {
    const file = req.file;
    if (file) {
      const fileName = file.originalname;
      res.render('contact', {
        isSent: true,
        fileName: fileName,
        fileBuffer: file.buffer.toString('base64'),
      });
    } else {
      res.render('contact', { isSent: true });
    }
  } else {
    res.render('contact', { isError: true });
  }
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).render('404');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
