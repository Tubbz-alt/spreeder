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
      $scope.chunks = [
        {
          name: 'one word at a time',
          size: 1
        },
        {
          name: 'Two words at a time',
          size: 2
        },
        {
          name: 'Three word at a time',
          size: 3
        }
      ];

      $scope.speeds = [300, 320, 340, 360];
    }
  ]);