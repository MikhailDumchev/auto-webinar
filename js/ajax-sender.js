function AjaxSender() {
    "use strict";
    var player = new Object();
    this.Player = function(value) {
        if (!arguments.length) return player;
        else player = value;
    };
    var timer = new Object();
    this.Timer = function(value) {
        if (!arguments.length) return timer;
        else timer = value;
    };
    var detector = new Object();
    this.Detector = function(value) {
        if (!arguments.length) return detector;
        else detector = value;
    };
    var callbacks = new Array();
    this.addCallback = function(value) {
        callbacks.push(value);
    };
    this.makeRequest = function() {
        var XHR = new XMLHttpRequest();
        var handlerAddress = "http://air.yaroslav-samoylov.com/live/test/time.php";
        XHR.onreadystatechange = function() {
            var response = new Object();
            var startingTime = 0;
            var currentServerTime = 0;
            var counter = 0;
            if (XHR.readyState === 4) {
                if (XHR.status === 200) {
                    if (!checkObject(player)) player = new VideoPlayer();
                    if (!checkObject(timer)) timer = new Timer();
                    response = JSON.parse(XHR.responseText);
                    startingTime = parseInt(response.start);
                    currentServerTime = parseInt(response.server);
                    player.StartingTime(startingTime);
                    player.CurrentServerTime(currentServerTime);
                    console.log("Время начала ", startingTime);
                    console.log("Текущее время ", currentServerTime);
                    timer.DeletionIndicator(true);
                    timer.CurrentServerTime(currentServerTime);
                    timer.StartingTime(startingTime);
                    timer.createTimer(document.getElementsByClassName("timer-background")[0]);
                    player.VideoSource("http://air.yaroslav-samoylov.com/live/video/3_desk.mp4");
                    player.MobileVideoSource("http://air.yaroslav-samoylov.com/live/video/3_mob.mp4");
                    player.CalculatedDuration(9120);
                    player.Detector(detector);
                    //Вызов запланированных callback;
                    if (callbacks.length) {
                        for (counter; counter < callbacks.length; counter++) {
                            callbacks[counter]();
                        }
                    }
                } else console.error("К сожалению, возникла ошибка при получении AJAX-ответа;");
            }
        };
        XHR.open("GET", handlerAddress, true);
        XHR.send();
    };
}