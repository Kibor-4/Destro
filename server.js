const express = require('express');
const path = require('path');
const routes = require('./router/routes'); 
const userRoutes = require('./router/signup'); 
const upload = require('./Public/Uploads/multer'); 
const bodyParser = require('body-parser');
const cors = require("cors");

const app = express();
// Parse request bodies
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json()); 

// Set EJS as the view engine
app.set('view engine', 'ejs');
// Set the views directory
app.set('views', __dirname + '/views');




// Use the imported routes
app.use('/', routes); 
app.use('/submit', userRoutes); 
app.use(cors());

// Serve static files
app.use('/Public/stylesheet', express.static(path.join(__dirname, 'Public', 'stylesheet')));
app.use('/Public/images', express.static(path.join(__dirname, 'Public', 'images')));
app.use('/Public/Uploads',express.static(path.join(__dirname,'Public','Uploads' )));

app.get('/add-property', (req, res) => {
  res.render('add-property'); // Render the form (add-property.ejs)
});

// Route to handle form submission
/*app.post('/upload', upload.array('images[]'), (req, res) => {
  // Extract form data
  const { location, house_type, sqft, bedrooms, bathrooms, lot_size, price, description } = req.body;

  // Extract uploaded files
  const images = req.files.map(file => `/uploads/${file.filename}`); // Save file paths

  // Render the sale.ejs file with the submitted data
  res.render('sale', {
    location,
    house_type,
    sqft,
    bedrooms,
    bathrooms,
    lot_size,
    price,
    description,
    images,
  });
});*/

function predictPrice(data) {
  // Example: Simple linear regression-like calculation
  const basePrice = 100000; // Base price
  const pricePerSqft = 200; // Price per square foot
  const pricePerBedroom = 10000; // Price per bedroom
  const pricePerBathroom = 8000; // Price per bathroom
  const conditionMultiplier = {
      excellent: 1.2,
      good: 1.0,
      fair: 0.8,
      poor: 0.6,
  };

  const predictedPrice =
      basePrice +
      pricePerSqft * data.sqft +
      pricePerBedroom * data.bedrooms +
      pricePerBathroom * data.bathrooms +
      conditionMultiplier[data.condition] * basePrice;

  return predictedPrice.toFixed(2);
}

// Prediction endpoint
app.post('/predict', (req, res) => {
  const data = req.body;

  // Perform prediction
  const predictedPrice = predictPrice(data);

  // Send response
  res.json({ predictedPrice });
});


const port = 8100;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});