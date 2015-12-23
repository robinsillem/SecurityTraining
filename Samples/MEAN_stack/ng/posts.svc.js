angular.module('app')
.service('PostsSvc', function ($http, localStorageService) {
    this.fetch = function (search) {
        if (search) {
            search = "?search=" + search;
        }
        return $http.get('/api/posts' + (search ? search : ""));
    }
    
    this.create = function (post) {
        return $http.post('/api/posts', post, {
            headers: { "X-Auth": localStorageService.get('currentUser').token }
        });
    }
});