/**
 * 85% of code is original and not copied in this file
 */

$scatter_animation = new ScatterAnimation();
$scatter_animation.draw();

function ScatterAnimation() {

    var dataset;
    var xScale;
    var yScale;
    var xAxis;
    var yAxis;
    var svg;
    var tip;

    var allData;

    this.draw = function() {

        d3.json("json/all_data.json", function (error, data) {

            allData = data;
            dataset = filterData();

            doIt();
        });

        // This function code is copied
        function doIt() {
            // Setup settings for graphic
            var canvas_width = $('#scatter_plot_container').width();//700;
            var canvas_height = $('#scatter_plot_container').height(); //350;
            var padding = 30;  // for chart edges

            // Create scale functions
            xScale = d3.scale.linear()  // xScale is width of graphic
                .domain([0, d3.max(dataset, function (d) {
                    //return d[0];  // input domain
                    return d['Placement Rate'];  // input domain
                })])
                .range([padding, canvas_width - padding * 2]); // output range

            yScale = d3.scale.linear()  // yScale is height of graphic
                .domain([0, d3.max(dataset, function (d) {
                    //return d[1];  // input domain
                    return d['Median Overall Salary'];  // input domain
                })])
                .range([canvas_height - padding, padding]);  // remember y starts on top going down so we flip

            // Define X axis
            xAxis = d3.svg.axis()
                .scale(xScale)
                .orient("bottom")
                .ticks(10);

            // Define Y axis
            yAxis = d3.svg.axis()
                .scale(yScale)
                .orient("left")
                .ticks(5);

            /* OMAR TOOLTIP */
            tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {

                    var toolTipText = d['College'] + '<br>' +
                                      '<span style="color:lightblue">Median Overall Salary:</span> $' + Math.round(d['Median Overall Salary']) + '<br>' +
                                      '<span style="color:lightblue">Employment Rate:</span> ' + Math.round(d['Placement Rate']) + '%<br>' +
                                      '<span style="color:lightblue">Offer Rate:</span> ' + Math.round(d['Offer Rate']) + '%';

                    return toolTipText;
                });

            // Create SVG element
            svg = d3.select("#scatter_plot_container")  // This is where we put our vis
                .append("svg")
                .attr("width", canvas_width)
                .attr("height", canvas_height);

            svg.call(tip);

            var color = d3.scale.category10();

            // Create Circles
            svg.selectAll("circle")
                .data(dataset)
                .enter()
                .append("circle")  // Add circle svg
                .attr("cx", function (d) {
                    //return xScale(d[0]);  // Circle's X
                    return xScale(d['Placement Rate']);  // Circle's X
                })
                .attr("cy", function (d) {  // Circle's Y
                    //return yScale(d[1]);
                    return yScale(d['Median Overall Salary']);
                })
                .attr("r", 10)  // radius
                .style("fill", function (d) {
                    //return color(d.species);
                    return $index.getCollegeColor(d['College']);
                })
                .on("mouseover", tip.show)
                .on("mouseout", tip.hide);

            // Add to X axis
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + (canvas_height - padding) + ")")
                .call(xAxis)
                .append("text")
                .attr("class", "label")
                .attr("x", canvas_width - 50)
                .attr("y", -6)
                .style("text-anchor", "end")
                .text("Employment Rate (%)");

            // Add to Y axis
            svg.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + padding + ",0)")
                .call(yAxis)
                .append("text")
                .attr("class", "label")
                .attr("transform", "rotate(-90)")
                .attr("x", -25)
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Salary ($)");

        }

    };

    this.update = function(collegeFilter) {

        dataset = filterData();

        // Update scale domains
        xScale.domain([0, d3.max(dataset, function (d) {
            //return d[0];
            return d['Placement Rate'];
        })]);
        yScale.domain([0, d3.max(dataset, function (d) {
            //return d[1];
            return d['Median Overall Salary'];
        })]);

        if (collegeFilter)
        {
            var circle = svg.selectAll("circle")
                .data(dataset);

            myEnter();
            myExit();
        }
        else {
            // Update circles
            svg.selectAll("circle")
                .data(dataset)  // Update with new data
                .transition()  // Transition from old to new
                .duration(2000)  // Length of animation
                .each("start", function () {  // Start animation
                    d3.select(this)  // 'this' means the current element
                        .attr("fill", "red")  // Change color
                        .attr("r", 5);  // Change size
                })
                .delay(function (d, i) {
                    return i / dataset.length * 500;  // Dynamic delay (i.e. each item delays a little longer)
                })
                //.ease("linear")  // Transition easing - default 'variable' (i.e. has acceleration), also: 'circle', 'elastic', 'bounce', 'linear'
                .attr("cx", function (d) {
                    //return xScale(d[0]);  // Circle's X
                    return xScale(d['Placement Rate']);  // Circle's X
                })
                .attr("cy", function (d) {
                    //return yScale(d[1]);  // Circle's Y
                    return yScale(d['Median Overall Salary']);  // Circle's Y
                })
                .each("end", function () {  // End animation
                    d3.select(this)  // 'this' means the current element
                        .transition()
                        .duration(500)
                        .attr("fill", "black")  // Change color
                        .attr("r", 10);  // Change radius
                });

            // Update X Axis
            svg.select(".x.axis")
                .transition()
                .duration(2000)
                .call(xAxis);

            // Update Y Axis
            svg.select(".y.axis")
                .transition()
                .duration(100)
                .call(yAxis);
        }

        function myEnter() {

            var circlesHashMap = {}
            for (var i in dataset)
                circlesHashMap[dataset[i]['College']] = true; // add filtered colleges

            $('#scatter_plot_container svg circle').each(function () {

                var circleColor = $(this).css('fill');
                var college = $index.getCollegeFromColor(rgb2hex(circleColor).toUpperCase());

                for (var i in circlesHashMap) {
                    if (college in circlesHashMap)
                        delete circlesHashMap[college];
                }

            });

            if ($.isEmptyObject(circlesHashMap) == false) {

                svg.selectAll("circle").remove();

                // Create Circles
                svg.selectAll("circle")
                    .data(dataset)
                    .enter()
                    .append("circle")  // Add circle svg
                    .attr("cx", function (d) {
                        return xScale(d['Placement Rate']);  // Circle's X
                    })
                    .attr("cy", function (d) {  // Circle's Y
                        return yScale(d['Median Overall Salary']);
                    })
                    .attr("r", 10)  // radius
                    .style("fill", function (d) {
                        return $index.getCollegeColor(d['College']);
                    })
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide);

                // Update X Axis
                svg.select(".x.axis")
                    .transition()
                    .duration(2000)
                    .call(xAxis);

                // Update Y Axis
                svg.select(".y.axis")
                    .transition()
                    .duration(100)
                    .call(yAxis);
            }

        }

        function myExit()
        {
            // jQuery magic
            $('#scatter_plot_container svg circle').each(function () {

                var circleColor = $(this).css('fill');

                var college = $index.getCollegeFromColor(rgb2hex(circleColor).toUpperCase());

                if ($employment_filter.isExcluded(college))
                    $(this).remove();

            });

        }

        //Function to convert hex format to a rgb color
        function rgb2hex(rgb){
            rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            return "#" +
                ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
                ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
                ("0" + parseInt(rgb[3],10).toString(16)).slice(-2);
        }

    };

    this.reset = function() {

        d3.select('#scatter_plot_container').select('svg').remove();
        this.draw();
    };

    /**
     * Helper functions
     * @returns {Array}
     */

    function filterData() {
        var hashMap = {};

        allData.forEach(function (d) {

            var college = d['College'];
            if ($employment_filter.isExcluded(college))
                return;

            var date = parseDate(d['Date']);
            var degreeLevel = d['Level'];
            var medianSalary = d['Median Overall Salary'];
            var employmentRate = d['Placement Rate'];
            var offerRate = d['Offer Rate'];

            if (date.year >= $employment_filter.getStartYear() && date.year <= $employment_filter.getEndYear()) {
                if (degreeLevel == $employment_filter.getDegreeLevel()) {
                    if (college in hashMap == false)
                        hashMap[college] = [[employmentRate, medianSalary, offerRate]]; //[medianSalary];
                    else
                        hashMap[college].push([employmentRate, medianSalary, offerRate]); //medianSalary);
                }
            }
        });

        var arr_data = [];
        for (var college in hashMap) {
            var employmentRateAvg = average(hashMap[college], 0);
            var medianSalaryAvg = average(hashMap[college], 1);
            var offerRateAvg = average(hashMap[college], 2);

            //arr_data.push({"college":college, "medianSalary":avg});
            arr_data.push({
                "College": college,
                "Placement Rate": employmentRateAvg,
                "Median Overall Salary": medianSalaryAvg,
                "Offer Rate": offerRateAvg
            });
        }

        return arr_data;
    }

    function parseDate(num) {
        var str = num.toString();

        var month = str.substring(4, 6);
        var day = str.substring(6, 8);
        var year = parseInt(str.substring(0, 4));

        return new Date(month, day, year);

        function Date(month, day, year) {
            this.month = month;
            this.day = day;
            this.year = year;
            this.toString = function () {
                return 'month: ' + this.month + ', day: ' + this.day + ', year: ' + this.year;
            };
        }
    }

    function average(numArr, index) {
        var avg = 0;
        for (i in numArr)
            avg += numArr[i][index];

        return avg / numArr.length;
    }

}