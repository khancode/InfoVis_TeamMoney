/**
 * Created by khancode on 4/22/2015.
 */

$responsive_bar_chart = new ResponsiveBarChart();
$responsive_bar_chart.init();

function ResponsiveBarChart() {

    var _this = this;

    var collegesData;
    var bsTuitionRates;
    var msTuitionRates;

    var stackedbar;

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
            var filename = 'json/ms_tuition_rates.csv';
            d3.csv(filename, function (error, data) {
                msTuitionRates = data;
                _this.draw();
            });
        }
    };

    this.draw = function() {
        stackedbar = new D3StackedBar({
            container: "#stacked_bar_chart_container"
        });
        stackedbar.show();
        this.update();
    };

//    this.update = function() {
//
//        var data;
//        if ($employment_filter.getDegreeLevel() == 'Bachelors')
//            data = filterBSData();
//        else if ($employment_filter.getDegreeLevel() == 'Masters')
//            data = filterMSData();
//
//        var newData = new Array();
//        var categories = ['Tuition', 'Salary', 'Bonus'];
//
//        for (var i = 0; i < categories.length; i++)
//        {
//            var category = {key: categories[i], values: new Array()};
//            for (var college in data)
//            {
//                var collegeObj = data[college];
//                //console.log('collegeObj->');
//                //console.log(collegeObj);
//
//                var collegeInitials = $employment_filter.getCollegeInitials(college);
//                if (categories[i] == 'Tuition') {
//                    if ($employment_filter.getDegreeLevel() == 'Bachelors') {
//                        //var inOutStateAvg = -1 * (collegeObj['in-state-more-than-6hrs'] + collegeObj['out-of-state-more-than-6hrs']) / 2;
//                        var inOutStateAvg = -1 * collegeObj['in-state-more-than-6hrs'] //+ collegeObj['out-of-state-more-than-6hrs']) / 2;
//                        category.values.push({x: collegeInitials, y:inOutStateAvg});
//                    }
//                    else if ($employment_filter.getDegreeLevel() == 'Masters') {
//                        var inOutStateAvg = -1 * (collegeObj['in-state-more-than-12hrs'] + collegeObj['out-of-state-more-than-12hrs']) / 2;
//                        category.values.push({x: collegeInitials, y: inOutStateAvg});
//                    }
//                }
//                else if (categories[i] == 'Salary') {
//                    category.values.push({x: collegeInitials, y: collegeObj['Median Overall Salary']});
//                }
//                else if (categories[i] == 'Bonus') {
//                    category.values.push({x: collegeInitials, y: collegeObj['Median Overall Bonus']});
//                }
//            }
//
//            newData.push(category);
//        }
//
//        console.log('newData: ');
//        console.log(newData);
//
//        stackedbar.dataset = newData;
//        stackedbar.update();
//
//        //var newData = new Array();
//        //var year = 2007;//getRandomInt(2005, 2014);
//        //var numCategories = 2;//getRandomInt(1, 10);
//        // for (var i=0; i<numCategories; i++) {
//        // 	var category = {};
//        // 	category.key = "category "+i;
//        // 	category.values = new Array();
//        // 	for (var j=year; j<=2015; j++) {
//        // 		category.values.push({ x: j, y: getRandomInt(-50, 50) });
//        // 	// 	category.values.push({ x: j, y: -45 });
//
//        // 	};
//        // 	// category.values.push({x:j, y:-45});
//        // 	// category.values.push({x:2007, y:80});
//
//
//        // 	newData.push(category);
//        // }
//
//        ///* OMAR CODE */
//        //var category = {key: 'Tuition', values: new Array()};
//        //category.values.push({x: 'CoC', y: -15000})
//        //category.values.push({x: 'CoA', y: -15000})
//        //newData.push(category);
//        //
//        //var category = {key: 'Salary', values: new Array()};
//        //category.values.push({x: 'CoC', y: 65000})
//        //category.values.push({x: 'CoA', y: 45000})
//        //newData.push(category);
//        //
//        //var category = {key: 'Bonus', values: new Array()};
//        //category.values.push({x: 'CoC', y: 5000})
//        //category.values.push({x: 'CoA', y: 3500})
//        //newData.push(category);
//        ///* OMAR CODE */
//
//        //stackedbar.dataset = newData;
//        //stackedbar.update();
////});
//    };

    this.update = function() {

        var data;
        if ($employment_filter.getDegreeLevel() == 'Bachelors')
            data = filterBSData();
        else if ($employment_filter.getDegreeLevel() == 'Masters')
            data = filterMSData();

        var newData = new Array();
        var categories = ['Tuition', 'Salary', 'Bonus'];

        for (var i = 0; i < categories.length; i++)
        {
            var category = {key: categories[i], values: new Array()};
            for (var college in data)
            {
                var collegeObj = data[college];
                //console.log('collegeObj->');
                //console.log(collegeObj);

                var collegeInitials = $employment_filter.getCollegeInitials(college);
                if (categories[i] == 'Tuition') {
                    if ($employment_filter.getDegreeLevel() == 'Bachelors') {
                        var tuitionSum;
                        if ($employment_filter.getTuitionType() == 'In-State')
                            tuitionSum = -1 * collegeObj['in-state-more-than-6hrs'];
                        else if ($employment_filter.getTuitionType() == 'Out-Of-State')
                            tuitionSum = -1 * collegeObj['out-of-state-more-than-6hrs'];

                        category.values.push({x: collegeInitials, y:tuitionSum});
                    }
                    else if ($employment_filter.getDegreeLevel() == 'Masters') {
                        var tuitionSum;
                        if ($employment_filter.getTuitionType() == 'In-State')
                            tuitionSum = -1 * collegeObj['in-state-more-than-12hrs'];
                        else if ($employment_filter.getTuitionType() == 'Out-Of-State')
                            tuitionSum = -1 * collegeObj['out-of-state-more-than-12hrs'];

                        category.values.push({x: collegeInitials, y: tuitionSum});
                    }
                }
                else if (categories[i] == 'Salary') {
                    category.values.push({x: collegeInitials, y: collegeObj['Median Overall Salary']});
                }
                else if (categories[i] == 'Bonus') {
                    category.values.push({x: collegeInitials, y: collegeObj['Median Overall Bonus']});
                }
            }

            newData.push(category);
        }

        console.log('newData: ');
        console.log(newData);

        stackedbar.dataset = newData;
        stackedbar.update();

        //var newData = new Array();
        //var year = 2007;//getRandomInt(2005, 2014);
        //var numCategories = 2;//getRandomInt(1, 10);
        // for (var i=0; i<numCategories; i++) {
        // 	var category = {};
        // 	category.key = "category "+i;
        // 	category.values = new Array();
        // 	for (var j=year; j<=2015; j++) {
        // 		category.values.push({ x: j, y: getRandomInt(-50, 50) });
        // 	// 	category.values.push({ x: j, y: -45 });

        // 	};
        // 	// category.values.push({x:j, y:-45});
        // 	// category.values.push({x:2007, y:80});


        // 	newData.push(category);
        // }

        ///* OMAR CODE */
        //var category = {key: 'Tuition', values: new Array()};
        //category.values.push({x: 'CoC', y: -15000})
        //category.values.push({x: 'CoA', y: -15000})
        //newData.push(category);
        //
        //var category = {key: 'Salary', values: new Array()};
        //category.values.push({x: 'CoC', y: 65000})
        //category.values.push({x: 'CoA', y: 45000})
        //newData.push(category);
        //
        //var category = {key: 'Bonus', values: new Array()};
        //category.values.push({x: 'CoC', y: 5000})
        //category.values.push({x: 'CoA', y: 3500})
        //newData.push(category);
        ///* OMAR CODE */

        //stackedbar.dataset = newData;
        //stackedbar.update();
//});
    };

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    function filterMSData() {
        console.log('sup bro');

        var data = msTuitionRates;

        console.log(data);

        // hashmap: key (college) => value (Placement Rate)
        var hashMap = {};

        for (var i in data)
        {
            var college = data[i]['college'];
            if ($employment_filter.isExcluded(college))
                continue;

            // in-state-less-than-11hrs,in-state-more-than-12hrs,out-of-state-less-than-12hrs,out-of-state-more-than-12hrs

            //console.log('date');
            //console.log(data[i]['date']);
            var date = parseTuitionDate(data[i]['date']);
            var in_state_less_than_12hrs = parseInt(data[i]['in-state-less-than-12hrs']);
            var in_state_more_than_12hrs = parseInt(data[i]['in-state-more-than-12hrs']);
            var out_of_state_less_than_12hrs = parseInt(data[i]['out-of-state-less-than-12hrs']);
            var out_of_state_more_than_12hrs = parseInt(data[i]['out-of-state-more-than-12hrs']);

            if (date.year >= $employment_filter.getStartYear() && date.year <= $employment_filter.getEndYear())
            {
                if (college in hashMap == false) {
                    hashMap[college] = {
                        in_state_less_than_12hrs: [in_state_less_than_12hrs],
                        in_state_more_than_12hrs: [in_state_more_than_12hrs],
                        out_of_state_less_than_12hrs: [out_of_state_less_than_12hrs],
                        out_of_state_more_than_12hrs: [out_of_state_more_than_12hrs]
                    };
                }
                else {
                    hashMap[college]['in_state_less_than_12hrs'].push(in_state_less_than_12hrs);
                    hashMap[college]['in_state_more_than_12hrs'].push(in_state_more_than_12hrs);
                    hashMap[college]['out_of_state_less_than_12hrs'].push(out_of_state_less_than_12hrs);
                    hashMap[college]['out_of_state_more_than_12hrs'].push(out_of_state_more_than_12hrs);
                }
            }
        }

        // Average it now
        for (var college in hashMap)
        {
            hashMap[college]['in_state_less_than_12hrs'] = sum(hashMap[college]['in_state_less_than_12hrs']);
            hashMap[college]['in_state_more_than_12hrs'] = sum(hashMap[college]['in_state_more_than_12hrs']);
            hashMap[college]['out_of_state_less_than_12hrs'] = sum(hashMap[college]['out_of_state_less_than_12hrs']);
            hashMap[college]['out_of_state_more_than_12hrs'] = sum(hashMap[college]['out_of_state_more_than_12hrs']);
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
                            'Median Overall Salary': [medianSalary],
                            'Median Overall Bonus': [medianBonus]
                        };
                    }
                    else {
                        salaryHashMap[college]['Median Overall Salary'].push(medianSalary);
                        salaryHashMap[college]['Median Overall Bonus'].push(medianBonus);
                    }
                }
            }
        }

        //console.log('salaryHashMap');
        //console.log(salaryHashMap);

        // Average salary/bonus now
        for (var college in salaryHashMap)
        {
            salaryHashMap[college]['Median Overall Salary'] = average(salaryHashMap[college]['Median Overall Salary']);
            salaryHashMap[college]['Median Overall Bonus'] = average(salaryHashMap[college]['Median Overall Bonus']);
        }

        //console.log('salaryHashMap averaged');
        //console.log(salaryHashMap);

        //var arr_data = [];
        var arr_data = {};
        for (var college in hashMap)
        {
            arr_data[college] = {
                "in-state-less-than-12hrs": hashMap[college]['in_state_less_than_12hrs'],
                "in-state-more-than-12hrs": hashMap[college]['in_state_more_than_12hrs'],
                "out-of-state-less-than-12hrs": hashMap[college]['out_of_state_less_than_12hrs'],
                "out-of-state-more-than-12hrs": hashMap[college]['out_of_state_more_than_12hrs'],
                "Median Overall Salary": null,
                "Median Overall Bonus": null
            }
        }

        // Now put salary & bonus into arr_data
        for (var college in arr_data)
        {
            if (college in salaryHashMap) {
                arr_data[college]['Median Overall Salary'] = salaryHashMap[college]['Median Overall Salary'];
                arr_data[college]['Median Overall Bonus'] = salaryHashMap[college]['Median Overall Bonus'];
            }
        }

        console.log('arr_data: ');
        console.log(arr_data);

        return arr_data;
    }

    function filterBSData() {
        console.log('sup bro');

        var data;
        if ($employment_filter.getDegreeLevel() == 'Bachelors')
            data = bsTuitionRates;
        else if ($employment_filter.getDegreeLevel() == 'Masters')
            data = msTuitionRates;

        console.log(data);

        // hashmap: key (college) => value (Placement Rate)
        var hashMap = {};

        for (var i in data)
        {
            var college = data[i]['college'];
            if ($employment_filter.isExcluded(college))
                continue;

            //console.log('date');
            //console.log(data[i]['date']);
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
            hashMap[college]['in_state_less_than_6hrs'] = sum(hashMap[college]['in_state_less_than_6hrs']);
            hashMap[college]['in_state_more_than_6hrs'] = sum(hashMap[college]['in_state_more_than_6hrs']);
            hashMap[college]['out_of_state_less_than_6hrs'] = sum(hashMap[college]['out_of_state_less_than_6hrs']);
            hashMap[college]['out_of_state_more_than_6hrs'] = sum(hashMap[college]['out_of_state_more_than_6hrs']);
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
                            'Median Overall Salary': [medianSalary],
                            'Median Overall Bonus': [medianBonus]
                        };
                    }
                    else {
                        salaryHashMap[college]['Median Overall Salary'].push(medianSalary);
                        salaryHashMap[college]['Median Overall Bonus'].push(medianBonus);
                    }
                }
            }
        }

        //console.log('salaryHashMap');
        //console.log(salaryHashMap);

        // Average salary/bonus now
        for (var college in salaryHashMap)
        {
            salaryHashMap[college]['Median Overall Salary'] = average(salaryHashMap[college]['Median Overall Salary']);
            salaryHashMap[college]['Median Overall Bonus'] = average(salaryHashMap[college]['Median Overall Bonus']);
        }

        //console.log('salaryHashMap averaged');
        //console.log(salaryHashMap);

        //var arr_data = [];
        var arr_data = {};
        for (var college in hashMap)
        {
            //arr_data.push(
            //    {
            //        "college":college,
            //        "in-state-less-than-6hrs": hashMap[college]['in_state_less_than_6hrs'],
            //        "in-state-more-than-6hrs": hashMap[college]['in_state_more_than_6hrs'],
            //        "out-of-state-less-than-6hrs": hashMap[college]['out_of_state_less_than_6hrs'],
            //        "out-of-state-more-than-6hrs": hashMap[college]['out_of_state_more_than_6hrs']
            //    }
            //);

            arr_data[college] = {
                "in-state-less-than-6hrs": hashMap[college]['in_state_less_than_6hrs'],
                "in-state-more-than-6hrs": hashMap[college]['in_state_more_than_6hrs'],
                "out-of-state-less-than-6hrs": hashMap[college]['out_of_state_less_than_6hrs'],
                "out-of-state-more-than-6hrs": hashMap[college]['out_of_state_more_than_6hrs'],
                "Median Overall Salary": null,
                "Median Overall Bonus": null
            }
        }

        // Now put salary & bonus into arr_data
        for (var college in arr_data)
        {
            if (college in salaryHashMap) {
                arr_data[college]['Median Overall Salary'] = salaryHashMap[college]['Median Overall Salary'];
                arr_data[college]['Median Overall Bonus'] = salaryHashMap[college]['Median Overall Bonus'];
            }
        }

        console.log('arr_data: ');
        console.log(arr_data);

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
        for (var i in numArr)
            avg += numArr[i];

        return Math.round(avg / numArr.length);
    }

    function sum(numArr)
    {
        var sum = 0;
        for (var i in numArr)
            sum += numArr[i];

        return Math.round(sum);
    }

    /* accessors */
    this.getCollegesData = function() { return collegesData; };
    this.getBSTuitionRates = function() { return bsTuitionRates; };
    this.getMSTuitionRates = function() { return msTuitionRates; };
}