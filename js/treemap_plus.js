/**
 * Created by khancode on 3/19/2015.
 */

// sample data array
var sample_data = [
    {"value": 50000, "name": "College of Architecture"},
    {"value": 77500, "name": "College of Computing"},
    {"value": 66716, "name": "College of Engineering"},
    {"value": 54000, "name": "Ivan Allen College"},
    {"value": 55000, "name": "Scheller College of Business"},
    {"value": 43250, "name": "College of Sciences"},
    {"value": 63000, "name": "Multidisciplinary"}
];

// instantiate d3plus
var visualization = d3plus.viz()
    .container("#treemap_plus_container")  // container DIV to hold the visualization
    .data(sample_data)  // data to use with the visualization
    .type("tree_map")   // visualization type
    .id("name")         // key for which our data is unique on
    .size("value")      // sizing of blocks
    .draw();             // finally, draw the visualization!
