function addCourse(target) {
    
    var courseTable = document.getElementById("courseTable").getElementsByTagName("tbody")[0];
    var semesters = courseTable.getElementsByClassName("dynamicSemester");
    var tempCourse = document.getElementById("tempCourse");

    if (isEmpty(target)) {

        var semester = event.target.parentNode.parentNode;

    } else {

        var semester = courseTable.getElementsByClassName("dynamicSemester")[target-1];

    }

    if (semester == semesters[semesters.length - 1]) {

        courseTable.appendChild(getTemplate(tempCourse));

        var courseNum = courseTable.lastChild.getElementsByClassName("courseNum")[0];
        courseNum.innerText = courseTable.rows.length - getChildIndex(semester) - 1;

    } else {

        var nextSemester = semesters[getArrayIndex(semester, semesters) + 1];
        courseTable.insertBefore(getTemplate(tempCourse), nextSemester);

        var courseNum = courseTable.rows[getChildIndex(nextSemester) - 1].getElementsByClassName("courseNum")[0];
        courseNum.innerText = getChildIndex(nextSemester) - getChildIndex(semester) - 1;

    }

    show(semester.lastChild);
    
}

function addSemester() {

    var courseTable = document.getElementById("courseTable").getElementsByTagName("tbody")[0];
    var tempSemester = document.getElementById("tempSemester");

    courseTable.appendChild(getTemplate(tempSemester));
    var semesters = courseTable.getElementsByClassName("dynamicSemester");

    show(semesters[semesters.length - 1]);
    for (var i = 0; i < 3; i++) 
    { addCourse(semesters.length); }

    var semesterNum = semesters[semesters.length - 1].getElementsByClassName("semesterNum")[0];
    semesterNum.innerText = "Semester " + (semesters.length);


}


function deleteCourse() {

    var courseTable = document.getElementById("courseTable").getElementsByTagName("tbody")[0];
    var targetCourse = event.target.parentNode.parentNode;
    var semesters = courseTable.getElementsByClassName("dynamicSemester");
    var courses = courseTable.getElementsByClassName("dynamicCourse");

    for (var i = getChildIndex(targetCourse), row; row = courseTable.rows[i]; i--) {

        if (row.getAttribute("class") == "dynamicSemester") {

            var semester = row;
            break;

        }

    }

    for (var i = getChildIndex(targetCourse), row; row = courseTable.rows[i]; i++) {

        if (row.getAttribute("class") == "dynamicSemester") {

            break;

        }

        var courseNum = row.getElementsByClassName("courseNum")[0];
        courseNum.innerText = getChildIndex(row) - getChildIndex(semester) - 1;

    }

    targetCourse.remove();

}

function deleteSemester() {

    var courseTable = document.getElementById("courseTable").getElementsByTagName("tbody")[0];
    var targetSemester = event.target.parentNode.parentNode;
    var semesters = courseTable.getElementsByClassName("dynamicSemester");

    for (i = getArrayIndex(targetSemester, semesters); i < semesters.length; i++) {

        let semesterNum = courseTable.getElementsByClassName("semesterNum")[i];
        semesterNum.innerText = "Semester " + (getArrayIndex(semesters[i], semesters));

    }
    
    for (var i = getChildIndex(targetSemester) + 1, row; row = courseTable.rows[i]; i++) {

        if (row.getAttribute("class") == "dynamicSemester") {
            
            break;
            
        }

        row.remove();
        i--;
        
    }
    
    targetSemester.remove();

}

function getSemesterGpa(semesterNum) {

    var totalGrades = 0;
    var totalCredits = 0;
    var gradeScale = getGradeScale();
    var totals = [];

    var courseTable = document.getElementById("courseTable").getElementsByTagName("tbody")[0];
    var semester = document.getElementById("courseTable").getElementsByClassName("dynamicSemester")[semesterNum - 1];

    for (var i = (getChildIndex(semester) + 1), row; row = courseTable.rows[i]; i++) {

        if (row.getAttribute("class") == "dynamicSemester") {
            
            break;
            
        }

        let courseGradeInput = row.cells[2].firstChild.value;
        let courseCredits = row.cells[3].firstChild.value;
        let courseWeight = getNumFromString(row.cells[4].firstChild.value);

        if (gradeScale == "100") {

            var courseGrade = Number(courseGradeInput);

        } else if (gradeScale == "4") {

            var courseGrade = Number(getGradeFromLetter(courseGradeInput));

        } else {

            return 0;
            
        }

        if (!isEmpty(courseGradeInput)) {

            let effectiveCourseGrade = courseGrade;

            if (!isEmpty(courseWeight)) {

                if (gradeScale == "100") {

                    effectiveCourseGrade = effectiveCourseGrade * Number(courseWeight); 

                } else if (gradeScale == "4") {

                    effectiveCourseGrade = effectiveCourseGrade + Number(courseWeight) - 4; 

                }

            }

            if (!isEmpty(courseCredits)) {

                effectiveCourseGrade = effectiveCourseGrade * Number(courseCredits);
                totalCredits = totalCredits + Number(courseCredits);

            } else {

                totalCredits++;

            }
            
            totalGrades = totalGrades + effectiveCourseGrade;

        }

    }

    totals[0] = totalGrades;
    totals[1] = totalCredits;
    return(totals);

}

function getCumGpa() {

    var gpa = document.getElementById("gpaValue");
    var semesters = document.getElementById("courseTable").getElementsByClassName("dynamicSemester");
    var cumGrades = 0, cumCredits = 0;
    var gradeScale = getGradeScale();

    for (var i = 0; i < semesters.length; i++) {

        let semesterInfo = getSemesterGpa(i+1);
        let semesterGrades = Number(semesterInfo[0]);
        let semesterCredits = Number(semesterInfo[1]);

        cumGrades = cumGrades + semesterGrades;
        cumCredits = cumCredits + semesterCredits;
        
    }

    var calcGpa = (cumGrades/cumCredits);
    var roundedGpa = parseFloat(calcGpa.toFixed(2))
    
    if (gradeScale == '4') {

        const formatter = new Intl.NumberFormat('en-US', {minimumFractionDigits: 1});
        roundedGpa = formatter.format(roundedGpa);

    }

    gpa.innerText = roundedGpa;


}

function applyWeights() {

    var weightings = document.getElementById("weightings");
    var weightLabels = [];
    var weightList = document.getElementById("weightList");

    for (var i = 1, weight; weight = weightings.rows[i]; i++) {

        let weightLabel = weight.cells[0].firstChild.value;
        let weightValue = weight.cells[1].firstChild.value;

        if (!isEmpty(weightValue)) {

            if (Number(weightValue) >= 100) {

                weightValue = Number(weightValue)/100;

            }

            if (!isEmpty(weightLabel)) {

                weightLabels[i-1] = weightLabel + " (" + weightValue + ")";

            } else {

                weightLabels[i-1] = weightValue;

            }

        }
        
    }

    weightList.innerHTML = '';
    
    for (var i = 0; i < (weightLabels.length); i++) {

        let newOption = document.createElement("option");
        weightList.appendChild(newOption);
        weightList.lastChild.innerText = weightLabels[i];
        weightList.lastChild.value = weightLabels[i];

    }

    console.log("weights added!");

}


// Main

window.onload = main;

function main() {

    addSemester();

    addWeight(); createDefaultWeight("Honors", 1.08);
    addWeight(); createDefaultWeight("AP", 1.1);
    applyWeights();

    clean(document);

}