/* Vienna Sightseeing Beispiel */

// Stephansdom Objekt
let BBTor = {
    lat: 52.51943952665335,
    lng: 3.38937309608342,
    title: "BBTor",
  };
  
  // Karte initialisieren
  let mapde = L.map("mapde").setView([BBTor.lat, BBTor.lng], 15);

// BasemapAT Layer mit Leaflet provider plugin als startLayer Variable
let startLayer = L.tileLayer.provider("BasemapAT.grau");
startLayer.addTo(mapde);

// Hintergrundlayer
L.control
  .layers({
    "BasemapAT Grau": startLayer,
    "BasemapAT Standard": L.tileLayer.provider("BasemapAT.basemap"),
    "BasemapAT High-DPI": L.tileLayer.provider("BasemapAT.highdpi"),
    "BasemapAT Gelände": L.tileLayer.provider("BasemapAT.terrain"),
    "BasemapAT Oberfläche": L.tileLayer.provider("BasemapAT.surface"),
    "BasemapAT Orthofoto": L.tileLayer.provider("BasemapAT.orthofoto"),
    "BasemapAT Beschriftung": L.tileLayer.provider("BasemapAT.overlay"),
    "OpenSnowMap": L.tileLayer.provider("OpenSnowMap.pistes"),
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


