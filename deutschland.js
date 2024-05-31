/* Vienna Sightseeing Beispiel */

// Stephansdom Objekt
let BBTor = {
    lat: 52.516389,
    lng: 13.377778,
    title: "BBTor",
};

// Karte initialisieren
let mapde = L.map("mapde").setView([BBTor.lat, BBTor.lng], 15);

// Hintergrundlayer
let layerControl = L.control.layers({
    "Openstreetmap": L.tileLayer.provider("OpenStreetMap.Mapnik"),
    "Esri WorldTopoMap": L.tileLayer.provider("Esri.WorldTopoMap"),
    "Esri WorldImagery": L.tileLayer.provider("Esri.WorldImagery").addTo(mapde)
}).addTo(mapde);

// Maßstab
L.control
    .scale({
        imperial: false,
    })
    .addTo(mapde);

L.control
    .fullscreen()
    .addTo(mapde);


