angular.module('starter')

.controller('AppCtrl', function() {})
.controller('LoginCtrl', function($rootScope, $scope, $state, AuthService, $http) {
            $scope.data = {
            username: "a",
            password: "a"
            };
var vm=this;
            $scope.login = function(data) {
            //AuthService.login(data.username, data.password);
            AuthService.getRequest(function(res) {
              console.log(JSON.stringify(res));
            });
            //$state.go('sublist');
            //$scope.appointments.push({title: 'New event', type: 'important', draggable: true, resizable: true});
            };
            
            $scope.gotoSignup = function() {
            $state.go('signup');
            };

            $scope.appointments = [];
    /*$http({
          url: 'http://192.168.0.89/xampp/scheduler/backend/appointment.php',
          method: "POST",
          headers: {"Content-Type": "application/x-www-form-urlencoded"},
          data: $.param({programID: 1})
     })
     .success(function(data, status, headers, config) {
      console.log(data);
        $scope.appointments = JSON.parse(JSON.stringify(data));
     })
     .error(function(data, status, headers, config) {
          alert('error');
     });

    $scope.calendarView = 'month';
    $scope.calendarDay = new Date();*/

            })
.controller('DashCtrl', function() {})
.controller('SignupCtrl', function($scope, AuthService, $ionicHistory) {
            $scope.signup = function(data) {
            AuthService.signup(data.firstname, data.lastname, data.email, data.username, data.password);
            };
            $scope.goBack = function(){
            $ionicHistory.goBack();
            };
            
            var model = this;
            model.message = "";
            model.data = {
            firstname: "",
            firstname: "",
            username: "",
            firstname: "",
            password: "",
            verification: ""
            };
            model.submit = function(data, isValid) {
            console.log("h");
            if (isValid) {
            signup(data);
            } else {
            model.message = "There are still invalid fields below";
            }
            };
            
            
            })

.controller('SubListCtrl', function($scope, $state, $rootScope, $ionicHistory, $cordovaCamera, DataService, BACKEND_URL, $ionicPopup, AuthService) {
            $scope.goBack = function(){
            AuthService.logout();
            };
            
            $scope.clearSearch = function(){
            $scope.searchForce = "";
            };
            
            var loadData = function(){
            DataService.getSubListData(function(response) {
                                       $scope.items = new Array();
                                       if(response == "null")
                                       return;
                                       else {
                                       var itemCount = response.length;
                                       for(i=0; i<itemCount; i++)
                                       {
                                       var item = JSON.parse(JSON.stringify(response[i]));
                                       item.image_path = BACKEND_URL.baseURL + item.image_path;
                                       item.amountstr = parseFloat(item.amount).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
                                       $scope.items.push(item);
                                       }
                                       }
                                       });
            };
            loadData();
            $rootScope.refreshList = loadData;
            
            $scope.deleteItem = function(item) {
            var confirmPopup = $ionicPopup.confirm({
                                                   title: 'Delete',
                                                   template: 'Are you sure you want to delete this item?'
                                                   });
            confirmPopup.then(function(res) {
                              if(res) {
                              DataService.removeItem(item.id, function(response) {
                                                     if(response == "success") {
                                                     var index = $scope.items.indexOf(item);
                                                     $scope.items.splice(index, 1);
                                                     }
                                                     });
                              } else {
                              console.log('You are not sure');
                              }
                              });
            };
            
            $scope.takePhoto = function() {
            var options = {
            quality : 80,
            destinationType : Camera.DestinationType.DATA_URL,
            destinationType : Camera.DestinationType.FILE_URI,
            //sourceType : Camera.PictureSourceType.CAMERA,
            //allowEdit : true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 1000,
            targetHeight: 1000,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
            };
            
            $cordovaCamera.getPicture(options).then(function(imageData) {
                                                    //console.log(imageData);
                                                    //$rootScope.capturedImgURI = "data:image/jpeg;base64," + imageData;
                                                    $rootScope.imgURI = imageData;
                                                    
                                                    $state.go('upload');
                                                    //$state.go('crop');
                                                    }, function(err) {
                                                    });
//                                                    $jrCrop.crop({
//                                                                 url: imageData,
//                                                                 width: 200,
//                                                                 height: 200
//                                                                 }).then(function(canvas) {
//                                                                         // success!
//                                                                         var image = canvas.toDataURL('image/jpeg', 1.0);
//                                                                         console.log("crop:"+image);
//                                                                         }, function() {
//                                                                         // User canceled or couldn't load image.
//                                                                         });
//                                                                         });
            };
            
            $scope.itemClicked = function(item){
            $rootScope.selIndex = $scope.items.indexOf(item);
            $rootScope.galleryItems = $scope.items;
            
            $state.go("slideshow");
            };
            })

.controller('SlideCtrl', function($scope, $rootScope, $ionicHistory, $state, $ionicSlideBoxDelegate) {
            
            $scope.goBack = function(){
            $ionicHistory.goBack();
            };
            
            $scope.items = $rootScope.galleryItems;
            $scope.myActiveSlide = $rootScope.selIndex;
            
            $scope.showFullScreen = function(url) {
            $rootScope.fullscreenImgURL = url;
            $state.go("fullscreen");
            };
            
            $scope.slideVisible = function(index){
            //index = index + 1;
            var currentIndex = $ionicSlideBoxDelegate.currentIndex();
            if(  index < $ionicSlideBoxDelegate.currentIndex() -1
               || index > $ionicSlideBoxDelegate.currentIndex() + 1){
            return false;
            }
            return true;
            }
            })

.controller('CropCtrl', function($state, $scope, $rootScope, $ionicHistory) {
            //console.log($rootScope.capturedImgURI);
            
            $scope.goBack = function() {
            $ionicHistory.goBack();
            };
            
            $scope.imageCropResult = '';
            
            $scope.useImage = function(base64Img) {
            $rootScope.imgURI = base64Img;
            if($rootScope.loadUploadImage)
            {
            $rootScope.loadUploadImage();
            }
            $state.go('upload');
            };
            
            $scope.cancelImage = function() {
            $state.go('sublist');
            };
            })

.controller('FullScreenCtrl', function($scope, $rootScope, $ionicHistory) {
            
            $scope.goBack = function(){
            $ionicHistory.goBack();
            };
            $scope.imgURL = $rootScope.fullscreenImgURL;
            (document.getElementById('page')).style.width = (screen.width - 20) + "px";
            (document.getElementById('page')).style.position = "absolute";
            (document.getElementById('page')).style.transform = "translateY(30%)";
            var nav_height = $(".bar-header").outerHeight();
            var pane_height = (screen.height - nav_height - 15) + "px";
            (document.getElementById('scrolly')).style.height = pane_height;
            })

.controller('UploadCtrl', function($state, $rootScope, $scope, $ionicHistory, $cordovaDatePicker, UploadService, DataService, $ionicPopup) {
            
            var loadImage = function() {
                $scope.imageURI = $rootScope.imgURI;
            };
            
            /*if(!$rootScope.loadUploadImage)
            {
                loadImage();
                $rootScope.loadUploadImage = loadImage;
            }*/
            loadImage();
            
            $scope.data = {
            description: "",
            amount:""
            };
            
            DataService.getCategory(function(response) {
                                    $scope.categories = new Array();
                                    if(response == "null")
                                    return;
                                    else {
                                    var itemCount = response.length;
                                    console.log("Categories: " + itemCount)
                                    for(i=0; i<itemCount; i++)
                                    {
                                    var category = JSON.parse(JSON.stringify(response[i]));
                                    category.order = i;
                                    $scope.categories.push(category);
                                    }
                                    }
                                    });
            
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1; //January is 0!
            var yyyy = today.getFullYear();
            $scope.todayDate = dd + "-" + mm + "-" + yyyy;
            $rootScope.dateStr = $scope.todayDate;
            
            
            
            
            $scope.upload = function(data) {
            UploadService.uploadImage($rootScope.user_id, $scope.imgURI, $scope.todayDate, data.category, data.description, data.amount);
            /*UploadService.uploadBase64($rootScope.user_id, $scope.imageURI, $scope.todayDate, data.category, data.description, data.amount, function(response){
                                       if(response == "success"){
                                       var popup = $ionicPopup.alert({
                                                                     title: 'Success',
                                                                     template: 'Uploaded successfully.'
                                                                     });
                                       popup.then(function(res) {
                                                  $scope.imageURI = "";
                                                  $rootScope.refreshList();
                                                  $state.go("sublist");
                                                  });
                                       
                                       }
                                       else{
                                       $ionicPopup.alert({
                                                         title: 'Error',
                                                         template: 'Error uploading file: ' + response
                                                         });
                                       }
                                       });*/
            };
            
            $scope.showDatePicker = function() {
            var dt_options = {
            date: new Date(),
            mode: 'date'/*, // or 'time'
                         minDate: new Date() - 10000,
                         allowOldDates: true,
                         allowFutureDates: false,
                         doneButtonLabel: 'DONE',
                         doneButtonColor: '#F2F3F4',
                         cancelButtonLabel: 'CANCEL',
                         cancelButtonColor: '#000000'*/
            };
            
            $cordovaDatePicker.show(dt_options)
            .then(function(date){
                  today = new Date(date);
                  dd = today.getDate();
                  mm = today.getMonth()+1; //January is 0!
                  yyyy = today.getFullYear();
                  $scope.todayDate = dd + "-" + mm + "-" + yyyy;
                  $rootScope.dateStr = $scope.todayDate;
                  });
            }
            
            $scope.goBack = function(){
            $scope.imageURI = "";
            $state.go('sublist');
            //$ionicHistory.goBack();
            };
            });