(function(){
    'use strict';
    
    angular
        .module('app')
        .controller('loginCtrl', loginCtrl);
    
    function loginCtrl($state, $location){
        var vm = this;
        var auth = firebase.auth();
        var userRef = firebase.database().ref('users');
        
        auth.onAuthStateChanged(function(user) {
            if(user) {
                $('#log-out').show();
                
                userRef.child(user.uid).once('value', function(data) {
                    $('#register').closeModal();

                    if(data.val().isAdmin) {
                        $state.go('dashboard');
                    } else {
                        $state.go('productOrder');
                    }
                });
            } else {
                $('#log-out').hide();

                $state.go('login');
            }
        });

        vm.login = function(user){
            firebase.auth().signInWithEmailAndPassword(vm.user.email, vm.user.pass)
                .catch(function(error) {
                    swal('Error', error.message, 'error');
                });
        };
        
        vm.register = function(user){
          user = {};//Empty user object after submit  
        };
    }
})(); 