var app = angular.module('loginapp', []);
app.controller('signupController', function($scope,$http){

  $scope.signup = function(reg){
  	$http({
  		method : 'POST',
  		url : 'postsignup',
  		data : $scope.reg
  	}).then( function success(response){
      alert('Registered Successfully');
      $scope.reg = {};
  	}, function error(response){
      alert('Registration Failed, Please try again');
  	});
  }
});

app.controller('loginController', function($scope,$http,$window){

	$scope.login = function(log){
  	$http({
      method:'POST',
      url: '/postlogin',
      data: $scope.log
    }).then(function success(response){
      //alert('login successfull');
      $window.location.href = '/home'
    }, function error(response){
      alert('invalid credentials');
      $scope.log = {};
    });
  }

})