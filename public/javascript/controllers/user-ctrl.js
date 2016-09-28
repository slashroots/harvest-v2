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
).controller("UserLoginCtrl", ['$scope', '$location', '$routeParams', 'UserFactory',
        'AuthenticationFactory', 'PlatformFactory',
        function($scope, $location, $routeParams, UserFactory, AuthenticationFactory, PlatformFactory) {
            var credentials = {};

            $scope.login = function() {
                $scope.credentials.password = CryptoJS.SHA1($scope.credentials.password).toString(CryptoJS.enc.Hex);
                AuthenticationFactory.login($scope.credentials, function(response) {
                    $location.url('/dashboard');
                }, function(error) {
                    alert("incorrect credentials!");
                });
            };
        }
    ]
).controller("UserDashboardCtrl", ['$scope', '$location', '$routeParams', 'UserFactory', 'AppsFactory', 'AppFactory','PlatformFactory',
        function($scope, $location, $routeParams, UserFactory, AppsFactory, AppFactory, PlatformFactory) {

            $scope.app = {};

            AppsFactory.query($routeParams, function(apps) {
                $scope.apps = apps;
            }, function(error) {
                console.log(error);
            });

            $scope.createApp = function () {
                PlatformFactory.show(function(info) {
                    console.log(info);
                    $scope.app.ap_app_role = info._id;//acquires the default role for the app before creating it
                    console.log($scope.app);
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

        }
    ]
);

