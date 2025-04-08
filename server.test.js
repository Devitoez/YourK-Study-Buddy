const request = require('supertest');
const app = require('./server');

describe('Backend API Tests', () => {

  it('GET / should return all courses', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('Each course should have title and lessons', async () => {
    const res = await request(app).get('/');
    const courses = res.body;

    courses.forEach(course => {
      expect(course).toHaveProperty('title');
      expect(course).toHaveProperty('lessons');
      expect(course.lessons).toBeInstanceOf(Array);
    });
  });

  it('Each lesson should include name, textbook, and video', async () => {
    const res = await request(app).get('/');
    const allLessons = res.body.flatMap(course => course.lessons);

    allLessons.forEach(lesson => {
      expect(lesson).toHaveProperty('name');
      expect(lesson).toHaveProperty('textbook');
      expect(lesson).toHaveProperty('video');
    });
  });

});
