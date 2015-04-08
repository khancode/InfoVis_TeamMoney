/**
 * Created by khancode on 3/19/2015.
 */

console.log("inside index.js");





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