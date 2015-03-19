/**
 * Created by khancode on 3/17/2015.
 */

//##############    1    ####################
//Setting the size of our canvas
var width = 780;
var height = 460;

//Setting our x and y axes
//RangeRoundBands returns the band width. Decimal value is the padding
//Range provides the band height (because of the inverted values).
var x = d3.scale.ordinal().rangeRoundBands([0, width], 0.1);
var y = d3.scale.linear().range([height, 0]);

//d3.select("body").append("h1").html("My beautiful text")

//Creating our chart and grabbing attributes from ".chart" in header
var chart = d3.select("#treemap")
    .attr("width", width)
    .attr("height", height);


//##############    2    ####################
//Pulling data from .json file
d3.json("json/State-Example.json", function(error, data){

    //Set our scale domains
    //data.map creates a new array with the result of a function of every element in the array
    x.domain(data.map(function(d) { return d.state; }));
    y.domain([0, d3.max(data, function(d) { return d.value; })]);

    var y_translate = 50;
    /* Talk about this later */


    //##############    3    ####################
    //Grabbing data and binding it to the bars
    //"G" groups all the svg elements together
    var bar = chart.selectAll("g")
        .data(data)
        .enter()
        .append("g")
        .attr("transform", function(d) { return "translate("+ x(d.state) +",0)"; });
    // Translate arranges all the "g" elements on the X axis.
    // Without the translate, all the groups would be drawn at the same position

    //Logging data to the console so we can make sure the data is bound
    console.log(data);


    //##############    4    ####################
    //Generating rectangle SVG elements for our data
    bar.append("rect")
        .attr("y", function(d) { return y(d.value); }) // Setting the Y position of individual bars based on the data
        .attr("height", function(d) { return height - y_translate - y(d.value); }) // At the chosen Y position, we're now specifying height.
        .attr("width", x.rangeBand())

        .style("fill", function(d){
            if(d.value > 30){
                return "#00CC33";
            }
            else{
                return "steelblue";
            }
        });
    // We're now specifying a different color for the bar based on the value


    //##############    5    ####################
    //Adding y labels to our bars
    bar.append("text")
        .attr("x", x.rangeBand() / 2)
        .attr("y", function(d) { return y(d.value) + 3; })
        .attr("dy", ".75em")
        .text(function(d) { return d.value; });

    //Adding x labels to our bars
    bar.append("text")
        .attr("class", "xText")
        .attr("x", x.rangeBand() / 2)
        .attr("y", height - y_translate + 5)
        .attr("dy", ".75em")
        .text(function(d) { return d.state; });

});