angular.module('spreeder.auth', [])
  .controller('AuthCtrl', ['$scope', '$location', '$rootScope', 'authService',
    function($scope, $location, $rootScope, auth) {
      if ($location.path() == '/login') {
        $scope.login_active = true;
      } else {
        $scope.login_active = false;
      }

      $scope.login = function() {
        // first, check if user is already authenticated.
        if ($rootScope.user) {
          $location.path('/dashboard');
        } else {
          auth.login($scope.user, function(err, res) {
            if (err) {
              console.log('Login error: ', err);
            } else {
              // handle token here.
              console.log(res);
              $location.path('/dashboard');
            }
          });
        }
      };

      $scope.register = function() {
        // first, check if user is already authenticated.
        if ($rootScope.user) {
          $location.path('/dashboard');
        } else {
          auth.register($scope.user, function(err, res) {
            if (err) {
              console.log('Login error: ', err);
            } else {
              // handle token here.
              console.log(res);
              $location.path('/dashboard');
            }
          });
        }
      };
    }
  ])
  .factory('authService', ['$http',
    function($http) {
      return {
        login: function(user, cb) {
          $http.post('/users/login', user).success(function(res) {
            cb(null, res);
          }).error(function(err) {
            cb(err);
          });
        },
        register: function(user, cb) {
          $http.post('users/register', user).success(function(res) {
            cb(null, res);
          }).error(function(err) {
            cb(err);
          });
        }
      }
    }
  ]);
