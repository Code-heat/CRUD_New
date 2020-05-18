var app = angular.module('myApp',[]);
app.controller('myController',['$scope', '$http', function($scope,$http){

  $http({
    method : 'GET',
    url : '/getuser',
  }).then(function success(response){
    //console.log(response.data);
    $scope.user = response.data;
  },function error(response){
    alert('error occured, please try again later!')
  })

  $scope.saveData = function(users){
  	console.log($scope.users);
    $http({
    	method : 'POST',
    	url : '/postuser',
    	data : $scope.users
    }).then(function success(response){
    	//alert('Inserted succesfully');
      $scope.user.push(response.data);
    	$scope.users = {};
    }, function error(response){
    	alert('Error occured, please try again');
    })
  }
  
  $scope.updateData = function(users){
    console.log(users);
    $scope.editUser = false;
    $http({
      method : 'PUT',
      url : '/edituser/'+users._id,
      data : users
    }).then(function success(response){
      alert('updated succesfully');
    }, function error(response){
      alert('error occured, please try again');
    })
  }

  $scope.removeData = function(users){
    //console.log(users._id);
    $http({
      method : 'DELETE',
      url : '/deleteuser/'+users._id
    }).then(function success(response){
       alert('removed succesfully')
       var index = $scope.user.indexOf(users);
       $scope.user.splice(index,1);
    }, function error(response){
       alert('Error occured, please try again');
    })
  }

}])