angular.module('app')
.controller('PostsCtrl', function ($scope, PostsSvc, UserSvc) {

    $scope.addPost = function () {
        if ($scope.postBody) {
            PostsSvc.create({
                username: UserSvc.currentUser.name,
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

