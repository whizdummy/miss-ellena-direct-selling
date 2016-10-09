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
                $('#side-nav-btn').show();
                
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
                $('#side-nav-btn').hide();

                $state.go('login');
            } 
        });

        vm.login = function(user){
            $('.btn').prop('disabled', true);

            firebase.auth().signInWithEmailAndPassword(vm.user.email, vm.user.pass)
                .catch(function(error) {
                    swal('Error', error.message, 'error');

                    $('.btn').prop('disabled', false);
                });
        };
        
        vm.register = function(user){
          user = {};//Empty user object after submit  
        };

        vm.continueAsGuest = function() {
            $state.go('productOrder');
        }
    }
})(); 