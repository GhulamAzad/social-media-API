import * as dotenv from 'dotenv'
dotenv.config()
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './routers/routes.js';
import ErrorHandler from './middleware/errorHandler.js';

const app = express()
const port = process.env.PORT || 5000;

// middlewares
app.use(cors())
app.use(express.json());

// Connect to MongoDB database
mongoose.connect(process.env.MONGODB_URI)
    .then(() => app.listen(port, () => console.log(`Server listening on port ${port}`)))
    .catch(error => console.log(error.message));

// Routers
app.use("/api", router);

// middleware
app.use(ErrorHandler);