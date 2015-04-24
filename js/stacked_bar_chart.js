$salaries_stacked_bar_chart = new SalariesStackedBarChart();

$salaries_stacked_bar_chart.draw();
// Default tree map 2006 - 2014
function SalariesStackedBarChart()
{
	this.draw = function() {

        //FILTERING DATA
		if($employment_filter.getDegreeLevel() == 'Bachelors') {
			var majorsCollege =
			{
				"College of Architecture" : ["Architecture", "Building Construction", "Industrial Design"],
				"College of Computing" : ["Computational Media", "Computer Sci"],
				"College of Engineering" : ["Nucleaer & Radiological Engr","Material Sci & Engr","Environmental Engr","Chemical Engr","Polymer & Fiber Engr","Nuclear & Radiological Engr","Materials Sci & Engr","Chemical & Biochemical Engr", "Polymer & Fiber Engr", "Nuclear & Radiological Engr", "Mechanical Engr", "Materials Sci & Engr", "Aerospace Engr", "Biomedical Engr", "Chemical and Biomolecular Eng", "Civil Engr", "Computer Engr", "Electrical Engr", "Industrial Engr"],
				"Ivan Allen College" : ["Global Economics & Modern Lang","Applied Lang & Inercultural Studies","Sci, Technology & Culture","International Affairs & Modern Langs","History, Technology & Society","Global Economics and Modern Langs","Economics and International Affairs","International Affairs & Modern Lang","Economics & International Affairs","Sci, Technology, & Culture", "Public Policy", "Econ & Int'l Affairs", "History, Technology, & Society", "Int'l Affairs & Mod Lang", "International Affairs", "Global Econ/Mod Lang"],
				"Scheller College of Business" : ["Management", "Economics","Business Administration"],
				"College of Sciences" : ["Earth and Atmospheric Sci","Biochemistry","Applied Physics","Mathematics","Biology", "Psychology", "Physics", "Applied Biology", "Applied Mathematics", "Chemistry", "Discrete Mathematics", "Earth & Atmospheric Sci"]
			};
            var filename = 'json/BS_Major_Data.json';
        } else {
			var majorsCollege =
			{

				"College of Architecture" : ["City Planning","Architecture","Building Construction","Industrial Design","Urban Design"],
				"College of Computing" : ["Computer Sci", "Human Computer Interaction","Digital Media","Information Design & Technology","Information Security","Human-Computer Interaction"],
				"College of Engineering" : ["Industrial Engr","Health Systems","Environmental Engr","Supply Chain Engr","Applied Systems Engr","Biomedical Engr","Engr Sci & Mechanics","Materials Sci & Engr","Paper Sci Engr","Nuclear & Radiological Engr","Engr Sci & Mechanics","Electrical & Computer Engr","Polymer & Fiber Engr","BioEngineering","Computational Sci & Engr","Material Sci & Engr","Operations Research","Nuclear & Radiological Engr","Electrical & Computer Engr","Civil Engr","Aerospace Engr","Bioengineering", "Chemical Engr","Mechanical Engr"],
				"Ivan Allen College" : ["History & Sociology of Technology & Sci","International Affairs","Public Policy","History of Technology","International Logistics","History, Technology & Society","Music Technology"],
				"Scheller College of Business" : ["Economics","Management","Global MBA","Management of Technology","Quantitative & Computational Finance","Quanta & Computation Fin","Global Business","Business Administration","Global Executive MBA"],
				"College of Sciences" : ["Health Systems","Earth & Atmospheric Sci","Chemistry","Applied Physiology", "Bioinformatics","Biomedical Innov & Dev", "Biology","Mathematics","Prosthetics & Orthotics","Alg, Combo & Optimization","Statistics","Medical Physics","Physics","Psychology","Earth and Atmospheric Sci"]
			}
            var filename = 'json/MS_Major_Data.json';
        }

        var majorToAbrv =
        {
            "Architecture": "ARCH",
            "Building Construction": "BC",
            "Industrial Design": "ID",
            "Computational Media": "CM",
            "Computer Sci" : "CS",
            "Material Sci & Engr": "MSE",
            "Environmental Engr" : "EnvE",
            "Chemical Engr": "ChE",
            "Chemical & Biochemical Engr": "CHBE",
            "Polymer & Fiber Engr": "PTFE",
            "Nuclear & Radiological Engr": "NRE",
            "Mechanical Engr": "ME",
            "Aerospace Engr": "AE",
            "Biomedical Engr": "BME",
            "Chemical and Biomolecular Eng": "CHBE",
            "Civil Engr": "CivE",
            "Computer Engr": "CE",
            "Electrical Engr": "EE",
            "Industrial Engr": "IE",
            "Applied Lang & Inercultural Studies": "ALIS",
            "Sci, Technology & Culture": "STC",
            "History, Technology & Society": "HTS",
            "Global Economics and Modern Langs": "GLML",
            "Public Policy": "PP",
            "Econ & Int'l Affairs": "EIA",
            "Int'l Affairs & Mod Lang": "IAML",
            "International Affairs": "IA",
            "Global Econ/Mod Lang": "GEML",
            "Management": "MGNT",
            "Economics": "ECON",
            "Business Administration": "BA",
            "Biochemistry": "BChm",
            "Applied Physics": "PYS",
            "Mathematics": "MATH",
            "Psychology": "PYCH",
            "Physics": "PHYS",
            "Physics": "PHYS",
            "Applied Biology": "BIO",
            "Applied Mathematics": "MATH",
            "Chemistry": "CHEM",
            "Discrete Mathematics": "DMTH",
            "Earth & Atmospheric Sci": "EAS",
            //BATCHLEORS DONE
            "City Planning": "CP",
            "Architecture": "ARCH",
            "Building Construction": "BC",
            "Industrial Design": "ID",
            "Urban Design": "UD",
            "Computer Sci": "CS",
            "Human Computer Interaction": "HCI",
            "Digital Media": "DM",
            "Information Design & Technology": "IDT",
            "Information Security": "IS",
            "Human-Computer Interaction": "HCI",
            "Industrial Engr": "IE",
            "Health Systems": "HS",
            "Environmental Engr": " ENVE",
            "Supply Chain Engr": "SCE",
            "Applied Systems Engr": "SE",
            "Biomedical Engr": "BME",
            "Engr Sci & Mechanics": "ESM",
            "Materials Sci & Engr": "MSE",
            "Paper Sci Engr": "PSE",
            "Nuclear & Radiological Engr": "NRE",
            "Engr Sci & Mechanics": "ESM",
            "Electrical & Computer Engr": "ECE",
            "Polymer & Fiber Engr": "PTFE",
            "BioEngineering": "BE",
            "Computational Sci & Engr": "CSE",
            "Material Sci & Engr": "MSE",
            "Operations Research": "OPR",
            "Nuclear & Radiological Engr": "NRE",
            "Electrical & Computer Engr": "ECE",
            "Civil Engr": "CivE",
            "Aerospace Engr": "AE",
            "Bioengineering": "BE",
            "Chemical Engr": "CE",
            "Mechanical Engr": "ME",
            "Economics": "ECON",
            "Management": "MGNT",
            "Global MBA": "MBA",
            "Management of Technology": "MOT",
            "Quantitative & Computational Finance": "QCF",
            "Quanta & Computation Fin": "QCF",
            "Global Business": "GB",
            "Business Administration": "BA",
            "Global Executive MBA": "MBA",
            "Earth & Atmospheric Sci": "EAS",
            "Chemistry": "CHEM",
            "Applied Physiology": "PHYC",
            "Bioinformatics": "BINF",
            "Biomedical Innov & Dev": "BID",
            "Biology": "BIO",
            "Mathematics": "MATH",
            "Prosthetics & Orthotics": "PaO",
            "Alg, Combo & Optimization": "ALGC",
            "Statistics": "STAT",
            "Medical Physics": "MED",
            "Physics": "PHYS",
            "Psychology": "PSYC",
            "Earth and Atmospheric Sci": "EAS",
            "History & Sociology of Technology & Sci": "HTS",
            "International Affairs": "IA",
            "Public Policy": "PP",
            "History of Technology": "HoT",
            "International Logistics": "IL",
            "History, Technology & Society": "HTC",
            "Music Technology": "MT",
            "Economics": "ECON",
            "Management": "MGT"
        }

		//THIS IS WHAT TREEMAP NEEDS TO GIVE ME
		var collegeList = ["College of Engineering", "College of Sciences",  "Ivan Allen College", "Scheller College of Business","College of Architecture", "College of Computing"];
        var collegeabrv = ["CoE", "CoS", "IAC", "CoB", "CoA", "CoC"];
        var div_store = ["#stacked_salaries_one", "#stacked_salaries_one","#stacked_salaries_one", "#stacked_salaries_one","#stacked_salaries_one", "#stacked_salaries_one"];
        var color_array = ["#282f6b", "#5f487c",  "#b35c1e", "#224f20","#b22200", "#bca632"]


        //index's are decided by collegeList^
		var dataArray = [[],[],[],[],[],[]];

		var majorHashMap = {};

		//Importing data and organizing my college
		d3.json(filename, function(error, data)
		{

			//create a hashmap of the Majors with the all the data for that major
 			for (var i in data)
            {
                var major = data[i]['Major'];
                var date = parseDate(data[i]['Date']);

                if (date.year >= $employment_filter.getStartYear() && date.year <= $employment_filter.getEndYear())
                {
                    if (major in majorHashMap == false) {
                        majorHashMap[major] = [data[i]];
                    }
                    else {
                        majorHashMap[major].push(data[i]);
                    }
                }
            }

            //Go through each major and calculate the average across all the entries
		 	for(var major in majorHashMap)
		 	{
		 		var majorAverage = average(majorHashMap[major]);

		 		majorHashMap[major] = majorAverage;
			 	//console.log(majorHashMap[major].Major);
		 	}

		 	//console.log(majorHashMap);
		 	//For each major, assign it to a college so that we can group the viz's
		 	for(var college in collegeList)
		 	{
                if(!$employment_filter.isExcluded(collegeList[college])) 
                {
                    // console.log(college);
    		 		for(var major in majorHashMap)
    		 		{
    		 			if (majorsCollege[collegeList[college]].indexOf(majorHashMap[major].Major) > -1)
    		 				dataArray[college].push(majorHashMap[major]);
    		 		}
		 	    }
            }
            //DONE FILTERING DATA, there are some data structures that are aboce that are used later
console.log(dataArray);

            //formatting for x-axis
			var dollarFormat = d3.format("s$4n");

            //variable to set x-axis range to have consistant across all graphs
			maxSum = 0;
			for(var i = 0; i <dataArray.length; i++)
			{
				if (d3.max(dataArray[i], function(d) {return d.High}) > maxSum) maxSum = d3.max(dataArray[i], function(d) {return d.High});
			}

			//create the multiple SVGs, one for each college
			for(var i = 0; i <dataArray.length; i++)
			{
                if(dataArray[i].length == 0) continue;
				var margin = {top:40 , bot:5 , right:10 , left: 40},
						width 	= 31*dataArray[i].length,
						height	= 200 - margin.top - margin.bot;

				var y = d3.scale.linear()
                    .range([20, height]);

				var x = d3.scale.ordinal()
                    .rangeRoundBands([31*dataArray[i].length, 0]);

                var xAxis = d3.svg.axis()
					.scale(x)
					.orient("bottom")
                    .tickSize(0);

				var yAxis = d3.svg.axis()
					.scale(y)
					.orient("left")
					.tickSize(0)
                    .tickFormat(dollarFormat);

				//used to make bars smaller
				var shrinkageVar = 10;

				//D3 details-on-demand
				var tip = d3.tip()
					.attr('class', 'd3-tip')
					.offset([0,0])
					.html(function(d) {
                        if(d.High)
					return "<p style='padding: 10px; color: red; background-color: black; border: black 2px solid'>" +
							"<span style='color:#E0AA0F'>" + d.Major + "</span><br/>" +
							"<strong style='color:#E0AA0F'>High:</strong> <span style='color:white'>$" + numberWithCommas((d.High).toFixed(0)) + "</span><br/>" +
							"<strong style='color:#E0AA0F'>Median:</strong> <span style='color:white'>$" + numberWithCommas(d.Median.toFixed(0)) + "</span><br/>" +
							"<strong style='color:#E0AA0F'>Low:</strong> <span style='color:white'>$" + numberWithCommas(d.Low.toFixed(0)) + "</span><br/>" +
							"<strong style='color:#E0AA0F'>Offer Rate:</strong> <span style='color:white'>" + numberWithCommas(d["Offer Rate"].toFixed(2)) + "%</span><br/>" +
							"<strong style='color:#E0AA0F'>Placement Rate:</strong> <span style='color:white'>" + numberWithCommas(d["Placement Rate"].toFixed(2)) + "%</span>"
							"</p>";
				});

				//setting axis bounds and values
			 	x.domain(dataArray[i].map(function(d) {return majorToAbrv[d.Major]; }));
				y.domain([maxSum, 0]);

			 	//creating the SVG for this itteration
				var svg = d3.select(div_store[i]).append("svg")
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bot)
				  .append("g")
				  	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");



				//something to do with tooltip?
				svg.call(tip);

				//Y-Axis tabs
				svg.append("g")
				    .attr("class", "y axis")
			   		.attr("transform", "translate(0, 0)")
				    .call(yAxis)
                    .style("fill", color_array[i])
                    .style("opacity", 0)
                    .transition()
                    .duration(1000)
                    .style("opacity", 1)
                  .selectAll("text")
                //.style("text-anchor", "end")
                    //.attr("dx", "-.8em")
                    //.attr("dy", ".15em")
                    //.attr("transform", function(d) {
                    //    return "rotate(-90)"
                    //});


			    //X-Axis tabs
				svg.append("g")
					.attr("class", "x axis")
			   		.attr("transform", "translate(0,0)")
					.call(xAxis)
                    .style("fill", color_array[i])
                    .style("opacity", 0)
                    .transition()
                    .duration(1000)
                    .style("opacity", 1)
                  .selectAll("text")
                    .style("font-size", "10px")
                    //.call(wrap, margin.left-17)
                    //.style("text-anchor", "start");

//
                //line under name
                svg.selectAll(".line")
                    .data(dataArray[i])
                    .enter()
                    .append("line")
                    .attr("x1", -margin.left)
                    .attr("y1", "-13.7")
                    .attr("x2", width)
                    .attr("y2", "-13.7")
                    .attr("stroke-width",12)
                    .attr("stroke", color_array[i])
                    .style("opacity", 0)
                    .transition()
                    .duration(1000)
                    .style("opacity", 1)

				////College Text
				svg.append("text")
				  	.attr("dy", "-1.1em")
                    .attr("dx", "-1.5em")
                    .style("text-anchor", "start")
				    .style("stroke", color_array[i])
				    .text(collegeabrv[i])
				    .attr("font-size", "20px")
				    .attr("fill", color_array[i])
				    .attr("font-family", "Helvetica")
                    .style("opacity", 0)
                    .transition()
                    .duration(1000)
                    .style("opacity", 1);

                ////line for left (separating data and values)
                //svg.selectAll(".line")
                //    .data(dataArray[i])
                //    .enter()
                //    .append("line")
                //    .attr("x1", "-.2")
                //    .attr("y1", "-13.7")
                //    .attr("x2", "-.2")
                //    .attr("y2", "500")
                //    .attr("stroke-width", ".5")
                //    .attr("stroke", color_array[i]);

				//line for range
				svg.selectAll(".line")
			      	.data(dataArray[i])
		      	  .enter()
		      	  	.append("line")
                    .attr("y1", function(d) {return y(d.Low); })
                    .attr("x1", function(d) {return x(majorToAbrv[d.Major]) + shrinkageVar*1.5; })
                    .attr("y2", function(d) {return y(d.High); })
                    .attr("x2", function(d) {return x(majorToAbrv[d.Major]) + shrinkageVar*1.5; })
                    .attr("stroke-width", 2)
                    .attr("stroke", color_array[i])
                    .style("opacity", 0)
                    .transition()
                    .duration(1000)
                    .style("opacity", 1);

                svg.selectAll(".medianCirc")
                    .data(dataArray[i])
                  .enter()
                    .append("circle")
                    .attr("cy", function(d) {if (d.Median)return y(d.Median); })
                    .attr("cx", function(d) {if (d.Median)return x(majorToAbrv[d.Major]) + shrinkageVar*1.5;})
                    .attr("r", function(d) {if (d.Median) return 5})
                    .style("fill", color_array[i])
                    .style("opacity", 0)
                    .transition()
                    .duration(1000)
                    .style("opacity", 1);

                svg.selectAll(".missing text")
                    .data(dataArray[i])
                  .enter()
                    .append("text")
                    .text(function(d){if(!d.High) return "N/A"})
                    .attr("x", function(d) {return x(majorToAbrv[d.Major]) + shrinkageVar/1.5; })
                    .attr("y", function(d) {return y(maxSum/2); })
                    .style("stroke", color_array[i])
                    .attr("font-size", "8px")
                    .style("opacity", 0)
                    .transition()
                    .duration(1000)
                    .style("opacity", 1);


                ////make virtual area for mouseover tooltip
				svg.selectAll(".tipArea")
					.data(dataArray[i])
		      	  .enter()
		      	  	.append("rect")
			      	.attr("class", "bar")
			      	.attr("x", function(d) {return x(majorToAbrv[d.Major])})
			      	.attr("height", 500)
			    	.attr("y", function(d) {return 0; })
			    	.attr("width", x.rangeBand())
                    //.style("stroke", "black")
					.style("fill", "transparent")
			    	.on('mouseover', tip.show)
			      	.on('mouseout', tip.hide);


			}
		});
	};

    this.reDraw =function() {

        div = d3.select("#stacked_salaries_one");

        div. selectAll("circle")
            .transition()
            .duration(1000)
            //.attr("cx", function (d) {return x(d.Median);})
            .style("opacity", function (d) {if (!d.Median) return 0;})
        .remove();

        div.selectAll("line")
            .transition()
            .duration(1000)
            //.attr("x1", function(d) {return x(d.Low); })
            //.attr("y1", function(d) {return y(d.Major) + shrinkageVar*1.5; })
            //.attr("x2", function(d) {return x(d.High); })
            //.attr("y2", function(d) {return y(d.Major) + shrinkageVar*1.5; })
            .attr("stroke-width", 2)
        .style("opacity", 0)
        .remove();

        div.selectAll("text")
            .transition()
            .duration(1000)
        .style("opacity", 0)
        .remove();

        div.selectAll("svg")
            .transition()
            .duration(1000)
            .style("opacity", 0)
            .remove();

        setTimeout(function() { $salaries_stacked_bar_chart.draw(); }, 999);
    }


        function average(majorDataArray)
         {
    	//set varables to create averages of (This is NOT all variables given)
    	var offerRateAverage = 0;
    	var placementRateAverage = 0;
    	var medianAverage = 0;
    	var highAverage = 0;
    	var lowAverage = 0;
    	var major = majorDataArray[0].Major;
    	var listRealLength = 0; //don't count the -1 values



    	//go through list and add to aveage
    	for (var data in majorDataArray) {
    		if(majorDataArray[data]["Offer Rate"] != -1) offerRateAverage += majorDataArray[data]["Offer Rate"];	
    		if(majorDataArray[data]["Placement Rate"] != -1) placementRateAverage += majorDataArray[data]["Placement Rate"];
    		if(majorDataArray[data].Median != -1) medianAverage += majorDataArray[data].Median;
    		if(majorDataArray[data].High != -1) highAverage += majorDataArray[data].High;
    		if(majorDataArray[data].Low != -1) { 
    			lowAverage += majorDataArray[data].Low;
    			listRealLength+= 1
    		}
    	}
    	//console.log(offerRateAverage)

    	offerRateAverage = offerRateAverage/listRealLength;
		placementRateAverage = placementRateAverage/listRealLength;
		medianAverage = medianAverage/listRealLength;
		highAverage = highAverage/listRealLength;
		lowAverage = lowAverage/listRealLength;
		//create the data object that you are retruning
		return 	{
					"Major": major,
					"Offer Rate": offerRateAverage,
					"Placement Rate": placementRateAverage,
					"Median": medianAverage,
					"High": highAverage,
					"Low": lowAverage
				};

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

    function wrap(text, width) {
        text.each(function () {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.1, // ems
                y = text.attr("y"),
                dy = parseFloat(text.attr("dy")),
                tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy -.45 + "em");
            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy -.6 + "em").text(word);
                }
            }
        });
    }

    function numberWithCommas(x) {
    	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
}