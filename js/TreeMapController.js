/**
 * Created by khancode on 3/19/2015.
 */

var mod = angular.module('TreeMap', []);
mod.controller('TestController', ['$scope', TestNgRepeat]);

function TestNgRepeat($scope){
    $scope.colleges = data;

    rawr = $scope;

    $scope.login = function() {
        alert('NEED TO IMPLEMENT: Login');

        var username = $('#usernameInput').val();
        var password = $('#passwordInput').val();

        alert('username: ' + username);
        alert('password: ' + password);
    };

    //// Simple POST request example (passing data) :
    //$http.post('http://studyonthegoapp.com/khancode.php', {msg:'hello word!'}).
    //    success(function(data, status, headers, config) {
    //        // this callback will be called asynchronously
    //        // when the response is available
    //        alert('data: ' + JSON.stringify(data));
    //
    //    }).
    //    error(function(data, status, headers, config) {
    //        // called asynchronously if an error occurs
    //        // or server returns response with an error status.
    //    });
}

var rawr;

var counter = 1;

var data = [
    {
        name:'Omar',
        size:300000
    },
    {
        name:'Titus',
        size:65000
    }
];