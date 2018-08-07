angular.module('starter')
 
.service('AuthService', function($q, $rootScope, $http, $state, USER_CREDENTIAL, BACKEND_URL, $ionicLoading, $ionicPopup) {
  var username;
  var user_id = -1;
  var fullname = '';
  var email = '';
 
  function loadUserCredentials() {
    username = window.localStorage.getItem(USER_CREDENTIAL.user_key);
    var password = window.localStorage.getItem(USER_CREDENTIAL.pass_key);
    if (username) {
      login(username, password);
    }
  }
 
  function storeUserCredentials(username, password) {
    window.localStorage.setItem(USER_CREDENTIAL.user_key, username);
    window.localStorage.setItem(USER_CREDENTIAL.pass_key, password);
  }
 
  function destroyUserCredentials() {
    $rootScope.user_id = -1;
    window.localStorage.removeItem(USER_CREDENTIAL.user_key);
    window.localStorage.removeItem(USER_CREDENTIAL.pass_key);
  }
 
  var getRequest = function(callback) {
    show_spinner();
    $http({
        url: 'https://qa2.openadr.com/m.dr.website/resteasy/services/getAlertHistory?device=2e8f190c0bb7b3a8928520d67af92d8fe98158924a81a445a8520dd53e3bd3fd&index=0&offset=25',
               method: "GET",
               headers: {"Content-Type": "application/x-www-form-urlencoded"}
               })
    .success(function(data, status, headers, config) {
                          hide_spinner();
                          var responseData = JSON.parse(JSON.stringify(data));
                          callback(responseData);
               }).error(function(data, status, headers, config) {
                        hide_spinner();
                        $ionicPopup.alert({
                          title: 'Error',
                          template: data
                        });                      
               });
  }

  var login = function(name, pw) {
        show_spinner();
         $http({
               url: BACKEND_URL.baseURL+BACKEND_URL.loginURL,
               method: "POST",
               headers: {"Content-Type": "application/x-www-form-urlencoded"},
               data: $.param({username:name, password:pw})
               }).success(function(data, status, headers, config) {
                          hide_spinner();
                          var responseData = JSON.parse(JSON.stringify(data));
                          if(responseData.isValid == "invalid")
                          {
                            //alert("Username and password are not valid. Please try again.");
                            $ionicPopup.alert({
                                title: 'Failure',
                                template: 'Username and password are not valid. Please try again.'
                            });
                          }
                          else{
                            var userData = responseData.user;
                            console.log(userData);
                            $rootScope.user_id = userData.id;
                            storeUserCredentials(name, pw);
                            $state.go("sublist");
                          }
               }).error(function(data, status, headers, config) {
                        hide_spinner();
                        $ionicPopup.alert({
                          title: 'Error',
                          template: data
                        });                      
               });
  };
       
  var signup = function(firstname, lastname, email, username, pw) {
        show_spinner();
        console.log(BACKEND_URL.baseURL+BACKEND_URL.signupURL);
        console.log(username + ", " + pw + ", " + email + ", " + firstname + ", " + lastname);
         
        $http({
              url: BACKEND_URL.baseURL+BACKEND_URL.signupURL,
              method: "POST",
              headers: {"Content-Type": "application/x-www-form-urlencoded"},
              data: $.param({username : username,
                            password : pw,
                            email : email,
                            First_Name : firstname,
                            Last_Name : lastname})
              }).success(function(data, status, headers, config) {
                    hide_spinner();
                    var responseData = JSON.parse(JSON.stringify(data));
                          if(responseData.msg == "fail")
                          {
                            $ionicPopup.alert({
                                title: 'Failure',
                                template: 'Unfortunately, your information was not registered. Please try again.'
                            });
                          }
                          else{
                            $ionicPopup.alert({
                                title: 'Success',
                                template: 'You are successfully registered. Thank you.'
                            });
                            $rootScope.user_id = responseData.id;
                            $state.go("sublist");
                          }
               }).error(function(data, status, headers, config) {
                    hide_spinner();
                    $ionicPopup.alert({
                      title: 'Error',
                      template: data
                    });
        });
    };

    var logout = function() {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Logout',
        template: 'Are you sure you want to logout?'
      });
      confirmPopup.then(function(res) {
        if(res) {
          destroyUserCredentials();
          $state.go("login");
        } else {
          console.log('You are not sure');
        }
      });
    };

    var show_spinner = function() {
      //$("#spinnerdiv").css("visibility","visible");
      $ionicLoading.show({
        template : "<ion-spinner></ion-spinner>"
      });
    };

    var hide_spinner = function() {
      //$("#spinnerdiv").css("visibility","hidden");
      $ionicLoading.hide();
    };

  return {
    login: login,
    signup: signup,
    logout: logout,
    show_spinner : show_spinner,
    getRequest: getRequest,
    hide_spinner : hide_spinner,
    username: function() {return username;},
    email: function() {return email;},
    fullname: function() {return fullname;}
  };
})

.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
  return {
    responseError: function (response) {
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
        403: AUTH_EVENTS.notAuthorized
      }[response.status], response);
      return $q.reject(response);
    }
  };
})
 
.config(function ($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
})

.service('DataService', function($q, $rootScope, $http, $state, BACKEND_URL, AuthService) {
         
    var getSubListData = function(callback){
        AuthService.show_spinner();
        user_id = $rootScope.user_id;
        $http({
              url: BACKEND_URL.baseURL+BACKEND_URL.subListURL,
              method: "POST",
              headers: {"Content-Type": "application/x-www-form-urlencoded"},
              data: $.param({user_id : user_id})
        }).
        success(function(data, status, headers, config) {
              AuthService.hide_spinner();
              if(data == "fail") {
                callback("null");
                return;
              }
              callback(JSON.parse(JSON.stringify(data)));
        }).
        error(function(data, status, headers, config) {
              AuthService.hide_spinner();
              $ionicPopup.alert({
                title: 'Error',
                template: data
              });
        });
    };
         
    var getCategory = function(callback){
         AuthService.show_spinner();
         user_id = $rootScope.user_id;
         $http({
               url: BACKEND_URL.baseURL+BACKEND_URL.categoryURL,
               method: "POST",
               headers: {"Content-Type": "application/x-www-form-urlencoded"},
               data: $.param({user_id : user_id})
         }).
         success(function(data, status, headers, config) {
                 AuthService.hide_spinner();
                 if(data == "fail") {
                    callback("null");
                    return;
                 }
                 callback(JSON.parse(JSON.stringify(data)));
         }).
         error(function(data, status, headers, config) {
               AuthService.hide_spinner();
               $ionicPopup.alert({
                    title: 'Error',
                    template: data
               });
         });
    };
    
    var removeItem = function(item_id, callback) {
         AuthService.show_spinner();
         $http({
               url: BACKEND_URL.baseURL+BACKEND_URL.deleteItemURL,
               method: "POST",
               headers: {"Content-Type": "application/x-www-form-urlencoded"},
               data: $.param({item_id : item_id})
         }).
         success(function(data, status, headers, config) {
                AuthService.hide_spinner();
                callback(data);
         }).
         error(function(data, status, headers, config) {
               AuthService.hide_spinner();
               $ionicPopup.alert({
                    title: 'Error',
                    template: data
                });
         });
    };
         
         return {
            getSubListData : getSubListData,
            removeItem : removeItem,
            getCategory : getCategory
         };
})

.service('UploadService', function($q, $http, $state, $rootScope, USER_CREDENTIAL, BACKEND_URL, AuthService, $ionicPopup) {
        var uploadImage = function(user, imgURI, uploadDate, category, description, amount) {
            AuthService.show_spinner();
            var ft = new FileTransfer();
            var server_url = BACKEND_URL.baseURL + BACKEND_URL.uploadURL;

            ft.onprogress = function(progressEvent) {
            };

            var options = new FileUploadOptions();
         
            options.fileKey="file";
            options.fileName="photo.jpg";
            options.mimeType = "image/jpeg";
            options.chunkedMode = false;
            options.httpMethod = "POST";
            options.ContentLength = '1';
         
            var params = {};
            params.user_id = user;
            params.date = uploadDate;
            params.description = description;
            params.amount = amount;
            params.category = category;
         
            options.params = params;
            ft.upload(imgURI, encodeURI(server_url),
                  function(result) {
                      //alert("Success: " + result.response);
                      AuthService.hide_spinner();
                      var popup = $ionicPopup.alert({
                        title: 'Success',
                        template: 'Uploaded successfully.'
                      });
                      popup.then(function(res) {
                                 $rootScope.refreshList();
                                 $state.go("sublist");
                                 });                      
                  },
                  function(error) {
                      AuthService.hide_spinner();
                      $ionicPopup.alert({
                        title: 'Error',
                        template: 'Error uploading file ' + imgURI + ': ' + error.code
                      });
                      //console.log('Error uploading file ' + imgURI + ': ' + error.code);
                  },
                  options);
         };
         
        var uploadBase64 = function(user, imageData, uploadDate, category, description, amount, callback) {
         AuthService.show_spinner();
         $http({
               url: BACKEND_URL.baseURL+BACKEND_URL.upload64URL,
               method: "POST",
               headers: {"Content-Type": "application/x-www-form-urlencoded"},
               data: $.param({
                             user_id : user,
                             date : uploadDate,
                             description : description,
                             amount : amount,
                             category : category,
                             imageData : imageData
                             })
               }).
         success(function(data, status, headers, config) {
                 AuthService.hide_spinner();
                 callback(data);
                 }).
         error(function(data, status, headers, config) {
               AuthService.hide_spinner();
               $ionicPopup.alert({
                                 title: 'Error',
                                 template: data
                                 });
               });
        };
        return {
          uploadImage : uploadImage,
          uploadBase64 : uploadBase64
        };
});