const error = document.getElementById("error");
const result = document.getElementById("searchResult");
var trackedCourses = [];

async function findCourse(track, searchQuery = null) {
    error.innerHTML = "";
    if (searchQuery == null) {
        var searchQuery = document.getElementById("searchQuery").value.trim();
    }
    var term = document.getElementById("term").value.trim();
    const courses = await getCourses();  
    var flag = false;

    // Make sure term is not just letters/too short
    if (searchQuery.length > 3) {
        // Find correct course based off search
        for (i = 0; i < courses.length; i++) {
            if (courses[i].title.toLowerCase().includes(searchQuery.toLowerCase())) {
                flag = true;
                foundCourse = courses[i];
                break;
            }
        }
        // If course not found set error msg
        if (!flag) {
            error.innerHTML = "Course Not Found"
        }
    // If serach too short set error msg
    } else if (searchQuery.length < 3) {
        error.innerHTML = "Please use longer terms!"
    }
   
    // If course found then continue
    if (flag) {
        if (track) {
            // Create array to store course
            if (localStorage.getItem(foundCourse.title) == null) {
                if (term.length < 1) {
                    term = "Unspecified";
                }
                var courseItems =
                    {
                        title: foundCourse.title,
                        term: term,
                        grade: null,
                        lessons: [
                            {video: false, textbook: false},
                            {video: false, textbook: false},
                            {video: false, textbook: false}
                        ]
                    }
                // Store data locally
                if (localStorage.getItem(foundCourse.title) == null) {
                    localStorage.setItem(foundCourse.title,JSON.stringify(courseItems));
                }
                // Display course (track button)
                result.innerHTML = displayCourse(foundCourse);
                console.log(localStorage.getItem(foundCourse.title))
            } else {
                error.innerHTML = "You are tracking this course already";
            }
            
        }
        else {
            // Display course (serach button)
            result.innerHTML = displayCourse(foundCourse);
        }
    }
    // Scroll course into view
    document.getElementById("lesson3").scrollIntoView({
        behavior: "smooth"
    });
    // Return true/false if course found
    return flag;
}

// Pre: course is an array element
// Post: Display details of the course
function displayCourse(course) {
    return `<hr> <h1 id="courseTitle"> ${course.title} </h1>`
                        + `<div class="lesson">
                            <h3 onclick="displayLesson(0,this)" id="lesson1"> ${course.lessons[0].name} </h3>
                            <div id="sub-boxes">
                                <div id="sub-box-1">
                                    <p>Textbook Link<p>
                                    <a id="sub-box-1-link">Click a unit</a>
                                </div>
                                
                                <div id="sub-box-2">
                                    <p>Video Link<p>
                                    <a id="sub-box-2-link">Click a unit</a>
                                </div>
                            </div>
                          </div>`
                        + `<div class="lesson">
                            <h3 onclick="displayLesson(1,this)" id="lesson2"> ${course.lessons[1].name} </h3>
                           </div>`
                        + `<div class="lesson">
                            <h3 onclick="displayLesson(2,this)" id="lesson3"> ${course.lessons[2].name} </h3>                           
                          </div>`;
}

// Pre: num is a number, element is an html element
// Post: display lessons of the unit # chosen
async function displayLesson(num, element) {
    var name = document.getElementById("courseTitle").textContent.trim();
    var isCompleted1 = "", isCompleted2 = "";
    const textbook = document.getElementById("sub-box-1")
    const video = document.getElementById("sub-box-2");
    const courses = await getCourses();  
    for (var course of courses) {
        if (course.title.trim().toLowerCase() == name.trim().toLowerCase()) {
            break;
        }
    }
    if (localStorage.getItem(course.title) != null) {
        const courseDetails = JSON.parse(localStorage.getItem(course.title));
        console.log(courseDetails.lessons)
        if (courseDetails.lessons[num].textbook) {
            isCompleted1 = "checked";
        }  
        if (courseDetails.lessons[num].video) {
            isCompleted2 = "checked";
        }
    }

    textbook.innerHTML = `<p>Textbook Link<p>
                            <a id="sub-box-1-link" href="${course.lessons[num].textbook}">${course.lessons[num].textbook}</a>
                            <br>
                            <br>
                            <input id="check-lesson1" type="checkbox" onclick="completeLesson(this)" data-lesson="${num}" data-type="textbook" ${isCompleted1}>Completed?
                        `;
    video.innerHTML = `<p>Video Link<p>
                        <a id="sub-box-2-link" href="${course.lessons[num].video}">${course.lessons[num].video}</a>
                            <br>
                            <br>
                            <input id="check-lesson2" type="checkbox" onclick="completeLesson(this)" data-lesson="${num}" data-type="video" ${isCompleted2}>Completed?
                        `;

    document.getElementById("lesson1").style.width = "200px"
    document.getElementById("lesson2").style.width = "200px"
    document.getElementById("lesson3").style.width = "200px"

    element.style.width = "500px";
}

function completeLesson(element) {
    var name = document.getElementById("courseTitle").textContent.trim();
    console.log(name);
    var lessonNum = Number(element.dataset.lesson); 
    var type = element.dataset.type;
    if (localStorage.getItem(name) != null) {
        var courseDetails = JSON.parse(localStorage.getItem(name))
        console.log(courseDetails);
        if (type == "textbook") {
            courseDetails.lessons[lessonNum].textbook = true;
        }
        if (type == "video") {
            courseDetails.lessons[lessonNum].video = true;
        }
        localStorage.setItem(name,JSON.stringify(courseDetails))
    }
}


// Get course data from server
async function getCourses() {
    const response = await fetch('http://localhost:3000/', {
        method: 'GET'
    });
    const data = await response.json()
    return data;
}
