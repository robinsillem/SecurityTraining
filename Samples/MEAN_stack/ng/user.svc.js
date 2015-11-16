angular.module('app')
.service('UserSvc', function ($http) {
    var svc = this;

    svc.currentUser = null;

    svc.getUser = function (token) {
        return $http.get('/api/users', {
            headers: { "X-Auth": token }
        });
    }

    svc.getToken = function (email, password) {
        return $http.post('/api/sessions', {
            email: email,
            password: password
        });
    }
    
    svc.createUser = function (email, name, password) {
        return $http.post('/api/users', {
            email: email,
            name: name,
            password: password
        });
    }
});