(function(){
    'use strict';
    
    angular
        .module('app')
        .controller('registerCtrl', registerCtrl);
    
    function registerCtrl($timeout){
        var vm = this;
        var auth = firebase.auth();
        var userRef = firebase.database().ref('users');
        var registerBtn = document.getElementById('register-btn');

        vm.register = function() {
            registerBtn.disabled = true;

            auth.createUserWithEmailAndPassword(vm.user.email, vm.user.pass)
                .then(function(user) {
                    userRef.child(auth.currentUser.uid).set({
                        isAdmin: false,
                        name: vm.user.name,
                        contactNumber: vm.user.contactNumber,
                        address: vm.user.address
                    }).then(function(data) {
                        $timeout(function() {
                            vm.user = {};
                            $('#register').closeModal();

                            registerBtn.disabled = false;

                            swal('Success', 'User successfully registered', 'success');
                        });
                    }).catch(function(error) {
                        swal('Error', error.message, 'error');
                    });
                }).catch(function(error) {
                    registerBtn.disabled = false;

                    swal('Error', error.message, 'error');
                });
        };
    }
})(); 