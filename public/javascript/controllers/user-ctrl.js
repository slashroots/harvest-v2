/**
 * Created by Nick on 15/09/16.
 */

angular.module('harvestv2')
    .controller("UserCtrl", ['$scope', '$location', '$routeParams', 'UserFactory', 'RolesFactory',
        'PlatformFactory',
        function($scope, $location, $routeParams, UserFactory, RolesFactory, PlatformFactory) {

            /**
             * Registration Page defaults
             */
            $scope.user = {};
            $scope.selectedRole = {};
            $scope.passwordConfirm = "";
            $scope.agreeChecked = false;
            $scope.confirmation = false;

            /**
             * First step is to get the default platform role
             * and assign it to the user during registration
             */
            PlatformFactory.show(function(info) {
                $scope.user.us_user_role = info._id;
            }, function(error) {
                    console.log(error);
            });

            /**
             * Password check fields
             */
            $scope.validatePasswordMatch = function (pass1, pass2) {
                return (pass1 == pass2);
            };

            /**
             * Function creates user if all checks have passed
             * Also hashes the password for transmission.
             */
            $scope.createUser = function () {
                if (!$scope.signupForm.$invalid &&
                    $scope.validatePasswordMatch($scope.user.us_password, $scope.passwordConfirm) &&
                    $scope.agreeChecked) {

                    $scope.user.us_password = CryptoJS.SHA1($scope.user.us_password).toString(CryptoJS.enc.Hex);

                    UserFactory.create($scope.user, function(user) {
                        $scope.confirmation = true;
                    }, function(error) {
                        console.log(error);
                    })
                }
            };

            /**
             * TODO: Change this from a JQuery library to an angular implemented function
             */
            $scope.setupVisualValidationCues = function () {
                jQuery('#signupForm').validator();
            };

            $scope.setupVisualValidationCues();

        }
    ]
).controller("UserLoginCtrl", ['$scope', '$location', '$routeParams', 'UserFactory', 'UserActivationFactory',
        'AuthenticationFactory', 'PlatformFactory',
        function($scope, $location, $routeParams, UserFactory, UserActivationFactory, AuthenticationFactory, PlatformFactory) {
            var credentials = {};

            if($routeParams.token){
                UserActivationFactory.activate($routeParams, function(response) {//this function calls the factory that activates the user via the route implemented for the purpose on the expressJS side
                    $scope.success = true;//this flag determines the color of the notification of the login screen - green is successful and red if there was an error
                    $scope.loginScreenNotification = "Your account has been activated successfully!";
                }, function(error) {
                    $scope.success = false;
                    $scope.loginScreenNotification = "The activation token you provided was invalid!";
                });
            }

            $scope.login = function() {
                $scope.credentials.password = CryptoJS.SHA1($scope.credentials.password).toString(CryptoJS.enc.Hex);
                AuthenticationFactory.login($scope.credentials, function(response) {
                    $location.url('/dashboard');
                }, function(error) {
                    $scope.success = false;
                    $scope.loginScreenNotification = "We were unable to log you in! Please check your credentials!";
                });
            };
        }
    ]
).controller("UserDashboardCtrl", ['$scope', '$location', '$routeParams', 'CurrentUserFactory', 'UserAppsFactory', 'AppFactory','AppDisableFactory', 'PlatformFactory',
        function($scope, $location, $routeParams, CurrentUserFactory, UserAppsFactory, AppFactory, AppDisableFactory, PlatformFactory) {

            $scope.app = {};

            /*
             Gets the current user so we can pass the id to get all their apps - we could also have grabbed their id from the req.user.id instead of doing this but the endpoint was already created to expect an ID being passed to it
             */
            CurrentUserFactory.query($routeParams, function(user) {
                $routeParams.id = user._id;
                UserAppsFactory.query($routeParams, function(apps) {//gets all applications for this specific user
                    $scope.apps = apps;
                }, function(error) {
                    console.log(error);
                });
            }, function(error) {
                console.log(error);
            });

            $scope.createApp = function () {
                PlatformFactory.show(function(info) {
                    $scope.app.ap_app_role = info._id;//acquires the default role for the app before creating it
                    AppFactory.create($scope.app, function(app) {
                        $scope.apps.push(app);
                        $scope.app = {};
                    }, function(error) {
                        console.log(error);
                    });
                }, function(error) {
                    console.log(error);
                });
            };

            $scope.isEven = function (num) {//for applying CSS classes appropriately in iterating through apps in ng-repeat
                return ((num % 2) == 0);
            }

            $scope.searchText = "";

            $scope.isAppActive = function (app_status) {
                return app_status == 'active';
            }

            $scope.toggleApp = function (index) {//enable or disable the app - index is the index of the app in $scope.apps;
                $routeParams.id = $scope.apps[index]._id;//set the app id for the request to be the one associated with the app we are toggling.
                AppDisableFactory.toggle({id:$routeParams.id}, function(app) {
                    $scope.apps[index].ap_app_status = app.ap_app_status;
                }, function(error) {
                    console.log(error);
                });
            };
        }
    ]).controller("NavigationCtrl", ['$scope', '$location', '$routeParams',
        'AuthenticationFactory', 'CurrentUserFactory',
        function($scope, $location, $routeParams, AuthenticationFactory, CurrentUserFactory) {

            $scope.userLoggedIn = false;

            CurrentUserFactory.query($routeParams, function(user) {
                $scope.user = user;
                if ($scope.user._id !== undefined) {
                    $scope.userLoggedIn = true;
                }
                console.log(user);
            }, function(error) {
                console.log(error);
            });


        }
    ]
);

