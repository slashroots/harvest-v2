angular.module('harvestv2')
    .controller("AdminDashboardCtrl", ['$scope', '$location', '$routeParams', 'UsersFactory', 'AppsFactory', 'LogsFactory', 'AppFactory',
        function($scope, $location, $routeParams, UsersFactory, AppsFactory, LogsFactory, AppFactory) {

            $scope.isAppActive = function (app_status) {
                return app_status == 'active';
            };

            $scope.setAppState = function (id, state) {
                AppFactory.update({id: id},
                    {ap_app_status: state}, function(app) {
                        $scope.apps = $scope.appsSearch = AppsFactory.query();
                    }, function(error) {
                        console.log(error);
                    });
            };

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
                $scope.apps = $scope.appsSearch = AppsFactory.query();
            }

            $scope.filterUsersByName = function (searchText) {
                $scope.usersSearch = [];
                for (var i = 0; i < $scope.users.length; i++) {
                    if ($scope.users[i].us_user_first_name.includes(searchText) || $scope.users[i].us_user_last_name.includes(searchText) || $scope.users[i].us_username.includes(searchText)) $scope.usersSearch.push($scope.users[i]);
                }
            };

            $scope.filterAppsByName = function (searchText) {
                $scope.appsSearch = [];
                for (var i = 0; i < $scope.apps.length; i++) {
                    if ($scope.apps[i].ap_app_name.includes(searchText)) $scope.appsSearch.push($scope.apps[i]);
                }
            };

            /*
            Here we get all the users and store them in the appropriate scope variable. We also get the count of these users
            to use in the card on the Dashboard.
             */
            UsersFactory.query($routeParams, function(users) {
                $scope.users = users;
                $scope.userCount = $scope.users.length;
            }, function(error) {
                console.log(error);
            });

            $scope.config = {//pagination configuration
                itemsPerPage: 10,
                fillLastPage: true
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

            /*
            This function filters the table of application logs based on the text in the search box - which is passed in the searchText variable
             */
            $scope.filterAppLogs = function (searchText) {
                $scope.appLogsSearch = [];
                for (var i = 0; i < $scope.appLogs.length; i++) {
                    if ($scope.appLogs[i].lo_log_user !== null) {
                        if ($scope.appLogs[i].lo_log_description.includes(searchText) || $scope.appLogs[i].lo_log_user.ap_app_name.includes(searchText) || $scope.appLogs[i].lo_log_user.ap_app_desc.includes(searchText) || $scope.appLogs[i].lo_log_requested.includes(searchText)) $scope.appLogsSearch.push($scope.appLogs[i]);
                    }
                    else if ($scope.appLogs[i].lo_log_description.includes(searchText) || $scope.appLogs[i].lo_log_requested.includes(searchText)) $scope.appLogsSearch.push($scope.appLogs[i]);
                }
            };

            /*
             This function filters the table of user logs based on the text in the search box - which is passed in the searchText variable
             */
            $scope.filterUserLogs = function (searchText) {
                $scope.userLogsSearch = [];
                for (var i = 0; i < $scope.userLogs.length; i++) {
                    if ($scope.userLogs[i].lo_log_description.includes(searchText) || $scope.userLogs[i].lo_log_user.us_user_first_name.includes(searchText) || $scope.userLogs[i].lo_log_user.us_username.includes(searchText)) $scope.userLogsSearch.push($scope.userLogs[i]);
                }
            };

            $scope.config = {//pagination configuration
                itemsPerPage: 10,
                fillLastPage: true
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