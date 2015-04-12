/**
 * Created by khancode on 4/11/2015.
 */

$overall_salary_dashboard = new OverallSalaryDashboard();

$overall_salary_dashboard.draw();

function OverallSalaryDashboard() {

    this.draw = function() {

        var filename = 'json/all_data.json';

        d3.json(filename, function (error, data) {

            // hashmap: key (college) => value (medianSalary)
            var hashMap = {};

            for (var i in data) {

                var college = data[i]['College'];
                if ($employment_filter.isExcluded(college))
                    continue;

                var date = parseDate(data[i]['Date']);
                var degreeLevel = data[i]['Level'];
                var medianOverallSalary = data[i]['Median Overall Salary'];
                var medianOverallBonus = data[i]['Median Overall Bonus'];

                if (date.year >= $employment_filter.getStartYear() && date.year <= $employment_filter.getEndYear())
                {
                    if (degreeLevel == $employment_filter.getDegreeLevel())
                    {
                        if (college in hashMap == false) {
                            hashMap[college] = [[medianOverallSalary], [medianOverallBonus]];
                        }
                        else {
                            hashMap[college][0].push(medianOverallSalary);
                            hashMap[college][1].push(medianOverallBonus);
                        }
                    }
                }
            }

            var arr_data = [];
            for (var college in hashMap) {
                var salaryAvg = parseInt(average(hashMap[college][0]));
                var bonusAvg = parseInt(average(hashMap[college][1]));

                //console.log('salaryAvg: ' + salaryAvg);
                //console.log('bonusAvg: ' + bonusAvg);

                arr_data.push({
                    college: college,
                    money: {"Median Overall Salary": salaryAvg, "Median Overall Bonus": bonusAvg}
                });
            }

            //var freqData = [
            //    {State: 'AL', freq: {low: 4786, mid: 1319, high: 249}}
            //    , {State: 'AZ', freq: {low: 1101, mid: 412, high: 674}}
            //    , {State: 'CT', freq: {low: 932, mid: 2149, high: 418}}
            //    , {State: 'DE', freq: {low: 832, mid: 1152, high: 1862}}
            //    , {State: 'FL', freq: {low: 4481, mid: 3304, high: 948}}
            //    , {State: 'GA', freq: {low: 1619, mid: 167, high: 1063}}
            //    , {State: 'IA', freq: {low: 1819, mid: 247, high: 1203}}
            //    , {State: 'IL', freq: {low: 4498, mid: 3852, high: 942}}
            //    , {State: 'IN', freq: {low: 797, mid: 1849, high: 1534}}
            //    , {State: 'KS', freq: {low: 162, mid: 379, high: 471}}
            //];

            dashboard('#dashboard_container', arr_data);//freqData);

            //var dude = $("#dashboard_container > svg g:nth-child(1) g:nth-child(3) text").text();
            //$("#dashboard_container > svg > g g:nth-child(3) rect").attr("fill", "#EACE3F");

            //console.log(dude);
        });

        function dashboard(id, fData) {
            var barColor = 'steelblue';
            var collegeColors = {'College of Architecture':'#B22200',
                'College of Computing':'#EACE3F',
                'College of Engineering':'#282F6B',
                'Ivan Allen College':'#B35C1E',
                'Scheller College of Business':'#224F20',
                'College of Sciences':'#5F487C'
            };
            var pieChartColor = ["#41ab5d", "#e08214"]; // CAUTION: these colors are also hardcoded somewhere else in this file!!!


            function segColor(c) {
                return {"Median Overall Salary": "#41ab5d", "Median Overall Bonus": "#e08214"}[c];
            }

            // compute total for each state.
            fData.forEach(function (d) {
                d.total = d.money['Median Overall Salary'] + d.money['Median Overall Bonus']
            });

            // function to handle histogram.
            function histoGram(fD) {
                var hG = {}, hGDim = {t: 60, r: 0, b: 30, l: 0};
                hGDim.w = 500 - hGDim.l - hGDim.r,
                    hGDim.h = 300 - hGDim.t - hGDim.b;

                //create svg for histogram.
                var hGsvg = d3.select(id).append("svg")
                    .attr("width", hGDim.w + hGDim.l + hGDim.r)
                    .attr("height", hGDim.h + hGDim.t + hGDim.b).append("g")
                    .attr("transform", "translate(" + hGDim.l + "," + hGDim.t + ")");

                // create function for x-axis mapping.
                var x = d3.scale.ordinal().rangeRoundBands([0, hGDim.w], 0.1)
                    .domain(fD.map(function (d) {
                        return d[0];
                    }));

                // Add x-axis to the histogram svg.
                hGsvg.append("g").attr("class", "x axis")
                    .attr("transform", "translate(0," + hGDim.h + ")")
                    .call(d3.svg.axis().scale(x).orient("bottom"));

                // Create function for y-axis map.
                var y = d3.scale.linear().range([hGDim.h, 0])
                    .domain([0, d3.max(fD, function (d) {
                        return d[1];
                    })]);

                // Create bars for histogram to contain rectangles and freq labels.
                var bars = hGsvg.selectAll(".bar").data(fD).enter()
                    .append("g").attr("class", "bar");

                //create the rectangles.
                bars.append("rect")
                    .attr("x", function (d) {
                        return x(d[0]);
                    })
                    .attr("y", function (d) {
                        return y(d[1]);
                    })
                    .attr("width", x.rangeBand())
                    .attr("height", function (d) {
                        return hGDim.h - y(d[1]);
                    })
                    .attr('fill', function(d) { //barColor)
                        if (d[0] in collegeColors)
                            return collegeColors[d[0]];
                        else
                            return 'black'; // this should not happen
                    })
                    .on("mouseover", mouseover)// mouseover is defined below.
                    .on("mouseout", mouseout);// mouseout is defined below.

                //Create the frequency labels above the rectangles.
                bars.append("text").text(function (d) {
                    return d3.format(",")(d[1])
                })
                    .attr("x", function (d) {
                        return x(d[0]) + x.rangeBand() / 2;
                    })
                    .attr("y", function (d) {
                        return y(d[1]) - 5;
                    })
                    .attr("text-anchor", "middle");

                function mouseover(d) {  // utility function to be called on mouseover.
                    // filter for selected state.
                    var st = fData.filter(function (s) {
                            return s.college == d[0];
                        })[0],
                        nD = d3.keys(st.money).map(function (s) {
                            return {type: s, money: st.money[s]};
                        });

                    // call update functions of pie-chart and legend.
                    pC.update(nD);
                    leg.update(nD);
                }

                function mouseout(d) {    // utility function to be called on mouseout.
                    // reset the pie-chart and legend.
                    pC.update(tF);
                    leg.update(tF);
                }

                // create function to update the bars. This will be used by pie-chart.
                hG.update = function (nD, color) {
                    // update the domain of the y-axis map to reflect change in frequencies.
                    y.domain([0, d3.max(nD, function (d) {
                        return d[1];
                    })]);

                    // Attach the new data to the bars.
                    var bars = hGsvg.selectAll(".bar").data(nD);

                    // transition the height and color of rectangles.
                    bars.select("rect").transition().duration(500)
                        .attr("y", function (d) {
                            return y(d[1]);
                        })
                        .attr("height", function (d) {
                            return hGDim.h - y(d[1]);
                        })
                        .attr("fill", function(d) {
                            // Omar
                            if (pieChartColor.indexOf(color) > -1 == true)
                                return color;

                            if (d[0] in collegeColors)
                                return collegeColors[d[0]];
                            else
                                color;
                        });

                    // transition the frequency labels location and change value.
                    bars.select("text").transition().duration(500)
                        .text(function (d) {
                            return d3.format(",")(d[1])
                        })
                        .attr("y", function (d) {
                            return y(d[1]) - 5;
                        });
                };
                return hG;
            }

            // function to handle pieChart.
            function pieChart(pD) {
                var pC = {}, pieDim = {w: 250, h: 250};
                pieDim.r = Math.min(pieDim.w, pieDim.h) / 2;

                // create svg for pie chart.
                var piesvg = d3.select(id).append("svg")
                    .attr("width", pieDim.w).attr("height", pieDim.h).append("g")
                    .attr("transform", "translate(" + pieDim.w / 2 + "," + pieDim.h / 2 + ")");

                // create function to draw the arcs of the pie slices.
                var arc = d3.svg.arc().outerRadius(pieDim.r - 10).innerRadius(0);

                // create a function to compute the pie slice angles.
                var pie = d3.layout.pie().sort(null).value(function (d) {
                    return d.money;
                });

                // Draw the pie slices.
                piesvg.selectAll("path").data(pie(pD)).enter().append("path").attr("d", arc)
                    .each(function (d) {
                        this._current = d;
                    })
                    .style("fill", function (d) {
                        return segColor(d.data.type);
                    })
                    .on("mouseover", mouseover).on("mouseout", mouseout);

                // create function to update pie-chart. This will be used by histogram.
                pC.update = function (nD) {
                    piesvg.selectAll("path").data(pie(nD)).transition().duration(500)
                        .attrTween("d", arcTween);
                }
                // Utility function to be called on mouseover a pie slice.
                function mouseover(d) {
                    // call the update function of histogram with new data.
                    hG.update(fData.map(function (v) {
                        return [v.college, v.money[d.data.type]];
                    }), segColor(d.data.type));
                }

                //Utility function to be called on mouseout a pie slice.
                function mouseout(d) {
                    // call the update function of histogram with all data.
                    hG.update(fData.map(function (v) {
                        return [v.college, v.total];
                    }), barColor);
                }

                // Animating the pie-slice requiring a custom function which specifies
                // how the intermediate paths should be drawn.
                function arcTween(a) {
                    var i = d3.interpolate(this._current, a);
                    this._current = i(0);
                    return function (t) {
                        return arc(i(t));
                    };
                }

                return pC;
            }

            // function to handle legend.
            function legend(lD) {
                var leg = {};

                // create table for legend.
                var legend = d3.select(id).append("table").attr('class', 'legend');

                // create one row per segment.
                var tr = legend.append("tbody").selectAll("tr").data(lD).enter().append("tr");

                // create the first column for each segment.
                tr.append("td").append("svg").attr("width", '16').attr("height", '16').append("rect")
                    .attr("width", '16').attr("height", '16')
                    .attr("fill", function (d) {
                        return segColor(d.type);
                    });

                // create the second column for each segment.
                tr.append("td").text(function (d) {
                    return d.type;
                });

                // create the third column for each segment.
                tr.append("td").attr("class", 'legendFreq')
                    .text(function (d) {
                        return d3.format(",")(d.money);
                    });

                // create the fourth column for each segment.
                tr.append("td").attr("class", 'legendPerc')
                    .text(function (d) {
                        return getLegend(d, lD);
                    });

                // Utility function to be used to update the legend.
                leg.update = function (nD) {
                    // update the data attached to the row elements.
                    var l = legend.select("tbody").selectAll("tr").data(nD);

                    // update the frequencies.
                    l.select(".legendFreq").text(function (d) {
                        return d3.format(",")(d.money);
                    });

                    // update the percentage column.
                    l.select(".legendPerc").text(function (d) {
                        return getLegend(d, nD);
                    });
                };

                function getLegend(d, aD) { // Utility function to compute percentage.
                    return d3.format("%")(d.money / d3.sum(aD.map(function (v) {
                        return v.money;
                    })));
                }

                return leg;
            }

            // calculate total frequency by segment for all state.
            var tF = ['Median Overall Salary', 'Median Overall Bonus'].map(function (d) {
                return {
                    type: d, money: d3.sum(fData.map(function (t) {
                        return t.money[d];
                    }))
                };
            });

            // calculate total frequency by state for all segment.
            var sF = fData.map(function (d) {
                return [d.college, d.total];
            });

            var hG = histoGram(sF), // create the histogram.
                pC = pieChart(tF), // create the pie-chart.
                leg = legend(tF);  // create the legend.
        }
    };

    this.reDraw = function() {
        d3.select('#dashboard_container').select('svg').remove();
        d3.select('#dashboard_container').select('svg').remove();
        d3.select('#dashboard_container').select('table').remove();
        this.draw();
    };

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

    function average(numArr) {
        var avg = 0;
        for (i in numArr)
            avg += numArr[i];

        return avg / numArr.length;
    }
}