angular.module('app')
.service('PostsSvc', function ($http, UserSvc) {
    this.fetch = function () {
        return $http.get('/api/posts');
    }
    
    this.create = function (post) {
        return $http.post('/api/posts', post, {
            headers: { "X-Auth": UserSvc.currentUser.token }
        });
    }
});