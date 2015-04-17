/**
 * Created by khancode on 3/19/2015.
 */

$tree_map = new TreeMap();
// Default tree map 2006 - 2014
$tree_map.draw();

function TreeMap() {

    this.draw = function() {

        var filename = 'json/all_data.json';

        d3.json(filename, function (error, data) {

            // hashmap: key (college) => value (medianSalary)
            var hashMap = {};

            for (var i in data)
            {
                var college = data[i]['College'];
                if ($employment_filter.isExcluded(college))
                    continue;

                var date = parseDate(data[i]['Date']);
                var degreeLevel = data[i]['Level'];
                //var medianSalary = data[i]['Median Overall Salary'];
                var employmentRate = data[i]['Placement Rate'];

                if (date.year >= $employment_filter.getStartYear() && date.year <= $employment_filter.getEndYear())
                {
                    if (degreeLevel == $employment_filter.getDegreeLevel())
                    {
                        if (college in hashMap == false)
                            hashMap[college] = [employmentRate]; //[medianSalary];
                        else
                            hashMap[college].push(employmentRate); //medianSalary);
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

            //// sample data array
            //var sample_data = [
            //    {"value": 50000, "name": "College of Architecture"},
            //    {"value": 77500, "name": "College of Computing"},
            //    {"value": 66716, "name": "College of Engineering"},
            //    {"value": 54000, "name": "Ivan Allen College"},
            //    {"value": 55000, "name": "Scheller College of Business"},
            //    {"value": 43250, "name": "College of Sciences"},
            //    {"value": 63000, "name": "Multidisciplinary"}
            //];

            // instantiate d3plus
            var visualization = d3plus.viz()
                .container("#treemap_plus_container")  // container DIV to hold the visualization
                .data(arr_data) //sample_data)  // data to use with the visualization
                .type("tree_map")   // visualization type
                .id("college") //"name")         // key for which our data is unique on
                .size("Employment Rate") //"medianSalary") //"value")      // sizing of blocks
                .timing({"transitions": 1500})
                .draw();             // finally, draw the visualization!

            setOnCollegeRectClickListener();
        });

    };

    this.reDraw = function() { //level, startYear, endYear) {
        d3.select('#treemap_plus_container').select('svg').remove();
        this.draw();
    };

    function setOnCollegeRectClickListener()
    {
        // Wait for elements to be injected into html
        setTimeout(function() {
            $('#treemap_plus_container svg .d3plus_rect').click(function() {

                var id = $(this).find("text").attr('id');
                var split = id.split('_');

                var college = '';
                for (var i = 2; i < split.length - 1; i++) {
                    college += split[i];

                    if (i != split.length - 2)
                        college += ' ';
                }

                console.log("College selected: " + college);
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

}