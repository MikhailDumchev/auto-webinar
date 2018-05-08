function DiagramCreator(testObject, chartColors) {
    var callerClassName = "caller";
    var diagramCanvasID = "canvas";
    var additoryFormID = "utmmediumForm";
    var diagramCanvas = new Object();
    var caller = new Object();
    var form = new Object();
    var formProperties = new Object();
    var configuration = new Object();
    var additoryForm = new Object();
    var diagramData = new Array();
    var diagramLabels = new Array();
    var additoryField = "";
    var duration = 1000;
    this.AdditoryField = function(value) {
        "use strict";
        if (!arguments.length) return additoryField;
        else additoryField = value;
    };
    this.initialize = function(element) {
        "use strict";
        if (document.getElementById(diagramCanvasID) && document.getElementById(diagramCanvasID).nodeName === "CANVAS") {
            diagramCanvas = document.getElementById(diagramCanvasID);
            if (element) {
                if (testClassName(element, callerClassName)) {
                    caller = element;
                    if (searchForm(element)) {
                        setFormProperties();
                        caller.addEventListener("click", this, true);
                    } else console.error("Не найдена DOM-форма;");
                } else console.error("DOM-элемент должен иметь класс '" + callerClassName + "';");
            } else console.error("Необходимо передать ссылку на DOM-элемент;");
        } else console.error("Не найдено полотно для отображения графиков;");
    };
    this.handleEvent = function(event) {
        "use strict";
        event = event || window.event;
        if (event.type === "click") {
            //sendRequest();
            setDiagramData(testObject);
            setDiagramLabels(testObject);
            setConfiguration();
            appendDiagram();
            appendForm(testObject);
        }
    };
    var setFormProperties = function() {
        "use strict";
        if (form.hasAttribute("method")) formProperties["method"] = form.getAttribute("method");
        else formProperties["method"] = "POST";
        if (form.hasAttribute("action")) formProperties["handlerAddress"] = form.getAttribute("action");
        else formProperties["handlerAddress"] = "http://air2.yaroslav-samoylov.com/analytics/getajax/1";
    };
    var searchForm = function(element) {
        "use strict";
        form = element;
        var indicator = false;
        while (!indicator && form.nodeName !== "BODY") {
            form = form.parentNode;
            if (form.nodeName === "FORM") indicator = true;
        }
        return indicator;
    };
    var sendRequest = function() {
        "use strict";
        var data = new Object();
        var additoryObject = new Object();
        var requestBody = "";
        var counter = 0;
        var XHR = new XMLHttpRequest();
        XHR.onreadystatechange = function() {
            "use strict";
            var response = new Object();
            if (XHR.readyState === 4) {
                if (XHR.status === 200) {
                    response = JSON.parse(XHR.responseText);
                    setDiagramData(response);
                    setDiagramLabels(response);
                    setConfiguration();
                    appendDiagram();
                    appendForm(response);
                } else console.error("Возникла ошибка при обработке AJAX-запроса;");
            }
        };
        if (formProperties["method"] === "POST") {
            data = new FormData(form);
            if (additoryField) data.append("s", additoryField);
            XHR.open("POST", formProperties["handlerAddress"], true);
            XHR.send(data);
        //Если используется GET-запросы;
        } else {
            //Формирование тела запроса;
            for (counter = 0; counter < form.elements.length; counter++) {
                additoryObject = form.elements[counter];
                if (additoryObject.type !== "submit") {
                    switch (additoryObject.type) {
                        case "text":
                        case "email":
                        case "tel":
                        case "hidden":
                            requestBody = requestBody + additoryObject.name + "=" + additoryObject.value;
                            if (counter < form.elements.length - 2) requestBody = requestBody + "&";
                            break;
                        case "radio":
                            if (additoryObject.checked) {
                                requestBody = requestBody + additoryObject.name + "=" + additoryObject.value;
                                if (counter < form.elements.length - 2) requestBody = requestBody + "&";
                            }
                            break;
                        default: break;
                    }
                    if (additoryObject.nodeName === "TEXTAREA") {
                        requestBody = requestBody + additoryObject.name + "=" + additoryObject.value;
                        if (counter < form.elements.length - 2) requestBody = requestBody + "&";
                    }
                }
            }
            XHR.open("GET", formProperties["handlerAddress"] + "?" + requestBody, true);
            XHR.send();
        }
    };
    var setDiagramData = function(response) {
        "use strict";
        var counter = 0;
        var internalCounter = 0;
        var currentColor = 0;
        var currentSum = 0;
        for (var key in response.utmmedium) {
            currentColor = getColor(counter);
            for (internalCounter = 0; internalCounter < response.utmmedium[key].count.length; internalCounter++)
                currentSum += response.utmmedium[key].count[internalCounter];
            diagramData[counter] = {
                "label": key + " (" + currentSum + ")",
                "fill": false,
                "backgroundColor": currentColor,
                "borderColor": currentColor,
                "data": response.utmmedium[key].count
            };
            counter++;
            currentSum = 0;
        }
    };
    var setDiagramLabels = function(response) {
        "use strict";
        var counter = 0;
        for (counter; counter < response.utmsourse.length; counter++) {
            diagramLabels[counter] = response.utmsourse[counter].day;
        }
    };
    var getColor = function(counter) {
        var internalCounter = 0;
        //Цвета содержатся в объекте, необходимо оперировать его свойствами через
        //порядковый номер текущего объекта во внешнем цикле;
        for (var key in chartColors) {
            if (internalCounter === counter) return chartColors[key];
            internalCounter++;
        }
        //var keys = Object.keys(chartColors);
        //return chartColors[keys[counter]];
    };
    var setConfiguration = function() {
        "use strict";
        configuration = {
            "type": "line",
            "data": {
                "labels": diagramLabels,
                "datasets": diagramData
            },
            "options": {
                "responsive": true,
                "title": {
                    "display": true,
                    "text": "UTM - Sourse"
                },
                "animation": {
                    "duration": duration
                }
            }
        };
    };
    var appendForm = function(response) {
        "use strict";
        var label = new Object();
        var checkbox = new Object();
        var additoryElement = new Object();
        additoryForm = document.createElement("form");
        additoryForm.id = additoryFormID;
        for (var key in response.utmmedium) {
            additoryElement = document.createElement("div");
            additoryElement.className = "control__indicator";
            label = document.createElement("label");
            label.className = "control control--checkbox";
            label.textContent = key;
            checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.className = "manager";
            checkbox.name = "utm[]";
            checkbox.value = key;
            label.appendChild(checkbox);
            additoryForm.appendChild(label);
        }
        document.body.appendChild(additoryForm);
    };
    var appendDiagram = function() {
        "use strict";
        caller.removeEventListener("click", this, true);
        new Chart(diagramCanvas.getContext("2d"), configuration);
        window.setTimeout(function() {
            caller.addEventListener("click", this, true);
        }.bind(this), duration);
    };
}