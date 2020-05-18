var app = angular.module('pdfApp',[]);
app.controller('pdfController',function($scope){
	$scope.pdf = function(pdfs){
      var doc = new jsPDF()
			doc.text(pdfs.name, 10, 10)
			doc.save('a4.pdf')
	}
})