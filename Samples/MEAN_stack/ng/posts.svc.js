angular.module('app')
.service('PostsSvc', function ($http, localStorageService) {
    this.fetch = function () {
        return $http.get('/api/posts');
    }
    
    this.create = function (post) {
        return $http.post('/api/posts', post, {
            headers: { "X-Auth": localStorageService.get('currentUser').token }
        });
    }
});