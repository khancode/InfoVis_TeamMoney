/**
 * Created by khancode on 4/6/2015.
 */

// sample data array
var sample_data = [
    {"year": 1991, "name":"alpha", "value": 17},
    {"year": 1992, "name":"alpha", "value": 20},
    {"year": 1993, "name":"alpha", "value": 25},
    {"year": 1994, "name":"alpha", "value": 33},
    {"year": 1995, "name":"alpha", "value": 52},
    {"year": 1991, "name":"beta", "value": 36},
    {"year": 1992, "name":"beta", "value": 32},
    {"year": 1993, "name":"beta", "value": 40},
    {"year": 1994, "name":"beta", "value": 58},
    {"year": 1995, "name":"beta", "value": 13},
    {"year": 1991, "name":"gamma", "value": 24},
    {"year": 1992, "name":"gamma", "value": 27},
    {"year": 1994, "name":"gamma", "value": 35},
    {"year": 1995, "name":"gamma", "value": 40}
];

// instantiate d3plus
var visualization = d3plus.viz()
    .container("#time_series_container")  // container DIV to hold the visualization
    .data(sample_data)  // data to use with the visualization
    .type("line")       // visualization type
    .id("name")         // key for which our data is unique on
    .text("name")       // key to use for display text
    .y("value")         // key to use for y-axis
    .x("year")          // key to use for x-axis
    .draw();            // finally, draw the visualization!