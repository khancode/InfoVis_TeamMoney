/**
 * Created by khancode on 4/11/2015.
 */

$employment_filter = new EmploymentFilter();

function EmploymentFilter()
{
    // private members
    var degreeLevel = 'Bachelors'; // default
    var startYear = 2011; // default
    var endYear = 2015; // default
    var tuitionType = 'In-State'; // ('In-State' or 'Out-Of-State') only used by responsive_bar_chart
    var collegesExcluded = {}; // treated as a hashset with value ignored: key (college) => value (true)

    //FILTERING DATA
    var collegeInitials = {
        'College of Architecture':'CoA',
        'College of Computing':'CoC',
        'College of Engineering':'CoE',
        'Ivan Allen College':'IAC',
        'Scheller College of Business':'CoB',
        'College of Sciences':'CoS'
    };

    var bsMajorsCollege =
    {
        "College of Architecture" : ["Architecture", "Building Construction", "Industrial Design"],
        "College of Computing" : ["Computational Media", "Computer Sci"],
        "College of Engineering" : ["Nucleaer & Radiological Engr","Material Sci & Engr","Environmental Engr","Chemical Engr","Polymer & Fiber Engr","Nuclear & Radiological Engr","Materials Sci & Engr","Chemical & Biochemical Engr", "Polymer & Fiber Engr", "Nuclear & Radiological Engr", "Mechanical Engr", "Materials Sci & Engr", "Aerospace Engr", "Biomedical Engr", "Chemical and Biomolecular Eng", "Civil Engr", "Computer Engr", "Electrical Engr", "Industrial Engr"],
        "Ivan Allen College" : ["Global Economics & Modern Lang","Applied Lang & Inercultural Studies","Sci, Technology & Culture","International Affairs & Modern Langs","History, Technology & Society","Global Economics and Modern Langs","Economics and International Affairs","International Affairs & Modern Lang","Economics & International Affairs","Sci, Technology, & Culture", "Public Policy", "Econ & Int'l Affairs", "History, Technology, & Society", "Int'l Affairs & Mod Lang", "International Affairs", "Global Econ/Mod Lang"],
        "Scheller College of Business" : ["Management", "Economics","Business Administration"],
        "College of Sciences" : ["Earth and Atmospheric Sci","Biochemistry","Applied Physics","Mathematics","Biology", "Psychology", "Physics", "Applied Biology", "Applied Mathematics", "Chemistry", "Discrete Mathematics", "Earth & Atmospheric Sci"]
    };
    var msMajorsCollege =
    {

        "College of Architecture" : ["City Planning","Architecture","Building Construction","Industrial Design","Urban Design"],
        "College of Computing" : ["Computer Sci", "Human Computer Interaction","Digital Media","Information Design & Technology","Information Security","Human-Computer Interaction"],
        "College of Engineering" : ["Industrial Engr","Health Systems","Environmental Engr","Supply Chain Engr","Applied Systems Engr","Biomedical Engr","Engr Sci & Mechanics","Materials Sci & Engr","Paper Sci Engr","Nuclear & Radiological Engr","Engr Sci & Mechanics","Electrical & Computer Engr","Polymer & Fiber Engr","BioEngineering","Computational Sci & Engr","Material Sci & Engr","Operations Research","Nuclear & Radiological Engr","Electrical & Computer Engr","Civil Engr","Aerospace Engr","Bioengineering", "Chemical Engr","Mechanical Engr"],
        "Ivan Allen College" : ["History & Sociology of Technology & Sci","International Affairs","Public Policy","History of Technology","International Logistics","History, Technology & Society","Music Technology"],
        "Scheller College of Business" : ["Economics","Management","Global MBA","Management of Technology","Quantitative & Computational Finance","Quanta & Computation Fin","Global Business","Business Administration","Global Executive MBA"],
        "College of Sciences" : ["Health Systems","Earth & Atmospheric Sci","Chemistry","Applied Physiology", "Bioinformatics","Biomedical Innov & Dev", "Biology","Mathematics","Prosthetics & Orthotics","Alg, Combo & Optimization","Statistics","Medical Physics","Physics","Psychology","Earth and Atmospheric Sci"]
    };

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

        //console.log('college to be excluded: ' + college);
        //console.log(collegesExcluded);
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

    this.setTuitionType = function(tuitionTypeInput) {
        tuitionType = tuitionTypeInput;
    };

    this.getCollegeFromMajor = function (major) {

        var mapping;
        if (degreeLevel == 'Bachelors')
            mapping = bsMajorsCollege;
        else if (degreeLevel == 'Masters')
            mapping = msMajorsCollege;

        for (var college in mapping) {
            //if (major in mapping[college])
            //    return college;

            var arrMajors = mapping[college];
            for (var i in arrMajors) {
                if (major == arrMajors[i])
                    return college;
            }
        }
    };

    this.getCollegeInitials = function(college) {
        return collegeInitials[college];
    };

    this.getDegreeLevel = function() { return degreeLevel; };
    this.getStartYear = function() { return startYear; };
    this.getEndYear = function() { return endYear; };
    this.getTuitionType = function() { return tuitionType; }
}