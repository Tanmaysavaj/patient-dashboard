import { Router, Request, Response } from 'express';
import { Patient, DashboardStats } from '../models/patient.model.js';

const router = Router();

// ─── GET /api/stats ──────────────────────────────────────────────────────────
// Returns counts: total, active, pending, inactive
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const [total, active, pending, inactive] = await Promise.all([
      Patient.countDocuments(),
      Patient.countDocuments({ status: 'active' }),
      Patient.countDocuments({ status: 'pending' }),
      Patient.countDocuments({ status: 'inactive' })
    ]);

    const stats: DashboardStats = { total, active, pending, inactive };
    res.status(200).json(stats);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: message });
  }
});

export default router;
