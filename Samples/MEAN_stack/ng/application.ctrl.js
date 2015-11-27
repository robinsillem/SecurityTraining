angular.module('app')
.controller('ApplicationCtrl', function ($scope, localStorageService) {
    
    $scope.currentUser = localStorageService.get('currentUser');

    $scope.$on('login', function(_, user) {
        $scope.currentUser = user;
    });

    $scope.logout = function () {
        localStorageService.remove('currentUser');
        $scope.currentUser = null;
    }
});
