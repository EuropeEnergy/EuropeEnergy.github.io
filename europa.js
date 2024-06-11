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

var sidebar = L.control.sidebar('sidebar', {
    position: 'right',
    closeButton: true,
});

mapeu.addControl(sidebar);



//Erstellung eines Musters
let stripePattern = new L.StripePattern({
    weight: 5,
    spaceWeight: 4,
    color: "black",
    spaceColor: "#8A2BE2",
    angle: 45,
    opacity: 1,
});
stripePattern.addTo(mapeu);



//STYLE-Funktion GEOJSON-Objekt (Einfärbung der einzelnen Länderpolygone)

function style(feature) {
if (feature.properties.Renewables_and_biofuels == null) {
    return {
        fillPattern: stripePattern, 
        weight: 2, 
        color: "white"
    };} 

else {
    return {
        fillColor: getColor(parseInt(feature.properties.Renewables_and_biofuels)),  //Hier ParseInt da Zahlenwert in JSON als String gespeichert
        weight: 2,
        opacity: 1,
        color: "white",
        fillOpacity: 1
    };}
}



//OnEachFeature Funktion GEOJSON-Objekt (PopUps etc.)

function onEachFeature(feature, layer) {
    /*layer.on({
        click: function() {sidebar.addTo(mapeu)}
    })*/

    layer.bindPopup(
        `<h4>Land (eng): ${feature.properties.preferred_term}</h4>
    <p>Anteil erneuerbarer Energien am gesamten Bruttoendenergieverbrauch (%): ${feature.properties.Renewables_and_biofuels}`
    )
    layer.on({
        click: ClickOnFeature
    });
}





//DEFINITION DER KLASSEN für GETCOLOR und LEGENDE

klassen = [0, 15, 20, 25, 30, 35, 40];





//GetCOLOR Funktion für Angabe der Farbabstufungen (Definition der Klassengrenzen)

function getColor(a) {
    return a <= klassen[1] ? "#c6dbef" :
        a <= klassen[2] ? "#9ecae1" :
            a <= klassen[3] ? "#6baed6" :
                a <= klassen[4] ? "#4292c6" :
                    a <= klassen[5] ? "#2171b5" :
                        a <= klassen[6] ? "#08519c" :
                            a > klassen[6] ? "#08306b" :
                                "#E8DCCA"
}






//LEGENDE für die thematische Karte 

let legend = L.control({ position: 'bottomleft' });

legend.onAdd = function (mapeu) {

    let div = L.DomUtil.create('div', 'info legend')
    labels = []

    div.innerHTML += "<b>Anteil erneuerbarer Energien <br> am gesamten <br> Bruttoendenergieverbrauch (%) <br><br></b>"

    for (let i = 0; i < klassen.length; i++) {
        let p = klassen[i + 1] - 1;
        div.innerHTML +=
            '<i style="background:' + getColor(klassen[i] + 1) + '"></i>' +
            klassen[i] + (p ? '&ndash;' + p + '<br>' : '+');
    }

    div.innerHTML += '<br><br><i style="background:' + "#E8DCCA" + '"></i>' +
        'Europäisches Land, <br> keine Daten verfügbar';

    return div;

};

legend.addTo(mapeu);




//Funktionsaufruf zum Datenabruf

showGeojsonEU("/data/Daten_Europa.geojson");





//Funktion ClickOnFeature für einzelne Click Events für die Diagrammerstellung
function ClickOnFeature(e) {

    //Öffnen der Sidebar
    sidebar.setContent(`<b>Name des Landes: ${e.target.feature.properties.preferred_term} <br><br> <div id="Diagramm"></div> <br><br> <button id="b1">close</button>`).show();
    document.getElementById('b1').addEventListener('click', function() {
        sidebar.hide();
    })
    

    //Variablen um Werte aus GeoJSON abzugreifen (bzw. aus dem Feature, welches angeklickt wurde) - da String, Umwandlung in Nummer notwendig!
    let Biomasse = parseFloat((e.target.feature.properties.Sustainable_primary_solid_biofuels).replace(',', '.')) 
    + parseFloat((e.target.feature.properties.Charcoal).replace(',', '.')) 
    + parseFloat((e.target.feature.properties.Sustainable_biofuels).replace(',', '.')) 
    + parseFloat((e.target.feature.properties.Sustainable_bioliquids).replace(',', '.')) 
    + parseFloat((e.target.feature.properties.Sustainable_biogases).replace(',', '.')) 
    + parseFloat((e.target.feature.properties.Renewable_municipal_waste).replace(',', '.'));
    
    let Wasserkraft = parseFloat((e.target.feature.properties.Hydro).replace(',', '.'))
    + parseFloat((e.target.feature.properties.Tide_wave_ocean).replace(',','.'));

    let Wind = parseFloat((e.target.feature.properties.Wind).replace(',', '.'));
    let Geothermie = parseFloat((e.target.feature.properties.Geothermal).replace(',', '.'));

    let Sonnenenergie = parseFloat((e.target.feature.properties.Solar_thermal).replace(',', '.'))
    + parseFloat((e.target.feature.properties.Solar_photovoltaic).replace(',','.'));

    let Wärmepumpen = parseFloat((e.target.feature.properties.Ambient_heat_heat_pumps).replace(',', '.'))
    let erneuerbare_Kuehlung = parseFloat((e.target.feature.properties.Renewable_cooling).replace(',', '.'))



    //Anlegen des Arrays, welcher dann für die Diagrammerstellung notwendig ist und an drawChart übergeben wird
    let tabellenbezeichnung = ['Biomasse', 'Wasserkraft', 'Wind', 'Geothermie', 'Sonnenergie', 'Wärmepumpen', 'erneuerbare Kühlung']
    let tabellenwerte = [Biomasse, Wasserkraft, Wind, Geothermie, Sonnenenergie, Wärmepumpen, erneuerbare_Kuehlung]
    
    let diagrammdaten = []

    for (let a=0; a<=tabellenwerte.length; a++) {
        diagrammdaten[a] = [tabellenbezeichnung[a], tabellenwerte[a]]
    }

    //sidebar.open('sidebar')
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(function () {
        drawChart(diagrammdaten)
    });
}






//Funktion für Erstellung eines Google-Chart Diagramms 

function drawChart(diagrammdaten) {
    let data = new google.visualization.DataTable();
    data.addColumn('string', 'Energietyp')
    data.addColumn('number', 'Prozentzahl')
    data.addRows(diagrammdaten)

    var options = {
        title: 'Kategorieanteil an Erneuerbarer Energie (%)',
        pieHole: 0.4,
        slices: {0: {color: '#CD9B1D'}, 1:{color: '#5CACEE'}, 2:{color: '#66CDAA'}, 3:{color: '#FF6347'}, 4:{color: '#EEEE00'}, 5:{color: '#AB82FF'}, 6:{color: '#528B8B'}},
    };

    var chart = new google.visualization.PieChart(document.getElementById('Diagramm'));
    chart.draw(data, options);
}





//