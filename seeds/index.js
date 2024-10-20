const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Placeground = require('../models/placeground');

mongoose.set('strictQuery', true);

async function connectDB() {
    try {
        await mongoose.connect('mongodb://localhost:27017/yemen-review', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Database connected");
    } catch (error) {
        console.error("Connection error:", error);
        process.exit(1);
    }
}

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    try {
        await Placeground.deleteMany({}); 
        
        for (let i = 0; i < 50; i++) {
            const random1000 = Math.floor(Math.random() * cities.length); 
            const price = Math.floor(Math.random() * 2) + 1;

            const place = new Placeground({
                // USER ID
                author: "63d58efe6e596f1c5c22c5f9",
                location: `${cities[random1000].city}, ${cities[random1000].admin_name}`,
                title: `${sample(descriptors)} ${sample(places)}`,
                description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed quo praesentium in ratione odio recusandae. Mollitia suscipit, beatae accusamus ad eos sequi',
                price,
                geometry: {
                    type: "Point",
                    coordinates: [
                        cities[random1000].lng,
                        cities[random1000].lat
                    ]
                },
                image: [
                    {
                        url: '/img/bg1.jpg',
                        filename: 'yemenReviews/l4lvvehb4jdbiqqoogkz',
                    },
                    {
                        url: '/img/bg5.jpg',
                        filename: 'yemenReviews/aiddnomq8yk25khh5klb',
                    },
                    {
                        url: '/img/ig4.jpg',
                        filename: 'yemenReviews/l4lvvehb4jdbiqqoogkz',
                    }
                ]
            });
            await place.save();
        }
    } catch (error) {
        console.error("Error seeding database:", error);
    }
};

connectDB().then(async () => {
    await seedDB();
    mongoose.connection.close(); 
});
