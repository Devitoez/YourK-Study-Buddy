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
    var searchBar = document.getElementById("searchBar").innerHTML;
    var flag = 0;
    for (i = 0; i <= courses.length; i++) {

    }
    // In order for search to accuratly find, there are 3 major flags:
    // Course code
    // Course name
    error.innerHTML = indexed;
    error.innerHTML = "Error: Course Not Found";
}