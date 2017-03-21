ymaps.ready(function () {
           
 
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

        myMap = new ymaps.Map('YMapsID', {
            center: myCoords,
            zoom: loc.zoom || 9,
            behaviors: ['default', 'scrollZoom']
        }),
                    myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
            hintContent: 'Собственный значок метки',
            balloonContent: 'Это красивая метка'
        }, {
            // Опции.
            // Необходимо указать данный тип макета.
            iconLayout: 'default#image',
            // Своё изображение иконки метки.
            iconImageHref: 'https://raw.githubusercontent.com/domservis/domservis.github.io/master/images/258.png',
            // Размеры метки.
            iconImageSize: [30, 42],
            // Смещение левого верхнего угла иконки относительно
            // её "ножки" (точки привязки).
            iconImageOffset: [-5, -38]
        });

    myMap.geoObjects.add(myPlacemark);
}),

  
 myMap.geoObjects.add(myPlacemark),
        myMap.geoObjects.add(myPlacemark);
    });
});
