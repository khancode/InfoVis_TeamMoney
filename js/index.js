/*
    100% of the code is original and not copied in this file
 */

// Setting a listener for reset button to reset overall filter and reload all visualizations
$('#reset_button').on('click', function() {

    // reset overall filter
    $employment_filter.reset();

    // update vizs
    $scatter_animation.reset();
    $time_series.reDraw();
    $responsive_bar_chart.update();
    $tree_map.reDraw();
    $salaries_stacked_bar_chart.reDraw();

    // reset radio buttons and time scale years text
    $('#bsDegreeRadio').prop('checked', true);
    $('#inStateTuitionRadio').prop('checked', true);
    $('#time_scale_years_text').html('Years: 2011 - 2015');
});

// Setting a listener for degree radio group buttons
// Vizs should update after applying filter
$('.degree_radio_group').on('change', function() {

    // set degree level filter
    var degreeLevel = $(this).val();
    $employment_filter.setDegreeLevel(degreeLevel);

    // Update vizs
    $time_series.update();
    $scatter_animation.update();
    $responsive_bar_chart.update();
    $tree_map.reDraw();
    $salaries_stacked_bar_chart.reDraw();
});

$('.in-out-state_tuition_radio_group').on('change', function() {

    // apply filter
    var inOutStateTuitionType = $(this).val();
    $employment_filter.setTuitionType(inOutStateTuitionType);

    // update mirrored bar chart
    $responsive_bar_chart.update();
});

// $index is used to hold associated college colors
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
