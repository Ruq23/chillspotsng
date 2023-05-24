mapboxgl.accessToken = 'pk.eyJ1IjoicnVxMjAiLCJhIjoiY2xodWdnODBkMDd6cjNscG9id2tqdTZ1ZiJ9.w36tMHtCVDXeZCu-Q6nFkw';
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v12', // style URL
  center: spot.geometry.coordinates, // starting position [lng, lat]
  zoom: 12, // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(spot.geometry.coordinates)
    .setPopup(
      new mapboxgl.Popup({offset: 25})
      .setHTML(
        `<h3>${spot.name}</h3> <p>${spot.address} ${spot.location}</p>`
      )
    )
    .addTo(map);