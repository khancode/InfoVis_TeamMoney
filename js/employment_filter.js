/**
 * Created by khancode on 4/11/2015.
 */

$employment_filter = new EmploymentFilter();

function EmploymentFilter()
{
    this.collegesExcluded = {}; // treated as a hashset with value ignored: key (college) => value (true)

    /**
     *  Takes college as input and checked as hashset key:
     *      if it already exists, then remove it from collegesExcluded
     *      otherwise, add it to collegesExcluded
     */
    this.filter = function(college) {

        if (college in this.collegesExcluded)
            delete this.collegesExcluded[college];
        else
            this.collegesExcluded[college] = true;

        //console.log('collegesExcluded:');
        //console.log(this.collegesExcluded);
    };

    this.isExcluded = function(college) {

        return college in this.collegesExcluded;
    };

    this.clear = function() {
        for (college in this.collegesExcluded)
            delete this.collegesExcluded[college];
    };
}