// Innsbruck
let ibk = {
    lat: 47.267222,
    lng: 11.392778
};

// Karte initialisieren
let mapeu = L.map("mapeu", {
    fullscreenControl: true
}).setView([ibk.lat, ibk.lng], 5);

// Hintergrundlayer
let layerControl = L.control.layers({
    "Openstreetmap": L.tileLayer.provider("OpenStreetMap.Mapnik"),
    "Esri WorldTopoMap": L.tileLayer.provider("Esri.WorldTopoMap").addTo(mapeu),
    "Esri WorldImagery": L.tileLayer.provider("Esri.WorldImagery")
}).addTo(mapeu);

// Maßstab
L.control.scale({
    imperial: false,
}).addTo(mapeu);


//DATENIMPORT GEOJSON EUROPA-DATEN

async function showGeojsonEU(url) {
    let response = await fetch(url);
    let geojson = await response.json();


//ERSTELLUNG LEAFLET GEOJSON OBJEKT

    L.geoJSON(geojson, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map)

};

showGeojsonEU("\Daten_europa.json");  //Funktionsaufruf 