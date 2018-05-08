var adder = (function() {
    "use strict";
    var nextCommentNumber = 0;
    var dataFileAddress = "data-1.json";
    //var handlerAddress = "http://air2.yaroslav-samoylov.com/admin/time";
    var handlerAddress = "http://air.yaroslav-samoylov.com/live/time.php";
    //В переменной содержится массив всех комментариев, а также текущее серверное время;
    var data = new Object();
    var Data = function(value) {
        if (!arguments.length) return data;
        else data = value;
    };
    var currentTime = 0;
    var CurrentTime = function(value) {
        if (!arguments.length) return currentTime;
        else currentTime = value;
    };
    var getCurrentTime = function(callback) {
        sendRequest(handlerAddress, function(value) {
            CurrentTime(value.server);
            if (callback) callback();
        });
    };
    var getData = function(callback) {
        sendRequest(dataFileAddress, function(value) {
            Data(value);
            if (callback) callback();
        });
    };
    var startCommentAddition = function() {
        var counter = 0;
        var indicator = false;
        while (!indicator && counter < data.comments.length) {
            if (currentTime < data.comments[counter].time) {
                indicator = true;
                //Определение порядкового номера следующего комментария;
                nextCommentNumber = counter;
            } else counter++;
        }
        if (indicator) {
            console.log("Функция ожидает начала добавления комментариев;");
            scheduleCommentAddition(data.comments[nextCommentNumber].time - currentTime);
        }
    };
    var scheduleCommentAddition = function(time) {
        window.setTimeout(function() {
            nextCommentNumber++;
            if (nextCommentNumber < data.comments.length) {
                scheduleCommentAddition(data.comments[nextCommentNumber].time - data.comments[nextCommentNumber - 1].time);
            }
        }.bind(this), time);
    };
    var sendRequest = function(handlerAddress, callback) {
        var XHR = new XMLHttpRequest();
        XHR.onreadystatechange = function() {
            var response = new Object();
            if (XHR.readyState === 4) {
                if (XHR.status === 200) {
                    response = JSON.parse(XHR.responseText);
                    if (callback) callback(response);
                } else notify("К сожалению, возникла ошибка при получении AJAX-ответа;");
            }
        }.bind(this);
        XHR.open("GET", handlerAddress, true);
        XHR.send();
    };
    return {
        start: function() {
            console.log("Функция запущена;");
            //Получение текущего серверного времени;
            getCurrentTime(function() {
                //Получение списка комментариев;
                getData(startCommentAddition);
            });
        },
        showComment: function(comment) {
            console.log(comment);
        }
    };
}());