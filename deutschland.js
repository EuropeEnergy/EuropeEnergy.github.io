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

// BasemapAT Layer mit Leaflet provider plugin als startLayer Variable
let startLayer = L.tileLayer.provider("Esri.WorldTopoMap");
startLayer.addTo(mapde);

// Maßstab
L.control.scale({
    imperial: false,
    position: 'bottomright'
}).addTo(mapde);

// Fullscreen
L.control.fullscreen({
    position: 'bottomright'
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
    "Solarenergie": themaLayer.solar,
    "Windenergie Onshore": themaLayer.windOnshore,
    "Windenergie Offshore": themaLayer.windOffshore,
    "Wasserkraft": themaLayer.water,
    "Biomasse": themaLayer.bio

}, { collapsed: false }).addTo(mapde);

// Import GeoJson Daten Deutschland

// Solaranlagen

async function showGeojsonsolar(url) {
    let response = await fetch(url);
    let geojson = await response.json();
    // console.log(geojson);

    L.geoJSON(geojson, {
        style: function (feature) {
            return {
                color: '#D0D07B', // Außenlinienfarbe
                fillColor: '#D0D07B', // Füllfarbe
                weight: 2,
                opacity: 1,
                fillOpacity: 0.5
            };
        },
        onEachFeature: function (feature, layer) {
            // console.log(feature);
            layer.bindPopup(`
            <h5> Solarpark </h5>
            <hr>
            <p> Inbetriebnahme: ${feature.properties.COD}
            <br> Typ: ${feature.properties.TYP}
            <br> Installierte Leistung: ${feature.properties.CAP} kW
            <br> Ausrichtung: ${feature.properties.ALG}
            `, { className: 'PopUp_Solar' });
        }
    }).addTo(themaLayer.solar);
}

showGeojsonsolar("/data/solar_angepasst.geojson");


// Windenenergie Onshore

async function showGeojsonwindOnshore(url) {

    let response = await fetch(url);
    let geojson = await response.json();
    //console.log(geojson);

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
            //console.log(feature);
            layer.bindPopup(`
            <h5> Windanlage Onshore </h5>
            <hr>
            <p> Inbetriebnahme: ${feature.properties.COD}
            <br> System: ${feature.properties.SYS}
            <br> Installierte Leistung: ${feature.properties.CAP} kW
            <br> Anlagenhöhe: ${feature.properties.HUB}
            <br> Rotordurchmesser: ${feature.properties.ROD}
            `, { className: 'PopUp_Wind' });
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
            <h5> Windanlage Onshore </h5>
            <hr>
            <p> Inbetriebnahme: ${feature.properties.COD}
            <br> System: ${feature.properties.SYS}
            <br> Installierte Leistung: ${feature.properties.CAP} kW
            <br> Anlagenhöhe: ${feature.properties.HUB}
            <br> Rotordurchmesser: ${feature.properties.ROD} 
            `, { className: 'PopUp_Wind' });
        }
    }).addTo(themaLayer.windOffshore);
};

showGeojsonwindOffshore("/data/wind_offsore_angepasst.geojson");

// Wasserkraft

async function showGeojsonwater(url) {

    let response = await fetch(url);
    let geojson = await response.json();
    //console.log(geojson);

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
            //console.log(feature);
            layer.bindPopup(`
            <h5> Wasserkraft </h5>
            <hr>
            <p> Inbetriebnahme: ${feature.properties.COD}
            <br> System: ${feature.properties.SYS}
            <br> Installierte Leistung: ${feature.properties.CAP} kW
            `, { className: 'PopUp_Wasser' });
        }
    }).addTo(themaLayer.water)
};

showGeojsonwater("/data/Wasserkraft_angepasst.geojson");

// Biomasse

async function showGeojsonbio(url) {

    let response = await fetch(url);
    let geojson = await response.json();
    //console.log(geojson);

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
            // console.log(feature);
            layer.bindPopup(`
            <h5> Biomasse </h5>
            <hr>
            <p> Inbetriebnahme: ${feature.properties.COD}
            <br> Typ: ${feature.properties.TYP}
            <br> Installierte Leistung: ${feature.properties.CAP} kW
            `, { className: 'PopUp_Bio' });
        }
    }).addTo(themaLayer.bio)
};

showGeojsonbio("/data/bioenergy_angepasst.geojson");

// Landkreise integrieren und Suchfunktion

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
            //map.fitBounds( latlng.layer.getBounds() );
            var zoom = map.getBoundsZoom(latlng.layer.getBounds());
            map.setView(latlng, zoom);
        }
    });

    searchControl.on('search:locationfound', function (e) {
        // Stil des gefundenen Features anpassen
        e.layer.setStyle({ fillColor: 'transparent', color: '#3abfe8', opacity: 0.6, fillOpacity: 0.6 });
    });

    mapde.addControl(searchControl);

    //document.querySelector('.leaflet-control-search').classList.add('suchleiste-position');
};

showGeojsonLandkreise("/data/landkreise.geojson");