function DeviceDetector() {
    var screenWidth = 720;
    var agent = navigator.userAgent.toLowerCase();
    this.ScreenWidth = function(value) {
        "use strict";
        if (!arguments.length) return screenWidth;
        else screenWidth = value;
    };
    var detectUserAgent = function() {
        "use strict";
        var keywords = ["android", "blackberry", "iphone", "ipad", "ipod", "opera mini", "opera mobi", "iemobile"];
        var counter = 0;
        var indicator = false;
        while (!indicator && counter < keywords.length) {
            if (agent.match(new RegExp(keywords[counter], "ig"))) {
                indicator = true;
            } else counter++;
        }
        return indicator;
    };
    var detectScreenWidth = function() {
        "use strict";
        var indicator = false;
        var status = false;
        var maxValue = Math.max(
            document.body.scrollWidth, document.documentElement.scrollWidth,
            document.body.offsetWidth, document.documentElement.offsetWidth,
            document.body.clientWidth, document.documentElement.clientWidth
        );
        if (maxValue) {
            status = true;
            if (maxValue <= screenWidth) indicator = true;
        }
        return {"status": status, "mobile": indicator};
    };
    this.detectMobileDevice = function() {
        "use strict";
        var mainIndicator = false;
        var additoryObject = detectScreenWidth();
        if (additoryObject.status) {
            mainIndicator = additoryObject.mobile;
        } else {
            mainIndicator = detectUserAgent();
        }
        return mainIndicator;
    };
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
    this.detectBrowser = function() {
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
    this.detectMobileSafari = function () {
        var indicator = false;
        var counter = 0;
        var variable = detectSafari();
        var functions = [detectOpera, detectFirefox, detectIE, detectEdge, detectChrome];
        if (agent.indexOf('safari/') > -1 && variable.status)   {
            while (!indicator && counter < functions.length) {
                variable = functions[counter]();
                if (variable.status) {
                    indicator = true;
                } else counter++;
            }
            if (!indicator) {
                indicator = true;
            } else indicator = false;
        }
        return indicator;
    };
}