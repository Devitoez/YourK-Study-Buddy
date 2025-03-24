// "Course Math",""

var courses = [["SC MATH 1019 Discrete Math",
                ["Lesson 1", "Textbook link", "Video"],
                ["Lesson 2", "Textbook link", "Video"],
                ["Lesson 3", "Textbook link", "Video"]
                ],
                ["LE EECS 1012 Net-Centric Intro to Computing",
                    ["Lesson 1", "Textbook link", "Video"],
                    ["Lesson 2", "Textbook link", "Video"],
                    ["Lesson 3", "Textbook link", "Video"]
                ]

            ];

function findCourse() {
    var error = document.getElementById("error");

    error.innerHTML = "Error: Course Not Found";
}