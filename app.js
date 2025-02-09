import express from 'express'
import { PORT } from './config/env.js'
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import connectToDb from './database/mongodb.js';

const app = express();

//API Routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/subscriptions', subscriptionRouter)

app.get('/', (req, res) => {
    res.send('Welcome to my Subscription Tracker API' )
});

app.listen(PORT, async () => {
    console.log(`This API on localhost http://localhost:${PORT}`)
    await connectToDb()
})

export default app