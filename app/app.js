'use strict';

require('./js/auth.js');

angular.module('spreeder', ['spreeder.auth', 'ngRoute'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/login', {
        templateUrl: '/views/login.html',
        controller: 'LoginCtrl'
      }).
      when('/signup', {
        templateUrl: '/views/signup.html',
        controller: 'SignupCtrl'
      }).
      otherwise({
        redirectTo: '/login'
      });
    }
  ]);
