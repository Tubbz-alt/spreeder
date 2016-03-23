'use strict';

require('../public/bower_components/angular/angular.js');
require('../public/bower_components/angular-route/angular-route.js');
require('../public/bower_components/angular-loading-bar/build/loading-bar.min.js');
require('./js/auth.js');
require('./js/dash.js');

angular.module('spreeder', ['spreeder.auth', 'angular-loading-bar', 'spreeder.dash', 'ngRoute'])
  .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    $routeProvider.
      when('/', {
        templateUrl: '/views/landing.html'
      }).
      when('/login', {
        templateUrl: '/views/login.html',
        controller: 'AuthCtrl'
      }).
      when('/signup', {
        templateUrl: '/views/signup.html',
        controller: 'AuthCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });

    $httpProvider.interceptors.push('authInterceptor');
    }
  ])
  .run(['$rootScope', 'tokenService', '$location',
    function($rootScope, tokenService, $location) {
      $rootScope.isAuthenticated = function() {
        return tokenService.isAuthenticated();
      };

      $rootScope.logout = function() {
        tokenService.removeToken();
        $location.path("/login");
      };

      $rootScope.$on("$routeChangeStart", function(event, next, current) {
        var redirectRoutes = ['/login', '/signup'];
        if ($location.path() == '/logout') {
          $rootScope.logout();
        }
        else if (tokenService.isAuthenticated() &&
          redirectRoutes.indexOf($location.path()) != -1) {
          $location.path("/dashboard/spreed");
        }
      });
    }
  ]);
