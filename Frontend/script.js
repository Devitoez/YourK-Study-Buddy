const error = document.getElementById("error");
const result = document.getElementById("searchResult");
var errorMsg = "Course Not Found";
var trackedCourses = [];

async function findCourse(track, searchQuery = null) {
    error.innerHTML = "";
    if (searchQuery == null) {
        var searchQuery = document.getElementById("searchQuery").value;
    }
    const courses = await getCourses();  
    var flag = false;
    if (searchQuery.length > 3) {
        for (i = 0; i < courses.length; i++) {
            if (courses[i].title.toLowerCase().includes(searchQuery.toLowerCase())) {
                flag = true;
                foundCourse = courses[i];
                break;
            }
        }
    } else if (searchQuery.length < 3) {
        errorMsg = "Please use longer terms!"
    } else {
        errorMsg = "Course Not Found"
    }
   

    if (flag) {
        result.innerHTML = displayCourse(foundCourse);
        // If  user wishes to track
        if (track) {
            var courseItems =
                {
                    title: foundCourse.title,
                    grade: null,
                    lessons: [
                        {video: false, textbook: false},
                        {video: false, textbook: false},
                        {video: false, textbook: false}
                    ]
                }
            // Store data
            if (localStorage.getItem(foundCourse.title) == null) {
                localStorage.setItem(foundCourse.title,JSON.stringify(courseItems));
            }
            console.log(localStorage.getItem(foundCourse.title))
            }

    } else {
        error.innerHTML = errorMsg;
    }

    // Return true/false if cours found
    return flag;
}


function displayCourse(course) {
    var checkbox = "";
    // Check if course is being tracked

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

async function displayLesson(num, element) {
    var name = document.getElementById("courseTitle");
    const textbook = document.getElementById("sub-box-1-link")
    const video = document.getElementById("sub-box-2-link");
    const courses = await getCourses();  
    for (var course of courses) {
        if (course.title == name) {
            break;
        }
    }
    textbook.innerHTML = `<a id="sub-box-1-link" href="${course.lessons[num].textbook}">${course.lessons[num].textbook}</a>`;
    video.innerHTML = `<a id="sub-box-2-link" href="${course.lessons[num].video}">${course.lessons[num].video}</a>`;

    document.getElementById("lesson1").style.width = "200px"
    document.getElementById("lesson2").style.width = "200px"
    document.getElementById("lesson3").style.width = "200px"

    element.style.width = "500px";
}


// Get course data
async function getCourses() {
    const response = await fetch('http://localhost:3000/', {
        method: 'GET'
    });
    const data = await response.json()
    return data;
}
