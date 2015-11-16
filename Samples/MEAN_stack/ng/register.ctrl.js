angular.module('app')
.controller('RegisterCtrl', function ($scope, $location, $log, UserSvc) {
    $scope.errmsg = null;

    $scope.register = function (email, name, password) {
        UserSvc.createUser(email, name, password)
        .success(function () {
            $log.info('Registered user ' + email);
            $location.path('/login');
        }).error(function (data, status) {
            $scope.errmsg = 'Failed to create user';
            $log.error('Failed to create user', status, data);
        });
    }
    
});