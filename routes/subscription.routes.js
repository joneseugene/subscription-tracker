import { Router } from 'express';
import authorize from '../middlewares/auth.middleware.js';
import { createSubscription, getSubscriptions, getUserSubscriptions } from '../controllers/subscription.controller.js';

const subscriptionRouter = Router();

subscriptionRouter.get('/', getSubscriptions);
subscriptionRouter.get('/:id', (req, res) => res.send( {title: 'get subscription detail'}));
subscriptionRouter.post('/', authorize, createSubscription);
subscriptionRouter.put('/:id', (req, res) => res.send( {title: 'update subscription'}));
subscriptionRouter.delete('/:id', (req, res) => res.send( {title: 'delete subscription'}));
subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);
subscriptionRouter.get('/:id/cancel', (req, res) => res.send( {title: 'cancel subscription='}));
subscriptionRouter.get('/upcoming-renewals', (req, res) => res.send( {title: 'get upcoming renewals'}));

export default subscriptionRouter;