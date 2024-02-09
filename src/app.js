import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.routes.js';
import linkRoutes from './routes/links.routes.js';

// Initializations
const app= express();

// para que otro servidor se pueda conectar
const allowdOrigins = process.env.CLIENT_ORIGIN_IP.split(',');
app.use(cors({
    origin: allowdOrigins,
    credentials:true,
}))

// Settings
app.set('port', process.env.PORT || 3000);

// Middlewares
app.use(morgan('dev'));

// allow read json
app.use(express.json())

// allow read cookie like json
app.use(cookieParser())

// routes
app.use("/api",authRoutes)
app.use("/api",linkRoutes)

export default app;