angular.module('app')
.controller('PostsCtrl', function ($scope, PostsSvc, localStorageService) {

    $scope.addPost = function () {
        if ($scope.postBody) {
            PostsSvc.create({
                username: localStorageService.get('currentUser').name,
                body: $scope.postBody
            }).success(function (post) {
                $scope.posts.unshift(post);
                $scope.postBody = null;
            });
        }
    }
    
    PostsSvc.fetch()
    .success(function (posts) {
        $scope.posts = posts;
    });

});

