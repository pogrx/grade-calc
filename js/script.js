// Create dynamic element

function getTemplate(template) {

    var maxId = 0;
    var x = template.cloneNode(true);

    x.id = "";
    x.style.display = "";
    x.innerHTML = x.innerHTML.replace(/{id}/, ++maxId);

    return x;
}

function addWeight() {

    var weightings = document.getElementById("weightings");
    var tempWeight = document.getElementById("tempWeight");

    weightings.appendChild(getTemplate(tempWeight));
    show(weightings.lastChild);
    
}


// Delete element

function deleteWeight() {

    var weightings = document.getElementById("weightings");
    var weights = weightings.getElementsByClassName("dynamicWeight");
    var targetWeight = event.target.parentNode.parentNode;

    targetWeight.remove();
    
}


// Get GPA

function getGradeFromLetter(courseGradeLetter) {

    var courseGradeNumber;

    if ((parseStringFor(courseGradeLetter, "A") || parseStringFor(courseGradeLetter, "a")) && !parseStringFor(courseGradeLetter, "-")) {

        courseGradeNumber = 4;

    } else if (parseStringFor(courseGradeLetter, "A-") || parseStringFor(courseGradeLetter, "a-")) {

        courseGradeNumber = 3.7;

    } else if (parseStringFor(courseGradeLetter, "B+") || parseStringFor(courseGradeLetter, "b+")) {

        courseGradeNumber = 3.3;

    } else if (parseStringFor(courseGradeLetter, "B-") || parseStringFor(courseGradeLetter, "b-")) {

        courseGradeNumber = 2.7;
        
    } else if (parseStringFor(courseGradeLetter, "B") || parseStringFor(courseGradeLetter, "b")) {

        courseGradeNumber = 3;
        
    } else if (parseStringFor(courseGradeLetter, "C+") || parseStringFor(courseGradeLetter, "c+")) {

        courseGradeNumber = 2.3;
        
    } else if (parseStringFor(courseGradeLetter, "C-") || parseStringFor(courseGradeLetter, "c-")) {

        courseGradeNumber = 1.7;
        
    } else if (parseStringFor(courseGradeLetter, "C") || parseStringFor(courseGradeLetter, "c")) {

        courseGradeNumber = 2;
        
    } else if (parseStringFor(courseGradeLetter, "D+") || parseStringFor(courseGradeLetter, "d+")) {

        courseGradeNumber = 1.3;
        
    } else if (parseStringFor(courseGradeLetter, "D") || parseStringFor(courseGradeLetter, "d")) {

        courseGradeNumber = 1.0;
        
    } else if (parseStringFor(courseGradeLetter, "F") || parseStringFor(courseGradeLetter, "f")) {

        courseGradeNumber = 0;
        
    } else {

        return courseGradeLetter;

    }

    return courseGradeNumber;

}


// Set weights

function createDefaultWeight(weightName, weight) {

    var weightings = document.getElementById("weightings");
    var weights = weightings.getElementsByClassName("dynamicWeight");
    var lastWeight = weights[weights.length - 1];

    lastWeight.cells[0].firstChild.defaultValue = weightName;
    lastWeight.cells[1].firstChild.defaultValue = weight;

}

function replaceWeight(weightName, weight) {

    var weightings = document.getElementById("weightings");
    var weights = weightings.getElementsByClassName("dynamicWeight");
    var targetWeight = '';

    const formatter = new Intl.NumberFormat('en-US', {minimumFractionDigits: 1});
    var newWeight = formatter.format(weight);

    for (var i = 0, weight; weight = weights[i]; i++) {

        if (weight.cells[0].firstChild.value == weightName) {

            targetWeight = weight;

        }

    }

    if (targetWeight == '') {

        return 0;

    }

    targetWeight.cells[1].firstChild.defaultValue = newWeight;

}

function scaleDefaultWeights() {

    gradeScale = getGradeScale();

    if (gradeScale == "100") {

        replaceWeight("Honors", 1.08);
        replaceWeight("AP", 1.1);

    } else if (gradeScale == "4") {

        replaceWeight("Honors", 4.5);
        replaceWeight("AP", 5.0);

    }

    applyWeights();

}


// Specific return-value computations

function isCharNumber(c) {

  return (c >= '0' && c <= '9') || c == '.';

}

function getNumFromString(string) {

    var num = '';
    
    for (var i = 0, j = 0, char; char = string[i]; i++) {

        if (isCharNumber(char)) {

            num = num + char;
            j++;

        }

    }

    return num;

}

function isEmpty(input) {

    if (input == null || input == "") {

        return true;

    } else {

        return false;

    }

}

function getChildIndex(element) {

    var parent = element.parentElement;
    var children = Array.from(parent.children);
    
    return children.indexOf(element);

}

function getArrayIndex(element, array) {

    return Array.from(array).indexOf(element);

}

function parseStringFor(string, insideString) {

    for (var i = 0; i < string.length; i++) {

        if (string[i] == insideString[0]) {

            for (var j = i; j < (i + insideString.length); j++) {

                if (string[j] != insideString[j - i]) {

                    return false;

                }

                return true;

            }

        }
        
    }

    return false;

}


// QOL

function hide(element) {

    element.style.display = 'none';

}

function show(element) {

    element.style.display = '';

}

function clean(node) {

    body = document.body;

    for(var i = 0, child; child = node.childNodes[i]; i++) {

        if (child.nodeType === 8 || (child.nodeType === 3 && !/\S/.test(child.nodeValue))) {

            node.removeChild(child);

        } else if (child.nodeType === 1) {

            clean(child);

        }

    }

}

function getGradeScale() {

    var gradeScale = document.getElementById("gradeScale");
    return Number(gradeScale.value);

}