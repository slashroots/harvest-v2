/**
 * Created by Nick on 15/09/16.
 */

angular.module('harvestv2')

    .controller("UserCtrl", ['$scope', '$location', 'UserFactory', function($scope, $location, UserFactory) {

        $scope.user = {};

        $scope.createUser = function () {

            console.log($scope.user);

            UserFactory.create($scope.user, function(user) {
                $location.url('confirmation');
            }, function(error) {
                console.log(error);
            })

        }

    }]);
