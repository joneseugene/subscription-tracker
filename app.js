import express from 'express';
import cookieParser from 'cookie-parser';
import { PORT } from './config/env.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import connectToDb from './database/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js';

const app = express();

//Express Middleware
app.use(express.json())
app.use(express.urlencoded({ extended:false }))
app.use(cookieParser())

//API Routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/subscriptions', subscriptionRouter)

//Custom Middlewares
app.use(errorMiddleware)

app.get('/', (req, res) => {
    res.send('Welcome to my Subscription Tracker API' )
});

app.listen(PORT, async () => {
    console.log(`This API on localhost http://localhost:${PORT}`)
    await connectToDb()
})

export default app