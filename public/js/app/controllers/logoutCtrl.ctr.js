(function(){
    'use strict';
    
    angular
        .module('app')
        .controller('logoutCtrl', logoutCtrl);
    
    function logoutCtrl($state){
        var vm = this;

        vm.logout = function() {
            firebase.auth().signOut().
                then(function() {
                    $state.go('login');

                    swal('Success', 'Successfully logged out', 'success');
                }, function(error) {
                    swal('Error', error.message, 'error');
                });
        };
    }
})(); 