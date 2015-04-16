/**
 * Created by khancode on 4/11/2015.
 */

$employment_filter = new EmploymentFilter();

function EmploymentFilter()
{
    // private members
    var degreeLevel = 'Bachelors'; // default
    var startYear = 2006; // default
    var endYear = 2014; // default
    var collegesExcluded = {}; // treated as a hashset with value ignored: key (college) => value (true)

    /**
     *  Takes college as input and checked as hashset key:
     *      if it already exists, then remove it from collegesExcluded
     *      otherwise, add it to collegesExcluded
     */
    this.filterCollege = function(college) {

        if (college in collegesExcluded)
            delete collegesExcluded[college];
        else
            collegesExcluded[college] = true;

        console.log('college to be excluded: ' + college);
        console.log(collegesExcluded);
    };

    this.isExcluded = function(college) {

        return college in collegesExcluded;
    };

    this.clear = function(degreeLevelInput) {
        // TODO for temporary use, look at index.js for problem description
        degreeLevel = degreeLevelInput;
        startYear = 2006;
        endYear = 2014;
        for (var college in collegesExcluded)
            delete collegesExcluded[college];
    };

    this.setDegreeLevel = function(degreeLevelInput) {
        degreeLevel = degreeLevelInput;
    };

    this.setStartEndYear = function(startYearInput, endYearInput) {
        startYear = startYearInput;
        endYear = endYearInput;
    };

    this.getDegreeLevel = function() { return degreeLevel; };
    this.getStartYear = function() { return startYear; };
    this.getEndYear = function() { return endYear; };
}