//TODO: 4. Go to Dev Portal and grab codes

const hereCredentials = {
   id: 'UQ75LhFcnAv0DtOUwBEA',
   code: 'f5nyezNmYF4wvuJqQgNSkg'
}

//TODO: 5. Get Map Tile Url from dev poral
const hereTileUrl = `https://2.base.maps.api.here.com/maptile/2.1/maptile/newest/reduced.day/{z}/{x}/{y}/512/png8?app_id=${hereCredentials.id}&app_code=${hereCredentials.code}&ppi=320`;

//TODO 6: Initialize map
const map = L.map('map', {
   center: [52.368707, 4.922624],
   zoom: 10,
   layers: [L.tileLayer(hereTileUrl)],
   zoomControl: false
});


//TODO: 7: Play around with map styles
//normal.day
//reduced.day
//reduced.night

//TODO 8: add data url from XYZ Space with fetch

function makeGeocodeUrl(query) {
   return `https://geocoder.api.here.com/6.2/geocode.json?app_id=${hereCredentials.id}&app_code=${hereCredentials.code}&searchtext=${query}`;
}

function makeRoutingUrl(start, end) {
   return `https://route.api.here.com/routing/7.2/calculateroute.json?app_id=${hereCredentials.id}&app_code=${hereCredentials.code}&waypoint0=geo!${start}&waypoint1=geo!${end}&mode=fastest;car;traffic:disabled&routeattributes=shape`
}



const dataUrl = `https://xyz.api.here.com/hub/spaces/Su8JAjZh/search?limit=5000&access_token=AUKZJX9yMyq6dsikSBTnx_8`
fetch(dataUrl).then(dataRes => dataRes.json()).then(dataRes => {
   console.log(dataRes)
   const geoJsonLayer = L.geoJSON(dataRes).addTo(map);

   //TODO 9: add map click to get coordinates
   map.on('click', (q) => {
      const endCoordinates = [q.latlng.lat, q.latlng.lng];
      const search = document.querySelector('#search').value;



      //TODO 10: add geocoder url

      //TODO 11: geocode request
      fetch(makeGeocodeUrl(search)).then(geocodeRes => geocodeRes.json()).then(geocodeRes => {

         console.log(geocodeRes)
         let startCoordinates = geocodeRes.Response.View[0].Result[0].Location.NavigationPosition[0];
         startCoordinates = [startCoordinates.Latitude, startCoordinates.Longitude]


         //TODO 12: make Routing request Url

         //TODO: 13: make routing rquest
         fetch(makeRoutingUrl(startCoordinates, endCoordinates)).then(routingRes => routingRes.json()).then(routingRes => {
            const shape = routingRes.response.route[0].shape.map(x => x.split(","))
            const poly = L.polyline(shape).addTo(map)
            //TODO 14: add to map

         })
      })
   })

})
