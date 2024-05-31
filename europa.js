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


//STYLE-Funktion GEOJSON-Objekt (Einfärbung der einzelnen Länderpolygone)

function style(feature){

    return {
        fillColor: getColor(parseInt(feature.properties.Renewables_and_biofuels)),  //Hier ParseInt da Zahlenwert in JSON als STring gespeichert
        weight: 2,
        opacity: 1,
        color: "white",
        fillOpacity: 0.7
    };
}

//GetCOLOR Funktion für Angabe der Farbabstufungen (Definition der Klassengrenzen)

function getColor(a) {
    return a <= 20 ? "#d8d7e0":
            a <= 30 ? "#b2b1c1":
            a <= 40 ? "#8d8ba4":
            a <= 50 ? "#6a6887":
            a <= 60 ? "#47476b":
            a > 60 ? "#252850":
            "grey";
}

showGeojsonEU("\Daten_europa.json");  //Funktionsaufruf 