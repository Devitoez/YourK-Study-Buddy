const { findCourse } = require('./script'); 

describe('find course', () => {
    test("finds course with numerical term 1012", () => {
        expect(findCourse(1012).toBe(true));
    })



})