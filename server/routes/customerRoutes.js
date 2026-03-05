import express from 'express';
import { getCustomers, getCustomerById } from '../controllers/customerController.js';

const router = express.Router();

router.get('/customers', getCustomers);
router.get('/customers/:id', getCustomerById);

export default router;