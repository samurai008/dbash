/* jshint ignore:start */
angular.module('starter.controllers', ['ngCordova', 'ngStorage', 'base64'])

.controller('AppCtrl', function(
  $scope, $ionicModal,
  $timeout, $http,
  $localStorage,
  $ionicTabsDelegate, $state,
  $sessionStorage, $window ) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};
  $scope.$userData = $localStorage;
  $scope.$cartData = $sessionStorage;

  $scope.$cartData = $localStorage.$default({
    cart:[],
    user: $scope.$userData.username,
    key: $scope.$userData.key,
    total: 0,
  });

   console.log($scope.$cartData);
  // Create the login modal that we will use later


  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // goToCart()
  $scope.goToCart = () => {
    $state.go('app.cart');
    console.log($ionicTabsDelegate.selectedIndex());
    $ionicTabsDelegate.showBar(false);
  };

  $scope.onTabDeselected = () => {
    console.log(this);
  }

  // Register modal used later
  $ionicModal.fromTemplateUrl('templates/register.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.regModal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  $scope.closeRegisterScreen = function() {
    $scope.regModal.hide();
  }

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Open the register modal
  $scope.register = function() {
    $scope.regModal.show();
  }



  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);


    // LOGIN WEB API
    $http({
      method: 'POST',
      url: 'http://dbash.delhinerds.com/rest-auth/login/',
      data: $scope.loginData
    }).then(function successCallback(response) {
      console.log(response)
      // store auth key
      $scope.$userData.key = response['data']['key'];
      $scope.$userData.username = $scope.loginData.username
    }, function errorCallback(error) {
      console.log(error)
    })
    // END OF LOGIN WEB API

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

  //Logout
  $scope.logout = function() {
    delete $scope.$userData.key;
    delete $scope.$userData.username;
  }
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('MyProfileCtrl', function($scope, $http, $state) {
  $scope.phone = $scope.address = $scope.profile_image = '';
  var username = $scope.$userData.username;
  var url = 'http://dbash.delhinerds.com/user/' + username + '';
  var userdetailobj = {};
  $http({
    method: 'GET',
    url: url,
  }).then(function successCallback(response) {
    console.log(response['data']);
    $scope.phone = response['data']['phone'];
    $scope.address = response['data']['address'];
    $scope.profile_image = response['data']['profile_image'];
    userdetailobj = {
      phone: $scope.phone,
      address: $scope.address,
      profile_image: $scope.profile_image
    };

  });

  $scope.editprofilebtn = function(){
    if (userdetailobj != null)
      $state.go('app.edit_profile', {obj: userdetailobj});
  }
})

.controller('EditProfileCtrl', function($scope, $http, $location, $ionicHistory, $document, $ionicGesture, $state, $base64) {
  var ionicHistory = $ionicHistory.viewHistory();
  var preuserdetails = $state.params.obj;

  $scope.goToProfile = function(event){
    //console.log(ionicHistory['backView']);
    let stack = ionicHistory['backView'];

    if (stack != null){
      $location.path(stack.url);
    }
  };

  $scope.profile = {};
  $scope.profile.phone = preuserdetails.phone;
  $scope.profile.address = preuserdetails.address;
  var imageData = $base64.encode(preuserdetails.profile_image);
  $scope.profile.profile_image = imageData;
  console.log($scope.profile.profile_image);
  $scope.getProfileDetails = function() {
    return {
      profile_image: $scope.profile.profile_image,
      phone: $scope.profile.phone,
      address: $scope.profile.address,
    };
  };
  $scope.editProfile = function () {
    console.log($scope.getProfileDetails());
    $http({
      method: 'PUT',
      url: 'http://dbash.delhinerds.com/user/' + $scope.$userData.username + '/',
      data: $scope.getProfileDetails(),
    }).then(function successCallback(response) {
      console.log(response);
      $location.path('/#/app/profile');
    });
  console.log($scope.getProfileDetails());
  };
})

.controller('EventListCtrl', function($scope, $http, $timeout) {
  console.log('Event List Control');
  $scope.events = [];
  $scope.insearch = false;
  $http({
    method: 'GET',
    url: 'http://dbash.delhinerds.com/cart/products/?type=evnt',
  }).then(function successCallback(response){
    console.log(response.data);
    $scope.events = response.data;
  });

  $scope.str = {};
  $scope.search = function() {
    // if (promise != undefined){
    //   $timeout.cancel(promise);
    // }
    console.log($scope.str.query);
    $scope.insearch = true;
    let promise = $timeout(()=>{
      $http({
        method: 'GET',
        url: 'http://dbash.delhinerds.com/cart/products/?type=evnt&q='+$scope.str.query,
      }).then(function successCallback(response) {
        $scope.insearch = false;
        console.log(response.data);
        $scope.events = response.data;
      });
    }, 1000);
    console.log(promise);
    $timeout(()=>{console.log("obj");}, 2000);
  };
})

.controller('ClubListCtrl', function($scope, $http) {
  $scope.clubs = [];
  $scope.insearch = false;
  console.log('ClubListCtrl');
  $http({
    method: 'GET',
    url: 'http://dbash.delhinerds.com/clubs/?q=',
  }).then(function successCallback(response){
    console.log(response.data);
    $scope.clubs = response.data;
  });

  $scope.str = {};

  $scope.search = function() {
    console.log($scope.str.query);
    $scope.insearch = true;
    $http({
      method: 'GET',
      url: 'http://dbash.delhinerds.com/clubs/?q='+$scope.str.query,
    }).then(function successCallback(response) {
      $scope.insearch = false;
      console.log(response.data);
      $scope.clubs = response.data;
    })
  }
})

.controller('ClubDetailCtrl', function(
    $scope, $stateParams, $http, $ionicLoading, $ionicSideMenuDelegate, $cordovaAppAvailability
  ) {
  $scope.clubdetail = {}
  console.log($scope.clubdetail);
  console.log($stateParams);
  $scope.options = {
    speed: 500,
  };

  $scope.$on("$ionicSlides.sliderInitialized", function(event, data){
    // data.slider is the instance of Swiper
    console.log(event);
    console.log(data);
    $scope.slider = data.slider;
  });

  $scope.$on('$ionicView.enter', function(){
      $ionicSideMenuDelegate.canDragContent(false);
    });
  $scope.$on('$ionicView.leave', function(){
      $ionicSideMenuDelegate.canDragContent(true);
    });

  $http({
    method: 'GET',
    url: 'http://dbash.delhinerds.com/club/'+$stateParams.id,
  }).then(function successCallback(response){
    $scope.hide();
    console.log(response.data);
    $scope.clubdetail = response.data;
    console.log($scope.clubdetail);
  });

  $scope.show = function() {
    $ionicLoading.show({
      template: 'Loading...'
    }).then(function(){
       console.log("The loading indicator is now displayed");
    });
  };

  $scope.show();
  $scope.hide = function(){
    $ionicLoading.hide().then(function(){
       console.log("The loading indicator is now hidden");
    });
  };
})

.controller('EventDetailCtrl', function(
  $scope, $stateParams, $http, $ionicLoading, $ionicSideMenuDelegate,
  $sessionStorage) {
  console.log('EventDetailCtrl');
  $scope.eventdetail = {};
  console.log($scope.eventdetail);
  console.log($stateParams);

  $scope.$on('$ionicView.enter', function(){
      $ionicSideMenuDelegate.canDragContent(false);
    });
  $scope.$on('$ionicView.leave', function(){
      $ionicSideMenuDelegate.canDragContent(true);
    });
  // find event in cart
  var iselementpresent;
  var findelementincart = function(id){
    var findelement = function(obj){
      return obj.id == id;
    }
    if ($scope.$cartData.cart.find(findelement)) {
      return {
        element: $scope.$cartData.cart.find(findelement),
        present: true
      };
    }

    return {
      id: null,
      present: false
    };
  };

  // Event Description
  $http({
    method: 'GET',
    url: 'http://dbash.delhinerds.com/cart/product/'+$stateParams.id,
  }).then(function successCallback(response){
    $scope.hide();
    console.log(response.data);
    $scope.eventdetail = response.data;
    console.log($scope.eventdetail);
    console.log('eventdetail.id = ' + $scope.eventdetail.id);

    iselementpresent = findelementincart($scope.eventdetail.id);

  });

  // function ionicLoading
  $scope.show = function() {
    $ionicLoading.show({
      template: 'Loading...'
    }).then(function(){
       console.log("The loading indicator is now displayed");
    });
  };

  // call ionicLoading
  $scope.show();
  $scope.hide = function(){
    $ionicLoading.hide().then(function(){
       console.log("The loading indicator is now hidden");
    });
  };

  // add to cart
  $scope.addToCart = function(){
    evnt_detail = $scope.eventdetail;
    let element = {};

    if (iselementpresent.present == true) {
      console.log('element is present');
      console.log(iselementpresent.element);
      element = iselementpresent.element;
      element.quantity += 1;
      $scope.$cartData.total += element.price;
    } else{

      element.id = evnt_detail.id;
      element.name = evnt_detail.name;
      element.price = evnt_detail.price;
      element.p_type = "event";

      //if ($scope.$cartData.cart.find())
      element.quantity = 1;
      $scope.$cartData.total += $scope.$cartData.price;
      $scope.$cartData.cart.push(element);
    }
/*
    evnt_detail = $scope.eventdetail;
    let element = {};

    element.id = evnt_detail.id;
    element.name = evnt_detail.name;
    element.price = evnt_detail.price;
    element.p_type = "event";

    //if ($scope.$cartData.cart.find())
    element.quantity = 1;
    $scope.$cartData.total += $scope.$cartData.price;
    $scope.$cartData.cart.push(element);
*/

  };

})

.controller('FindClubsDetailCtrl', function($scope, $cordovaGeolocation, $http, $ionicLoading) {
  var posOptions = {timeout: 10000, enableHighAccuracy: false};

  $scope.clubs = {};

  $scope.show = function() {
    $ionicLoading.show({
      template: 'Loading...'
    }).then(function(){
       console.log("The loading indicator is now displayed");
    });
  };

  $scope.show();
  $scope.hide = function(){
    $ionicLoading.hide().then(function(){
       console.log("The loading indicator is now hidden");
    });
  };

  $scope.getclubs = function(lt, lg) {
    $http({
      method: 'GET',
      url: 'http://dbash.delhinerds.com/searchnearclubs/?lat='+ lt +'&lon=' + lg,
    }).then(function successCallback(response) {
      $scope.hide();
      console.log(response);
      $scope.clubs = response.data;
    });
  };

   $cordovaGeolocation
   .getCurrentPosition(posOptions)

   .then(function (position) {
      var lat  = position.coords.latitude
      var long = position.coords.longitude
      console.log(lat + '   ' + long)
      $scope.getclubs(lat, long);

   }, function(err) {
      console.log(err)
   });

   var watchOptions = {timeout : 3000, enableHighAccuracy: false};
   var watch = $cordovaGeolocation.watchPosition(watchOptions);

   watch.then(
      null,

      function(err) {
         console.log(err)
      },

      function(position) {
         var lat  = position.coords.latitude
         var long = position.coords.longitude
         console.log(lat + '' + long)
      }
   );

   watch.clearWatch();
})

.controller('CartCtrl', function($scope, $state, $sessionStorage){
  let $user = $scope.$userData;
  let payment_details = {}

  $scope.cartdetails = $scope.$cartData.cart;
  $scope.cartTotal = $scope.$cartData.total;

  $scope.checkout_ftn = () => {

    if ($user['key']){
      payment_details = {
        user: $user.username,
        products: [
          'apple',
          'banana',
        ],
        total: '300'
      }
      $state.go('app.payment', {paymentdetails: payment_details});
    } else{
      $scope.login();
    }

  }

  $scope.removeFromCart = function(id){
    var subtractprice = $scope.cartdetails[id].price;
    $scope.cartTotal -= subtractprice;
    $scope.cartdetails.splice(id, 1);
  }
})

.controller('ArrangePartyCtrl', function($scope, $state){
  let $user = $scope.$userData;
  console.log("obj");
})

.controller('PaymentCtrl', function($scope, $state){
  console.log($state.params.paymentdetails);
  $scope.gobacktocart = function(){
    $state.go('^.cart');
  };
})

.controller('OrderCtrl', function($scope, $state){

})

.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}]);

/* jshint ignore:end */
