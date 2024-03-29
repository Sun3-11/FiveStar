const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;


// https://res.cloudinary.com/douqbebwk/image/upload/w_300/v1600113904/YelpCamp/gxgle1ovzd2f3dgcpass.png

const ImageSchema = new Schema({
    url: String,
    filename: String
});


ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true }}//, timestamps: true };

const PlacegroundSchema = new Schema({
    title: String,
   
    image:[ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true
        }    
    },
    price: Number, 
    typeplace: {
        
        type: String,
       // required: true,
        lowercase: true,
        enum: ['coffee', 'restaurant', 'park', 'another thing']
    },
   duration: {
        
        type: String,
       // required: true,
        lowercase: true,
        enum: ['24', '12', 'day', 'month', 'year']
    },
    description: String,
    location: String,
    createdAt : { type: Date, default: Date.now },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    username: String,

    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    rating: {
      type: Number,
      default: 0,
    },
    winner: {
      type: Boolean,
      default: false,
    },
    tag: String,

}, opts);

PlacegroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/5starplaces/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`
});

PlacegroundSchema.post('findOneAndDelete', async function(doc) {
    //console.log("Deleted!!!!!!")
   // console.log(doc)
   if(doc){[
         await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
         })
   ]}
})

module.exports = mongoose.model('Placeground', PlacegroundSchema);