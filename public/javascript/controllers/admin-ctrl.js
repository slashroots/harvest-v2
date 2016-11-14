angular.module('harvestv2')
    .controller("AdminDashboardCtrl", ['$scope', '$location', '$routeParams', 'UsersFactory', 'AppsFactory', 'LogsFactory', 'RolesFactory',
        function($scope, $location, $routeParams, UsersFactory, AppsFactory, LogsFactory, RolesFactory) {

            $scope.usersSearch = $scope.roles = $scope.appsSearch = $scope.userLogsSearch = $scope.appLogsSearch = [];//declaring these here prevents Javascript errors from the Angular library we are using for the tables

            UsersFactory.query($routeParams, function(users) {
                $scope.users = users;
                $scope.usersSearch = users;
                $scope.userCount = users.length;
            }, function(error) {
                console.log(error);
            });

            RolesFactory.query($routeParams, function(roles) {
                $scope.roles = roles;
            }, function(error) {
                console.log(error);
            });

            AppsFactory.query($routeParams, function(apps) {
                $scope.apps = apps;
                $scope.appsSearch = apps;//this variable will store our search results
            }, function(error) {
                console.log(error);
            });

            LogsFactory.query($routeParams, function(applogs) {
                $scope.appLogs = applogs;
                $scope.appLogsSearch = applogs;//this variable will store our search results
            }, function(error) {
                console.log(error);
            });

            $scope.searchText = "";

            //the following functions filter results for each of the tables on the Admin Dashboard because we are not using ng-repeat due to the pagination library

            $scope.filterAppsByName = function () {
                $scope.appsSearch = [];
                for (var i = 0; i < $scope.apps.length; i++) {
                    if ($scope.apps[i].ap_app_name.includes($scope.searchText)) $scope.appsSearch.push($scope.apps[i]);
                }
            }

            $scope.filterUserLogs = function () {
                $scope.userLogsSearch = [];
                for (var i = 0; i < $scope.userLogs.length; i++) {
                    if ($scope.userLogs[i].lo_log_description.includes($scope.searchText) || $scope.userLogs[i].lo_log_user.us_user_first_name.includes($scope.searchText) || $scope.userLogs[i].lo_log_user.us_username.includes($scope.searchText)) $scope.userLogsSearch.push($scope.userLogs[i]);
                }
            }

            $scope.filterAppLogs = function () {
                $scope.appLogsSearch = [];
                for (var i = 0; i < $scope.appLogs.length; i++) {
                    if ($scope.appLogs[i].lo_log_user !== null) {
                        if ($scope.appLogs[i].lo_log_description.includes($scope.searchText) || $scope.appLogs[i].lo_log_user.ap_app_name.includes($scope.searchText) || $scope.appLogs[i].lo_log_user.ap_app_desc.includes($scope.searchText) || $scope.appLogs[i].lo_log_requested.includes($scope.searchText)) $scope.appLogsSearch.push($scope.appLogs[i]);
                    }
                    else if ($scope.appLogs[i].lo_log_description.includes($scope.searchText) || $scope.appLogs[i].lo_log_requested.includes($scope.searchText)) $scope.appLogsSearch.push($scope.appLogs[i]);
                }
            }

            $scope.filterUsersByName = function () {
                $scope.usersSearch = [];
                for (var i = 0; i < $scope.users.length; i++) {
                    if ($scope.users[i].us_user_first_name.includes($scope.searchText) || $scope.users[i].us_user_last_name.includes($scope.searchText) || $scope.users[i].us_username.includes($scope.searchText)) $scope.usersSearch.push($scope.users[i]);
                }
            }

            $scope.config = {
                itemsPerPage: 5,
                fillLastPage: true
            }

        }
    ]
)