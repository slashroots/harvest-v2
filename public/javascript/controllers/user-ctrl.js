/**
 * Created by Nick on 15/09/16.
 */

angular.module('harvestv2')
    .controller("UserCtrl", ['$scope', '$location', '$routeParams', 'UserFactory', 'RolesFactory',
        'PlatformFactory', 'CurrentUserFactory', 'UserPasswordFactory',
        function($scope, $location, $routeParams, UserFactory, RolesFactory, PlatformFactory, CurrentUserFactory,
                 UserPasswordFactory) {

            /**
             * Registration Page defaults
             */
            $scope.user = {};
            $scope.selectedRole = {};
            $scope.passwordConfirm = "";
            $scope.agreeChecked = false;
            $scope.confirmation = false;
            $scope.default_user_role = "";
            $scope.signupErrorMessage = '';

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
                 	$scope.current_user.us_password = "";
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
                        /**
                         * A bootstrap alert has been implemented so this should be fine now from a UI standpoint
                         * TODO: Implement this better --> error.data.message.errmsg.startsWith('E11000')
                         */
                        if(error.data.message.errmsg.startsWith('E11000')){
                            $scope.signupErrorMessage = error.data.message.errmsg.split('"')[1]+ " has already been used!";
                        }
                    })
                }
            };

            /**
             * TODO: Change this from a JQuery library to an angular implemented function
             */
            $scope.chpass = function () {
                if (!$scope.chpassForm.$invalid &&
                    $scope.validatePasswordMatch($scope.current_user.new_password, $scope.passwordConfirm)) {
                    $scope.user.new_password = CryptoJS.SHA1($scope.current_user.new_password).toString(CryptoJS.enc.Hex);
                    $scope.user.old_password = CryptoJS.SHA1($scope.current_user.old_password).toString(CryptoJS.enc.Hex);

                    UserPasswordFactory.change({id : $scope.current_user._id}, $scope.user,
                        function(user) {
                            $scope.confirmation = true;
                		//var elem = document.getElementById("feedbackmsg");
                		//elem.style.color = "green";
                		$scope.alertType = "success";
                		$scope.alertMsg = "Your password has been changed.";
                        }, function(error) {
                		//var elem = document.getElementById("feedbackmsg");
                		//elem.style.color = "red";
                		$scope.alertType = "danger";
                		$scope.alertMsg = "Incorrect password provided. Your password was not changed.";
                        });
                        $scope.current_user.old_password = "";
                        $scope.current_user.new_password = "";
                        $scope.passwordConfirm = "";
                }
            };
            $scope.setupVisualValidationCues = function () {
                jQuery('#signupForm').validator();
            };

            $scope.setupVisualValidationCues();

        }
    ]
).controller("UserLoginCtrl", ['$scope', '$location', '$routeParams', 'UserFactory', 'UserActivationFactory',
        'AuthenticationFactory', 'SharedState',
        function($scope, $location, $routeParams, UserFactory, UserActivationFactory,
                 AuthenticationFactory, SharedState) {
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

            /**
             * If the detected user is an administrator then direct them to the admin dashboard otherwise
             * the regular dashboard
             */
            $scope.login = function() {
                $scope.credentials.password = CryptoJS.SHA1($scope.credentials.password).toString(CryptoJS.enc.Hex);
                AuthenticationFactory.login($scope.credentials, function(response) {
                    SharedState.setCurrentUser(response);
                    if(response.us_user_role == 'admin') {
                        $location.url('/admin');
                    } else {
                        $location.url('/dashboard');
                    }
                }, function(error) {
                    $scope.success = false;
                    $scope.loginScreenNotification = "We were unable to log you in! Please check your credentials!";
                });
            };

        }
    ]
).controller("UserDashboardCtrl", ['$scope', '$location', '$routeParams', 'CurrentUserFactory',
        'UserAppsFactory', 'AppFactory','PlatformFactory',
        function($scope, $location, $routeParams, CurrentUserFactory,
                 UserAppsFactory, AppFactory, PlatformFactory) {
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
        'AuthenticationFactory', 'CurrentUserFactory', 'UserLogoutFactory', 'SharedState',
        function($scope, $location, $routeParams, AuthenticationFactory, CurrentUserFactory, UserLogoutFactory,
                 SharedState) {
            $scope.current_user = "";

            $scope.userLoggedIn = false;
            $scope.isAdmin = false;

            $scope.logout = function() {
                UserLogoutFactory.logout(function(response) {
                    $location.url('/');
                    SharedState.setCurrentUser({});
                    $scope.userLoggedIn=false;
                    $scope.isAdmin = false;
                }, function(error) {
                });
            };

            /**
             * The below function checks the path loaded to see if
             * it is a path specified in the link attribute of the navbar
             * should it match then the active class is set on the
             * appropriate link.
             */
            $scope.isActive = function (linkPath) {
        		return linkPath === $location.path();
    		};

            /**
             * In the event that the screen refreshes
             * we can query the backend to give back
             * the user details.
             */
            var configureUI = function () {
                CurrentUserFactory.query(function (user) {
                    SharedState.setCurrentUser(user);
                    $scope.current_user = user;
                    if ($scope.current_user._id !== undefined) {
                        $scope.userLoggedIn = true;
                        if ($scope.current_user.us_user_role == 'admin') {
                            $scope.isAdmin = true;
                        } else {
                            $scope.isAdmin = false;
                        }
                    } else {
                        $scope.userLoggedIn = false;
                    }
                });
            };
            configureUI();

            /**
             * Monitor changes to the user object within the sharedState.
             */
            $scope.$watch(function () { return SharedState.getCurrentUser();}, function (newValue, oldValue) {
                if(newValue.hasOwnProperty('us_user_role')) {
                    configureUI();
                }
            }, true);
        }
    ]
).controller("DocsCtrl", ['$scope', '$location', '$routeParams',
        'AuthenticationFactory', 'CurrentUserFactory', 'UserLogoutFactory', 'SharedState',
        function($scope, $location, $routeParams, AuthenticationFactory, CurrentUserFactory, UserLogoutFactory,
                 SharedState) {
            Redoc.init('/docs/swagger.yaml');
        }
    ]
)
/**
 * This is used to share the user object of the currently logged in user.
 * Must setCurrentUser upon login and logout.
 */
    .factory("SharedState", function () {
        var user = {};
        function getCurrentUser() {
            return user;
        }
        function setCurrentUser(new_user) {
            user = new_user;
        }
        return {
            getCurrentUser: getCurrentUser,
            setCurrentUser: setCurrentUser
        }
    });
