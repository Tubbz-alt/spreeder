angular.module('spreeder.auth', [])
  .controller('AuthCtrl', ['$scope', '$location', function($scope, $location) {
    if ($location.path() == '/login') {
      $scope.login_active = true;
    } else {
      $scope.login_active = false;
    }
  }]);
