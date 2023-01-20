const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { placegroundSchema, reviewSchema } = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Placeground = require('./models/placeground');
const Review = require ('./models/review');

mongoose.set('strictQuery', true); 
mongoose.connect('mongodb://localhost:27017/yemen-review', {
 
    useNewUrlParser: true,
    useUnifiedTopology: true

});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

 
const validatePlaceground = (req, res, next) => {
    const {error} = placegroundSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
    
}


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

app.get('/', (req, res) => {
    //res.send('Hello form Yemen Reviews ');
     res.render('home')
});

app.get('/5starplaces', catchAsync(async(req, res) => {
    const fivestarplaces = await Placeground.find({});
    res.render('5starplaces/index', {fivestarplaces})
}));


app.get('/5starplaces/new', (req, res) => {
   
    res.render('5starplaces/new');
});

app.post('/5starplaces', validatePlaceground, catchAsync(async(req, res, next) => {
      //  if(!req.body.placeground) throw new ExpressError('Invalid places Data', 400)
        
        const placeground = new Placeground(req.body.placeground);
        await placeground.save();
        res.redirect(`/5starplaces/${placeground._id}`);
   
}));


app.get('/5starplaces/:id',catchAsync(async(req, res) => {
    const placeground = await Placeground.findById(req.params.id).populate('reviews');
    //console.log(placeground)
    res.render('5starplaces/show', { placeground });
}));

app.get('/5starplaces/:id/edit', catchAsync(async(req, res) => {
    const placeground = await Placeground.findById(req.params.id);
    res.render('5starplaces/edit', { placeground });
}));

app.put('/5starplaces/:id', validatePlaceground, catchAsync(async (req, res) => {
    // res.send("IT WOEKED!!!")
    const { id } = req.params;
    const placeground = await Placeground.findByIdAndUpdate(id, { ...req.body.placeground });
    res.redirect(`/5starplaces/${placeground._id}`)
}));

app.delete('/5starplaces/:id', catchAsync( async(req, res) => {
    const { id } = req.params;
    await Placeground.findByIdAndDelete(id);
    res.redirect('/5starplaces');
}));

app.post('/5starplaces/:id/reviews', validateReview, catchAsync(async (req, res) => {
   // res.send('YOU MADE IT!!!!');
    const placeground = await Placeground.findById(req.params.id);
    const review = new Review(req.body.review);
    placeground.reviews.push(review);
    await review.save();
    await placeground.save();
    res.redirect(`/5starplaces/${placeground._id}`);
}));

app.delete('/5starplaces/:id/reviews/:reviewId', catchAsync(async (req, res) =>{
    const {id, reviewId} = req.params;
    await Placeground.findByIdAndUpdate(id, { $pull: { reviews: reviewId }});
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/5starplaces/${id}`);
    //res.send("Delete me")
}))

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