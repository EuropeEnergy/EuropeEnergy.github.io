/* Karte Deutschland */

// Mittelpunkt Deutschlands
let Besse = {
    lat: 51.221944,
    lng: 9.3875,
    title: "Besse",
};

// Karte initialisieren
let mapde = L.map("mapde", { zoomControl: false }).setView([Besse.lat, Besse.lng], 5.5);

// Zoom Control
new L.Control.Zoom({ position: 'bottomleft' }).addTo(mapde);

// Esri WorldImagery Layer mit Leaflet provider plugin als startLayer Variable
let startLayer = L.tileLayer.provider("Esri.WorldImagery");
startLayer.addTo(mapde);

// Maßstab
L.control.scale({
    imperial: false,
    position: 'bottomright'
}).addTo(mapde);

// Fullscreen
L.control.fullscreen({
    position: 'bottomleft'
}).addTo(mapde);

// Layerauswahl Energietyp
let themaLayer = {
    solar: L.featureGroup(),
    windOnshore: L.markerClusterGroup({
        disableClusteringAtZoom: 17,
        iconCreateFunction: function (cluster) {
            return L.divIcon({
                html: `<div style="background-color: #65C8CF; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">${cluster.getChildCount()}</div>`,
                className: 'custom-cluster-icon'
            });
        }
    }),
    windOffshore: L.markerClusterGroup({
        disableClusteringAtZoom: 17,
        iconCreateFunction: function (cluster) {
            return L.divIcon({
                html: `<div style="background-color: #65C8CF; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">${cluster.getChildCount()}</div>`,
                className: 'custom-cluster-icon'
            });
        }
    }),
    water: L.markerClusterGroup({
        disableClusteringAtZoom: 17,
        iconCreateFunction: function (cluster) {
            return L.divIcon({
                html: `<div style="background-color: #8AA2D1; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">${cluster.getChildCount()}</div>`,
                className: 'custom-cluster-icon'
            });
        }
    }),
    bio: L.markerClusterGroup({
        disableClusteringAtZoom: 17,
        iconCreateFunction: function (cluster) {
            return L.divIcon({
                html: `<div style="background-color: #b0a48e; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">${cluster.getChildCount()}</div>`,
                className: 'custom-cluster-icon'
            });
        }
    })
};

// Hintergrundlayer
L.control.layers({
    "Openstreetmap": L.tileLayer.provider("OpenStreetMap.Mapnik"),
    "Esri WorldTopoMap": L.tileLayer.provider("Esri.WorldTopoMap"),
    "Esri WorldImagery": L.tileLayer.provider("Esri.WorldImagery")
}, {
    "Solarenergie": themaLayer.solar.addTo(mapde),
    "Windenergie Onshore": themaLayer.windOnshore,
    "Windenergie Offshore": themaLayer.windOffshore,
    "Wasserkraft": themaLayer.water,
    "Biomasse": themaLayer.bio

}, { collapsed: false }).addTo(mapde);

// Datum Format anpassen
function formatDate(dateString) {
    let parts = dateString.split('-');
    let year = parts[0];
    let month = parts[1];
    let day = parts[2];
    return `${day}.${month}.${year}`;
}

// Import GeoJson Daten Deutschland

// Solaranlagen

async function showGeojsonsolar(url) {
    let response = await fetch(url);
    let geojson = await response.json();

    L.geoJSON(geojson, {
        style: function (feature) {
            return {
                color: '#D0D07B',
                fillColor: '#D0D07B',
                weight: 2,
                opacity: 1,
                fillOpacity: 1
            };
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(`
            <h5> Solarpark </h5>
            <hr>
            <br><strong>Inbetriebnahme:</strong> ${formatDate(feature.properties.COD)}
            <br><strong>Typ:</strong> ${feature.properties.TYP}
            <br><strong>Installierte Leistung:</strong> ${feature.properties.CAP} kW
            <br><strong>Ausrichtung:</strong>${feature.properties.ALG}
            `, { className: 'PopUp_Solar' });
        }
    }).addTo(themaLayer.solar);
}

showGeojsonsolar("/data/solar_angepasst.geojson");

// Windenenergie Onshore

async function showGeojsonwindOnshore(url) {

    let response = await fetch(url);
    let geojson = await response.json();

    L.geoJSON(geojson, {
        pointToLayer: function (feature, latlng) {
            let windonshoreicon = "images/windturbine.png";
            return L.marker(latlng, {
                icon: L.icon({
                    iconUrl: windonshoreicon,
                    iconAnchor: [16, 37],
                    popupAnchor: [0, -37]
                })
            });
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(`
            <h5>Windanlage Onshore</h5>
            <hr>
            <br><strong>Inbetriebnahme:</strong> ${formatDate(feature.properties.COD)}
            <br><strong>Hersteller:</strong> ${feature.properties.SYS}
            <br><strong>Installierte Leistung:</strong> ${feature.properties.CAP} kW
            <br><strong>Anlagenhöhe:</strong> ${feature.properties.HUB} m
            <br><strong>Rotordurchmesser:</strong> ${feature.properties.ROD} m
            `, { className: 'PopUp_Wind' });
        }
    }).addTo(themaLayer.windOnshore);
}

showGeojsonwindOnshore("/data/Wind-onshore_angepasst.geojson");

// Windenenergie Offshore

async function showGeojsonwindOffshore(url) {

    let response = await fetch(url);
    let geojson = await response.json();

    L.geoJSON(geojson, {
        pointToLayer: function (feature, latlng) {
            let windoffshoreicon = "images/windturbine.png";
            return L.marker(latlng, {
                icon: L.icon({
                    iconUrl: windoffshoreicon,
                    iconAnchor: [16, 37],
                    popupAnchor: [0, -37]
                })
            });
        },

        onEachFeature: function (feature, layer) {
            layer.bindPopup(`
            <h5>Windanlage Offshore</h5>
            <hr>
            <br><strong>Inbetriebnahme:</strong> ${formatDate(feature.properties.COD)}
            <br><strong>Hersteller:</strong> ${feature.properties.SYS}
            <br><strong>Installierte Leistung:</strong> ${feature.properties.CAP} kW
            <br><strong>Anlagenhöhe:</strong> ${feature.properties.HUB} m
            <br><strong>Rotordurchmesser:</strong> ${feature.properties.ROD} m
            `, { className: 'PopUp_Wind' });
        }
    }).addTo(themaLayer.windOffshore);
};

showGeojsonwindOffshore("/data/wind_offsore_angepasst.geojson");

// Wasserkraft

async function showGeojsonwater(url) {

    let response = await fetch(url);
    let geojson = await response.json();

    L.geoJSON(geojson, {
        pointToLayer: function (feature, latlng) {
            let watermillicon = "images/watermill.png";
            return L.marker(latlng, {
                icon: L.icon({
                    iconUrl: watermillicon,
                    iconAnchor: [16, 37],
                    popupAnchor: [0, -37]
                })
            });
        },

        onEachFeature: function (feature, layer) {
            layer.bindPopup(`
            <h5>Wasserkraftwerk</h5>
            <hr>
            <br><strong>Inbetriebnahme:</strong> ${formatDate(feature.properties.COD)}
            <br><strong>System:</strong> ${feature.properties.SYS}
            <br><strong>Installierte Leistung:</strong> ${feature.properties.CAP} kW
            `, { className: 'PopUp_Wasser' });
        }
    }).addTo(themaLayer.water)
};

showGeojsonwater("/data/Wasserkraft_angepasst.geojson");

// Biomasse

async function showGeojsonbio(url) {

    let response = await fetch(url);
    let geojson = await response.json();

    L.geoJSON(geojson, {
        pointToLayer: function (feature, latlng) {
            let biomassicon = "images/biomass.png";
            return L.marker(latlng, {
                icon: L.icon({
                    iconUrl: biomassicon,
                    iconAnchor: [16, 37],
                    popupAnchor: [0, -37]
                })
            });
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(`
            <h5>Biomassekraftwerk</h5>
            <hr>
            <br><strong>Inbetriebnahme:</strong> ${formatDate(feature.properties.COD)}
            <br><strong>Typ:</strong> ${feature.properties.TYP}
            <br><strong>Installierte Leistung:</strong> ${feature.properties.CAP} kW
            `, { className: 'PopUp_Bio' });
        }
    }).addTo(themaLayer.bio)
};

showGeojsonbio("/data/bioenergy_angepasst.geojson");

// Landkreise integrieren und Suchfunktion

let highlightedLK

async function showGeojsonLandkreise(url) {
    let response = await fetch(url);
    let geojson = await response.json();
    console.log(geojson);

    let landkreise = L.geoJSON(geojson, {
        style: function (feature) {
            return {
                color: 'transparent',
                fillColor: 'transparent',
                weight: 2,
                opacity: 0,
                fillOpacity: 0
            };
        }
    });

    let searchControl = new L.Control.Search({
        markerLocation: true,
        layer: landkreise,
        propertyName: 'GEN',
        marker: false,
        textPlaceholder: 'Such dir deinen Landkreis',
        textErr: 'Versuchs nochmal',
        collapsed: false,
        position: 'topleft',
        moveToLocation: function (latlng, title, map) {
            var zoom = map.getBoundsZoom(latlng.layer.getBounds());
            map.setView(latlng, zoom);
        }
    });

    searchControl.on('search:locationfound', function (e) {
        // ausgewählter Landkreis zurücksetzen
        if (highlightedLK) {
            landkreise.resetStyle(highlightedLK);
        }
        // Style des gewählten Landkreises
        e.layer.setStyle({ fillColor: 'transparent', color: '#3abfe8', opacity: 0.6, fillOpacity: 0.6 });

        // Aktuell gewählten Landkreis speichern
        highlightedLK = e.layer;
    });

    mapde.addControl(searchControl);
};

showGeojsonLandkreise("/data/landkreise.geojson");