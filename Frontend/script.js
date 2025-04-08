const error = document.getElementById("error");
const result = document.getElementById("searchResult");
var trackedCourses = [];

// Resource page functions:
// Pre: track is boolean, searchQuery is an optional string
// Post: return true/false if course is found
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
            // Check if tracking
            const trackedCourse = await getTrackedCourseByTitle(foundCourse.title);
            if (trackedCourse == null) {
                if (term.length < 1) {
                    term = "N/A";
                }
                var courseItems =
                    {
                        title: foundCourse.title,
                        grade: 0,
                        term: term,
                        grade: null,
                        lessons: [
                            {name: foundCourse.lessons[0].name, video: false, textbook: false},
                            {name: foundCourse.lessons[1].name, video: false, textbook: false},
                            {name: foundCourse.lessons[2].name, video: false, textbook: false}
                        ]
                    }
                // Display course (track button)
                result.innerHTML = displayCourse(foundCourse);
                sendTrackedCourseToServer(courseItems); // Send to backend
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

async function sendTrackedCourseToServer(course) {
    const response = await fetch('http://localhost:3000/track', {
        method: 'POST',
        body: JSON.stringify(course),
        headers: {
            'Content-Type': 'application/json'  // Set content type to JSON
        }
    });
    const data = await response.json();
    console.log(data);
}

async function getTrackedCoursesFromServer() {
    const response = await fetch('http://localhost:3000/tracked');
    const data = await response.json();
    return data;
}

async function getTrackedCourseByTitle(name) {
    const trackedCourses = await getTrackedCoursesFromServer();
    console.log("Tracked courses:", trackedCourses);
    if (!trackedCourses || trackedCourses.length == 0) {
        console.log('No courses found.');
        return null; 
    }
    for (const course of trackedCourses) {
        if (course.title == name) {
            console.log('course found.');
            return course;
           
        }
    }
    console.log('No courses found.');
    return null;
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
    var check1 = ``;
    var check2 = ``;
    // Find the course given the list of courses
    for (var course of courses) {
        if (course.title.trim().toLowerCase() == name.trim().toLowerCase()) {
            break;
        }
    }
    // Check if user is tracking the course, if they are then display checkmark boxes
    const trackedCourse = await getTrackedCourseByTitle(course.title);
    if (trackedCourse != null) {
        if (trackedCourse.lessons[num].textbook) {
            isCompleted1 = "checked";
        }  
        if (trackedCourse.lessons[num].video) {
            isCompleted2 = "checked";
        }
        check1 = `<input id="check-lesson1" type="checkbox" onclick="completeLesson(this)" data-lesson="${num}" data-type="textbook" ${isCompleted1}>Completed?`;
        check2 = `<input id="check-lesson2" type="checkbox" onclick="completeLesson(this)" data-lesson="${num}" data-type="video" ${isCompleted2}>Completed?`;
    }

    // Using the course found from the list, display lessons
    textbook.innerHTML = `<p>Textbook Link<p>
                            <a id="sub-box-1-link" href="${course.lessons[num].textbook}">${course.lessons[num].textbook}</a>
                            <br>
                            <br>
                            ${check1}
                        `;
    video.innerHTML = `<p>Video Link<p>
                        <a id="sub-box-2-link" href="${course.lessons[num].video}">${course.lessons[num].video}</a>
                            <br>
                            <br>
                            ${check2}
                        `;

    document.getElementById("lesson1").style.width = "200px"
    document.getElementById("lesson2").style.width = "200px"
    document.getElementById("lesson3").style.width = "200px"

    element.style.width = "500px";
}


// Pre: element is the clicked upon lesson
// Post: store checkbox value into localstorage
async function completeLesson(element) {
    var name = document.getElementById("courseTitle").textContent.trim();
    var lessonNum = Number(element.dataset.lesson); 
    var type = element.dataset.type;

    const courseDetails = await getTrackedCourseByTitle(name);
    if (courseDetails != null) {
        console.log(courseDetails);
        if (type == "textbook") {
            courseDetails.lessons[lessonNum].textbook = true;
        }
        if (type == "video") {
            courseDetails.lessons[lessonNum].video = true;
        }
        sendTrackedCourseToServer(courseDetails); // Send to backend, update
    }
}


// Tracker page functions:

// Displays user's tracked courses from backend data
async function displayTrackedCourses() {
    var section = document.getElementById("tracker-container");
    var content = ``;
    var lessons = ``;
    var totalCompletion = 0;
    const trackedCourses = await getTrackedCoursesFromServer();
    console.log(trackedCourses);
    for (let i = 0; i < trackedCourses.length; i++) {
        var course = trackedCourses[i]
        lessons = ``;
        for (let j = 0; j < course.lessons.length; j++) {
            var lessonCompletion = 0;
            if (course.lessons[j].textbook) {
                lessonCompletion += 50;
            }
            if (course.lessons[j].video) {
                lessonCompletion += 50;
            }
            if (lessonCompletion == 100) {
                totalCompletion += 33.33;
            }
            
            lessons += `<h3>${course.lessons[j].name} <span>${lessonCompletion}%</span></h3>`;
        }
        content += `<div class="tracker-box">
                        <div class="tracker-content">
                            <div class="tracker-sub-content">
                                <h3 id="tracker-name">${course.title} (T: ${course.term})</h3>
                                
                                <h4>My Grade</h4>
                                <input id="tracker-grade" onchange="updateGrade()" size="10" type="number" min="0" max="100" value="${course.grade}"> %
                            </div>
                            
                            <div class="tracker-sub-content" id="tracker-grade-row">    
                                <h4>Completion</h4>      
                                <div id="tracker-completion">${Math.ceil(totalCompletion)}%</div>
                            </div>
                            <a class="tracker-buttons" href="./Resources.html">View material</a>
                        </div>
                        <div class="tracker-lessons">
                            ${lessons}
                        </div>
                        <div id="delete-button">
                            <button class="tracker-buttons" onclick="removeCourse()">Delete</button>
                        </div>
                        
                    </div>
        
        `
    }
    if (trackedCourses.length == 0) {
        content += `<h1>You are not tracking any courses!</h1>`;
    }
    section.innerHTML = content;
}

// Change grade, update backend
async function updateGrade() {
    var name = document.getElementById("tracker-name").textContent.split('(')[0].trim();
    var value = Number(document.getElementById("tracker-grade").value);
    var trackedCourse = await getTrackedCourseByTitle(name);
    trackedCourse.grade = value;
    sendTrackedCourseToServer(trackedCourse); // Update course
}
// Delete course tracked from backend
async function removeCourse() {
    console.log("delete")
    var name = document.getElementById("tracker-name").textContent.split('(')[0].trim();
    const response = await fetch(`http://localhost:3000/track/${name}`, {
        method: 'DELETE',
    });    
    displayTrackedCourses();
    return response;
}

// Get course data from server
async function getCourses() {
    const response = await fetch('http://localhost:3000/', {
        method: 'GET'
    });
    const data = await response.json()
    return data;
}
