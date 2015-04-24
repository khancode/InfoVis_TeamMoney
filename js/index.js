/**
 * Created by khancode on 3/19/2015.
 */

console.log("inside index.js");

$('#reset_button').on('click', function() {

    $employment_filter.reset();

    $scatter_animation.reset();
    $time_series.reDraw();
    $responsive_bar_chart.update();
    $tree_map.reDraw();
    $salaries_stacked_bar_chart.reDraw();

    $('#bsDegreeRadio').prop('checked', true);
    $('#inStateTuitionRadio').prop('checked', true);
    $('#time_scale_years_text').html('Years: 2011 - 2015');
});

/* Radio buttons */
$('.degree_radio_group').on('change', function() {

    var degreeLevel = $(this).val();
    //Omar
    $employment_filter.setDegreeLevel(degreeLevel);

    $time_series.update();
    $scatter_animation.update();
    $responsive_bar_chart.update();
    $tree_map.reDraw();
    //$overall_salary_dashboard.reDraw();

    $salaries_stacked_bar_chart.reDraw();

    // TODO the years and filter shouldn't be reset, need to fix this update.
    //$('#treemap_years_text').text('Years 2006 - 2014');
    //$employment_filter.clear(degreeLevel);
});

$('.in-out-state_tuition_radio_group').on('change', function() {

    var inOutStateTuitionType = $(this).val();

    console.log('inOutStateTuitionType: ' + inOutStateTuitionType);

    //Omar
    $employment_filter.setTuitionType(inOutStateTuitionType);

    //$time_series.update();
    //$scatter_animation.update();
    $responsive_bar_chart.update();
    //$tree_map.reDraw();
    ////$overall_salary_dashboard.reDraw();
    //
    //$salaries_stacked_bar_chart.reDraw();

    // TODO the years and filter shouldn't be reset, need to fix this update.
    //$('#treemap_years_text').text('Years 2006 - 2014');
    //$employment_filter.clear(degreeLevel);
});

$index = new CollegeColors();

function CollegeColors()
{
    var collegeColors = {'College of Architecture':'#B22200',
        'College of Computing':'#EACE3F',
        'College of Engineering':'#282F6B',
        'Ivan Allen College':'#B35C1E',
        'Scheller College of Business':'#224F20',
        'College of Sciences':'#5F487C'
    };

    var collegeColorScale = {
        'College of Architecture': ['#fef0d9', '#fdcc8a', '#fc8d59', '#e34a33', '#b30000'],
        'College of Computing': ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c'],
        'Ivan Allen College': ['#fe9929', '#ec7014', '#cc4c02', '#993404', '#662506'], // maybe incomplete
        'Scheller College of Business': ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b'],
        'College of Sciences': ['#fcfbfd', '#efedf5', '#dadaeb', '#bcbddc', '#9e9ac8', '#807dba', '#6a51a3', '#54278f', '#3f007d'] // maybe incomplete

    };

    this.getCollegeColor = function(college) {
        return collegeColors[college];
    };

    this.getCollegeFromColor = function(color) {

        for (var key in collegeColors) {
            if (color == collegeColors[key])
                return key;
        }
    };

    this.getCollegeColorScale = function(college) {

        return collegeColorScale[college];
    };
}

//var colleges;

///* Omar wrote this */
//$.getScript("js/treemap_plus.js", function(){
//
//    console.log("Script loaded and executed.");
//    // here you can use anything you defined in the loaded script
//
//    setTimeout(function (){
//
//        //something you want delayed
//        setSelector();
//
//    }, 1000); // how long do you want the delay to be?
//
//});
//
//function setSelector() {
//    $(".d3plus_rect").click(function() {
//        //alert('hai');
//
//        //alert($(this).text());
//
//        //var backgroundColor = $(this).css("background-color");
//        //alert("bgcolor: " + backgroundColor);
//
//        //$(this).css('background-color', 'yellow');
//        //$(this).
//
//        //alert($(this).find("tspan").text());
//        console.log($(this).find("text").attr('id'));
//        var id = $(this).find("text").attr('id');
//        var split = id.split('_');
//        //alert(split);
//
//        var college = '';
//        for (var i = 2; i < split.length - 1; i++) {
//            college += split[i];
//
//            if (i != split.length - 2)
//                college += ' ';
//        }
//
//        alert(college);
//        console.log("College selected: " + college);
//
//        // now get background color
//        var bgclr = $(this).find("rect").css('fill');
//        console.log(bgclr);
//
//        $(this).find("rect").css('fill', 'yellow');
//
//
//        data.push({name:college});
//        rawr.$apply(function() {
//            rawr.colleges = data;
//        })
//    });
//}