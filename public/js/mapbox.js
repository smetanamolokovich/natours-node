/* eslint-disable */
import '@babel/polyfill';

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoibWFzdGVyd29yazMzIiwiYSI6ImNrYnhobzgzcjBxM2wycHRieTR2NjQyOTIifQ.EdXmodnqsqTgen27EaOYrw';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/masterwork33/ckbxhtbr10lna1imnrwyftehb',
    scrollZoom: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    const el = document.createElement('div');
    el.className = 'marker';

    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
