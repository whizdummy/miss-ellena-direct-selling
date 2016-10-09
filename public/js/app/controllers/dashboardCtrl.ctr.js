(function(){
    'use strict';
    
    angular
        .module('app')
        .controller('dashboardCtrl', dashboardCtrl);
    
    function dashboardCtrl($rootScope, $location, $state){
        var vm = this;
        var auth = firebase.auth();
        var userRef = firebase.database().ref('users');
        $rootScope.showSection = $location.path() == "/login";

        auth.onAuthStateChanged(function(user) {
            if(user) {
                $('#log-out').show();
                $('.user').hide();

                userRef.child(user.uid).once('value', function(data) {
                    $('#register').closeModal();

                    if(!data.val().isAdmin) {
                        $state.go('productOrder');
                    }
                });
            } else {
                $('#log-out').hide();

                $state.go('login');
            }
        });
    }
})(); 