const request = require('supertest');
const app = require('./server');

describe('Backend API Tests', () => {

    it('GET / should return all courses', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('POST /track should update an existing course', async () => {
        const Course = {
            title: 'SC MATH 1019 Discrete Math',
            grade: 60,
            term: `W`,
            lessons: [
              { name: 'Propositional Logic', textbook: 'Textbook link 1', video: 'Video 1' }
            ]
          };
      
          await request(app).post('/track').send(Course);

        const updatedCourse = {
            title: 'SC MATH 1019 Discrete Math',
            grade: 90,
            term: `W`,
            lessons: [
                { name: 'Propositional Logic', textbook: 'Textbook link 1', video: 'Video 1' }
            ]
        };

        const res = await request(app).post('/track').send(updatedCourse);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Course updated successfully');
        expect(res.body.data).toContainEqual(updatedCourse);
    });

    it('DELETE /track/:title should delete an existing course', async () => {
        const courseTitle = 'SC MATH 1019 Discrete Math';

        const res = await request(app).delete(`/track/${courseTitle}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Course deleted successfully');
        expect(res.body.data).not.toContainEqual(expect.objectContaining({ title: courseTitle }));
    });

    it('DELETE /track/:title should return 404 if course is not found', async () => {
        const courseTitle = 'Non-Existent Course';

        const res = await request(app).delete(`/track/${courseTitle}`);
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Course not found');
    });
});
