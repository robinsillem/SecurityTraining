angular.module('app')
.controller('PostsCtrl', function ($scope, PostsSvc, localStorageService, $location, $sce) {
    var hash = decodeURIComponent($location.search().search || "");
    $scope.searchString = hash;
    $scope.trustedSearch = $sce.trustAsHtml(hash);

    $scope.addPost = function () {
        if ($scope.postBody) {
            PostsSvc.create({
                username: localStorageService.get('currentUser').name,
                body: $scope.postBody
            }).success(function (post) {
                $scope.postBody = null;
            });
        }
    }

    $scope.$on('ws:new_post', function(_, post) {
        $scope.$apply(function() {
            $scope.posts.unshift(post);
        });
    });
    
    PostsSvc.fetch(hash)
    .success(function (posts) {
        $scope.posts = posts;
    });

    $scope.search = function() {
        $location.search({search: $scope.searchString});
    };

});

