const express = require('express'); // Importing
const app = express(); // Starting an app
const cors = require('cors'); // unblock CORS policy
const port = 3000; // Port

if (require.main === module) {
  app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`)
  });
}

app.use(cors());
app.use(express.json())

app.get('/',(req, res) => {
  res.json(courses);
});

module.exports = app;


const courses = [
    {
      title: "SC MATH 1019 Discrete Math",
      lessons: [
        { name: "Propositional Logic", textbook: "Textbook link ", video: "Video1 " },
        { name: "Set Theory", textbook: "Textbook link 2", video: "Video 2" },
        { name: "Big O Notation", textbook: "Textbook link 3", video: "Video 3" }
      ]
    },
    {
      title: "LE EECS 1012 Net-Centric Intro to Computing",
      lessons: [
        { name: "HTML/CSS", textbook: "https://a.co/d/greGo9h", video: "https://www.youtube.com/embed/DHjqpvDnNGE?si=N0m8KEsppIQyBWFu" },
        { name: "Javascript", textbook: "https://a.co/d/iYasuKg", video: "https://youtu.be/DHjqpvDnNGE?si=YYUA2Eh5elNwI7EC" },
        { name: "Computational Thinking", textbook: "https://a.co/d/ix6XGul", video: "https://youtu.be/UiYXwUg23Yw?si=IOHI1Fnzn3UzJuME" }
      ]
    }
  ];

let userCourses = []; 

// GET endpoint to fetch tracked courses
app.get('/tracked', (req, res) => {
  res.json(userCourses);
});

// POST Storing user data
app.post('/track', (req, res) => {
    const newCourse = req.body;
    let exists = false;

    // Search if course exists
    for (let i = 0; i < userCourses.length; i++) {
        if (userCourses[i].title == newCourse.title) {
            exists = true;  
            userCourses[i] = newCourse;
            break;  
        }
    }
    // If it doesnt exist add course to user's tracked list + confirmation
    if (!exists) {
      userCourses.push(newCourse);
      res.json({ message: "Course tracked successfully", data: userCourses });
    } else {
      res.json({ message: "Course updated successfully", data: userCourses });
    }
});

// Deleting a course
app.delete('/track/:title', (req, res) => {
  const courseTitle = req.params.title;  
  let exists = false;  

  // Find the index of the course to be deleted
  for (let i = 0; i < userCourses.length; i++) {
    if (userCourses[i].title === courseTitle) {
        exists = true;  
        userCourses.splice(i, 1); 
        break;  
    }
  }
  // Confirmation
  if (exists) {
    res.json({ message: "Course deleted successfully", data: userCourses });
  } else {
    res.status(404).json({ message: "Course not found" });
  }
});


