// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'tabSlideBox', 'socialLogin'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, socialProvider) {
  socialProvider.setFbKey({appId: "730156340480337", apiVersion: "v2.8"});
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl',
    params: { checkoutroute: null },
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
  })
  .state('app.playlists', {
    url: '/playlists',
    views: {
      'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  })

  .state('app.myprofile', {
    url: '/profile',
    views: {
      'menuContent': {
        templateUrl: 'templates/my_profile.html',
        controller: 'MyProfileCtrl'
      }
    }
  })

  .state('app.edit_profile', {
    url: '/edit_profile',
    params: {
     obj: null
    },
    views: {
      'menuContent': {
        templateUrl: 'templates/edit_profile.html',
        controller: 'EditProfileCtrl'
      }
    }
  })

  .state('app.event_list', {
    url: '/event_list',
    views: {
      'menuContent': {
        templateUrl: 'templates/event_list.html',
        controller: 'EventListCtrl'
      }
    }
  })

  .state('app.club_list', {
    url: '/club_list',
    views: {
      'menuContent': {
        templateUrl: 'templates/club_list.html',
        controller: 'ClubListCtrl'
      }
    }
  })

  .state('app.club_detail', {
    url: '/club_detail/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/club_detail.html',
        controller: 'ClubDetailCtrl'
      }
    }
  })

  .state('app.event_detail', {
    url: '/event_detail/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/event_detail.html',
        controller: 'EventDetailCtrl'
      }
    }
  })

  .state('app.find_clubs', {
    url: '/find_clubs',
    views: {
      'menuContent': {
        templateUrl: 'templates/find_clubs.html',
        controller: 'FindClubsDetailCtrl'
      }
    }
  })

  .state('app.orders', {
    url: '/orders',
    views: {
      'menuContent': {
        templateUrl: 'templates/my_orders.html',
        controller: 'OrderCtrl'
      }
    }
  })

  .state('app.cart', {
    url: '/cart',
    views: {
      'menuContent': {
        templateUrl: 'templates/cart_main.html',
        controller: 'CartCtrl'
      }
    }
  })

  .state('app.arrange_party', {
    url: '/arrange_party',
    views: {
      'menuContent': {
        templateUrl: 'templates/arrange_party.html',
        controller: 'ArrangePartyCtrl'
      }
    }
  })

  .state('app.payment', {
    url: '/pay',
    params: {
      paymentdetails: null,
    },
    views: {
      'menuContent': {
        templateUrl: 'templates/payment.html',
        controller: 'PaymentCtrl'
      }
    }
  })

  .state('app.flats', {
    url: '/flats',
    views: {
      'menuContent': {
        templateUrl: 'templates/flats.html',
        controller: 'FlatCtrl'
      }
    }
  })

  .state('app.flatdetail', {
    url: '/flatdetail/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/flat_detail.html',
        controller: 'FlatDetail'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/playlists');
});
