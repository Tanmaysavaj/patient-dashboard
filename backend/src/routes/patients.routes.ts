import { Router, Request, Response } from 'express';
import { Patient, PaginatedResponse, IPatient, PatientStatus } from '../models/patient.model.js';

const router = Router();

// ─── GET /api/patients ───────────────────────────────────────────────────────
// Supports ?search=<name|email>, ?status=<active|pending|inactive>,
//          ?page=<number>, ?pageSize=<number>
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, status, page, pageSize } = req.query;

    const filter: Record<string, unknown> = {};

    // Search by firstName, lastName, or email (case-insensitive)
    if (search && typeof search === 'string') {
      filter['$or'] = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName:  { $regex: search, $options: 'i' } },
        { email:     { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by status
    if (status && typeof status === 'string') {
      const validStatuses: PatientStatus[] = ['active', 'pending', 'inactive'];
      if (validStatuses.includes(status as PatientStatus)) {
        filter['status'] = status;
      }
    }

    // Pagination defaults
    const pageNum  = Math.max(parseInt(page as string, 10) || 1, 1);
    const size     = Math.max(parseInt(pageSize as string, 10) || 10, 1);
    const skip     = (pageNum - 1) * size;

    const [data, total] = await Promise.all([
      Patient.find(filter).skip(skip).limit(size),
      Patient.countDocuments(filter)
    ]);

    const response: PaginatedResponse<IPatient> = {
      data,
      total,
      page: pageNum,
      pageSize: size
    };

    res.status(200).json(response);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: message });
  }
});

// ─── GET /api/patients/:id ───────────────────────────────────────────────────
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }
    res.status(200).json(patient);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: message });
  }
});

// ─── POST /api/patients ──────────────────────────────────────────────────────
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, dateOfBirth, status } = req.body as {
      firstName?: string;
      lastName?: string;
      email?: string;
      dateOfBirth?: string;
      status?: PatientStatus;
    };

    // Validate required fields
    if (!firstName || !lastName || !email || !dateOfBirth) {
      res.status(400).json({ error: 'Missing required fields: firstName, lastName, email, dateOfBirth' });
      return;
    }

    // Tighten validation: Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: 'Invalid email format' });
      return;
    }

    // Tighten validation: Date of birth cannot be in the future
    if (new Date(dateOfBirth) > new Date()) {
      res.status(400).json({ error: 'Date of birth cannot be in the future' });
      return;
    }

    const patient = new Patient({ firstName, lastName, email, dateOfBirth, status });
    const saved = await patient.save();
    res.status(201).json(saved);
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes('duplicate key')) {
      res.status(400).json({ error: 'A patient with this email already exists' });
      return;
    }
    const message = error instanceof Error ? error.message : 'Internal server error';
    res.status(400).json({ error: message });
  }
});

// ─── PUT /api/patients/:id ──────────────────────────────────────────────────
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body as { status?: PatientStatus };

    if (!status) {
      res.status(400).json({ error: 'Missing required field: status' });
      return;
    }

    const validStatuses: PatientStatus[] = ['active', 'pending', 'inactive'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: 'Invalid status. Must be: active, pending, or inactive' });
      return;
    }

    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!patient) {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }

    res.status(200).json(patient);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: message });
  }
});

export default router;
