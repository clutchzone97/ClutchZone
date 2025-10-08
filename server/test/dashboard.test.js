import request from 'supertest';
import { expect } from 'chai';
import app, { inMemoryCars, inMemoryProperties } from '../index.js';

describe('Dashboard API', () => {
  describe('when MongoDB is not connected', () => {
    before(() => {
      // Clear and manually add data to in-memory arrays
      inMemoryCars.length = 0;
      inMemoryProperties.length = 0;
      inMemoryCars.push({ _id: '1', name: 'Test Car', brand: 'Test Brand', createdAt: new Date() });
      inMemoryProperties.push({ _id: '1', name: 'Test Property', location: 'Test Location', createdAt: new Date() });
    });

    it('should return correct stats from in-memory data', async () => {
      const res = await request(app).get('/api/dashboard/stats');
      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({
        totalCars: 1,
        totalProperties: 1,
        totalListings: 2,
      });
    });
  });

  describe('when MongoDB is connected', () => {
    const itif = (condition) => (condition ? it : it.skip);

    itif(process.env.MONGODB_URI)('should return correct stats from the database', async () => {
      const res = await request(app).get('/api/dashboard/stats');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('totalCars');
      expect(res.body).to.have.property('totalProperties');
      expect(res.body).to.have.property('totalListings');
    });
  });
});