var app = angular.module('forgotapp', []);
app.controller('forgotController', function($scope,$http){
  
  $scope.forgot = function(a){
  	$http({
  		method : 'POST',
  		url : '/postforgot',
  		data : $scope.a
  	}).then(function success(response){
  		alert('Email Sent')
      window.location.href='/';
  	}, function error(response){
  		alert('error occured, please try again later')
  	})
  }

});