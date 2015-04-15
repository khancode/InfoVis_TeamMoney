/**
 * Created by khancode on 4/14/2015.
 */

$salary_employment_scatterplot = new ScatterPlot();

$salary_employment_scatterplot.draw();

function ScatterPlot() {

    var allData = null;
    var svg = null;

    var xAxis = null;
    var yAxis = null;
    var xScale = null;
    var yScale = null;

    this.draw = function() {

        var margin = {top: 20, right: 20, bottom: 30, left: 40},
            width = 1800 - margin.left - margin.right, // 1900 (including margin)
            height = 500 - margin.top - margin.bottom;

        var x = d3.scale.linear()
            .range([0, width]);

        var y = d3.scale.linear()
            .range([height, 0]);

        var color = d3.scale.category10();

        xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        svg = d3.select("#scatter_plot_container").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        //d3.tsv("json/data.tsv", function (error, data) {
        d3.json("json/all_data.json", function (error, data) {

            allData = data;

            var hashMap = {};

            data.forEach(function (d) {

                var college = d['College'];
                if ($employment_filter.isExcluded(college))
                    return;

                var date = parseDate(d['Date']);
                var degreeLevel = d['Level'];
                var medianSalary = d['Median Overall Salary'];
                var employmentRate = d['Placement Rate'];

                if (date.year >= $employment_filter.getStartYear() && date.year <= $employment_filter.getEndYear())
                {
                    if (degreeLevel == $employment_filter.getDegreeLevel())
                    {
                        if (college in hashMap == false)
                            hashMap[college] = [[employmentRate, medianSalary]]; //[medianSalary];
                        else
                            hashMap[college].push([employmentRate, medianSalary]); //medianSalary);
                    }
                }
            });

            var arr_data = [];
            for (var college in hashMap)
            {
                var employmentRateAvg = average(hashMap[college], 0);
                var medianSalaryAvg = average(hashMap[college], 1);

                //arr_data.push({"college":college, "medianSalary":avg});
                arr_data.push({"College":college, "Placement Rate":employmentRateAvg, "Median Overall Salary":medianSalaryAvg});
            }
            data = arr_data;


            // Create scale functions
            xScale = d3.scale.linear()  // xScale is width of graphic
                .domain([0, d3.max(data, function(d) {
                    return d['Placement Rate'];  // input domain
                })])
                .range([0, height * 2]); // output range

            yScale = d3.scale.linear()  // yScale is height of graphic
                .domain([0, d3.max(data, function(d) {
                    return d['Median Overall Salary'];  // input domain
                })])
                .range([height, 0]);  // remember y starts on top going down so we


            x.domain(d3.extent(data, function (d) {
                //return d.sepalWidth;
                return d['Placement Rate'];
            })).nice();
            y.domain(d3.extent(data, function (d) {
                //return d.sepalLength;
                return d['Median Overall Salary'];
            })).nice();

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                .append("text")
                .attr("class", "label")
                .attr("x", width)
                .attr("y", -6)
                .style("text-anchor", "end")
                //.text("Sepal Width (cm)");
                .text("Employment Rate (%)");

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("class", "label")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                //.text("Sepal Length (cm)")
                .text("Salary ($)");

            svg.selectAll(".dot")
                .data(data)
                .enter().append("circle")
                .attr("class", "dot")
                .attr("r", 10)
                .attr("cx", function (d) {
                    //return x(d.sepalWidth);
                    return x(d['Placement Rate']);
                })
                .attr("cy", function (d) {
                    //return y(d.sepalLength);
                    return y(d['Median Overall Salary']);
                })
                .style("fill", function (d) {
                    //return color(d.species);
                    return color(d['College']);
                });

            var legend = svg.selectAll(".legend")
                .data(color.domain())
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function (d, i) {
                    return "translate(0," + i * 20 + ")";
                });

            legend.append("rect")
                .attr("x", width - 18)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", color);

            legend.append("text")
                .attr("x", width - 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function (d) {
                    return d;
                });

        });
    };

    this.update = function()
    {
        var dataset = filterData();

        // Update scale domains
        xScale.domain([0, d3.max(dataset, function(d) {
            return d['Placement Rate']; })]);
        yScale.domain([0, d3.max(dataset, function(d) {
            return d['Median Overall Salary']; })]);

        // Update circles
        svg.selectAll("circle")
            .data(dataset)  // Update with new data
            .transition()  // Transition from old to new
            .duration(1000)  // Length of animation
            .each("start", function() {  // Start animation
                //d3.select(this)  // 'this' means the current element
                    //.attr("fill", "red")  // Change color
                    //.attr("r", 5);  // Change size
            })
            .delay(function(d, i) {
                return i / dataset.length * 500;  // Dynamic delay (i.e. each item delays a little longer)
            })
            //.ease("linear")  // Transition easing - default 'variable' (i.e. has acceleration), also: 'circle', 'elastic', 'bounce', 'linear'
            .attr("cx", function(d) {
                return xScale(d['Placement Rate']);  // Circle's X
            })
            .attr("cy", function(d) {
                return yScale(d['Median Overall Salary']);  // Circle's Y
            })
            //.each("end", function() {  // End animation
            //    d3.select(this)  // 'this' means the current element
            //        .transition()
            //        .duration(500)
            //        .attr("fill", "black")  // Change color
            //        .attr("r", 2);  // Change radius
            //});

        // Update X Axis
        svg.select(".x .axis")
            .transition()
            .duration(1000)
            .call(xAxis);

        // Update Y Axis
        svg.select(".y .axis")
            .transition()
            .duration(100)
            .call(yAxis);
    };

    this.reDraw = function()
    {
        $("#scatter_plot_container svg").remove();
        this.draw();
    };

    function filterData()
    {
        var hashMap = {};

        allData.forEach(function (d) {

            var college = d['College'];
            if ($employment_filter.isExcluded(college))
                return;

            var date = parseDate(d['Date']);
            var degreeLevel = d['Level'];
            var medianSalary = d['Median Overall Salary'];
            var employmentRate = d['Placement Rate'];

            if (date.year >= $employment_filter.getStartYear() && date.year <= $employment_filter.getEndYear())
            {
                if (degreeLevel == $employment_filter.getDegreeLevel())
                {
                    if (college in hashMap == false)
                        hashMap[college] = [[employmentRate, medianSalary]]; //[medianSalary];
                    else
                        hashMap[college].push([employmentRate, medianSalary]); //medianSalary);
                }
            }
        });

        var arr_data = [];
        for (var college in hashMap)
        {
            var employmentRateAvg = average(hashMap[college], 0);
            var medianSalaryAvg = average(hashMap[college], 1);

            //arr_data.push({"college":college, "medianSalary":avg});
            arr_data.push({"College":college, "Placement Rate":employmentRateAvg, "Median Overall Salary":medianSalaryAvg});
        }

        return arr_data;
    }

    function parseDate(num)
    {
        var str = num.toString();

        var month = str.substring(4, 6);
        var day = str.substring(6, 8);
        var year = parseInt(str.substring(0, 4));

        return new Date(month, day, year);

        function Date(month, day, year)
        {
            this.month = month;
            this.day = day;
            this.year = year;
            this.toString = function() {
                return 'month: ' + this.month + ', day: ' + this.day + ', year: ' + this.year;
            };
        }
    }

    function average(numArr, index)
    {
        var avg = 0;
        for (i in numArr)
            avg += numArr[i][index];

        return avg / numArr.length;
    }
}