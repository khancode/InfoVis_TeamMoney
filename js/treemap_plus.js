/**
 * 90% of this code is original and not copied
 * This file imports copied code from libs/d3plus/d3plus.js
 */

$tree_map = new TreeMap();
$tree_map.init();

function TreeMap() {

    var _this = this;
    var collegesData;
    var bsMajorsData;
    var msMajorsData;

    var collegeSelected = null;

    // Get the necessary data files and draw the tree map
    this.init = function() {

        getCollegesData();

        function getCollegesData() {
            var filename = 'json/all_data.json';
            d3.json(filename, function (error, data) {
                collegesData = data;
                getBSMajorsData();
            });
        }

        function getBSMajorsData() {
            var filename = 'json/BS_Major_Data.json';
            d3.json(filename, function (error, data) {
                bsMajorsData = data;
                getMSMajorsData();
            });
        }

        function getMSMajorsData() {
            var filename = 'json/MS_Major_Data.json';
            d3.json(filename, function (error, data) {
                msMajorsData = data;
                _this.drawColleges();
            });
        }
    };

    this.drawColleges = function() {

        var data = collegesData;

        var arr_data = filterData(data);

        // instantiate d3plus
        var visualization = d3plus.viz()
            .container("#treemap_plus_container")  // container DIV to hold the visualization
            .data(arr_data) //sample_data)  // data to use with the visualization
            .type("tree_map")   // visualization type
            .id("college") //"name")         // key for which our data is unique on
            .size("Employment Rate") //"medianSalary") //"value")      // sizing of blocks
            .timing({"transitions": 1500})
            .draw();             // finally, draw the visualization!

        setOnRectClickListener();

        // Filter the tree map data according to the overall filter ($employment_filter)
        function filterData(data) {
            // hashmap: key (college) => value (Placement Rate)
            var hashMap = {};

            for (var i in data)
            {
                var college = data[i]['College'];
                if ($employment_filter.isExcluded(college))
                    continue;

                var date = parseDate(data[i]['Date']);
                var degreeLevel = data[i]['Level'];
                var employmentRate = data[i]['Placement Rate'];

                if (date.year >= $employment_filter.getStartYear() && date.year <= $employment_filter.getEndYear())
                {
                    if (degreeLevel == $employment_filter.getDegreeLevel())
                    {
                        if (college in hashMap == false)
                            hashMap[college] = [employmentRate];
                        else
                            hashMap[college].push(employmentRate);
                    }
                }
            }

            var arr_data = [];
            for (var college in hashMap)
            {
                var avg = average(hashMap[college]);

                //arr_data.push({"college":college, "medianSalary":avg});
                arr_data.push({"college":college, "Employment Rate":avg});
            }

            return arr_data;
        }
    };

    // Draw the majors when tree map is clicked
    this.drawMajors = function() {

        var data;
        if ($employment_filter.getDegreeLevel() == 'Bachelors')
            data = bsMajorsData;
        else if ($employment_filter.getDegreeLevel() == 'Masters')
            data = msMajorsData;

        var arr_data = filterData(data);

        // instantiate d3plus
        var visualization = d3plus.viz()
            .container("#treemap_plus_container")  // container DIV to hold the visualization
            .data(arr_data)   // data to use with the visualization
            .type("tree_map")   // visualization type
            .id("major")    // key for which our data is unique on
            .size("Employment Rate")    // sizing of blocks
            .timing({"transitions": 1500})
            .draw();             // finally, draw the visualization!

        // set click listener to go back to root tree map
        setOnRectClickListener();

        // Replace the tree map sections with easy-to-see color range
        setTimeout(function() {

            // Use d3's color range for College of Engineering instead
            if (collegeSelected == "College of Engineering")
                return;

            var d3plusRects = $('.d3plus_rect');

            var colorScale = $index.getCollegeColorScale(collegeSelected);
            for (var i = 0; i < d3plusRects.length; i++) {
                var g = d3plusRects[i];
                var rect = g.children[0];
                var text = g.children[1];

                $(rect).attr('fill', colorScale[i]);
                $(text).attr('fill', '#000000');
            }
        }, 500);

        function filterData(data) {
            // hashmap: key (major) => value (Placement Rate)
            var hashMap = {};

            for (var i in data)
            {
                // OMAR
                var majorObj = data[i];
                var major = majorObj['Major'];
                var majorCollege = $employment_filter.getCollegeFromMajor(major);

                if (majorCollege != collegeSelected)
                    continue;

                var date = parseDate(majorObj['Date']);

                if (date.year >= $employment_filter.getStartYear() && date.year <= $employment_filter.getEndYear())
                {
                    var employmentRate = majorObj['Placement Rate'];

                    if (major in hashMap == false)
                        hashMap[major] = [employmentRate];
                    else
                        hashMap[major].push(employmentRate);
                }

            }

            var arr_data = [];
            for (var major in hashMap)
            {
                var avg = average(hashMap[major]);

                arr_data.push({"major":major, "Employment Rate":avg});
            }

            return arr_data;
        }
    };

    this.reDraw = function() {
        d3.select('#treemap_plus_container').select('svg').remove();

        if (collegeSelected == null)
        {
            this.drawColleges();
        }
        else
        {
            if ($employment_filter.isExcluded(collegeSelected) == false)
                this.drawMajors();
            else
            {
                collegeSelected = null;
                this.drawColleges();
            }
        }
    };

    function setOnRectClickListener()
    {
        // Wait for elements to be injected into html
        setTimeout(function() {
            $('#treemap_plus_container svg .d3plus_rect').click(function() {

                if (collegeSelected == null) {
                    var id = $(this).find("text").attr('id');
                    var split = id.split('_');

                    var college = '';
                    for (var i = 2; i < split.length - 1; i++) {
                        college += split[i];

                        if (i != split.length - 2)
                            college += ' ';
                    }

                    //console.log("College selected: " + college);
                    collegeSelected = college;
                }
                else
                    collegeSelected = null;

                _this.reDraw();

            });
        }, 1000);

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

    function average(numArr)
    {
        var avg = 0;
        for (i in numArr)
            avg += numArr[i];

        return avg / numArr.length;
    }

    /* accessors */
    this.getCollegesData = function() { return collegesData; };
    this.getBSMajorsData = function() { return bsMajorsData; };
    this.getMSMajorsData = function() { return msMajorsData; };
    this.getCollegeSelected = function() { return collegeSelected; }
}