angular.module('app')
.controller('LogsCtrl', function ($scope, LogsSvc) {
    LogsSvc.fetch()
    .success(function (logs) {
        $scope.logs = logs;
    });

});

