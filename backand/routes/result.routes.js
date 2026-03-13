import express from 'express'
import authMiddleware from '../middleware/auth.js';
import { createResult, listResult } from '../controllers/result.controller.js';
const resultRouter = express();
resultRouter.post('/',authMiddleware,createResult);
resultRouter.get('/',authMiddleware,listResult)

export default resultRouter