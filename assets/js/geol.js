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

        myMap = new ymaps.Map('Map', {
            center: myCoords,
            zoom: loc.zoom || 9,
            behaviors: ['default', 'scrollZoom']
        });
        
      

        myMap.geoObjects.add(myPlacemark);
    });
    
       // Создаем метку с помощью вспомогательного класса.
        myPlacemark1 = new ymaps.Placemark([55.8, 37.6], {
            // Свойства.
            // Содержимое иконки, балуна и хинта.
            iconContent: '1',
            balloonContent: 'Балун',
            hintContent: 'Стандартный значок метки'
        });
    
});


