//requires
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');


const userRoutes = require('./routes/user');
const placegroundRouters = require('./routes/placegrounds');
const reviewsRouter = require('./routes/reviews');


//Mongoose DB connections
mongoose.set('strictQuery', true); 
mongoose.connect('mongodb://localhost:27017/yemen-review', {
 
    useNewUrlParser: true,
    useUnifiedTopology: true,

});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

//config for app
const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Middelware:
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

//SESSIONS
const sessionConfig = {
    secret: 'thismybettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
    
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
   console.log(req.session)
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   res.locals.currentUser = req.user;
   next();
})


//Routers

app.use('/', userRoutes)
app.use('/5starplaces', placegroundRouters)
app.use('/5starplaces/:id/reviews', reviewsRouter)

app.get('/', (req, res) => {
    //res.send('Hello form Yemen Reviews ');
     res.render('home')
});



app.all('*', (req, res, next) => {
    // res.send("404!!!!!!!");
    next(new ExpressError('Page Not Found', 404))
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'On No, Something Wrong!!!'
    res.status(statusCode).render('error', { err })
    //res.send('Oh boy, something went wrong!')
});

app.listen(3000, () => {
    console.log('Serving on port 3000');
})