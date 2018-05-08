function CommentsHandler() {
    "use strict";
    var internalContainerClassName = "mc-comments";
    var internalContainer = new Object();
    var containerID = "mc-container";
    var container = new Object();
    var currentNumber = 0;
    this.CurrentNumber = function(value) {
        if (!arguments.length) return currentNumber;
        else currentNumber = value;
    };
    var callbacks = new Array();
    this.addCallback = function(value) {
        callbacks.push(value);
    };
    var template = new Object();
    this.Template = function(value) {
        if (!arguments.length) return template;
        else template = value;
    };
    var data = new Object();
    this.Data = function(value) {
        if (!arguments.length) return data;
        else data = value;
    };
    this.initialize = function() {
        var additoryVariable = new Object();
        if (document.getElementById(containerID)) {
            container = document.getElementById(containerID);
            additoryVariable = selectElementByClassName(internalContainerClassName, container);
            if (additoryVariable.status) {
                internalContainer = additoryVariable.element;
            } else notify(internalContainerClassName, 1);
        } else notify(containerID, 3);
    };
    this.sendRequest = function() {
        var XHR = new XMLHttpRequest();
        var handlerAddress = "data.json?v=1.0.3";
        XHR.onreadystatechange = function() {
            if (XHR.readyState === 4) {
                if (XHR.status === 200) {
                    data = JSON.parse(XHR.responseText);
                    //Вызов запланированных callback;
                    if (callbacks.length) {
                        for (var counter = 0; counter < callbacks.length; counter++) {
                            callbacks[counter]();
                        }
                    }
                } else notify("К сожалению, возникла ошибка при получении AJAX-ответа;");
            }
        };
        XHR.open("GET", handlerAddress, true);
        XHR.send();
    };
    var getTemplate = function() {
        return template.getTemplate(data.comments[currentNumber]);
    };
    var animateHeightIncrease = function() {
        var comment = document.getElementById("cc-" + data.comments[currentNumber].id);
        var height = parseFloat(window.getComputedStyle(comment, "").height);
        comment.style.cssText = "height: 0px; transition: height 0.2s !important; -webkit-transition: height 0.2s !important; overflow: hidden; opacity: 0;";
        window.setTimeout(function() {
            comment.style.opacity = 1;
            comment.style.height = height + "px";
            comment.addEventListener("transitionend", handleEvent, false);
            comment.addEventListener("webkitTransitionEnd", handleEvent, false);
            comment.addEventListener("otransitionend", handleEvent, false);
        }.bind(this), 1000);
    };
    this.addComment = function() {
        internalContainer.insertAdjacentHTML("afterbegin", getTemplate());
        animateHeightIncrease();
    };
    var handleEvent = function(event) {
        event = event || window.event;
        if (event.type === "transitionend" || event.type === "webkitTransitionEnd" || event.type === "otransitionend") {
            event.target.removeAttribute("style");
            event.target.removeEventListener("transitionend", handleEvent, false);
            event.target.removeEventListener("webkitTransitionEnd", handleEvent, false);
            event.target.removeEventListener("otransitionend", handleEvent, false);
        }
    };
};