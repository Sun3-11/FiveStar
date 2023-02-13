
//'pk.eyJ1Ijoic2hhbXMzIiwiYSI6ImNsZHVrcXVsYjAwcjUzb3FudTJodW1tbWEifQ.K0H7lYpN2APnjQkoZ6iP2w';
//const goodPlaceground = JSON.parse(placeground);
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/light-v10',  //streets-v12 // style URL
center: placeground.geometry.coordinates,  // starting position [lng, lat]
zoom: 10, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
    .setLngLat(placeground.geometry.coordinates)
    .setPopup(
       new mapboxgl.Popup({offset: 25})
       .setHTML(
           `<h3>${placeground.title}</h3><p>${placeground.location}`
        ) 
     )
    .addTo(map)