/**
 * Created by khancode on 4/21/2015.
 */

$stacked_bar_chart = new StackedBarChart();
$stacked_bar_chart.init();

function StackedBarChart() {

    var _this = this;
    var collegesData;
    var bsTuitionRates;
    var msTuitionRates;

    // d3 vars
    var y;
    var x;
    var color;
    var xAxis;
    var yAxis;
    var svg;
    var min_val;
    var max_val;

    this.init = function() {

        getCollegesData();

        function getCollegesData() {
            var filename = 'json/all_data.json';
            d3.json(filename, function (error, data) {
                collegesData = data;
                getBSTuitionData();
            });
        }

        function getBSTuitionData() {
            var filename = 'json/bs_tuition_rates.csv';
            d3.csv(filename, function (error, data) {
                bsTuitionRates = data;
                getMSTuitionData();
            });
        }

        function getMSTuitionData() {
            var filename = 'json/MS_Major_Data.json';
            d3.json(filename, function (error, data) {
                msTuitionRates = data;
                _this.draw();
            });
        }
    };

    this.draw = function() {
        var margin = {top: 50, right: 45, bottom: 10, left: 210},
        //width = 800 - margin.left - margin.right,
            width = $('#stacked_bar_chart_container').width() - margin.left - margin.right,
        //height = 500 - margin.top - margin.bottom;
            height = $('#stacked_bar_chart_container').height() - margin.top - margin.bottom;

        y = d3.scale.ordinal()
            .rangeRoundBands([0, height], .3);

        x = d3.scale.linear()
            .rangeRound([0, width]);

        color = d3.scale.ordinal()
            .range(["red", "green", "yellow"]);

        xAxis = d3.svg.axis()
            .scale(x)
            .orient("top")
            .ticks(6);

         yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")

        svg = d3.select("#stacked_bar_chart_container").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("id", "d3-plot")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        //color.domain(["Strongly disagree", "Disagree", "Neither agree nor disagree", "Agree", "Strongly agree"]);
        color.domain(["Tuition", "Salary", "Bonus"]);



        var data = filterData();

        console.log('pre dat feel: ');
        console.log(data);

        //data.forEach(function(d) {
        //    // calc percentages
        //    d["Strongly disagree"] = +d[1]*100/d.N;
        //    d["Disagree"] = +d[2]*100/d.N;
        //    d["Neither agree nor disagree"] = +d[3]*100/d.N;
        //    d["Agree"] = +d[4]*100/d.N;
        //    d["Strongly agree"] = +d[5]*100/d.N;
        //    var x0 = -1*(d["Neither agree nor disagree"]/2+d["Disagree"]+d["Strongly disagree"]);
        //    var idx = 0;
        //    d.boxes = color.domain().map(function(name) { return {name: name, x0: x0, x1: x0 += +d[name], N: +d.N, n: +d[idx += 1]}; });
        //});

        data.forEach(function (d) {
            // calc percentages
            d["Tuition"] = +d['in-state-less-than-6hrs'];
            d["Salary"] = +d['in-state-more-than-6hrs'];
            d["Bonus"] = +d['out-of-state-more-than-6hrs'];
            var x0 = -1 * d["Tuition"];
            var idx = 0;
            d.boxes = color.domain().map(function (name) {
                return {name: name, x0: x0, x1: x0 += +d[name], N: +d.N, n: +d[idx += 1]};
            });
        });

        console.log('post dat feel: ');
        console.log(data);

        min_val = d3.min(data, function (d) {
            return d.boxes["0"].x0;
        });

        max_val = d3.max(data, function (d) {
            return d.boxes["2"].x1;
        });

        x.domain([min_val, max_val]).nice();
        y.domain(data.map(function (d) {
            return d['college'];
        }));

        svg.append("g")
            .attr("class", "x axis")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)

        var vakken = svg.selectAll(".question")
            .data(data)
            .enter().append("g")
            .attr("class", "bar")
            .attr("transform", function (d) {
                return "translate(0," + y(d['college']) + ")";
            });

        var bars = vakken.selectAll("rect")
            .data(function (d) {
                return d.boxes;
            })
            .enter().append("g").attr("class", "subbar");

        bars.append("rect")
            .attr("height", y.rangeBand())
            .attr("x", function (d) {
                return x(d.x0);
            })
            .attr("width", function (d) {
                return x(d.x1) - x(d.x0);
            })
            .style("fill", function (d) {
                return color(d.name);
            });

        bars.append("text")
            .attr("x", function (d) {
                return x(d.x0);
            })
            .attr("y", y.rangeBand() / 2)
            .attr("dy", "0.5em")
            .attr("dx", "0.5em")
            .style("font", "10px sans-serif")
            .style("text-anchor", "begin")
            //.text(function(d) { return d.n !== 0 && (d.x1-d.x0)>3 ? d.n : "" });
            .text(function (d) {
                return d['name'];
            });

        vakken.insert("rect", ":first-child")
            .attr("height", y.rangeBand())
            .attr("x", "1")
            .attr("width", width)
            .attr("fill-opacity", "0.5")
            .style("fill", "#F5F5F5")
            .attr("class", function (d, index) {
                return index % 2 == 0 ? "even" : "uneven";
            });

        svg.append("g")
            .attr("class", "y axis")
            .append("line")
            .attr("x1", x(0))
            .attr("x2", x(0))
            .attr("y2", height);

        var startp = svg.append("g").attr("class", "legendbox").attr("id", "mylegendbox");
        // this is not nice, we should calculate the bounding box and use that
        var legend_tabs = [0, 120, 200, 375, 450];
        var legend = startp.selectAll(".legend")
            .data(color.domain().slice())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) {
                return "translate(" + legend_tabs[i] + ",-45)";
            });

        legend.append("rect")
            .attr("x", 0)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        legend.append("text")
            .attr("x", 22)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "begin")
            .style("font", "10px sans-serif")
            .text(function (d) {
                return d;
            });

        d3.selectAll(".axis path")
            .style("fill", "none")
            .style("stroke", "#000")
            .style("shape-rendering", "crispEdges")

        d3.selectAll(".axis line")
            .style("fill", "none")
            .style("stroke", "#000")
            .style("shape-rendering", "crispEdges")

        var movesize = width / 2 - startp.node().getBBox().width / 2;
        d3.selectAll(".legendbox").attr("transform", "translate(" + movesize + ",0)");



    };

    this.update = function()
    {
        var data = filterData();

        console.log('update called');

        x.domain([min_val, max_val]).nice();
        y.domain(data.map(function (d) {
            return d['college'];
        }));

        svg.selectAll("rect")
            .data(data)  // Update with new data
            .transition()  // Transition from old to new

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
    };

    function filterData() {
        console.log('sup bro');

        var data;
        if ($employment_filter.getDegreeLevel() == 'Bachelors')
            data = bsTuitionRates;
        else if ($employment_filter.getDegreeLevel() == 'Masters')
            data = msTuitionRates;

        //console.log(data);

        // hashmap: key (college) => value (Placement Rate)
        var hashMap = {};

        for (var i in data)
        {
            var college = data[i]['college'];
            if ($employment_filter.isExcluded(college))
                continue;

            var date = parseTuitionDate(data[i]['date']);
            var in_state_less_than_6hrs = parseInt(data[i]['in-state-less-than-6hrs']);
            var in_state_more_than_6hrs = parseInt(data[i]['in-state-more-than-6hrs']);
            var out_of_state_less_than_6hrs = parseInt(data[i]['out-of-state-less-than-6hrs']);
            var out_of_state_more_than_6hrs = parseInt(data[i]['out-of-state-more-than-6hrs']);

            if (date.year >= $employment_filter.getStartYear() && date.year <= $employment_filter.getEndYear())
            {
                if (college in hashMap == false) {
                    hashMap[college] = {
                        in_state_less_than_6hrs: [in_state_less_than_6hrs],
                        in_state_more_than_6hrs: [in_state_more_than_6hrs],
                        out_of_state_less_than_6hrs: [out_of_state_less_than_6hrs],
                        out_of_state_more_than_6hrs: [out_of_state_more_than_6hrs]
                    };
                }
                else {
                    hashMap[college]['in_state_less_than_6hrs'].push(in_state_less_than_6hrs);
                    hashMap[college]['in_state_more_than_6hrs'].push(in_state_more_than_6hrs);
                    hashMap[college]['out_of_state_less_than_6hrs'].push(out_of_state_less_than_6hrs);
                    hashMap[college]['out_of_state_more_than_6hrs'].push(out_of_state_more_than_6hrs);
                }
            }
        }

        // Average it now
        for (var college in hashMap)
        {
            hashMap[college]['in_state_less_than_6hrs'] = average(hashMap[college]['in_state_less_than_6hrs']);
            hashMap[college]['in_state_more_than_6hrs'] = average(hashMap[college]['in_state_more_than_6hrs']);
            hashMap[college]['out_of_state_less_than_6hrs'] = average(hashMap[college]['out_of_state_less_than_6hrs']);
            hashMap[college]['out_of_state_more_than_6hrs'] = average(hashMap[college]['out_of_state_more_than_6hrs']);
        }

        //console.log('averaged buddy');
        //console.log(hashMap);

        /** Now get salary **/
        data = collegesData;
        //console.log('collegesData');
        //console.log(collegesData);

        var salaryHashMap = {};

        for (var i in data)
        {
            var college = data[i]['College'];
            if ($employment_filter.isExcluded(college))
                continue;

            var date = parseDate(data[i]['Date']);
            var degreeLevel = data[i]['Level'];
            var medianSalary = data[i]['Median Overall Salary'];
            var medianBonus = data[i]['Median Overall Bonus'];


            if (date.year >= $employment_filter.getStartYear() && date.year <= $employment_filter.getEndYear())
            {
                if (degreeLevel == $employment_filter.getDegreeLevel())
                {
                    if (college in salaryHashMap == false) {
                        salaryHashMap[college] = {
                            medianSalary: [medianSalary],
                            medianBonus: [medianBonus]
                        };
                    }
                    else {
                        salaryHashMap[college]['medianSalary'].push(medianSalary);
                        salaryHashMap[college]['medianBonus'].push(medianBonus);
                    }
                }
            }
        }

        //console.log('salaryHashMap');
        //console.log(salaryHashMap);

        // Average salary/bonus now
        for (var college in salaryHashMap)
        {
            salaryHashMap[college]['medianSalary'] = average(salaryHashMap[college]['medianSalary']);
            salaryHashMap[college]['medianBonus'] = average(salaryHashMap[college]['medianBonus']);
        }

        //console.log('salaryHashMap averaged');
        //console.log(salaryHashMap);

        var arr_data = [];
        for (var college in hashMap)
        {
            arr_data.push(
                {
                    "college":college,
                    "in-state-less-than-6hrs": hashMap[college]['in_state_less_than_6hrs'],
                    "in-state-more-than-6hrs": hashMap[college]['in_state_more_than_6hrs'],
                    "out-of-state-less-than-6hrs": hashMap[college]['out_of_state_less_than_6hrs'],
                    "out-of-state-more-than-6hrs": hashMap[college]['out_of_state_more_than_6hrs']
                }
            );
        }

        //console.log('arr_data: ');
        //console.log(arr_data);

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

    function parseTuitionDate(num)
    {
        var str = num.toString();

        var month = null;
        var day = null;
        var year = parseInt(str.substring(str.length - 4));

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

    function average(numArr)
    {
        var avg = 0;
        for (i in numArr)
            avg += numArr[i];

        return Math.round(avg / numArr.length);
    }

    /* accessors */
    this.getCollegesData = function() { return collegesData; };
    this.getBSTuitionRates = function() { return bsTuitionRates; };
    this.getMSTuitionRates = function() { return msTuitionRates; };
}