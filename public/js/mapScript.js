mapboxgl.accessToken = mapToken

const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: list.geometry.coordinates,  // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 10 // starting zoom
});

//marker on map
new mapboxgl.Marker({ color: 'red' }).setLngLat(list.geometry.coordinates).setPopup(
    new mapboxgl.Popup({ offset: 25 }) // add popup with 25 pixel offset
        .setHTML(   
            `<h4>${list.title}</h4><p>${list.location}</p>`
        )
).addTo(map);
// console.log(list);

