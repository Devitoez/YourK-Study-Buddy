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
            // Create array to store course
            if (localStorage.getItem(foundCourse.title) == null) {
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

// Pre: element is the clicked upon lesson
// Post: store checkbox value into localstorage
function completeLesson(element) {
    var name = document.getElementById("courseTitle").textContent.trim();
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


// Tracker page functions:

// Displays user's tracked courses from localStorage
function displayTrackedCourses() {
    var section = document.getElementById("tracker-container");
    var content = ``;
    var lessons = ``;
    var totalCompletion = 0;
    for (let i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        var course = JSON.parse(localStorage.getItem(key))
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
    if (localStorage.length == 0) {
        content += `<h1>You are not tracking any courses!</h1>`;
    }
    section.innerHTML = content;
    // Get course
}

// Change grade, update localStorage
function updateGrade() {
    var name = document.getElementById("tracker-name").textContent.split('(')[0].trim();
    var value = Number(document.getElementById("tracker-grade").value);
    var courseDetails = JSON.parse(localStorage.getItem(name));
    console.log(value)
    courseDetails.grade = value;
    localStorage.setItem(name, JSON.stringify(courseDetails))

    // Translate from york scale


}
// Delete course tracked from localStorage
function removeCourse() {
    console.log("delete")
    var name = document.getElementById("tracker-name").textContent.split('(')[0].trim();
    localStorage.removeItem(name);
    displayTrackedCourses();
}

// Get course data from server
async function getCourses() {
    const response = await fetch('http://localhost:3000/', {
        method: 'GET'
    });
    const data = await response.json()
    return data;
}
