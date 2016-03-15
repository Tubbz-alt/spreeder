'use strict';

require('./bower_components/angular/angular.js');
require('./bower_components/angular-route/angular-route.js');
require('./js/auth.js');

angular.module('spreeder', ['spreeder.auth', 'ngRoute'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/login', {
        templateUrl: '/views/login.html',
        controller: 'AuthCtrl'
      }).
      when('/signup', {
        templateUrl: '/views/signup.html',
        controller: 'AuthCtrl'
      }).
      otherwise({
        redirectTo: '/login'
      });
    }
  ]);
