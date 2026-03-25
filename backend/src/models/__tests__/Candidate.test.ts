import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import Candidate from '../../models/Candidate';
import app from '../../app';

let mongoServer: MongoMemoryServer;
let authToken: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Obtenir un token avec les identifiants admin
  const res = await request(app).post('/auth/login').send({
    username: 'admin',
    password: 'Candidat@2026!',
  });
  authToken = res.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Candidate.deleteMany({});
});

describe('Candidates API', () => {
  it('should create a candidate (POST /api/candidates)', async () => {
    const payload = {
      firstName: 'Marie',
      lastName: 'Curie',
      email: 'marie@example.com',
      position: 'Physicienne',
    };
    const res = await request(app)
      .post('/api/candidates')
      .set('Authorization', `Bearer ${authToken}`)
      .send(payload);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.firstName).toBe(payload.firstName);
  });

  it('should return 400 on invalid data (missing firstName)', async () => {
    const payload = {
      lastName: 'Curie',
      email: 'marie@example.com',
      position: 'Physicienne',
    };
    const res = await request(app)
      .post('/api/candidates')
      .set('Authorization', `Bearer ${authToken}`)
      .send(payload);
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Prénom');
  });

  it('should get a candidate by ID (GET /api/candidates/:id)', async () => {
    const candidate = await new Candidate({
      firstName: 'Albert',
      lastName: 'Einstein',
      email: 'albert@example.com',
      position: 'Physicien',
    }).save();

    const res = await request(app)
      .get(`/api/candidates/${candidate._id}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(res.body.firstName).toBe('Albert');
  });

  it('should update a candidate (PUT /api/candidates/:id)', async () => {
    const candidate = await new Candidate({
      firstName: 'Niels',
      lastName: 'Bohr',
      email: 'niels@example.com',
      position: 'Physicien',
    }).save();

    const update = { firstName: 'Niels Henrik', status: 'validated' };
    const res = await request(app)
      .put(`/api/candidates/${candidate._id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(update);
    expect(res.status).toBe(200);
    expect(res.body.firstName).toBe('Niels Henrik');
    expect(res.body.status).toBe('validated');
  });

  it('should soft delete a candidate (DELETE /api/candidates/:id)', async () => {
    const candidate = await new Candidate({
      firstName: 'James',
      lastName: 'Maxwell',
      email: 'james@example.com',
      position: 'Physicien',
    }).save();

    const res = await request(app)
      .delete(`/api/candidates/${candidate._id}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Candidate deleted');

    const deleted = await Candidate.findById(candidate._id);
    expect(deleted?.deletedAt).not.toBeNull();
  });

  it('should validate a candidate (POST /api/candidates/:id/validate) with delay simulation', async () => {
    const candidate = await new Candidate({
      firstName: 'Isaac',
      lastName: 'Newton',
      email: 'isaac@example.com',
      position: 'Physicien',
      status: 'pending',
    }).save();

    const res = await request(app)
      .post(`/api/candidates/${candidate._id}/validate`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Candidate validated');
    expect(res.body.candidate.status).toBe('validated');
  }, 3000); // timeout increased to 3 seconds due to 2s delay

  it('should list candidates with pagination and filters (GET /api/candidates)', async () => {
    // Create test candidates
    await Candidate.insertMany([
      { firstName: 'Marie', lastName: 'Curie', email: 'marie@example.com', position: 'Physics', status: 'validated' },
      { firstName: 'Albert', lastName: 'Einstein', email: 'albert@example.com', position: 'Physics', status: 'pending' },
      { firstName: 'Isaac', lastName: 'Newton', email: 'isaac@example.com', position: 'Mathematics', status: 'rejected' },
    ]);

    // Test pagination
    const res = await request(app)
      .get('/api/candidates?page=1&limit=2')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(res.body.candidates.length).toBe(2);
    expect(res.body.totalPages).toBe(2);
    expect(res.body.total).toBe(3);

    // Test filter by position
    const physicsRes = await request(app)
      .get('/api/candidates?position=Physics')
      .set('Authorization', `Bearer ${authToken}`);
    expect(physicsRes.body.candidates.length).toBe(2);

    // Test search by name
    const searchRes = await request(app)
      .get('/api/candidates?search=ein')
      .set('Authorization', `Bearer ${authToken}`);
    expect(searchRes.body.candidates.length).toBe(1);
    expect(searchRes.body.candidates[0].lastName).toBe('Einstein');
  });
});