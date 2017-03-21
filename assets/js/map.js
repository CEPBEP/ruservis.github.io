ymaps.ready(function () {

    // Координаты, к которым будем строить маршруты.
  
    // Укажите здесь, к примеру, координаты вашего офиса.
    var targetCoords = [55.818998, 37.498044],
	    

    // Инициализируем карту.
        myMap = new ymaps.Map('map', {
            center: targetCoords,
            zoom: 14
        }, {
            // Ограничиваем количество результатов поиска.
            searchControlResults: 1,

            // Отменяем автоцентрирование к найденным адресам.
            searchControlNoCentering: true,

            // Разрешаем кнопкам нужную длину.
            buttonMaxWidth: 250
        }),

    // Метка для конечной точки маршрута.
        targetPoint = new ymaps.Placemark(targetCoords, {iconImageSize: [64, 64], // размер иконки
	iconImageOffset: [-32, -64], // позиция иконки
	balloonContentSize: [370, 370], // размер нашего кастомного балуна в пикселях
   iconImageHref: 'https://raw.githubusercontent.com/domservis/domservis.github.io/master/images/258.png',
   iconContent: " <div id='dot'><div class='ping'></div></div><!--<br><a href='#' id='mp'>открыть</a>-->",
   balloonContentHeader: "<a href='tel:89859351863' style='position: absolute;font-size: 40px;font-weight: 900;'><i class='fa fa-phone' aria-hidden='true'></i></a>",
            balloonLayout: "default#imageWithContent",
	    balloonImageHref: 'https://raw.githubusercontent.com/domservis/domservis.github.io/master/images/258.png',
	    balloonContentBody: "<iframe id='fr' src='https://domservis.github.io/b.html'frameborder='0' allowfullscreen></iframe>",
	    balloonId: 'chatra-wrapper',
	    balloonImageSize: [260, 89],
            balloonContentFooter: "<!--<center><span id='spn1'>[<-]</span>X<span id='spn2'>[->]</span></center>-->",
            hintContent: "БЛИЖАЙШИЙ МАСТЕР",
            },
     //   { preset: 'islands#redStretchyIcon' },
                                          { iconLayout: 'default#imageWithContent',
          iconImageHref: 'https://raw.githubusercontent.com/domservis/domservis.github.io/master/images/258.png',
          iconImageSize: [80, 80]
          
         
					  })  ,
  

    // Получаем ссылки на нужные элементы управления.
        searchControl = myMap.controls.get('searchControl'),
        geolocationControl = myMap.controls.get('geolocationControl'),

    // Создаём выпадающий список для выбора типа маршрута.
        routeTypeSelector = new ymaps.control.ListBox({
            data: {
                content: 'Маршрут к Вам'
            },
            items: [
                new ymaps.control.ListBoxItem('На автомобиле'),
                new ymaps.control.ListBoxItem('Общественным транспортом'),
                new ymaps.control.ListBoxItem('Пешком')
            ],
            options: {
                itemSelectOnClick: false
            }
        }),
    // Получаем прямые ссылки на пункты списка.
        autoRouteItem = routeTypeSelector.get(0),
        masstransitRouteItem = routeTypeSelector.get(1),
        pedestrianRouteItem = routeTypeSelector.get(2),

    // Метка для начальной точки маршрута.
        sourcePoint,

    // Переменные, в которых будут храниться ссылки на текущий маршрут.
        currentRoute,
        currentRoutingMode;

    // Добавляем конечную точку на карту.
    myMap.geoObjects.add(targetPoint);

    // Добавляем на карту созданный выпадающий список.
    myMap.controls.add(routeTypeSelector);

    // Подписываемся на события нажатия на пункты выпадающего списка.
    autoRouteItem.events.add('click', function (e) { createRoute('auto', e.get('target')); });
    masstransitRouteItem.events.add('click', function (e) { createRoute('masstransit', e.get('target')); });
    pedestrianRouteItem.events.add('click', function (e) { createRoute('pedestrian', e.get('target')); });

    // Подписываемся на события, информирующие о трёх типах выбора начальной точки маршрута:
    // клик по карте, отображение результата поиска или геолокация.
    myMap.events.add('click', onMapClick);
    searchControl.events.add('resultshow', onSearchShow);
    geolocationControl.events.add('locationchange', onGeolocate);

    /*
     * Следующие функции реагируют на нужные события, удаляют с карты предыдущие результаты,
     * переопределяют точку отправления и инициируют перестроение маршрута.
     */

    function onMapClick (e) {
        clearSourcePoint();
        sourcePoint = new ymaps.Placemark(e.get('coords'), { iconContent: 'Я ТУТ' }, { preset: 'islands#greenStretchyIcon' });
        myMap.geoObjects.add(sourcePoint);
        createRoute();
    }

    function onSearchShow (e) {
        clearSourcePoint(true);
        sourcePoint = searchControl.getResultsArray()[e.get('index')];
        createRoute();
    }

    function onGeolocate (e) {
        clearSourcePoint();
        sourcePoint = e.get('geoObjects').get(0);
        createRoute();
    }

    function clearSourcePoint (keepSearchResult) {
        if (!keepSearchResult) {
            searchControl.hideResult();
        }

        if (sourcePoint) {
            myMap.geoObjects.remove(sourcePoint);
            sourcePoint = null;
        }
    }

    /*
     * Функция, создающая маршрут.
     */
    function createRoute (routingMode, targetBtn) {
        // Если `routingMode` был передан, значит вызов происходит по клику на пункте выбора типа маршрута,
        // следовательно снимаем выделение с другого пункта, отмечаем текущий пункт и закрываем список.
        // В противном случае — перестраиваем уже имеющийся маршрут или ничего не делаем.
        if (routingMode) {
            if (routingMode == 'auto') {
                masstransitRouteItem.deselect();
                pedestrianRouteItem.deselect();
            } else if (routingMode == 'masstransit') {
                autoRouteItem.deselect();
                pedestrianRouteItem.deselect();
            } else if (routingMode == 'pedestrian') {
                autoRouteItem.deselect();
                masstransitRouteItem.deselect();
            }

            targetBtn.select();
            routeTypeSelector.collapse();
        } else if (currentRoutingMode) {
            routingMode = currentRoutingMode;
        } else {
            return;
        }

        // Если начальная точка маршрута еще не выбрана, ничего не делаем.
        if (!sourcePoint) {
            currentRoutingMode = routingMode;
            geolocationControl.events.fire('press');
            return;
        }

        // Стираем предыдущий маршрут.
        clearRoute();

        currentRoutingMode = routingMode;

        // Создаём маршрут нужного типа из начальной в конечную точку.
        currentRoute = new ymaps.multiRouter.MultiRoute({
            referencePoints: [sourcePoint, targetPoint],
            params: { routingMode: routingMode }
        }, {
            boundsAutoApply: true
        });

        // Добавляем маршрут на карту.
        myMap.geoObjects.add(currentRoute);
    }

    function clearRoute () {
        myMap.geoObjects.remove(currentRoute);
        currentRoute = currentRoutingMode = null;
    }
	 });
	
	
	
	
	/**
 * Класс сервиса геолокации.
 * Определяет местоположение с использованием Geolocation API браузера.
 * В случае его отсутствия или ошибки определяет местоположение по IP с помощью API Яндекс.Карт.
 * @see http://www.w3.org/TR/geolocation-API/
 * @see http://api.yandex.ru/maps/doc/jsapi/2.x/ref/reference/geolocation.xml
 * @class
 * @name GeolocationService
 */
function GeolocationService() {
    this._location = new ymaps.util.Promise();
};

/**
 * @lends GeolocationService.prototype
 */
GeolocationService.prototype = {
    /**
     * @constructor
     */
    constructor: GeolocationService,
    /**
     * Определяем местоположение пользователя всеми доступными средствами.
     * @function
     * @name GeolocationService.getLocation
     * @params {Object} [options] Опции GeolocationAPI
     * @see http://www.w3.org/TR/geolocation-API/#position-options
     * @returns {ymaps.util.Promise} Возвращает объект-обещание.
     */
    getLocation: function (options) {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                ymaps.util.bind(this._onGeolocationSuccess, this),
                ymaps.util.bind(this._onGeolocationError, this),
                options
            );
        }
        else {
            this._location.resolve(
                this.getLocationByIP() || this.getDefaults()
            );
        }

        return this._sync();
    },
    /**
     * Обертка над оригинальным промисом, чтобы его нельзя было зареджектить
     * из пользовательского кода.
     * @private
     * @function
     * @name GeolocationService._sync
     * @returns {ymaps.util.Promise} Промис-обертка.
     */
    _sync: function (p) {
        var promise = new ymaps.util.Promise();

        this._location.then(
            function (res) { promise.resolve(res); },
            function (err) { promise.reject(err); }
        );

        return promise;
    },
    /**
     * Перегружаем промис для обновления местоположения при повторных вызовах getLocation.
     * @private
     * @function
     * @name GeolocationService._reset
     */
    _reset: function () {
        this._location = new ymaps.util.Promise();
    },
    /**
     * Обработчик результата геолокации.
     * @private
     * @function
     * @name GeolocationService._onGeolocationSuccess
     * @param {Object} position Объект с описанием местоположения.
     * @see http://www.w3.org/TR/geolocation-API/#position_interface
     */
    _onGeolocationSuccess: function (position) {
        this._location.resolve(position.coords);

        this._reset();
    },
    /**
     * Обработчик ошибки геолокации.
     * @private
     * @function
     * @name GeolocationService._onGeolocationError
     * @param {Object|Number} error Объект или код ошибки.
     * @see http://www.w3.org/TR/geolocation-API/#position_error_interface
     */
    _onGeolocationError: function (error) {
        // Выводим в консоль описание ошибки.
        if(window.console) {
            console.log(error.message || this.constructor.GEOLOCATION_ERRORS[error + 1]);
        }

        this._location.resolve(
            this.getLocationByIP() || this.getDefaults()
        );

        this._reset();
    },
    /**
     * Возвращает данные о местоположении пользователя на основе его IP-адреса.
     * @see http://api.yandex.ru/maps/doc/jsapi/2.x/ref/reference/geolocation.xml
     * @function
     * @name GeolocationService.getLocationByIP
     * @returns {Object|null} Местоположение пользователя.
     */
    getLocationByIP: function () {
        return ymaps.geolocation;
    },
    /**
     * Возвращает местоположение по умолчанию.
     * Удобно для перекрытия.
     * @function
     * @name GeolocationService.getDefaults
     * @returns {Object} Местоположение пользователя.
     */
    getDefaults: function () {
        // По умолчанию возвращаем Москву.
        return {
            latitude: 55.751574,
            longitude: 37.573856,
            zoom: 9
        };
    }
};

/**
 * Человекопонятное описание кодов ошибок Geolocation API.
 * @see http://www.w3.org/TR/geolocation-API/#position_error_interface
 * @static
 */
GeolocationService.GEOLOCATION_ERRORS = [
    'permission denied',
    'position unavailable',
    'timeout'
];
