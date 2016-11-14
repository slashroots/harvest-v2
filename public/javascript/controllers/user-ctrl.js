/**
 * Created by Nick on 15/09/16.
 */

angular.module('harvestv2')
    .controller("UserCtrl", ['$scope', '$location', '$routeParams', 'UserFactory', 'RolesFactory',
        'PlatformFactory', 'CurrentUserFactory',
        function($scope, $location, $routeParams, UserFactory, RolesFactory, PlatformFactory, CurrentUserFactory) {

            /**
             * Registration Page defaults
             */
            $scope.user = {};
            $scope.selectedRole = {};
            $scope.passwordConfirm = "";
            $scope.agreeChecked = false;
            $scope.confirmation = false;
            $scope.default_user_role = "";

            /**
             * First step is to get the default platform role
             * and assign it to the user during registration
             */
            PlatformFactory.show(function(info) {
                console.log(info);
                $scope.default_user_role = info.default_user_role;
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
             * Intended for users that are already registered.  Queries for
             * currently logged in user.
             */
            CurrentUserFactory.query($routeParams, function(currentuser) {
                if(currentuser) {
                    $routeParams.id = currentuser._id;
                    UserFactory.show($routeParams, function (user) {
                        $scope.current_user = user;
                    }, function (error) {
                        console.log(error);
                    });
                }
            }, function(error) {
                console.log(error);
            });

            /**
             * Function creates user if all checks have passed
             * Also hashes the password for transmission.
             */
            $scope.createUser = function () {
                if (!$scope.signupForm.$invalid &&
                    $scope.validatePasswordMatch($scope.user.us_password, $scope.passwordConfirm) &&
                    $scope.agreeChecked) {
                    $scope.user.us_user_role = $scope.default_user_role;
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
).controller("AdminDashboardCtrl", ['$scope', '$location', '$routeParams', 'UsersFactory', 'AppsFactory','UserLogsFactory', 'ApplicationLogsFactory', 'RolesFactory',
        function($scope, $location, $routeParams, UsersFactory, AppsFactory, UserLogsFactory, ApplicationLogsFactory, RolesFactory) {

            $scope.usersSearch = $scope.roles = $scope.appsSearch = $scope.userLogsSearch = $scope.appLogsSearch = [];//declaring these here prevents Javascript errors from the Angular library we are using for the tables

            UsersFactory.query($routeParams, function(users) {
               $scope.users = users;
               $scope.usersSearch = users;
               $scope.userCount = users.length;
               console.log(users.length);
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

            UserLogsFactory.query($routeParams, function(userlogs) {
                $scope.userLogs = userlogs;
                $scope.userLogsSearch = userlogs;//this variable will store our search results
            }, function(error) {
                console.log(error);
            });

            ApplicationLogsFactory.query($routeParams, function(applogs) {
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
).controller("UserDashboardCtrl", ['$scope', '$location', '$routeParams', 'CurrentUserFactory', 'UserAppsFactory', 'AppFactory','PlatformFactory',
        function($scope, $location, $routeParams, CurrentUserFactory, UserAppsFactory, AppFactory, PlatformFactory) {
            $scope.app = {};
            $scope.user = {};
            $scope.searchText = "";

            /**
             * Gets the current user so we can pass the id to get all their apps - we could also have grabbed their id from the req.user.id instead of doing this but the endpoint was already created to expect an ID being passed to it
             **/
            CurrentUserFactory.query($routeParams, function(user) {
                $routeParams.id = user._id;
                UserAppsFactory.query($routeParams, function(apps) {//gets all applications for this specific user
                    $scope.apps = apps;
                    $scope.appCount = apps.length;
                }, function(error) {
                    console.log(error);
                });

            }, function(error) {
                console.log(error);
            });

            $scope.createApp = function () {
                PlatformFactory.show(function(info) {
                    $scope.app.ap_app_role = info.default_app_role._id;//acquires the default role for the app before creating it
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

            /**
             * Is Application Active?
             * @param app_status
             * @returns {boolean}
             */
            $scope.isAppActive = function (app_status) {
                return app_status == 'active';
            };

            /**
             * enable or disable the app - index is the index of the app in $scope.apps;
             * @param index
             */
            $scope.setAppState = function (index, state) {
                AppFactory.update({id: $scope.apps[index]._id},
                    {ap_app_status: state}, function(app) {
                    $scope.apps[index].ap_app_status = app.ap_app_status;
                }, function(error) {
                    console.log(error);
                });
            };
        }
    ]).controller("NavigationCtrl", ['$scope', '$location', '$routeParams',
        'AuthenticationFactory', 'CurrentUserFactory', 'UserLogoutFactory',
        function($scope, $location, $routeParams, AuthenticationFactory, CurrentUserFactory, UserLogoutFactory) {

            $scope.userLoggedIn = false;

            $scope.logout = function() {
                UserLogoutFactory.logout(function(response) {
                    $location.url('/');
                }, function(error) {
                });
            };

            CurrentUserFactory.query(function(user) {
                if(user) {
                    $scope.current_user = user;
                    if ($scope.current_user._id !== undefined) {
                        $scope.userLoggedIn = true;
                    }
                }
            }, function(error) {
                console.log(error);
            });


        }
    ]
);
