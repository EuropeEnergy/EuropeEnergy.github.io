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
    }).addTo(mapeu)

};


//STYLE-Funktion GEOJSON-Objekt (Einfärbung der einzelnen Länderpolygone)

function style(feature){

    return {
        fillColor: getColor(parseInt(feature.properties.Renewables_and_biofuels)),  //Hier ParseInt da Zahlenwert in JSON als STring gespeichert
        weight: 2,
        opacity: 1,
        color: "white",
        fillOpacity: 1
    };
}


//OnEachFeature Funktion GEOJSON-Objekt (PopUps etc.)

function onEachFeature (feature,layer) {

}



//GetCOLOR Funktion für Angabe der Farbabstufungen (Definition der Klassengrenzen)

function getColor(a) {
    return a <= 15 ? "#c6dbef":
            a <= 20 ? "#9ecae1":
            a <= 25 ? "#6baed6":
            a <= 30 ? "#4292c6":
            a <= 35 ? "#2171b5":
            a <= 40 ? "#08519c":
            a > 40 ? "#08306b":
            "#E8DCCA" }



//LEGENDE für die thematische Karte 

let legend = L.control({position: 'bottomleft'});

legend.onAdd = function (mapeu) {
    
    let div = L.DomUtil.create('div', 'info legend')
    klassen = [0, 15, 20, 25, 30, 35, 40],   //Definition der Klassenabstufungen
    labels = []

    div.innerHTML += "<b>Anteil erneuerbarer Energien <br> am gesamten <br> Bruttoendenergieverbrauch (%) <br><br></b>"

    for (let i = 0; i < klassen.length; i++) {
        let p = klassen[i+1]-1;
        div.innerHTML +=
        '<i style="background:' + getColor(klassen[i] +1) + '"></i>' +
        klassen[i] + (p ? '&ndash;' + p + '<br>': '+');
    }

    div.innerHTML += '<br><br><i style="background:' + "#D8DcE4" + '"></i>' +
    'Europäisches Land, <br> keine Daten verfügbar';

    return div; 

}; 

legend.addTo(mapeu);




//Funktionsaufruf zum Datenabruf

showGeojsonEU("/data/Daten_europa.json");  