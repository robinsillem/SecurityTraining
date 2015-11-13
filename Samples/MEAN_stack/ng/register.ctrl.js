angular.module('app')
.controller('RegisterCtrl', function ($scope, $location, UserSvc) {
    $scope.register = function (username, password) {
        UserSvc.createUser(username, password)
        .then(function (response) {
            $scope.$emit('login', response.data);
            $location.path('/');
        });
    }
});