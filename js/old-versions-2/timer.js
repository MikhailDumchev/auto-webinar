function Timer() {
    var containerClassName = "timer-background";
    var daysModuleClassName = "days";
    var hoursModuleClassName = "hours";
    var minutesModuleClassName = "minutes";
    var secondsModuleClassName = "seconds";
    var container = new Object();
    var daysModule = new Object();
    var hoursModule = new Object();
    var minutesModule = new Object();
    var secondsModule = new Object();
    var intervalIndicator = 0;
    var currentServerTime = 0;
    this.CurrentServerTime = function(value) {
        "use strict";
        if (!arguments.length) return currentServerTime;
        else currentServerTime = value;
    };
    var startingTime = 0;
    this.StartingTime = function(value) {
        "use strict";
        if (!arguments.length) return startingTime;
        else startingTime = value;
    };
    var deletionIndicator = false;
    this.DeletionIndicator = function(value) {
        "use strict";
        if (!arguments.length) return deletionIndicator;
        else deletionIndicator = value;
    };
    var setValues = function(currentDate) {
        "use strict";
        var variable = parseInt(currentDate / 86400000);
        daysModule.getElementsByTagName("span")[0].textContent = addZero(variable);
        variable = parseInt(currentDate / 3600000) % 24;
        hoursModule.getElementsByTagName("span")[0].textContent = addZero(variable);
        variable = parseInt(currentDate / 60000) % 60;
        minutesModule.getElementsByTagName("span")[0].textContent = addZero(variable);
        variable = parseInt(currentDate / 1000) % 60;
        secondsModule.getElementsByTagName("span")[0].textContent = addZero(variable);
    };
    var start = function() {
        "use strict";
        var currentDate = startingTime - currentServerTime;
        if (currentDate > 0) {
            setValues(currentDate);
            intervalIndicator = window.setInterval(function() {
                currentDate = currentDate - 1000;
                setValues(currentDate);
                if (currentDate <= 0 && deletionIndicator) deleteTimer();
            }.bind(this), 1000);
        } else deleteTimer();
    };
    function addZero(variable) {
        "use strict";
        //Функция определяет, нужно ли добавлять "0" перед полученным числом;
        if (variable < 10) variable = "0" + variable.toString();
        else variable = variable.toString();
        return variable;
    }
    this.createTimer = function(element) {
        "use strict";
        var additoryObject = new Object();
        if (testClassName(element, containerClassName)) {
            container = element;
            additoryObject = selectElementByClassName(daysModuleClassName, container);
            if (additoryObject.status) {
                daysModule = additoryObject.element;
                additoryObject = selectElementByClassName(hoursModuleClassName, container);
                if (additoryObject.status) {
                    hoursModule = additoryObject.element;
                    additoryObject = selectElementByClassName(minutesModuleClassName, container);
                    if (additoryObject.status) {
                        minutesModule = additoryObject.element;
                        additoryObject = selectElementByClassName(secondsModuleClassName, container);
                        if (additoryObject.status) {
                            secondsModule = additoryObject.element;
                            start();
                        } else notify(secondsModuleClassName, 2);
                    } else notify(minutesModuleClassName, 2);
                } else notify(hoursModuleClassName, 2);
            } else notify(daysModuleClassName, 2);
        } else notify(containerClassName, 1);
    };
    var deleteTimer = function() {
        "use strict";
        window.clearInterval(intervalIndicator);
        container.parentNode.removeChild(container);
    };
}