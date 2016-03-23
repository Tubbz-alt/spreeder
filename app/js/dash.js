angular.module('spreeder.dash', ['ngRoute'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/dashboard', {
        redirectTo: '/dashboard/spreed'
      }).
      when('/dashboard/spreed', {
        templateUrl: '/views/get_text.html',
        controller: 'DashCtrl'
      }).
      when('/dashboard/metrics', {
        templateUrl: '/views/metrics.html',
        controller: 'DashCtrl'
      })
  }])
  .controller('DashCtrl', ['$scope',
    function($scope) {
      $scope.speedRead = function() {

      };
    }
  ]);