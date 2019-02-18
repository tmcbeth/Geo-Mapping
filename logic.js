// Store our API endpoint inside queryUrl

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

var queryFaultUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"




// Create circles

var earthquakeMarkers = [];

d3.json(queryUrl, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    console.log("Earthquake Data", data.features);
    console.log("Earthquake long", data.features[0].geometry.coordinates[0]);
    console.log("Earthquake map", data.features[0].properties.mag);

    // function getColor(d) {
    //     return d > 150000000 ? '#99000d' :
    //       d > 100000000 ? '#cb181d' :
    //         d > 50000000 ? '#ef3b2c' :
    //           d > 25000000 ? '#fb6a4a' :
    //             d > 10000000 ? '#fc9272' :
    //               d > 5000000 ? '#fcbba1' :
    //                 d > 1000000 ? '#fee0d2' :
    //                   '#fff5f0';
    // }
    
    function markerSize(size) {
        return (size * 10000000);
      }

    for (var i = 0; i < data.features.length; i++) {
        earthquakeMarkers.push(
            L.circle([data.features[i].geometry.coordinates[0],data.features[i].geometry.coordinates[1]], {
                fillOpacity: 1,
                color: "blue",
                fillColor: "blue",
                radius: markerSize(data.features[i].properties.mag)
            }).bindPopup("<h3>" + data.features[i].properties.place +
                "</h3><hr><h2>" + data.features[i].properties.mag + "</h2><hr><p>" + new Date(data.features[i].properties.time) + "</p>")
        );
    };
});


console.log("earthquakemarkers:", earthquakeMarkers);

// Fault Lines

var faultLines = [];


d3.json(queryFaultUrl, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    console.log("Faultline Data", data.features);

    for (var i = 0; i < data.features.length; i++) {
        faultLines.push(
            L.polyline(data.features[i].geometry.coordinates, {
                color: "yellow",
            })
        );
    };
});


var earthquakeLayer = L.layerGroup(earthquakeMarkers);
var faultLineLayer = L.layerGroup(faultLines);

    // Define streetmap and darkmap layers
  var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });


  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });
    
  var outdoorsmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Satellite": satellitemap,
    "Dark": darkmap,
    "Outdoors": outdoorsmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
      Earthquakes: earthquakeLayer,
      "Fault Lines": faultLineLayer,
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 3,
    layers: [satellitemap, earthquakeLayer]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);