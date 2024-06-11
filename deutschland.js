/* Karte Deutschland */

// Brandenburger Tor
let BBTor = {
    lat: 52.516389,
    lng: 13.377778,
    title: "BBTor",
};

// Karte initialisieren
let mapde = L.map("mapde").setView([BBTor.lat, BBTor.lng], 15);

// BasemapAT Layer mit Leaflet provider plugin als startLayer Variable
let startLayer = L.tileLayer.provider("Esri.WorldTopoMap");
startLayer.addTo(mapde);

// Maßstab
L.control.scale({
    imperial: false,
}).addTo(mapde);

// Fullscreen
L.control.fullscreen().addTo(mapde);

// Layerauswahl Typ Energie
let themaLayer = {
    solar: L.featureGroup(),
    windOnshore: L.markerClusterGroup({
        disableClusteringAtZoom: 17
    }),
    windOffshore: L.markerClusterGroup({
        disableClusteringAtZoom: 17
    }),
    water: L.markerClusterGroup({
        disableClusteringAtZoom: 17
    }),
    bio: L.markerClusterGroup({
        disableClusteringAtZoom: 17
    })

};

// Hintergrundlayer
L.control.layers({
    "Openstreetmap": L.tileLayer.provider("OpenStreetMap.Mapnik"),
    "Esri WorldTopoMap": L.tileLayer.provider("Esri.WorldTopoMap"),
    "Esri WorldImagery": L.tileLayer.provider("Esri.WorldImagery")
}, {
    "Solarenergie": themaLayer.solar,
    "Windenergie Onshore": themaLayer.windOnshore,
    "Windenergie Offshore": themaLayer.windOffshore,
    "Wasserkraft": themaLayer.water,
    "Biomasse": themaLayer.bio

}).addTo(mapde);

// Import GeoJson Daten Deutschland

// Freiflächen Solar

async function showGeojsonsolar(url) {

    let response = await fetch(url);
    let geojson = await response.json();
    //console.log(geojson);

    L.geoJSON(geojson, {
        style: function (feature) {
            return {
                color: "#F012BE",
                weight: 2,
                opacity: 1,
                fillOpacity: 1

            };
        },

        onEachFeature: function (feature, layer) {
            //console.log(feature);
            layer.bindPopup(`
            <h4> Freiflächenanlage PV </h4>
            <p> Typ: ${feature.properties.TYP}
            <p> Kapazität: ${feature.properties.CAP} kW
            `);
        }
    }).addTo(themaLayer.solar)
};

showGeojsonsolar("/data/solar_angepasst.geojson");

// Windenenergie Onshore

async function showGeojsonwindOnshore(url) {

    let response = await fetch(url);
    let geojson = await response.json();
    //console.log(geojson);

    L.geoJSON(geojson, {
        style: function (feature) {
            return {
                color: "#F012BE",
                weight: 2,
                opacity: 1,
                fillOpacity: 1

            };
        },

        onEachFeature: function (feature, layer) {
            //console.log(feature);
            layer.bindPopup(`
            <h4> Windenergieanlage Onshore </h4>
            <p> System: ${feature.properties.SYS}
            <p> Kapazität: ${feature.properties.CAP} kW
            `);
        }
    }).addTo(themaLayer.windOnshore)
};

showGeojsonwindOnshore("/data/Wind-onshore_angepasst.geojson");

// Windenenergie Offshore

async function showGeojsonwindOffshore(url) {

    let response = await fetch(url);
    let geojson = await response.json();
    //console.log(geojson);

    L.geoJSON(geojson, {
        style: function (feature) {
            return L.marker(latlng, {
                icon: L.icon({
                  iconUrl: "/images/windturbine_offshore.png",
                  iconAnchor: [16, 37],
                  popupAnchor: [0, -37]
                })
              });
        },

        onEachFeature: function (feature, layer) {
            //console.log(feature);
            layer.bindPopup(`
            <h4> Windenergieanlage Offshore </h4>
            <p> System: ${feature.properties.SYS}
            <p> Kapazität: ${feature.properties.CAP} kW
            `);
        }
    }).addTo(themaLayer.windOffshore)
};

showGeojsonwindOffshore("/data/wind_offsore_angepasst.geojson");

// Wasserkraft

async function showGeojsonwater(url) {

    let response = await fetch(url);
    let geojson = await response.json();
    //console.log(geojson);

    L.geoJSON(geojson, {
        style: function (feature) {
            return {
                color: "#F012BE",
                weight: 2,
                opacity: 1,
                fillOpacity: 1

            };
        },

        onEachFeature: function (feature, layer) {
            //console.log(feature);
            layer.bindPopup(`
            <h4> Wasserkraft </h4>
            <p> System: ${feature.properties.SYS}
            <p> Kapazität: ${feature.properties.CAP} kW
            `);
        }
    }).addTo(themaLayer.water)
};

showGeojsonwater("/data/Wasserkraft_angepasst.geojson");

// Biomasse

async function showGeojsonbio(url) {

    let response = await fetch(url);
    let geojson = await response.json();
    console.log(geojson);

    L.geoJSON(geojson, {
        style: function (feature) {
            return {
                color: "#F012BE",
                weight: 2,
                opacity: 1,
                fillOpacity: 1

            };
        },

        onEachFeature: function (feature, layer) {
            console.log(feature);
            layer.bindPopup(`
            <h4> Wasserkraft </h4>
            <p> System: ${feature.properties.SYS}
            <p> Typ: ${feature.properties.TYP}
            <p> Kapazität: ${feature.properties.CAP} kW
            `);
        }
    }).addTo(themaLayer.bio)
};

showGeojsonbio("/data/bioenergy_angepasst.geojson");
