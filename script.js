// "Course Math",""

const error = document.getElementById("error");


function findCourse() {
    var searchBar = document.getElementById("searchBar").innerHTML;
    const courses = getCourses();  
    var flag = 0;
    for (i = 0; i <= courses.length; i++) {

    }
    // In order for search to accuratly find, there are 3 major flags:
    // Course code
    // Course name
    // error.innerHTML = indexed;
    error.innerHTML = "Error: Course Not Found";
    console.log(courses);
}

const url = 'http://localhost:3000/';
async function getCourses(e) {
    const response = await fetch(url, {
        method: 'GET'
    });
    console.log(response)
    const data = await response.json()
    console.log(data)
}
  