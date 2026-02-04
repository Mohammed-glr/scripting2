import express from 'express';
import { getStatus, postAction, getHistory, resetSpacecraft, emergencyStop } from '../controllers/spacecraft.controller.js';

const router = express.Router();

router.get('/status', getStatus);
router.post('/action', postAction);
router.get('/history', getHistory);
router.post('/reset', resetSpacecraft);
router.post('/emergency-stop', emergencyStop);

export default router;
