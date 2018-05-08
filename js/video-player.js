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
    var interval = 0;
    var internalCounter = 0;
    var internalDuration = 0;
    var progressIndicator = false;
    var androidIndicator = 0;
    var androidCounter = 0;
    /**
     * Планирование старта видео-трансляции;
     */
    this.scheduleStart = function() {
        "use strict";
        //Начальная настройка видео-проигрывателя;
        if (this.initilize()) {
            window.setTimeout(function() {
                //Запуск трасляции;
                this.start();
//                if (!detector.detectMobileSafari()) {
//                    additoryCheck();
//                }
            }.bind(this), startingTime - currentServerTime);
        }
    };
    /**
     * Инициализация видео-плеера;
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
     * Подсчёт текущего тайминга видео-записи;
     */
    var calculateCurrentTiming = function() {
        "use strict";
        var searchingIndicator = true;
        var counter = 0;
        if (calculatedDuration > target.duration) {
            internalDuration = calculatedDuration;
        } else {
            internalDuration = target.duration;
        }
        //Подсчёт даты и времени окончания вебинара;
        var webinarEnding = startingTime + internalDuration * 1000;
        if (currentServerTime < webinarEnding) {
            currentTiming = parseFloat(((currentServerTime - startingTime) / 1000).toFixed(2));
            console.log("Время при расчёте:" + currentTiming);
            while (searchingIndicator && counter < data.comments.length) {
                if ((parseInt(data.comments[counter].time) / 1000) > Math.ceil(currentTiming)) {
                    searchingIndicator = false;
                    currentNumber = counter;
                } else {
                    counter++;
                }
            }
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
            console.log("5) setCurrentTiming");
            additionalIndicator = true;
            //Определение текущего тайминга видео;
            calculateCurrentTiming();
            if (indicator) {
                console.log("Сработало событие установки обыного тайминга: " + currentTiming);
                target.currentTime = currentTiming;
            } else {
                if (target.duration) target.currentTime = target.duration;
                else target.currentTime = calculatedDuration;
                console.log("Сработало экстренное завершение видео:", calculatedDuration);
            }
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
        console.log("2) progressHandler()" + target.duration + " " +  additionalIndicator);
        if (target.duration && !additionalIndicator) {
            console.log("3) Сработало условие progressHandler");
            checkPromise();
            progressIndicator = true;
            target.removeEventListener("progress", progressHandler, true);
        }
    };
    var manualStart = function() {
        internalCounter = currentTiming;
        interval = window.setInterval(function() {
            console.log(internalCounter);
            internalCounter += 0.09;
            target.currentTime = internalCounter;
        }, 90);
    };
    var checkPromise = function() {
        "use strict";
        var promise = new Object();
        //Если видео ещё не закончилось;
        if (currentTiming < internalDuration) {
            try {
                console.log("4) Promise - 1");
                /*Запуск видео, который срабатывает в большинстве ПК-версиях браузеров
                  но не работает на мобильных устройствах из-за политики экономии мобильного
                  трафика;*/
                promise = target.play();
                //Проверка актуальна для мобильных браузеров и новой ПК-версии Safari;
                if (promise !== undefined) {
                    //Если запуск сработал с ошибкой;
                    promise.catch(function(error) {
                        console.log("5) Promise - 2");
                        var internalPromise = new Object();
                        /*Повторный запуск видео-записи с отключённым звуком
                          (удовлетворяет некоторые мобильные браузеры);*/
                        target.muted = true;
                        internalPromise = target.play();
                        /*Некоторые Android-устройства не позволяют задать текущий тайминг
                          видео до его запуска, для мобильного Safari на iPhone 8
                          была актуальна проверка promise на undefined, но она не
                          срабатывала для iPhone более ранних версий;*/
                        if (timeUpgrateCheck() || internalPromise === undefined) {
                            //if (detector.detectMobileDevice()) {
                                //alert("Ручное кручение");
                                manualStart();
                                appendModalWindow();
                                modalWindow.addEventListener("click", startVideo, true);
                            //}
                        } else {
                            androidIndicator = true;
                            androidAdditoryCheck();
                        }
//                        if (internalPromise === undefined) {
//                            alert("Ручное кручение");
//                            manualStart();
//                        } else {
//                            androidAdditoryCheck();
//                        }
                        deactivateVolumeButtons();
//                        if (detector.detectMobileDevice()) {
//                            appendModalWindow();
//                        }
                    });
                //Проверка для старых версий Android-устройств;
                } else {
                    target.muted = true;
                    deactivateVolumeButtons();
                    internalDeletion();
                    appendModalWindow({"message": "Нажмите, чтобы начать просмотр", "class": "youtube"});
                    modalWindow.addEventListener("click", startVideo, true);
                }
            } catch (error) {
            }
            deactivateHandlers();
        }
    };
    var deactivateHandlers = function() {
        "use strict";
        window.clearTimeout(timeout);
        //Видео-запись начала проигрываться;
        if (!isPlaying) isPlaying = true;
    };
    /**
     * Запуск видео-трансляции;
     */
    this.start = function() {
        "use strict";
        //Автоматический запуск видео;
        checkPromise();
        addPreloader();
        //В мобильном Safari не вызывается событие "loadeddata", поэтому необходимо добавить обработчик на событие
        //"progress", которое в свою очередь вызывается во всех браузерах, однако при его обработке может возникать
        //проблема с загрузкой meta-данных видео (duration) и установкой текущего тайминга;
        console.log("1) start(), Browser: " + detector.detectMobileSafari());
        //Отрабатывает на мобильных устройствах;
        if (detector.detectMobileSafari()) {
            target.addEventListener("loadeddata", function() {
                window.setTimeout(function() {
                    setCurrentTiming();
                }.bind(this), 1000);
            }.bind(this), true);
        } else {
            target.addEventListener("loadeddata", setCurrentTiming, true);
        }
        target.addEventListener("progress", progressHandler, true);
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
            internalDeletion();
            //if (!timeIndicator) {
            //    setCurrentTiming();
            //}
        }
        changeFlag++;
    };
    var internalDeletion = function() {
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
    };
    var customizePlayer = function() {
        "use strict";
        target.loop = false;
        target.controls = false;
        target.autoplay = false;
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
            if (interval) {
                window.clearInterval(interval);
                interval = 0;
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
                checkPromise();
                target.removeEventListener("progress", progressHandler, true);
                target.removeEventListener("loadeddata", setCurrentTiming, true);
                target.addEventListener("loadedmetadata", setCurrentTiming, true);
            }
        }.bind(this), delay);
    };
    var androidAdditoryCheck = function() {
        "use strict";
        var delay = 5000;
        window.setTimeout(function() {
            if (!progressIndicator) {
                //alert("Сработала проверка для Android;");
                target.muted = true;
                deactivateVolumeButtons();
                internalDeletion();
                appendModalWindow({"message": "Нажмите, чтобы начать просмотр", "class": "youtube"});
                modalWindow.addEventListener("click", startVideo, true);
            } else {
                if (detector.detectMobileDevice()) {
                    appendModalWindow();
                }
            }
        }.bind(this), delay);
    };
    var startVideo = function() {
        "use strict";
        console.log("Отработало ещё какое-то событие;");
        //alert("Установленное время:" + currentTiming);
        //target.currentTime = currentTiming;
        //alert(target.currentTime);
        target.play();
        if (androidIndicator) {
            //alert(androidIndicator);
            target.addEventListener("progress", function() {
                if (androidCounter < 1) {
                    target.currentTime = currentTiming;
                    androidCounter++;
                }
            }, true);
        }
    };
    var timeUpgrateCheck = function() {
        var indicator = true;
        //На некоторых Android-устройствах установка времени не приводит к ожидаемому
        //результату;
        target.currentTime = currentTiming;
        if (!target.currentTime) indicator = false;
        return indicator;
    };
}