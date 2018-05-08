function TimeCalculator() {
    "use strict";
    var cookies = new Object();
    var currentTime = 0;
    var handlerAddress = "php/index.php";
    var currentBrowser = "Another";
    var cookieTitles = new Object();
    this.CookieTitles = function(value) {
        if (!arguments.length) return cookieTitles;
        else cookieTitles = value;
    };
    var currentUser = new Object();
    var second = 1000;
    var detector = new Object();
    /*
     *  Добавляет обработчик, вычисляет время, проведённое на сайте,
     *  идентифицирует пользователя и его браузер; 
     */
    this.initialize = function() {
        if (checkObject(cookieTitles)) {
            if (cookieTitles.getCookieTitles) {
                cookies = cookieTitles.getCookieTitles();
            }
        } else cookies = {"time": "ys-time", "object": "ys-object"};
        currentTime = parseInt(getCookie(cookies.time)) || 0;
        window.setInterval(function() {
            currentTime += second;
        }, second);
        identifyUser();
        detectBrowser();
        window.addEventListener("beforeunload", this, true);
    };
    this.handleEvent = function(event) {
        event = event || window.event;
        if (event.type === "beforeunload") {
            //Сохранение времени, проведённого пользователем на странице;
            setCookie(cookies.time, currentTime, {"domain": ".yaroslav-samoylov.com", "expires": new Date(Date.now() + 31536000000)});
            //Отправка данных на сервер;
            sendRequest();
        }
    };
    /*
     *  Устанавливает название браузера пользователя; 
     */
    var detectBrowser = function() {
        try {
            detector = new Detector();
            currentBrowser = detector.detect();
        } catch(error) {
            if (error instanceof ReferenceError) {
                notify("Не найден класс Detector;");
            }
        }
    };
    /*
     *  Идентифицирует пользователя (на основании данных cookie);
     */
    var identifyUser = function() {
        if (getCookie && getCookie(cookies.object)) {
            currentUser = JSON.parse(getCookie(cookies.object));
        } else {
            setID();
        }
    };
    /*
     *  Идентифицирует пользователя на основании дополнительного ID,
     *  сгенерированного через JS;
     */
    var setID = function() {
        var maximum = 100;
        currentUser.name = "#" + Date.now() + Math.floor((Math.random() * (maximum))).toString();
        currentUser.email = "example@gmail.com";
        currentUser.phone = "00000000000";
    };
    /*
     *  Отправляет AJAX-запрос методом POST;
     */
    var sendRequest = function() {
        var XHR = new XMLHttpRequest();
        var data = new FormData();
        XHR.onreadystatechange = function() {
            if (XHR.readyState === 4) {
                console.log("Данные отправлены;");
            }
        };
        data.append("browser", currentBrowser);
        data.append("time", currentTime);
        if (currentUser.email) {
            data.append("email", currentUser.email);
        }
        if (currentUser.id) {
            data.append("id", currentUser.id);
        }
        XHR.open("POST", handlerAddress, false);
        XHR.send(data);
    };
}
function Detector() {
    var detectOpera = function() {
        var status = false;
        if ((!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(" OPR/") >= 0) {
            status = true;
        }
        return {"status": status, "browser": "Opera"};
    };
    var detectFirefox = function() {
        var status = false;
        if (typeof InstallTrigger !== "undefined") status = true;
        return {"status": status, "browser": "Firefox"};
    };
    var detectSafari = function() {
        var status = false;
        if (/constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window.safari || (typeof safari !== 'undefined' && safari.pushNotification))) {
            status = true;
        }
        return {"status": status, "browser": "Safari"};
    };
    var detectIE = function() {
        var status = false;
        if (/*@cc_on!@*/false || !!document.documentMode) status = true;
        return {"status": status, "browser": "IE"};
    };
    var detectEdge = function() {
        var status = false;
        if (!detectIE() && !!window.StyleMedia) status = true;
        return {"status": status, "browser": "Edge"};
    };
    var detectChrome = function() {
        var status = false;
        if (!!window.chrome && !!window.chrome.webstore) status = true;
        return {"status": status, "browser": "Chrome"};
    };
    this.detect = function() {
        var counter = 0;
        var functions = [detectOpera, detectFirefox, detectSafari, detectIE, detectEdge, detectChrome];
        var variable = new Object();
        var indicator = false;
        var currentBrowser = "Another";
        while (!indicator && counter < functions.length) {
            variable = functions[counter]();
            if (variable.status) {
                indicator = true;
                currentBrowser = variable.browser;
            }
            counter++;
        }
        return currentBrowser;
    };
}