// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova', 'ngMessages', 'ngImgCrop'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })
  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'SignupCtrl'
  })
  .state('sublist', {
         url: '/sublist',
         templateUrl: 'templates/sublist.html',
         controller: 'SubListCtrl'
  })
  .state('upload', {
         url: '/uploadctrl',
         templateUrl: 'templates/uploadPhoto.html',
         controller: 'UploadCtrl'
  })
  .state('crop', {
        url: '/crop',
        templateUrl: 'templates/crop.html',
        controller: 'CropCtrl'
  })
  .state('slideshow', {
         url: '/slideshow',
         templateUrl: 'templates/slideshow.html',
         controller: 'SlideCtrl'
  })
  .state('fullscreen', {
        url: '/fullscreen',
        templateUrl: 'templates/fullscreen.html',
        controller: 'FullScreenCtrl'
  })
  $urlRouterProvider.otherwise('/login');
})

.run(function ($rootScope, $state) {
  $rootScope.$on('$stateChangeStart', function (event, next, nextParams, fromState) {
    
    // if (!AuthService.isAuthenticated()) {
    //   if ((next.name !== 'login') || (next.name !== 'signup')) {
    //     event.pre0ventDefault();
    //     $state.go('login');
    //   }
    // }
  });
})