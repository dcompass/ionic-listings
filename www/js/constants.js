angular.module('starter')
 
.constant('AUTH_EVENTS', {
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
})
 
.constant('USER_ROLES', {
  admin: 'admin_role',
  public: 'public_role'
})

.constant('USER_CREDENTIAL', {
  user_key: 'Billbase_username',
  pass_key: 'Billbase_password'
})

.constant('BACKEND_URL', {
  //baseURL: 'http://192.168.0.41/xampp/Billbase/',
  baseURL: 'http://li1364-120.members.linode.com/BillBase/Backend/',
  loginURL: 'login.php',
  signupURL: 'signup.php',
  uploadURL: 'upload.php',
  listURL : 'getlist.php',
  subListURL : 'getsublist.php',
  deleteItemURL : 'item_delete.php',
  categoryURL : 'category.php',
  upload64URL : 'uploadbase64.php'
});