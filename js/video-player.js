function VideoPlayer() {
    //Идентификатор DOM-элемента, который выполняет роль видео-плеера;
    var targetID = "video";
    //Идентификатор DOM-элемента, который выполняет роль полосы прокрутки;
    var preloaderID = "preloader";
    //Класс контейнера, в котором содержатся: стекло, видео-плеер и панель управления;
    var containerClassName = "video-container";
    var volumeButtonClassName = "volume-button";
    var activeButtonClassName = "active";
    var inactiveButtonClassName = "inactive";
    var modalWindowClassName = "modal-window";
    var backgroundClassName = "background";
    var initialBackgroundClassName = "initial-background";
    var additoryClassName = "with-image";
    var moduleWithTimerClassName = "module-with-timer";
    var currentNumber = 0;
    var detector = new Object();
    this.Detector = function(value) {
        if (!arguments.length) return detector;
        else detector = value;
    };
    var callbacks = new Array();
    this.addCallback = function(value) {
        callbacks.push(value);
    };
    var data = new Object();
    this.Data = function(value) {
        if (!arguments.length) return data;
        else data = value;
    };
    var handler = new Object();
    this.Handler = function(value) {
        if (!arguments.length) return handler;
        else handler = value;
    };
    var preloader = new Object();
    var modalWindow = new Object();
    var background = new Object();
    var message = new Object();
    var volumeButton = new Object();
    var container = new Object();
    //Ссылка на DOM-элемент, который выполняет роль видео-плеера;
    var target = new Object();
    var moduleWithTimer = new Object();
    var isPlaying = false;
    //console.log("ss", Date.parse(new Date("2017-11-16T10:28:00")));
    //Время начала трансляции (в UNIX-time);
    var startingTime = 0;
    this.StartingTime = function(value) {
        if (!arguments.length) return startingTime;
        else startingTime = value;
    };
    //Текущее серверное время (в UNIX-time);
    var currentServerTime = 0;
    this.CurrentServerTime = function(value) {
        if (!arguments.length) return currentServerTime;
        else currentServerTime = value;
    };
    //Ссылка на видео-запись для PC;
    var videoSource = "";
    this.VideoSource = function(value) {
        if (!arguments.length) return videoSource;
        else videoSource = value;
    };
    //Ссылка на видео-запись для мобильных;
    var mobileVideoSource = "";
    this.MobileVideoSource = function(value) {
        if (!arguments.length) return mobileVideoSource;
        else mobileVideoSource = value;
    };
    //Длительность видео-записи, просчитанная на стороне сервера (для встроенных браузеров Android, в секундах);
    var calculatedDuration = 0;
    this.CalculatedDuration = function(value) {
        if (!arguments.length) return calculatedDuration;
        else calculatedDuration = value;
    };
    var indicator = true;
    var additionalIndicator = false;
    var changeFlag = 0;
    var currentTiming = 0;
    var timeout = 0;
    /**
     * Метод используется для запланированного старта видео-трансляции;
     */
    this.scheduleStart = function() {
        "use strict";
        //Начальная настройка видео-проигрывателя;
        if (this.initilize()) {
            window.setTimeout(function() {
                this.start();
                additoryCheck();
            }.bind(this), startingTime - currentServerTime);
        }
    };
    /**
     * Метод используется для инициализации видео-плеера;
     */
    this.initilize = function() {
        "use strict";
        var indicator = false;
        //Поиск контейнера для видео-проигрывателя;
        var additoryVariable = selectElementByClassName(containerClassName);
        if (document.getElementById(targetID)) {
            if (additoryVariable.status) {
                container = additoryVariable.element;
                additoryVariable = selectElementByClassName(volumeButtonClassName, container);
                if (additoryVariable.status) {
                    volumeButton = additoryVariable.element;
                    additoryVariable = selectElementByClassName(moduleWithTimerClassName, container);
                    if (additoryVariable.status) {
                        moduleWithTimer = additoryVariable.element;
                        target = document.getElementById(targetID);
                        //Установка ссылки на видео-запись;
                        setVideoSource();
                        //Отключение стандартных элементов управления;
                        customizePlayer();
                        volumeButton.addEventListener("click", this, true);
                        indicator = true;
                    } else notify(moduleWithTimerClassName, 2);
                } else notify(volumeButtonClassName, 2);
            } else notify(containerClassName, 2);
        } else notify("Не был найден HTML-проигрываетль;");
        return indicator;
    };
    /**
     * Метод используется для подсчёта текущего тайминга видео-записи;
     */
    var calculateCurrentTiming = function() {
        "use strict";
        var internalDuration = target.duration || calculatedDuration;
        //Подсчёт даты и времени окончания вебинара;
        var webinarEnding = startingTime + internalDuration * 1000;
        if (currentServerTime < webinarEnding) {
            currentTiming = ((currentServerTime - startingTime) / 1000).toFixed(2);
            if (currentTiming < 0) currentTiming = 0;
        } else {
            indicator = false;
            console.log("К сожалению, вебинар окончен;");
        }
    };
    var setVideoSource = function() {
        "use strict";
        var element = document.createElement("source");
        element.type = "video/mp4";
        if (detector.detectMobileDevice() && mobileVideoSource.length) element.src = mobileVideoSource;
        else element.src = videoSource;
        target.appendChild(element);
        target.load();
    };
    var addPreloader = function() {
        preloader = document.createElement("div");
        preloader.id = preloaderID;
        container.appendChild(preloader);
    };
    var deletePreloader = function() {
        preloader.parentNode.removeChild(preloader);
    };
    var addZero = function(variable) {
        "use strict";
        //Функция определяет, нужно ли добавлять "0" перед полученным числом;
        if (variable < 10) variable = "0" + variable.toString();
        else variable = variable.toString();
        return variable;
    };
    var displayCurrentTiming = function() {
        "use strict";
        var visibleTiming = target.currentTime * 1000;
        var additoryVariable = new Date(visibleTiming);
        moduleWithTimer.textContent = addZero(additoryVariable.getUTCHours()) + ":" + addZero(additoryVariable.getMinutes()) + ":" + addZero(additoryVariable.getSeconds());
    };
    var setCurrentTiming = function() {
        "use strict";
        if (!additionalIndicator) {
            additionalIndicator = true;
            //Определение текущего тайминга видео;
            calculateCurrentTiming();
            if (indicator) {
                target.currentTime = currentTiming;
            } else {
                if (target.duration) target.currentTime = target.duration;
                else target.currentTime = calculatedDuration;
            }
            //console.log("Отработало событие установки тайминга;");
            checkPromise();
        }
    };
    var hideVideo = function() {
        "use strict";
        var additoryVariable = selectElementByClassName(initialBackgroundClassName);
        if (additoryVariable.status) clearClassName(additoryVariable.element, "inactive");
        addClassName(additoryVariable.element, additoryClassName);
        target.removeEventListener("timeupdate", displayCurrentTiming, true);
        target.removeChild(target.getElementsByTagName("source")[0]);
    };
    var progressHandler = function() {
        "use strict";
        console.log("Отработало событие progress;");
        if (target.duration && !additionalIndicator) {
            checkPromise();
            target.removeEventListener("progress", progressHandler, true);
        }
    };
    var checkPromise = function() {
        "use strict";
        var promise = new Object();
        if (target.currentTime < target.duration) {
            promise = target.play();
            if (promise !== undefined) {
                //Если промис сработал с ошибкой;
                promise.catch(function(error) {
                    target.muted = true;
                    target.play();
                    deactivateVolumeButtons();
                    if (detector.detectMobileDevice()) {
                        appendModalWindow();
                    }
                });
            } else {
                target.muted = true;
                deactivateVolumeButtons();
                appendModalWindow({"message": "Нажмите, чтобы начать просмотр", "class": "youtube"});
                modalWindow.addEventListener("click", startVideo, true);
            }
            deactivateHandlers();
            //Вызов запланированных callback;
            console.log("Отработало событие промиса;");
        }
    };
    var deactivateHandlers = function() {
        "use strict";
        window.clearTimeout(timeout);
        //Видео-запись начала проигрываться;
        if (!isPlaying) isPlaying = true;
    };
    this.start = function() {
        "use strict";
        //Автоматический запуск видео;
        checkPromise();
        addPreloader();
        //В мобильном Safari не вызывается событие "loadeddata", поэтому необходимо добавить обработчик на событие
        //"progress", которое в свою очередь вызывается во всех браузерах, однако при его обработке может возникать
        //проблема с загрузкой meta-данных видео (duration) и установкой текущего тайминга;
        target.addEventListener("progress", progressHandler, true);
        target.addEventListener("loadeddata", setCurrentTiming, true);
        target.addEventListener("timeupdate", deleteInitialElements, true);
        target.addEventListener("timeupdate", displayCurrentTiming, true);
        if (checkObject(handler)) {
            target.addEventListener("timeupdate", displayComment, true);
        }
        target.addEventListener("ended", hideVideo, true);
        console.log("Отработало событие начала;");
    };
    var displayComment = function() {
        "use strict";
        var counter = 0;
        var searchingIndicator = true;
        //Если видео-запись "прошла" контрольную точку;
        if (Math.ceil(target.currentTime) > parseInt(data.comments[currentNumber].time) / 1000) {
            while (searchingIndicator && currentNumber < data.comments.length && counter < 100) {
                //Если текущий тайминг больше, чем время появления следующих комментариев;
                if (Math.ceil(target.currentTime) < parseInt(data.comments[currentNumber].time) / 1000) {
                    //Остановка поиска;
                    searchingIndicator = false;
                //Вывод комментариев;
                } else {
                    handler.CurrentNumber(currentNumber);
                    handler.addComment();
                    currentNumber++;
                    counter++;
                }
            }
        }
    };
    var deleteInitialElements = function() {
        "use strict";
        /*
         * Предположительно перед показом видео с необходимого момента времени срабатывает
         * два события timeupdate: установка тайминга в нулевую позицию при загрузке видео, и
         * установка тайминга в нужную позицию после его изменения методом setCurrentTiming;
         **/
        if (changeFlag) {
            var additoryVariable = selectElementByClassName(initialBackgroundClassName);
            if (additoryVariable.status) addClassName(additoryVariable.element, "inactive");
            target.removeEventListener("timeupdate", deleteInitialElements, true);
            deletePreloader();
            //Видео-запись начала проигрываться;
            if (!isPlaying) isPlaying = true;
            //Вызов запланированных callback;
            if (callbacks.length) {
                for (var counter = 0; counter < callbacks.length; counter++) {
                    callbacks[counter]();
                }
            }
        }
        changeFlag++;
    };
    var customizePlayer = function() {
        "use strict";
        target.loop = false;
    };
    this.handleEvent = function(event) {
        "use strict";
        event = event || window.event;
        var element = event.target;
        var additoryVariable = new Object();
        if (event.type === "click") {
            additoryVariable = searchContainer(element, "class", volumeButtonClassName);
            if (additoryVariable.status) {
                element = additoryVariable.element;
                if (target.muted) {
                    target.muted = false;
                    activateVolumeButtons();
                } else {
                    target.muted = true;
                    deactivateVolumeButtons();
                }
            }
            additoryVariable = searchContainer(element, "class", backgroundClassName);
            if (additoryVariable.status) {
                background.parentNode.removeChild(background);
                target.muted = false;
                activateVolumeButtons();
            }
        }
    };
    var activateVolumeButtons = function() {
        "use strict";
        var volumeButtons = [volumeButton];
        var counter = 0;
        for (counter; counter < volumeButtons.length; counter++) {
            if (testClassName(volumeButtons[counter], inactiveButtonClassName)) clearClassName(volumeButtons[counter], inactiveButtonClassName);
            if (!testClassName(volumeButtons[counter], activeButtonClassName)) addClassName(volumeButtons[counter], activeButtonClassName);
        }
    };
    var deactivateVolumeButtons = function() {
        "use strict";
        var volumeButtons = [volumeButton];
        var counter = 0;
        for (counter; counter < volumeButtons.length; counter++) {
            if (testClassName(volumeButtons[counter], activeButtonClassName)) clearClassName(volumeButtons[counter], activeButtonClassName);
            if (!testClassName(volumeButtons[counter], inactiveButtonClassName)) addClassName(volumeButtons[counter], inactiveButtonClassName);
        }
    };
    var appendModalWindow = function(indicator) {
        "use strict";
        if (!document.getElementsByClassName(backgroundClassName).length) {
            background = document.createElement("div");
            background.className = backgroundClassName;
            modalWindow = document.createElement("div");
            modalWindow.className = modalWindowClassName;
            if (!indicator) {
                message = document.createElement("p");
                message.textContent = "НАЖМИТЕ, ЧТОБЫ ВКЛЮЧИТЬ ЗВУК";
                modalWindow.appendChild(message);
            } else {
                modalWindow.className += " youtube";
            }
            background.appendChild(modalWindow);
            container.appendChild(background);
            background.addEventListener("click", this, false);
        }
    }.bind(this);
    /*
     * Метод используется для проверки инициализации видео-записи спустя определённое
     * количество времени;
     */
    var additoryCheck = function() {
        "use strict";
        var delay = 5000;
        timeout = window.setTimeout(function() {
            if (!isPlaying) {
                console.log("Отработало дополнительное событие;");
                isPlaying = true;
                target.play();
                target.removeEventListener("progress", progressHandler, true);
                target.removeEventListener("loadeddata", setCurrentTiming, true);
                target.addEventListener("loadedmetadata", setCurrentTiming, true);
            }
        }.bind(this), delay);
    };
    var startVideo = function() {
        "use strict";
        console.log("Отработало ещё какое-то событие;");
        target.play();
    };
}