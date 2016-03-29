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
          $scope.getText_err = [];
          spreedService.speed = $scope.speed;
          spreedService.chunkSize = $scope.chunkSize;
          spreedService.text = $scope.pasteText;
          alert(JSON.stringify($scope.chunkSize));
          $location.path('/dashboard/spreed/start');
        } else {
          $scope.getText_err = [];
          if ($scope.pasteText.length < 100) {
            $scope.getText_err.push('Minimum words: 100');
          }
          if ($scope.chunkSize == undefined) {
            $scope.getText_err.push('Choose a chunk size');
          }
          if ($scope.speed == undefined){
            $scope.getText_err.push('Choose the reading speed (words per minute)');
          }
        }
      };
    }
  ])
  .controller('SpreedCtrl', ['$scope', 'spreedService', '$interval',
    function($scope, spreedService, $interval) {
      $scope.data = spreedService;
      alert(JSON.stringify(spreedService));
      $scope.position = 0;
      $scope.live = $scope.data.text.split(' ');
      $scope.live_speed = 60000.0 / $scope.data.speed;
      alert($scope.live_speed);
      $scope.startSpreeding = function() {
        $interval(function() {
          $scope.live_text = $scope.live[$scope.position];
          $scope.position++;
        }, $scope.live_speed);
      };
    }
  ])
  .factory('spreedService', function() {
    var spreedData = {};

    spreedData.chunkSize = 1;
    spreedData.speed = 300;
    spreedData.text = '';

    return spreedData;
  });