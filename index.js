const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const session = require('express-session');

// Set up session middleware
app.use(session({
    secret: 'secret1234',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set secure to true if using HTTPS
}));

// Set the correct password parts
const correctPasswordParts = ['93526', '81', 'aeeo'];


// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Set the view engine to pug
app.set('view engine', 'pug');

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index', { title: 'Alien', message: 'Hello World!!' });
});
// Route to handle individual part check
app.post('/check-part', (req, res) => {
    const { partIndex, partValue } = req.body;

    if (!req.session.partsValidated) {
        req.session.partsValidated = [false, false, false];
    }

    if (correctPasswordParts[partIndex] === partValue.toLowerCase()) {
        req.session.partsValidated[partIndex] = true;
    } else {
        req.session.partsValidated[partIndex] = false;
    }

    if (req.session.partsValidated.every(part => part)) {
        req.session.authenticated = true;
        res.json({ success: true, allPartsCorrect: true });
    } else {
        res.json({ success: req.session.partsValidated[partIndex], allPartsCorrect: false });
    }
});

// Middleware to check if the user is authenticated
function checkAuthentication(req, res, next) {
    if (req.session.authenticated) {
        next();
    } else {
        res.redirect('/');
    }
}

// Route to render the success page
app.get('/success', checkAuthentication, (req, res) => {
    res.render('success', { title: 'Success', message: 'Password Correct! Here is some lorem ipsum text.' });
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});