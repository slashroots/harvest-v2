/**
 * Created by Nick on 15/09/16.
 */

angular.module('harvestv2')
    .controller("UserCtrl", ['$scope', '$location', '$routeParams', 'UserFactory', 'RolesFactory', function($scope, $location, $routeParams, UserFactory, RolesFactory) {

        RolesFactory.query($routeParams, function(roles) {
            $scope.roles = roles;
        }, function(error) {
            console.log(error);
        });

        $scope.user = {};
        $scope.selectedRole = {};
        $scope.passwordConfirm = "";
        $scope.agreeChecked = false;

        $scope.validatePasswordMatch = function (pass1, pass2) {
            console.log((pass1 == pass2));
            return (pass1 == pass2);
        };

        $scope.createUser = function () {
            if (!$scope.signupForm.$invalid && $scope.validatePasswordMatch($scope.user.us_password, $scope.passwordConfirm) && $scope.agreeChecked)
                UserFactory.create($scope.user, function(user) {
                $location.url('confirmation');
            }, function(error) {
                console.log(error);
            })
        }

        $scope.setupVisualValidationCues = function () {

            jQuery('#signupForm').validator();

        }

        $scope.setupVisualValidationCues();

    }]);
