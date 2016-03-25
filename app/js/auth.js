angular.module('spreeder.auth', [])
  .controller('AuthCtrl', ['$scope', '$location', '$rootScope', 'authService', 'tokenService',
    function($scope, $location, $rootScope, auth, tokenService) {
      if ($location.path() == '/login') {
        $scope.login_active = true;
      } else {
        $scope.login_active = false;
      }

      $scope.login = function() {
        // first, check if user is already authenticated.
        if ($rootScope.isAuthenticated()) {
          $location.path('/dashboard');
        } else {
          auth.login($scope.user, function(err, res) {
            if (err) {
              console.log('Login error: ', err);
              $scope.user.password = '';
              $rootScope.auth_err = 'Credentials do not match';
            } else {
              tokenService.setToken(res);
              $scope.resetMessages();
              $location.path('/dashboard');
            }
          });
        }
      };

      $scope.register = function() {
        $scope.resetMessages();
        // first, check if user is already authenticated.
        if ($rootScope.isAuthenticated()) {
          $location.path('/dashboard/spreed');
        } else if ($scope.signup.$valid && $scope.user.cpassword
          == $scope.user.password) {
          auth.register($scope.user, function(err, res) {
            if (err) {
              console.log('Login error: ', err);
              $rootScope.auth_err = 'Registration error. Please re-submit.';
            } else {
              $rootScope.auth_msg = 'Registration successful. Login to continue.';
              $location.path('/login');
            }
          });
        } else {
          $rootScope.auth_err = 'The Passwords do not match.';
        }
      };

      $scope.resetMessages = function() {
        $rootScope.auth_err = '';
        $rootScope.auth_msg = '';
      };

    }
  ])
  .factory('authService', ['$http', '$window', 'tokenService',
    function($http, $window, tokenService) {
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
        },

        logout: function() {
          tokenService.removeToken();
        }
      };
    }
  ])
  .factory('tokenService', ['$window',
    function($window) {
      return {
        setToken: function(token) {
          $window.localStorage['jwtToken'] = token;
        },

        getToken: function() {
          return $window.localStorage['jwtToken'];
        },

        removeToken: function() {
          $window.localStorage.clear();
        },

        parseJwt: function(token) {
          var base64Url = token.split('.')[1];
          var base64 = base64Url.replace('-', '+').replace('_', '/');
          return JSON.parse($window.atob(base64));
        },

        isAuthenticated: function() {
          var token = this.getToken();
          if(token != undefined && token != {}) {
            var params = this.parseJwt(token);
            return Math.round(new Date().getTime() / 1000) <= params.exp;
          } else {
            return false;
          }
        }
      }
    }
  ])
  .factory('authInterceptor', ['tokenService', function(tokenService) {
    return {
      'request': function(config) {
        if (tokenService.isAuthenticated()) {
          config.headers['Authorization'] = tokenService.getToken();
        }
        return config;
      }
    }
  }]);
