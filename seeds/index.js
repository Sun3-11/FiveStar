const mongoose = require('mongoose');
const cities = require('./cities');
const{places, descriptors} = require('./seedHelpers');
const Placeground = require('../models/placeground');

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

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Placeground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 5);
        const price = Math.floor(Math.random() * 2) + 1;
        const place = new Placeground({
            location: `${cities[random1000].city}, ${cities[random1000].admin_name}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/483251', 
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed quo praesentium in ratione odio recusandae. Mollitia suscipit, beatae accusamus ad eos sequi',
            price
            
        })
        await place.save();
    }
}
seedDB();
seedDB().then(() => {
    mongoose.connection.close();
})