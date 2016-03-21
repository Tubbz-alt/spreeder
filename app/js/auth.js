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
              $rootScope.logged_in = true;
              $location.path('/dashboard');
            }
          });
        }
      };

      $scope.register = function() {
        $rootScope.auth_msg = '';
        $rootScope.auth_err = '';
        // first, check if user is already authenticated.
        if ($rootScope.user) {
          $location.path('/dashboard');
        } else if ($scope.signup.$valid && $scope.user.cpassword
          == $scope.user.password) {
          auth.register($scope.user, function(err, res) {
            if (err) {
              console.log('Login error: ', err);
            } else {
              $rootScope.auth_msg = 'Registration successful. Login to continue.';
              $location.path('/login');
            }
          });
        } else {
          $rootScope.auth_err = 'The Passwords do not match.';
        }
      };
    }
  ])
  .factory('authService', ['$http',
    function($http) {
      return {
        login: function(user, cb) {
          $http.post('/auth/login', user).success(function(res) {
            cb(null, res);
          }).error(function(err) {
            cb(err);
          });
        },
        register: function(user, cb) {
          $http.post('/auth/register', user).success(function(res) {
            cb(null, res);
          }).error(function(err) {
            cb(err);
          });
        }
      }
    }
  ]);
