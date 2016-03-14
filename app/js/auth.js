angular.module('spreeder.auth', [])
.controller('LoginCtrl', ['$scope', function($scope) {
  $scope.$parent.login_active = 'active';
  $scope.$parent.signup_active = '';
}])
.controller('SignupCtrl', ['$scope', function($scope) {
  $scope.$parent.login_active = '';
  $scope.$parent.signup_active = 'active';
}]);