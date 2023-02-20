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
    for (let i = 0; i < 150; i++) {
        const random1000 = Math.floor(Math.random() * 5);
        
        const price = Math.floor(Math.random() * 2) + 1;
        const place = new Placeground({
            // USER ID
            author: "63d58efe6e596f1c5c22c5f9",
            location: `${cities[random1000].city}, ${cities[random1000].admin_name}`,
            title: `${sample(descriptors)} ${sample(places)}`,
           // image: 'https://source.unsplash.com/483251', 
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed quo praesentium in ratione odio recusandae. Mollitia suscipit, beatae accusamus ad eos sequi',
            price,
            //typeplace : 'fruit',//`${typesplases[random1000].typess}`,           
            geometry: {
                type: "Point",
                coordinates: [
                     // coordinates: [15.240570, 44.657327] 
                    cities[random1000].lng,
                    cities[random1000].lat,
                ]
            },
            image: [
                {
                    url: 'https://res.cloudinary.com/db8dzgriv/image/upload/v1675642244/yemenReviews/l4lvvehb4jdbiqqoogkz.jpg',
                    filename: 'yemenReviews/l4lvvehb4jdbiqqoogkz',
                    
                  },
                  {
                    url: 'https://res.cloudinary.com/db8dzgriv/image/upload/v1675642254/yemenReviews/aiddnomq8yk25khh5klb.jpg',
                    filename: 'yemenReviews/aiddnomq8yk25khh5klb',
                    
                  },
                
            ]
            
        })
        await place.save();
    }
}
seedDB();
seedDB().then(() => {
    mongoose.connection.close();
    
})