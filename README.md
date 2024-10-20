# FiveStar Application

This project is a Node.js application for displaying real estate listings. The application uses MongoDB as the database, Mapbox for displaying interactive maps, and Cloudinary for handling image uploads. The app also utilizes a `.env` file for managing environment variables securely.

##Gif

## Image


## Features

- **Real estate listings**: Display available properties with details such as price, location, and images.
- **Map Integration**: Use Mapbox to display property locations on an interactive map.
- **Image Uploads**: Upload and store property images using Cloudinary.
- **Responsive Design**: A responsive web design that works on all devices.
  
## Technologies Used

- **Node.js**: Backend server
- **Express.js**: Web framework for Node.js
- **MongoDB**: Database for storing property listings
- **Mapbox**: Interactive maps for displaying property locations
- **Cloudinary**: Image hosting and management
- **Mongoose**: ODM for MongoDB
- **EJS**: Templating engine for rendering HTML
- **dotenv**: For managing environment variables

## Prerequisites

Before running the project, ensure you have the following installed:

- **Node.js**: Download and install from [Node.js website](https://nodejs.org/).
- **MongoDB**: You can either install MongoDB locally or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for cloud hosting.
- **Cloudinary account**: For image storage, create an account at [Cloudinary](https://cloudinary.com/).
- **Mapbox account**: For map integration, create an account at [Mapbox](https://www.mapbox.com/).

## Installation

Follow these steps to set up and run the project locally:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/username/repo-name.git

2. Navigate to the project directory:
   ```bash
   cd repo-name
3. Install dependencies: Use npm to install the required packages:
   ```bash
   npm install
4. Set up environment variables: Create a .env file in the root directory and add the following variables:
   ```bash
    CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
    CLOUDINARY_KEY=your-cloudinary-api-key
    CLOUDINARY_SECRET=your-cloudinary-api-secret
    MAPBOX_TOKEN=your-mapbox-access-token
    DB_URL=mongodb://localhost:27017/realestate
    PORT=8080
    SECRET=Your-sectret
Replace the values with your actual credentials.

5. Run MongoDB: If you're running MongoDB locally, make sure MongoDB is running:
   ```bash
   mongod
6. Run the application: Start the Node.js server:
   ```bash
   nodemon
   or
   node indexjs
   
7. Access the application: Open your browser and go to:
   ```bash
   http://localhost:8080

## Environment Variables
   The application uses a .env file to store sensitive information like API keys and database URLs. Here's a list of required variables:

  .CLOUDINARY_CLOUD_NAME: Your Cloudinary cloud name
  .CLOUDINARY_KEY: Your Cloudinary API key
  .CLOUDINARY_SECRET: Your Cloudinary API secret
  .MAPBOX_TOKEN: Your Mapbox access token for maps
  .DATABASE_URL: The URL of your MongoDB database
  .PORT: Port on which the server will run (default: 8080)

## Project Structure
   
    real-estate-app/
    │
    ├── models/               # Mongoose models for properties
    ├── routes/               # Express routes
    ├── views/                # EJS templates for rendering UI
    ├── public/               # Static files like CSS, JS
    ├── .env                  # Environment variables file
    ├── app.js                # Main application entry point
    ├── package.json          # Project dependencies and scripts
    └── README.md             # Project documentation

## Usage

Add property listings: Admins can add new real estate listings with images and locations.
View properties on the map: Users can explore property locations on an interactive Mapbox map.
Search properties: Users can search for properties based on criteria such as price, location, and type.

## Deployment

You can deploy this application on platforms like Heroku, Vercel, or any other Node.js-friendly hosting services. Make sure to set the environment variables in the hosting service's dashboard for proper configuration.

## License

## Acknowledgments
.Mapbox for the amazing map API.
.Cloudinary for seamless image storage and management.
```bash

### Key Points:
- Make sure to replace placeholders like `your-cloudinary-api-key` and `your-mapbox-access-token` with your actual credentials.
- The project is structured in a way that makes it easy to manage MongoDB, Mapbox, and Cloudinary integration.


