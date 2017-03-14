L.mapbox.accessToken = 'pk.eyJ1IjoicGV0ZXJxbGl1IiwiYSI6ImpvZmV0UEEifQ._D4bRmVcGfJvo1wjuOpA1g';

function reverseCoords(pair) {return [pair[1], pair[0]]}
var receivedQuantity = 0;
var responseNumerator = 0;
//interval at which animation progresses, in milliseconds per frame  
//Интервал, в котором происходит анимация, в миллисекундах на кадр
var pollingInterval = 250;
var soundOn = false;
var pickupPoints=
{
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "marker-color": "#666",
                "marker-size": "small",
                "marker-symbol": "circle",
                "address": "ул. Пасечная, 4 Москва 125008",
                "time_submitted": 1428941074549
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    37.54089475,
              55.82421348
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "marker-color": "#666",
                "marker-size": "small",
                "marker-symbol": "circle",
                "address": "ул. Большая Академическая, 22к7 ",
                "time_submitted": 1428941076676
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                     37.53235023,
              55.82398032
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "marker-color": "#666",
                "marker-size": "small",
                "marker-symbol": "circle",
                "address": "ул. Сельскохозяйственная, 23 ",
                "time_submitted": 1428941078865
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                   37.62878168,
              55.84016151
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "marker-color": "#666",
                "marker-size": "small",
                "marker-symbol": "circle",
                "address": "пр-т Мира, 112Б ",
                "time_submitted": 1428941079891
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                   37.63726652,
              55.80779315
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "marker-color": "#666",
                "marker-size": "small",
                "marker-symbol": "circle",
                "address": "Театральный пр-д, 5 ",
                "time_submitted": 1428941080424
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                  37.62466148,
              55.75956061
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "marker-color": "#666",
                "marker-size": "small",
                "marker-symbol": "circle",
                "address": "Сверчков пер., 6 ",
                "time_submitted": 1428941081584
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    37.63911724,
              55.76010844
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "marker-color": "#666",
                "marker-size": "small",
                "marker-symbol": "circle",
                "address": "Москворецкая наб., 7 ",
                "time_submitted": 1428941082591
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    37.63383865,
              55.75069009
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "marker-color": "#666",
                "marker-size": "small",
                "marker-symbol": "circle",
                "address": "ул. Косыгина, 55",
                "time_submitted": 1428941084832
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                   37.535790,
              55.715226
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "marker-color": "#666",
                "marker-size": "small",
                "marker-symbol": "circle",
                "address": "Люсиновская ул., 72",
                "time_submitted": 1428941085634
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                  37.62233734,
              55.71280052
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "marker-color": "#666",
                "marker-size": "small",
                "marker-symbol": "circle",
                "address": "Ломоносовский просп., 16",
                "time_submitted": 1428941086852
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                   37.54268646,
              55.6922939
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "marker-color": "#666",
                "marker-size": "small",
                "marker-symbol": "circle",
                "address": "ул. Трофимова, 4Б",
                "time_submitted": 1428941087632
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                   37.66229991,
              55.70142066
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "marker-color": "#666",
                "marker-size": "small",
                "marker-symbol": "circle",
                "address": "Судостроительная ул., 42А",
                "time_submitted": 1428941088728
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                  37.69250728,
              55.68529443
                ]
            }
        }
    ]
};

function updateTicker(content) {
  $('.ticker')
    .prepend(content)

  window.setTimeout(function(){
    $('.ticker div').addClass('expanded')
  },50); 
}

var colors=[
  ['Синий','456E75'],
  ['Зелёный','8F9957'],
  ['Оранжевый','B87C51'],
  ['Красный','B04548'],
  ['Фиолетовый','5C2E58']
];

       //--------GET JSON ---------//
$.get('//ruservis.github.io/addresses.json', function(error, response, data){
  var addresses = data.responseJSON;


  //generate new pickups at regular interval 
//создание новых заявок с регулярным интервалом
  var duration = 2000;
  var newPackage = setInterval(function(){
    var randomIndex = parseInt(Math.random()*addresses.length);
    var queryURL = 'https://api.tiles.mapbox.com/v4/geocode/mapbox.places/' + addresses[randomIndex][1]+'.json?access_token=' + L.mapbox.accessToken;

    $.get(queryURL, function(data){

      pickupPoints.features.push(
        {
          "type": "Feature",
          "properties": {
            "marker-color": "#666",
            "marker-size": "small",
            "marker-symbol": "circle",
            "address": addresses[randomIndex][0],
            "time_submitted":Date.now()
          },
          "geometry": {
            "type": "Point",
            "coordinates": data.features[0]['center']
          }
        }
      )

      updateTicker('<div><strong class="incoming strongpad">★ Новый заказ</strong>  <strong>'+addresses[randomIndex][0]+'</strong> в очереди')
      updatePickups();
    })


  // bind popups to markers, to display addresses 
//cвязывать всплывающие окна с маркерами, отображать адреса
    var lastAddress = pickupPoints.features[pickupPoints.features.length-1]['properties']['address'];
}, duration);

  function setOrderVelocity(ms){
    clearInterval(newPackage);
    duration == ms;
    newPackage
  }


  var bluepath, greenpath, orangepath, redpath, purplepath;
  pickupPoints.features.forEach(function(n){
    n.properties.time_submitted = Date.now()
  })
  var hq =
    {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Point",
            "coordinates": [
          37.62438403,
          55.74971944
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Point",
            "coordinates": [
              55.75725902,
              37.57152557
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Point",
            "coordinates": [
              55.75725902,
              37.63152557
            ]
          }
        }
      ]
    }
  var map = L.mapbox.map('map', 'mapbox.light')
      .setView([55.74971944,37.62438403], 14);
  map.scrollWheelZoom.enable();


  var pickups = L.mapbox.featureLayer().addTo(map);


  //update pickup markers and count
//Обновить маркеры перехвата и подсчитать
  function updatePickups(){
    pickups.setGeoJSON(pickupPoints);
    $('.queue').text(pickupPoints.features.length)
  }

  //draw hq
//Нарисовать hq
  hq.features.forEach(function(n){
    L.marker(
      reverseCoords(n.geometry.coordinates),
      {icon: L.divIcon({
      className: 'hq',
      iconSize: [20, 20],
      html: '<img class="hq" src="dropoff.png">'
      })}
    ).addTo(map);

  })



  //setOrderVelocity(1000000);
  //generate new pickups on user click
//Генерировать новые звукосниматели при нажатии пользователем
  map.on('click', function(e) {
    var coord =  e.latlng.lng+','+e.latlng.lat;
    var geocodeURL='https://api.tiles.mapbox.com/v4/geocode/mapbox.places/'+coord+'.json?access_token=pk.eyJ1IjoicGV0ZXJxbGl1IiwiYSI6ImpvZmV0UEEifQ._D4bRmVcGfJvo1wjuOpA1g'

    $.get(geocodeURL, function(data, err){
      var address = (data.features[0].address+' '+data.features[0].text);
      pickupPoints.features.push(
        {
          "type": "Feature",
          "properties": {
            "marker-color": "#666",
            "marker-size": "small",
            "marker-symbol": "circle",
            "time_submitted":Date.now(),
            "address": address
          },
          "geometry": {
            "type": "Point",
            "coordinates": [e.latlng.lng, e.latlng.lat]
          }
        });
      updatePickups()
      updateTicker('<div><strong class="incoming strongpad" style="background:white">★ ВАШ ЗАКАЗ</strong>  <strong>'+address+'</strong> добавлен в очередь');
      if (soundOn)  document.getElementById('fireball').play()
    })
  });

  //convert decimal minutes into minutes:seconds
// Преобразовать десятичные минуты в минуты: секунды
  function timeConverter(decimal){
    var min = Math.floor(Math.abs(decimal))
    var sec = Math.floor((Math.abs(decimal) * 60) % 60);
    return min + ":" + (sec < 10 ? "0" : "") + sec;
  }

  function createCourier(color){
    var courierPayload = 0

    //courier icon
//Значок курьера
    var courierIcon = L.divIcon({
      className: 'couriericon '+color[0],
      iconSize: [15, 15],
      html:''
    });

    //draw courier
//добавить курьера
    var courier = L.marker(reverseCoords(hq.features[0].geometry.coordinates), {
      icon: courierIcon
    }).addTo(map);

    var courierTarget= L.marker([0,0], {
      icon: L.divIcon({
      className: 'couriertarget '+color[0],
      iconSize: [20, 50],
      html: '<img class="couriertarget" src="https://a.tiles.mapbox.com/v4/marker/pin-s-circle+'+color[1]+'.png?access_token=pk.eyJ1IjoicGV0ZXJxbGl1IiwiYSI6ImpvZmV0UEEifQ._D4bRmVcGfJvo1wjuOpA1g">'
      })
    }).addTo(map);


    function dropoff(currentLocation){
      updateTicker('<div><strong class="strongpad" style="background:#'+color[1]+'"">✓ Выполнено#1</strong> '+color[0]+  ' прибыл на <strong>'+currentLocation.properties.address+'</strong>. В процессе .');

      var nearestDropoff = turf.nearest(currentLocation, hq)
      var endpoints = currentLocation.geometry.coordinates+';'+nearestDropoff.geometry.coordinates;
      var directionsURL='https://api.tiles.mapbox.com/v4/directions/mapbox.cycling/'+endpoints+'.json?access_token='+L.mapbox.accessToken;

      courierTarget.setLatLng(L.latLng(0,0))
      //query directions
      $.get(directionsURL, function(data, err){

        var coords= data.routes[0].geometry.coordinates;
        var processedCoords = coords.map(function(n){return reverseCoords(n)});
        var path = turf.linestring(coords);
        $('.'+color[0]+'path').remove();
        var courierRoute = 
          L.polyline(processedCoords,
            {color: "#"+color[1], className:color[0]+'path'})
            .addTo(map);


        //animate route path
        window.setTimeout(function(){
          $('path').css('stroke-dashoffset',0)
        },400); 

        var tripDuration = (data.routes[0].duration/60).toFixed(0); //duration in minutes
        var tripDistance = data.routes[0].distance; //distance in meters
        var increment = 0;

        var bikingAnimation= setInterval(function(){

          //once the animation is complete, kill animation and fire this function recursively, starting at the current location
          if (increment>tripDuration*1000/pollingInterval) {
            courierPayload=0;

            $('.couriericon.'+color[0]).text(courierPayload);
            clearInterval(bikingAnimation);
            if (soundOn)  document.getElementById('coin').play()
            goToPickup(nearestDropoff)

          }

          //1 SECOND= 60 REAL SECONDS. if the animation is not complete, calculate waypoint for animation and transition there (CSS)
          increment++;
          var waypoint=
          turf.along(path, increment*tripDistance*pollingInterval/(tripDuration*1000*1000), 'kilometers').geometry.coordinates;
          courier.setLatLng(L.latLng(waypoint[1], waypoint[0]))
        }, pollingInterval);

      })
    }






    function goToPickup(currentLocation){

      Array.minIndex = function( array ){
        return array.indexOf(Math.min.apply( Math, array ));
      };

      //distance of each pickup, divided by time elapsed
      var adjustedScores = pickupPoints.features.map(function(n){
        return (
          Math.pow(turf.distance(currentLocation, n, 'miles'),2)/(Date.now()-parseFloat(n.properties['time_submitted'])))
      });



      //identify nearest pickup to the courier, and remove it from the overall list
      var nearestPickupIndex = Array.minIndex(adjustedScores);
      var nearestPickup = pickupPoints.features[nearestPickupIndex];

      pickupPoints.features.splice(nearestPickupIndex,1);
      updatePickups();


      //assemble URL to route from courier's current location to the pickup
      var endpoints = currentLocation.geometry.coordinates+';'+nearestPickup.geometry.coordinates;
      var directionsURL='https://api.tiles.mapbox.com/v4/directions/mapbox.cycling/'+endpoints+'.json?access_token='+L.mapbox.accessToken;

      courierTarget.setLatLng(L.latLng(nearestPickup.geometry.coordinates[1], nearestPickup.geometry.coordinates[0]))

      //query directions
      $.get(directionsURL, function(data, err){

        var coords= data.routes[0].geometry.coordinates;
        var processedCoords = coords.map(function(n){return reverseCoords(n)});
        var path = turf.linestring(coords);
        $('.'+color[0]+'path').remove();
        var courierRoute = 
          L.polyline(processedCoords,
            {color: "#"+color[1], className:color[0]+'path'})
            .addTo(map);


        //animate route path
        window.setTimeout(function(){
          $('path').css('stroke-dashoffset',0)
        },400); 

        var tripDuration=(data.routes[0].duration/60).toFixed(0); //duration in minutes
        var tripDistance=data.routes[0].distance; //distance in meters
        var increment=0;

      if (currentLocation.properties.address) {
        updateTicker('<div><strong class="strongpad" style="background:#'+color[1]+'"">✓ Выполнено#2</strong> '+color[0]+  ' выполнено <strong>'+currentLocation.properties.address+'</strong> направляется <strong>'+nearestPickup.properties.address+'</strong> ('+tripDuration+' min, '+(tripDistance/1609).toFixed(2)+' mi)')
      }

        var bikingAnimation= setInterval(function(){

          //once the animation is complete, kill animation and fire this function recursively, starting at the current location
          if (increment>tripDuration*1000/pollingInterval) {
            courierPayload++
            receivedQuantity++

            responseNumerator += (Date.now() - nearestPickup.properties['time_submitted'])

            $('.retrieved').text(receivedQuantity);
            $('.responsetime').text(timeConverter(responseNumerator/(receivedQuantity*1000)));
            $('.couriericon.'+color[0]).text(courierPayload);
            clearInterval(bikingAnimation);

            if (soundOn) document.getElementById('kick').play()

            //depending on payload, go to next pickup, or drop off
            if (courierPayload<5) goToPickup(nearestPickup)
            else {dropoff(nearestPickup)}

          }

          //1 SECOND= 60 REAL SECONDS. if the animation is not complete, calculate waypoint for animation and transition there (CSS)
          increment++;
          var waypoint=
          turf.along(path, increment*tripDistance*pollingInterval/(tripDuration*1000*1000), 'kilometers').geometry.coordinates;
          courier.setLatLng(L.latLng(waypoint[1], waypoint[0]))
        }, pollingInterval);
      })
    }

    goToPickup(hq.features[0])
  }

  //create couriers
  colors.forEach(function(n){
    createCourier(n)
  })




})
