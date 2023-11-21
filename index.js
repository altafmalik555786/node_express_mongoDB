require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoString = process.env.DATABASE_URL;
const fileUpload = require('express-fileupload');
const useCombineRoutes = require('./routes');

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  const clientIP = req.ip; // This captures the client's IP address
  // You can save or log the IP address as needed
  console.log(`Client IP Address: ${clientIP}`);
  next();
});

// app.use(cors());
// Allow requests from your React app's domain
const allowedOrigins = ['https://coolblogging.netlify.app'];
app.use(cors({
  origin: "*", // Use the CORS_ORIGIN environment variable
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}));
app.use(bodyParser.json());
app.options('*',cors())
app.use(fileUpload({
    useTempFiles:false
}))

// app.use('/api', require('./routes/route').router);
// app.use('/api', require('./routes/userRoutes').router);
// app.use('/api', require('./routes/post').router);
// app.use('/api', require('./routes/emailVerification').router);
// app.use('/api', require('./routes/resetEmailRoute').router);

useCombineRoutes(app)

app.listen(process.env.PORT || 5000,  () => {
    console.log(`Server Started at http://${process.env.PORT || 5000}`)
})

