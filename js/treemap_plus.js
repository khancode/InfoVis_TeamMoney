/**
 * Created by khancode on 3/19/2015.
 */

$tree_map = new TreeMap();
// Default tree map 2006 - 2014
$tree_map.draw();//'Bachelors', 2006, 2014);

function TreeMap()
{
    _this = this; // store instance reference to use inside d3.json()
    this.degreeLevel = 'Bachelors';
    this.startYear = 2006;
    this.endYear = 2014;

    this.draw = function() //level, startYear, endYear)
    {
        $('#treemap_years_text').text('Years ' + this.startYear + ' - ' + this.endYear);

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
                var curLevel = data[i]['Level'];
                var medianSalary = data[i]['Median Overall Salary'];

                if (date.year >= _this.startYear && date.year <= _this.endYear) {

                    if (curLevel == _this.degreeLevel)
                    {
                        //console.log('good');
                        //console.log('level: ' + level);
                        //console.log('year: ' + date.year);

                        if (college in hashMap == false)
                            hashMap[college] = [medianSalary];
                        else
                            hashMap[college].push(medianSalary);

                        //console.log('date: ' + date.toString());
                        //console.log('college: ' + college);
                        //console.log('medianSalary: ' + medianSalary);
                    }
                }
            }

            //console.log('hashMap: ' + hashMap);

            var arr_data = [];
            for (var college in hashMap)
            {
                var avg = average(hashMap[college]);
                //console.log('college: ' + college);
                //console.log('avg: ' + avg);

                arr_data.push({"college":college, "medianSalary":avg});
            }

            //console.log(arr_data);

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
                .size("medianSalary") //"value")      // sizing of blocks
                .draw();             // finally, draw the visualization!

        });

    };

    this.reDraw = function() { //level, startYear, endYear) {
        d3.select('#treemap_plus_container').select('svg').remove();
        this.draw();
    };

    this.setParams = function(degreeLevel, startYear, endYear) {
        this.degreeLevel = degreeLevel;
        this.startYear = startYear;
        this.endYear = endYear;
    };

    this.setDegreeLevel = function(degreeLevel) {
        this.degreeLevel = degreeLevel;
    };


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