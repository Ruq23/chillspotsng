if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}



const express = require('express');
const path = require('path');
const mongoose = require ('mongoose');
const ejsMate = require('ejs-mate');
const { spotSchema } = require('./schemas.js');
const { reviewSchema } = require('./schemas.js');
const catchAsync = require('./utilities/catchAsync')
const ExpressError = require('./utilities/ExpressError')
const Spot = require('./models/spot');
const Review = require('./models/review');
const User = require('./models/user');
const methodOverride = require('method-override');
const { stat } = require('fs');
const bcrypt = require('bcrypt');
const user = require('./models/user');
const session = require('express-session')
const spotRoutes = require('./routes/spot')
const reviewRoutes = require('./routes/reviews')
const userRoutes = require('./routes/users')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const flash = require('connect-flash');
const { isAuthor } = require('./middleware.js');
// const mongoStore = require('connect-mongo')(session);


mongoose.connect('mongodb://localhost:27017/chillSpotng', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected")
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    // store: new mongoStore({ mongooseConnection: mongoose.connection }),
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 *60 * 24 * 7,
        maxAge: 1000 * 60 *60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); 

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    console.log(req.session)
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   res.locals.session = req.session
   next();
})



//ROUTES

app.use('/', userRoutes);
app.use('/list', spotRoutes);
app.use('/list/:id/reviews', reviewRoutes)


// app.get('/', async(req, res) => {
//     res.send('Hi')
// })











app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
} )

app.use((err, req, res, next) => {
    const{statusCode = 500} = err
    if(!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error.ejs', { err });
    // res.status(statusCode).send('Error')
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})