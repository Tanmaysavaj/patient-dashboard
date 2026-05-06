import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Patient, PatientStatus } from '../models/patient.model.js';

dotenv.config();

const patients: {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  status: PatientStatus;
  registeredDate: string;
}[] = [
  { firstName: 'John',     lastName: 'Smith',     email: 'john.smith@email.com',       dateOfBirth: '1985-03-15', status: 'active',   registeredDate: '2024-01-10T08:30:00.000Z' },
  { firstName: 'Sarah',    lastName: 'Johnson',   email: 'sarah.johnson@email.com',    dateOfBirth: '1990-07-22', status: 'active',   registeredDate: '2024-01-12T10:15:00.000Z' },
  { firstName: 'Michael',  lastName: 'Williams',  email: 'michael.williams@email.com', dateOfBirth: '1978-11-05', status: 'pending',  registeredDate: '2024-02-01T09:00:00.000Z' },
  { firstName: 'Emily',    lastName: 'Brown',     email: 'emily.brown@email.com',      dateOfBirth: '1995-01-30', status: 'active',   registeredDate: '2024-02-05T14:20:00.000Z' },
  { firstName: 'David',    lastName: 'Jones',     email: 'david.jones@email.com',      dateOfBirth: '1982-09-18', status: 'inactive', registeredDate: '2024-02-10T11:45:00.000Z' },
  { firstName: 'Jessica',  lastName: 'Garcia',    email: 'jessica.garcia@email.com',   dateOfBirth: '1993-04-12', status: 'active',   registeredDate: '2024-02-15T16:30:00.000Z' },
  { firstName: 'Daniel',   lastName: 'Martinez',  email: 'daniel.martinez@email.com',  dateOfBirth: '1988-12-25', status: 'pending',  registeredDate: '2024-03-01T08:00:00.000Z' },
  { firstName: 'Ashley',   lastName: 'Anderson',  email: 'ashley.anderson@email.com',  dateOfBirth: '1991-06-08', status: 'active',   registeredDate: '2024-03-05T13:10:00.000Z' },
  { firstName: 'James',    lastName: 'Taylor',    email: 'james.taylor@email.com',     dateOfBirth: '1975-02-14', status: 'inactive', registeredDate: '2024-03-10T10:30:00.000Z' },
  { firstName: 'Amanda',   lastName: 'Thomas',    email: 'amanda.thomas@email.com',    dateOfBirth: '1997-08-20', status: 'active',   registeredDate: '2024-03-15T09:45:00.000Z' },
  { firstName: 'Robert',   lastName: 'Jackson',   email: 'robert.jackson@email.com',   dateOfBirth: '1980-05-03', status: 'pending',  registeredDate: '2024-03-20T15:00:00.000Z' },
  { firstName: 'Stephanie',lastName: 'White',     email: 'stephanie.white@email.com',  dateOfBirth: '1992-10-11', status: 'active',   registeredDate: '2024-04-01T08:20:00.000Z' },
  { firstName: 'William',  lastName: 'Harris',    email: 'william.harris@email.com',   dateOfBirth: '1986-07-29', status: 'active',   registeredDate: '2024-04-05T12:00:00.000Z' },
  { firstName: 'Jennifer', lastName: 'Martin',    email: 'jennifer.martin@email.com',  dateOfBirth: '1994-03-17', status: 'inactive', registeredDate: '2024-04-10T14:30:00.000Z' },
  { firstName: 'Christopher',lastName:'Thompson', email: 'chris.thompson@email.com',   dateOfBirth: '1983-01-22', status: 'pending',  registeredDate: '2024-04-15T11:15:00.000Z' },
  { firstName: 'Lauren',   lastName: 'Robinson',  email: 'lauren.robinson@email.com',  dateOfBirth: '1996-09-05', status: 'active',   registeredDate: '2024-04-20T16:45:00.000Z' },
  { firstName: 'Matthew',  lastName: 'Clark',     email: 'matthew.clark@email.com',    dateOfBirth: '1979-11-30', status: 'active',   registeredDate: '2024-05-01T09:30:00.000Z' },
  { firstName: 'Rachel',   lastName: 'Rodriguez', email: 'rachel.rodriguez@email.com', dateOfBirth: '1990-04-25', status: 'pending',  registeredDate: '2024-05-05T13:00:00.000Z' },
  { firstName: 'Andrew',   lastName: 'Lewis',     email: 'andrew.lewis@email.com',     dateOfBirth: '1987-08-14', status: 'inactive', registeredDate: '2024-05-10T10:00:00.000Z' },
  { firstName: 'Nicole',   lastName: 'Lee',       email: 'nicole.lee@email.com',       dateOfBirth: '1998-02-07', status: 'active',   registeredDate: '2024-05-15T15:20:00.000Z' },
  { firstName: 'Kevin',    lastName: 'Walker',    email: 'kevin.walker@email.com',     dateOfBirth: '1981-06-19', status: 'active',   registeredDate: '2024-05-20T08:45:00.000Z' },
  { firstName: 'Megan',    lastName: 'Hall',      email: 'megan.hall@email.com',       dateOfBirth: '1993-12-01', status: 'pending',  registeredDate: '2024-06-01T12:30:00.000Z' },
  { firstName: 'Brandon',  lastName: 'Allen',     email: 'brandon.allen@email.com',    dateOfBirth: '1984-10-28', status: 'active',   registeredDate: '2024-06-05T14:00:00.000Z' },
  { firstName: 'Samantha', lastName: 'Young',     email: 'samantha.young@email.com',   dateOfBirth: '1999-05-16', status: 'inactive', registeredDate: '2024-06-10T11:00:00.000Z' },
  { firstName: 'Tyler',    lastName: 'King',      email: 'tyler.king@email.com',       dateOfBirth: '1976-03-09', status: 'pending',  registeredDate: '2024-06-15T09:15:00.000Z' },
];

async function seed(): Promise<void> {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error('Error: MONGODB_URI is not defined in .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing patients
    await Patient.deleteMany({});
    console.log('Cleared existing patient records');

    // Insert seed data
    const result = await Patient.insertMany(patients);
    console.log(`Successfully seeded ${result.length} patients`);

    // Print summary
    const active   = patients.filter(p => p.status === 'active').length;
    const pending  = patients.filter(p => p.status === 'pending').length;
    const inactive = patients.filter(p => p.status === 'inactive').length;
    console.log(`  Active: ${active} | Pending: ${pending} | Inactive: ${inactive}`);

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Seed error:', message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seed();
