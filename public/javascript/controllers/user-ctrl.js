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
                AuthenticationFactory.login(credentials, function(response) {
                    console.log(response);
                }, function(error) {
                    console.log(error);
                });
            };
        }
    ]
);

