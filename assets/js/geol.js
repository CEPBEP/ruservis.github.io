ymaps.ready(function () {
           // Создаем геообъект с типом геометрии "Точка".
        myGeoObject = new ymaps.GeoObject({
            // Описание геометрии.
            geometry: {
                type: "Point",
                coordinates: [55.8, 37.8]
            },
            // Свойства.
            properties: {
                // Контент метки.
                iconContent: 'Метка',
                balloonContent: 'Меня можно перемещать'
            }
        }, {
            // Опции.
            // Иконка метки будет растягиваться под размер ее содержимого.
            preset: 'twirl#redStretchyIcon',
            // Метку можно перемещать.
            draggable: true
        }),

        // Создаем метку с помощью вспомогательного класса.
        myPlacemark1 = new ymaps.Placemark([55.8, 37.6], {
            // Свойства.
            // Содержимое иконки, балуна и хинта.
            iconContent: '1',
            balloonContent: 'Балун',
            hintContent: 'Стандартный значок метки'
        }, {
            // Опции.
            // Стандартная фиолетовая иконка.
            preset: 'twirl#violetIcon'
        }),

        myPlacemark2 = new ymaps.Placemark([55.76, 37.56], {
            // Свойства.
            hintContent: 'Собственный значок метки'
        }, {
            // Опции.
            // Своё изображение иконки метки.
            iconImageHref: 'images/myIcon.gif',
            // Размеры метки.
            iconImageSize: [30, 42],
            // Смещение левого верхнего угла иконки относительно
            // её "ножки" (точки привязки).
            iconImageOffset: [-3, -42]
        });

    // Добавляем все метки на карту.
    myMap.geoObjects
        .add(myPlacemark1)
        .add(myPlacemark2)
        .add(myGeoObject);
};

    
    
    
    
    var myMap,
        service = new GeolocationService(),
        myLocation = service.getLocation({
            // Режим получения наиболее точных данных.
            enableHighAccuracy: true,
            // Максимальное время ожидания ответа (в миллисекундах).
            timeout: 10000,
            // Максимальное время жизни полученных данных (в миллисекундах).
            maximumAge: 1000
        });

    myLocation.then(function (loc) {
        var myCoords = [loc.latitude, loc.longitude],
            myPlacemark = new ymaps.Placemark(myCoords, {}, {
                iconImageHref: 'https://raw.githubusercontent.com/domservis/domservis.github.io/master/images/258.png',
                iconImageSize: [24, 24],
                iconImageOffset: [-12, -12]
            });

        myMap = new ymaps.Map('Map', {
            center: myCoords,
            zoom: loc.zoom || 9,
            behaviors: ['default', 'scrollZoom']
        });
        
      

        myMap.geoObjects.add(myPlacemark);
    });
    
  
    
});


