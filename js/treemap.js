/**
 * Created by khancode on 3/19/2015.
 */

var margin = {top: 40, right: 10, bottom: 10, left: 10},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var color = d3.scale.category20c();

var treemap = d3.layout.treemap()
    .size([width, height])
    .sticky(true)
    .value(function(d) { return d.size; });

var div = d3.select("#treemap_container").append("div")
    .style("position", "relative")
    .style("width", (width + margin.left + margin.right) + "px")
    .style("height", (height + margin.top + margin.bottom) + "px")
    .style("left", margin.left + "px")
    .style("top", margin.top + "px");

d3.json("json/college_median_salary.json", function(error, root) {
    var node = div.datum(root).selectAll(".node")
        .data(treemap.nodes)
        .enter().append("div")
        .attr("class", "node")
        .call(position)
        .style("background-color", function(d) {
            return d.name == 'tree' ? '#fff' : color(d.name); })
        //.style("background", function(d) { return d.children ? color(d.name) : null; })
        .text(function(d) { return d.children ? null : d.name; });

    d3.selectAll("input").on("change", function change() {
        var value = this.value === "count"
            ? function() { return 1; }
            : function(d) { return d.size; };

        node
            .data(treemap.value(value).nodes)
            .transition()
            .duration(1500)
            .call(position)
            .style("background-color", function(d) {
                return d.name == 'tree' ? '#fff' : color(d.name); })
            .append('div')
            .style("font-size", function(d) {
                // compute font size based on sqrt(area)
                return Math.max(20, 0.18*Math.sqrt(d.area))+'px'; })
            .text(function(d) { return d.children ? null : d.name; });
    });

    /* Omar wrote this */
    var str = $(".node").click(function() {
        //alert( "Handler for .click() called." );
        //alert($(this).text());

        //var backgroundColor = $(this).css("background-color");
        //alert("bgcolor: " + backgroundColor);

        //$(this).css('background-color', 'yellow');


        var college = $(this).text();
        //nodes[college] = $
        var backgroundColor = $(this).css("background-color");
        if (college in nodes) {
            console.log("it does exist buddy :D");
            $(this).css('background-color', nodes[college]);

            $("#selected_colleges").append(college);
        }
        else {
            console.log("it doesn't exist :(");
            $(this).css('background-color', 'yellow');
            nodes[college] = backgroundColor;
        }

        alert('data: ' + data);
        data.push({name:college});

        //rawr.colleges = data;
        rawr.$apply(function() {
            rawr.colleges = data;
        })
    });
});

function position() {
    this.style("left", function(d) { return d.x + "px"; })
        .style("top", function(d) { return d.y + "px"; })
        .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
        .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
}


var nodes = {};