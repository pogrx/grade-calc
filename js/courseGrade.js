function addAssessment() {
    
    var courseTable = document.getElementById("courseTable").getElementsByTagName("tbody")[0];
    var tempAssessment = document.getElementById("tempAssessment");

    courseTable.appendChild(getTemplate(tempAssessment));

    var newAssessment = courseTable.lastChild;
    var assessmentNum = newAssessment.getElementsByClassName("assessmentNum")[0];
    assessmentNum.innerText = courseTable.rows.length;

    show(newAssessment);
    
}

function deleteAssessment() {

    var courseTable = document.getElementById("courseTable").getElementsByTagName("tbody")[0];
    var targetAssessment = event.target.parentNode.parentNode;
    var assessments = courseTable.getElementsByClassName("dynamicAssessment");

    for (i = getChildIndex(targetAssessment); i < assessments.length; i++) {

        let assessmentNum = courseTable.getElementsByClassName("assessmentNum")[i];
        assessmentNum.innerText = i;

    }

    targetAssessment.remove();

}

function getCourseGrade() {

    var totalGrades = 0;
    var totalCredits = 0;

    var gradeScale = getGradeScale();
    var gradeValue = document.getElementById("gradeValue");
    var weightTypes = document.getElementById("weightList").childNodes;
    var courseTable = document.getElementById("courseTable");

    var weightOptionArray = [];
    var gradeArray = [];
    var creditArray = [];

    for (var i = 0, weightOption; weightOption = weightTypes[i]; i++) {

        weightOptionArray[i] = weightOption.value;
        gradeArray[i] = 0;
        creditArray[i] = 0;

    }

    for (var i = 0, row; row = courseTable.rows[i+1]; i++) {

        let assessmentGradeInput = row.cells[2].firstChild.value;
        let assessmentWeight = row.cells[3].getElementsByTagName("select")[0].value;
        let assessmentType = getArrayIndex(assessmentWeight, weightOptionArray);

        if (gradeScale == "100") {

            var assessmentGrade = Number(assessmentGradeInput);

        } else if (gradeScale == "4") {

            var assessmentGrade = Number(getGradeFromLetter(assessmentGradeInput));

        }

        if (!isEmpty(assessmentGradeInput) && !isEmpty(assessmentWeight)) {

            gradeArray[assessmentType] = Number(gradeArray[assessmentType]) + Number(assessmentGrade);
            creditArray[assessmentType]++;

        }

    }

    for (var i = 0; i < (weightTypes.length); i++) {

        if (!isEmpty(creditArray[i])) {

            let typeGrades = Number(gradeArray[i]);
            let typeCredits = Number(creditArray[i]);
            let typeWeight = Number(getNumFromString(weightOptionArray[i]))/100
            var typeAverageGrade = Number(typeGrades/typeCredits);

            totalGrades = totalGrades + (typeWeight* typeAverageGrade);
            totalCredits = totalCredits + typeWeight;

        }

    }

    var calcGrade = totalGrades/totalCredits;
    var roundedGrade = parseFloat(calcGrade.toFixed(2));

    if (gradeScale == '4') {

        const formatter = new Intl.NumberFormat('en-US', {minimumFractionDigits: 1});
        roundedGrade = formatter.format(roundedGrade);

    }

    gradeValue.innerText = roundedGrade;

}

function applyWeights() {

    var weightings = document.getElementById("weightings");
    var weightLists = document.getElementById("courseTable").getElementsByClassName("selectType");
    var globalWeightList = document.getElementById("weightList");

    var weightOptions = [];
    let k = 0;

    for (var i = 1, weight; weight = weightings.rows[i]; i++) {

        let weightLabel = weight.cells[0].firstChild.value;
        let weightValue = weight.cells[1].firstChild.value;

        if (!isEmpty(weightValue)) {

            if (!isEmpty(weightLabel)) {

                weightOptions[i-1-k] = weightLabel + " (" + weightValue + "%)";

            } else {

                let existing = false;

                for (var j = 0, option; option = weightOptions[j]; j++) {

                    if (weightValue == getNumFromString(option)) {

                        existing = true;
                        k++;

                    }

                }
                
                if (existing == false) {

                    weightOptions[i-1-k] = weightValue + "%";

                }

            }

        }
        
    }
    
    for (var i = 0, weightList; weightList = weightLists[i]; i++) {

        weightList.innerHTML = '';

        for (var j = 0; j < (weightOptions.length); j++) {

            let newOption = document.createElement("option");
            weightList.appendChild(newOption);
            weightList.lastChild.innerText = weightOptions[j];
            weightList.lastChild.value = weightOptions[j];
            
        }

        console.log(weightList);

    }

    globalWeightList.innerHTML = '';
    
    for (var i = 0; i < (weightOptions.length); i++) {

        let newOption = document.createElement("option");
        globalWeightList.appendChild(newOption);
        globalWeightList.lastChild.value = weightOptions[i];

    } 

}


// Main

window.onload = main;

function main() {

    for (var i = 0; i < 3; i++) 
    { addAssessment(); }

    addWeight(); createDefaultWeight("Tests", 40);
    addWeight(); createDefaultWeight("Quizzes", 20);
    addWeight(); createDefaultWeight("Homework", 20);
    addWeight(); createDefaultWeight("Participation", 20);

    applyWeights();

    clean(document);

}