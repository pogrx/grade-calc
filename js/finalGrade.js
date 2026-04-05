function getFinalGrade() {

    var courseTable = document.getElementById("courseTable");
    var current = courseTable.rows[0].cells[1].firstChild.value;
    var desired = courseTable.rows[1].cells[1].firstChild.value;
    var weight = courseTable.rows[2].cells[1].firstChild.value;

    console.log(current, desired, weight);
    var gradeValue = document.getElementById("gradeValue");

    if (gradeScale == "100") {

        current = Number(current);
        desired = Number(desired);
        weight = Number(weight);

    } else if (gradeScale == "4") {

        current = Number(getGradeFromLetter(current));
        desired = Number(getGradeFromLetter(desired));
        weight = Number(getGradeFromLetter(weight));

    }

    var finalGrade = (desired - current * (1-weight))/weight;
    var roundedGrade = parseFloat(finalGrade.toFixed(2));

    if (gradeScale == '4') {

        const formatter = new Intl.NumberFormat('en-US', {minimumFractionDigits: 1});
        roundedGrade = formatter.format(roundedGrade);

    }

    gradeValue.innerText = roundedGrade;

}
