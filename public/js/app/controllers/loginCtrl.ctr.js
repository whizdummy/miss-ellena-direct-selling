(function(){
    'use strict';
    
    angular
        .module('app')
        .controller('loginCtrl', loginCtrl);
    
    function loginCtrl($state, $location){
        var vm = this;
        var auth = firebase.auth();
        var userRef = firebase.database().ref('users');

        vm.user = {};
        
        auth.onAuthStateChanged(function(user) {
            if(user) {
                userRef.child(user.uid).once('value', function(data) {
                    if(data.val().isAdmin) {
                        $state.go('dashboard');
                    } else {
                        $state.go('productOrder');
                    }
                });
            } else {
                $state.go('login');
            }
        });

        vm.login = function(user){
            console.log(vm.user);

            firebase.auth().signInWithEmailAndPassword(vm.user.email, vm.user.pass)
                .catch(function(error) {
                    swal('Error', error.message, 'error');
                });
            // $state.go('dashboard'); // if success
        };
        
        vm.register = function(user){
          user = {};//Empty user object after submit  
        };
    }
})(); 