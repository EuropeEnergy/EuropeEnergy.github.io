// INNSBRUCK
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






//Erstellung einer Sidebar für die Karte

let sidebar = L.control.sidebar({
    autopan: false,       
    closeButton: true,    
    container: 'sidebar', 
    position: 'left',     
}) 

//mapeu.addControl(sidebar);
//mapeu.on("click", function(){sidebar.hide()})




//STYLE-Funktion GEOJSON-Objekt (Einfärbung der einzelnen Länderpolygone)

function style(feature){

    return {
        fillColor: getColor(parseInt(feature.properties.Renewables_and_biofuels)),  //Hier ParseInt da Zahlenwert in JSON als String gespeichert
        weight: 2,
        opacity: 1,
        color: "white",
        fillOpacity: 1
    };
}





//OnEachFeature Funktion GEOJSON-Objekt (PopUps etc.)

function onEachFeature (feature, layer) {
/*layer.on({
    click: function() {sidebar.addTo(mapeu)}
})*/

layer.bindPopup(
    `<h4>Land (eng): ${feature.properties.preferred_term}</h4>
    <p>Anteil erneuerbarer Energien am gesamten Bruttoendenergieverbrauch: ${feature.properties.Renewables_and_biofuels}`
)

layer.on({
    click: ClickOnFeature
    }); 
}




//DEFINITION DER KLASSEN für GETCOLOR und LEGENDE

klassen = [0, 15, 20, 25, 30, 35, 40];





//GetCOLOR Funktion für Angabe der Farbabstufungen (Definition der Klassengrenzen)

function getColor(a) {
    return a <= klassen[1] ? "#c6dbef":
            a <= klassen[2] ? "#9ecae1":
            a <= klassen[3] ? "#6baed6":
            a <= klassen[4] ? "#4292c6":
            a <= klassen[5] ? "#2171b5":
            a <= klassen[6] ? "#08519c":
            a > klassen[6] ? "#08306b":
            "#E8DCCA" }






//LEGENDE für die thematische Karte 

let legend = L.control({position: 'bottomleft'});

legend.onAdd = function (mapeu) {
    
    let div = L.DomUtil.create('div', 'info legend')
    labels = []

    div.innerHTML += "<b>Anteil erneuerbarer Energien <br> am gesamten <br> Bruttoendenergieverbrauch (%) <br><br></b>"

    for (let i = 0; i < klassen.length; i++) {
        let p = klassen[i+1]-1;
        div.innerHTML +=
        '<i style="background:' + getColor(klassen[i] +1) + '"></i>' +
        klassen[i] + (p ? '&ndash;' + p + '<br>': '+');
    }

    div.innerHTML += '<br><br><i style="background:' + "#E8DCCA" + '"></i>' +
    'Europäisches Land, <br> keine Daten verfügbar';

    return div; 

}; 

legend.addTo(mapeu);




//Funktionsaufruf zum Datenabruf

showGeojsonEU("/data/Daten_europa.json");  




//Funktion ClickOneFeature 
function ClickOnFeature(e){
 let diagrammdaten = []
 let tabellenbezeichnung = ['Wasserkraft', 'Wind', 'Geothermie']
 let tabellenwerte = [e.feature.properties.Hydro, e.feature.properties.Wind, e.feature.properties.Geothermal]
 diagrammdaten[0] = [tabellenbezeichnung[0], tabellenwerte[0]]
 diagrammdaten[1] = [tabellenbezeichnung[1], tabellenwerte[1]]
 diagrammdaten[2] = [tabellenbezeichnung[2], tabellenwerte[2]]

 google.charts.load('current', {packages: ['corechart']});
 google.charts.setOnLoadCallback(function() {
    drawChart(diagrammdaten)});
}





//Funktion für Erstellung eines Diagramms 

/*
        google.charts.load('current', {packages: ['corechart']});
        google.charts.setOnLoadCallback(drawChart);
        */


/*function drawChart() {
    let data = new google.visualization.DataTable();
    data.addColumn('string', 'Energietyp')
    data.addDataColumn('number', 'Prozentzahl')
    data.addRows([])
}*/