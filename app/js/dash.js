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
          spreedService.speed = parseInt($scope.speed);
          spreedService.chunkSize = parseInt($scope.chunkSize);
          spreedService.text = $scope.pasteText;
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
      var position = 0;
      $scope.data.text.replace(/[\n\r]+/g, ' ');
      $scope.live = $scope.data.text.split(' ');
      $scope.live_speed = 60000.0 / $scope.data.speed;
      var length = $scope.live.length;
      $scope.startSpreeding = function() {
        stop = $interval(function() {
          var upperBound = $scope.data.chunkSize + position;
          if (upperBound >= length) {
            $interval.cancel(stop);
            $scope.live_text = $scope.live.slice(position, length).join(' ');
          } else {
            $scope.live_text = $scope.live.slice(position, upperBound).join(' ');
            position = upperBound;
          }
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