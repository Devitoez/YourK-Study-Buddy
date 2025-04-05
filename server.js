const express = require('express'); // Importing
const app = express(); // Starting an app
const port = 3000; // Port

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
});

app.use(express.static('Pages'))

app.get('/',(req, res) => {
    res.status(200).json(courses);
});



const courses = [
    {
      title: "SC MATH 1019 Discrete Math",
      lessons: [
        { name: "Lesson 1", textbook: "Textbook link", video: "Video" },
        { name: "Lesson 2", textbook: "Textbook link", video: "Video" },
        { name: "Lesson 3", textbook: "Textbook link", video: "Video" }
      ]
    },
    {
      title: "LE EECS 1012 Net-Centric Intro to Computing",
      lessons: [
        { name: "Lesson 1", textbook: "Textbook link", video: "Video" },
        { name: "Lesson 2", textbook: "Textbook link", video: "Video" },
        { name: "Lesson 3", textbook: "Textbook link", video: "Video" }
      ]
    }
  ];