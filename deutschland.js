/* Vienna Sightseeing Beispiel */

// Stephansdom Objekt
let BBTor = {
    lat: 52.516389,
    lng: 13.377778,
    title: "BBTor",
};

// Karte initialisieren
let mapde = L.map("mapde").setView([BBTor.lat, BBTor.lng], 15);

// Layerauswahl Typ Energie
let themaLayer = {
    solar: L.featureGroup().addTo(mapde),
    windOnshore: L.featureGroup().addTo(mapde),
    windOffshore: L.featureGroup().addTo(mapde),
    water: L.featureGroup().addTo(mapde),
    bio: L.markerClusterGroup({
        disableClusteringAtZoom: 17
    }).addTo(mapde),

};

// Maßstab
L.control
    .scale({
        imperial: false,
    })
    .addTo(mapde);

// Fullscreen
L.control
    .fullscreen()
    .addTo(mapde);

// Hintergrundlayer
let layerControl = L.control.layers({
    "Openstreetmap": L.tileLayer.provider("OpenStreetMap.Mapnik"),
    "Esri WorldTopoMap": L.tileLayer.provider("Esri.WorldTopoMap"),
    "Esri WorldImagery": L.tileLayer.provider("Esri.WorldImagery").addTo(mapde)
}, {
    "Solarenergie": themaLayer.solar,
    "Windenergie Onshore": themaLayer.windOnshore,
    "Windenergie Offshore": themaLayer.windOffshore,
    "Wasserkraft": themaLayer.water,
    "Biomasse": themaLayer.bio

  })
  .addTo(mapde);



// Import GeoJson Daten Deutschland

async function showGeojsonsolar(url) {
    let response = await fetch(url);
    let geojson = await response.json();

    L.geoJSON(geojson, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(mapde)
};

showGeojsonsolar("/data/solar_angepasst.geojson");


