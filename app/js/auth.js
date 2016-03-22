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
        if ($rootScope.user) {
          $location.path('/dashboard');
        } else {
          auth.login($scope.user, function(err, res) {
            if (err) {
              console.log('Login error: ', err);
            } else {
              tokenService.setToken(res);
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

      $rootScope.logout = function() {
        auth.logout();
        $location.path('/login');
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
          $window.localStorage.removeItem('jwtToken');
        },

        parseJwt: function(token) {
          var base64Url = token.split('.')[1];
          var base64 = base64Url.replace('-', '+').replace('_', '/');
          return JSON.parse($window.atob(base64));
        },

        isAuthenticated: function() {
          var token = this.getToken();
          if(token) {
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
        console.log('authenticated: ', tokenService.isAuthenticated());
        if (tokenService.isAuthenticated()) {
          config.headers['Authorization'] = tokenService.getToken();
        }
        return config;
      }
    }
  }]);
