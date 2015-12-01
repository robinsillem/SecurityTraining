angular.module('app')
.controller('LogsCtrl', function ($scope, LogsSvc) {
    LogsSvc.fetch()
    .success(function (logs) {
        $scope.logs = logs;
    });

    $scope.$on('ws:new_log', function (_, log) {
        $scope.$apply(function () {
            $scope.logs.unshift(log);
        });
    });
    
});

