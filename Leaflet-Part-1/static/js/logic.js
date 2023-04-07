// Store api endpoint as queryurl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
  });
  
  function createFeatures(earthquakeData) {

    

  // Give each feature a popup that describes the place, magnitude, and depth of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}<br>Depth: ${feature.geometry.coordinates[2]} km</p>`);
  }
  //Define a function for markersize based on magnitude
  function markerSize(mag) {
    return mag*4;
  }
  // Define a function to set the marker style based on magnitude and depth coordinates
  function markerStyle(feature) {
    var depth = feature.geometry.coordinates[2];
    var fillColor;
    if (depth < 10) {
        fillColor = "green";
    } else if (depth < 20) {
        fillColor = "greenyellow";
    } else if (depth < 30) {
        fillColor = "yellow";
    } else if (depth < 40) {
        fillColor = "lightsalmon";
    } else if (depth < 50) {
        fillColor = "orange";
    } else {
        fillColor = "red";
    }
    
    return {
        radius: markerSize(feature.properties.mag),
        fillColor: fillColor,
        color: "black",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.6
    };
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, markerStyle(feature));
    }
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}


function createMap(earthquakes) {

  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
      39.82, -98.57
    ],
    zoom: 4.5,
    layers: [street, earthquakes]
  });

  
  // Define an object that maps depth ranges to colors.
  var depthColors = {
    "<10 km": "green",
    "10-20 km": "greenyellow",
    "20-30 km": "yellow",
    "30-40 km": "lightsalmon",
    "40-50 km": "orange",
    ">50 km": "red"
  };

  // Create a legend control that displays the depth ranges and corresponding colors.
  var legend = L.control({position: "bottomright"});
  legend.onAdd = function(map) {
    var div = L.DomUtil.create("div", "info legend");
    div.innerHTML += "<h4>Depth (km)</h4>";
    for (var depthRange in depthColors) {
      div.innerHTML +=
        '<i style="background:' +
        depthColors[depthRange] +
        '"></i> ' +
        depthRange +
        '<br>';
    }
    return div;
  };
  legend.addTo(myMap);

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}







































