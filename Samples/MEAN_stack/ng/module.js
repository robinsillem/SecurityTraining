﻿var module = angular.module('app', [
    'ngRoute'
]);

module.run(function ($http) {
    $http.defaults.headers.common['Cache-Control'] = 'no-cache, no - store, must-revalidate';
    $http.defaults.headers.common['Pragma'] = 'no-cache';
    $http.defaults.headers.common['Expires'] = '0';
});
