angular.module('app')
.controller('LoginCtrl', function ($scope, $location, $log, UserSvc) {
    $scope.errmsg = null;

    $scope.login = function(username, password) {
        UserSvc.getToken(username, password)
        .success(function (token) {
            UserSvc.getUser(token)
            .success(function (user) {
                UserSvc.currentUser = user;
                UserSvc.currentUser.token = token;
                $log.info('Logged in user ' + user.email);
                $scope.$emit('login', user);
                $location.path('/');
            });
        }).error(function (data, status) {
            $scope.email = null;
            $scope.password = null;
            $scope.errmsg = 'Failed to authenticate user';
            $log.error('Failed to authenticate user', status, data);
        });
    }
});
