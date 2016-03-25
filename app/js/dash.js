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
      when('/dashboard/spreed/start', {
        templateUrl: '/views/start_spreed.html',
        controller: 'SpreedCtrl'
      }).
      when('/dashboard/metrics', {
        templateUrl: '/views/metrics.html',
        controller: 'DashCtrl'
      })
  }])
  .controller('DashCtrl', ['$scope', '$location', 'spreedService',
    function($scope, $location, spreedService) {
      $scope.speedRead = function() {
        if ($scope.getText.$valid) {
          spreedService.speed = $scope.speed;
          spreedService.chunkSize = $scope.chunkSize;
          spreedService.text = $scope.pasteText;
          $location.path('/dashboard/spreed/start');
        } else {
          alert('Minimum words: 100');
        }
      };
    }
  ])
  .controller('SpreedCtrl', ['$scope', 'spreedService',
    function($scope, spreedService) {
      $scope.text = spreedService.text;
    }
  ])
  .factory('spreedService', function() {
    var spreedData = {};

    spreedData.chunkSize = 1;
    spreedData.speed = 300;
    spreedData.text = '';

    return spreedData;
  });