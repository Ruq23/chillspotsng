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
// const bcrypt = require('bcrypt');
const user = require('./models/user');
const session = require('express-session')
const spotRoutes = require('./routes/spot')
const reviewRoutes = require('./routes/reviews')
const userRoutes = require('./routes/users')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const flash = require('connect-flash');
const { isAuthor } = require('./middleware.js');
const port = process.env.PORT || 3000;
const helmet = require('helmet');


// const mongoStore = require('connect-mongo')(session);


// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGODB_CONNECT_URI)
//         console.log('Connected to MongoDb succesfully')
//     }catch(e) {
//         console.log('Connection failed' + error.message)
//     }
// }

mongoose.connect(process.env.MONGODB_CONNECT_URI), {
    useNewUrlParser: true,
    useUnifiedTopology: true
}


// mongoose.connect('mongodb://localhost:27017/chillSpotng', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

// mongoose.connect("mongodb://mongo:eqeDsY0CelNL0xjvomcf@containers-us-west-98.railway.app:6560", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });



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
    name: 'sheeeesh',
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
// app.use(helmet());
// app.use(
//     helmet({
//       contentSecurityPolicy: false,
//       xDownloadOptions: false,
//     })
//   );
//   const scriptSrcUrls = [
//     "https://stackpath.bootstrapcdn.com/",
//     "https://api.tiles.mapbox.com/",
//     "https://api.mapbox.com/",
//     "https://kit.fontawesome.com/",
//     "https://code.jquery.com/",
//     "https://cdnjs.cloudflare.com/",
//     "https://cdn.jsdeliver.net/",
//   ];

//   const styleSrcUrls = [
//     "https://kit-free.fontawesome.com/",
//     "https://stackpath.bootstrapcdn.com/",
//     "https://api.mapbox.com/",
//     "https://api.titles.mapbox.com/",
//     "https://fonts.googleapis.com/",
//     "https://use.fontawesome.com/",

//   ]
//   const connectSrcUrls = [
//     "https://api.mapbox.com/",
//     "https://a.tiles.mapbox.com/",
//     "https://b.tiles.mapbox.com/",
//     "https://events.mapbox.com/"
//   ]

//     const fontSrcUrls = [];

//   app.use(
//     helmet.contentSecurityPolicy({
//         directives: {
//             defaultSrc: [],
//             connectSrc: ["'self", ...connectSrcUrls],
//             scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
//             styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
//             workerSrc: ["'self", "blob:"],
//             objectSrc: [],
//             imgSrc: [
//                 "'self'",
//                 "blob:",
//                 "data:",
//                 "https://res.cloudinary.com/YOURNAME/",
//                 "https://images.unsplash.com/",
//             ],
//             fontSrc: ["'self'", ...fontSrcUrls],
//         },
//     })
//   );

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


app.get('/', async(req, res) => {
    res.render('home')
})











app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
} )

app.use((err, req, res, next) => {
    const{statusCode = 500} = err
    if(!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error.ejs', { err });
    // res.status(statusCode).send('Error')
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log('Serving on port ' + PORT)
})

