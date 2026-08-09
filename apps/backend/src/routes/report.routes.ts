import { Router } from 'express';
import { getArrearsReport } from '../controllers/report.controller';

const router = Router();

router.get('/mora', getArrearsReport);

export default router;