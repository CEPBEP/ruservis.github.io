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
                iconImageSize: [64, 64],
                iconImageOffset: [-12, -12]
                
                     .add(new ymaps.Placemark([55.790139, 37.814052], {
            balloonContent: '<strong>blue</strong> color',
            iconCaption: 'Very long but, of course, very interesting text'
        }, {
            preset: 'islands#blueCircleDotIconWithCaption',
            iconCaptionMaxWidth: '50'
                
            });
        
        
        
    
        })),
        
        
        
        
        

        myMap = new ymaps.Map('YMapsID', {
            center: myCoords,
            zoom: loc.zoom || 11,
            behaviors: ['default', 'scrollZoom']
        });
            
            
            
            
   
            
            
            
            
            
            
            
            

        myMap.geoObjects.add(myPlacemark);
    });
});
