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
                $scope.userLogsSearch = LogsFactory.query({lo_log_level: 'user_activity'});
            } else {
                $scope.appLogsSearch = LogsFactory.query({lo_log_level: 'app_activity'});
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