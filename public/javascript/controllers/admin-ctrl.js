angular.module('harvestv2')
    .controller("AdminDashboardCtrl", ['$scope', '$location', '$routeParams', 'UsersFactory', 'AppsFactory', 'LogsFactory',
        function($scope, $location, $routeParams, UsersFactory, AppsFactory, LogsFactory) {

            /**
             * Init Variables
             */
            $scope.usersSearch = $scope.roles = $scope.appsSearch = $scope.userLogsSearch = $scope.appLogsSearch = [];
            $scope.entity = $routeParams.entity;

            /**
             * Based on the entity, choose appropriate factory and run query across all users or apps
             */
            if($routeParams.entity == 'users') {
                $scope.users = $scope.usersSearch = UsersFactory.query();
            } else {
                $scope.appsSearch = AppsFactory.query();
            }


            /**
             * TODO: requires restrictions on the amount of logs retrieved
             */
            if(!$routeParams.entity) {
                $scope.userLogsSearch = LogsFactory.query({lo_log_level: 'user_activity'});
                $scope.appLogsSearch = LogsFactory.query({lo_log_level: 'app_activity'});
            }
        }
    ]
).controller("AdminActivityCtrl", ['$scope', '$location', '$routeParams', 'UsersFactory', 'AppsFactory', 'LogsFactory',
        function($scope, $location, $routeParams, UsersFactory, AppsFactory, LogsFactory) {

            /**
             * Init Variables
             */
            $scope.userLogsSearch = $scope.appLogsSearch = [];
            $scope.entity = $routeParams.entity;


            /**
             * Based on entity search logs.  TODO: This should be restricted
             */
            if($routeParams.entity == 'user') {
                $scope.userLogsSearch = $scope.userLogs = LogsFactory.query({lo_log_level: 'user_activity'});
            } else {
                $scope.appLogsSearch  = $scope.appLogs = LogsFactory.query({lo_log_level: 'app_activity'});
            }

            $scope.filterAppLogs = function (searchText) {
                $scope.appLogsSearch = [];
                for (var i = 0; i < $scope.appLogs.length; i++) {
                    if ($scope.appLogs[i].lo_log_user !== null) {
                        if ($scope.appLogs[i].lo_log_description.includes(searchText) || $scope.appLogs[i].lo_log_user.ap_app_name.includes(searchText) || $scope.appLogs[i].lo_log_user.ap_app_desc.includes(searchText) || $scope.appLogs[i].lo_log_requested.includes(searchText)) $scope.appLogsSearch.push($scope.appLogs[i]);
                    }
                    else if ($scope.appLogs[i].lo_log_description.includes(searchText) || $scope.appLogs[i].lo_log_requested.includes(searchText)) $scope.appLogsSearch.push($scope.appLogs[i]);
                }
            };

            $scope.filterUserLogs = function (searchText) {
                $scope.userLogsSearch = [];
                for (var i = 0; i < $scope.userLogs.length; i++) {
                    if ($scope.userLogs[i].lo_log_description.includes(searchText) || $scope.userLogs[i].lo_log_user.us_user_first_name.includes(searchText) || $scope.userLogs[i].lo_log_user.us_username.includes(searchText)) $scope.userLogsSearch.push($scope.userLogs[i]);
                }
            }

        }
    ]
).controller("AdminRoleCtrl", ['$scope', '$location', '$routeParams', 'UsersFactory', 'AppsFactory', 'RolesFactory',
        function($scope, $location, $routeParams, UsersFactory, AppsFactory, RolesFactory) {

            /**
             * Init Variables
             */
            $scope.roles = [];

            /**
             * Retrieve platform roles for applications
             */
            $scope.roles = RolesFactory.query();
        }
    ]
).filter('titleCase', function() {
        return function(input) {
            input = input || '';
            return input.replace(/\w\S*/g,
                function(txt){
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                });
        };
    });