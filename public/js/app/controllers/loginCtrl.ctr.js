(function(){
    'use strict';
    
    angular
        .module('app')
        .controller('loginCtrl', loginCtrl);
    
    function loginCtrl($state){
        var vm = this;
        
        vm.user = {};
        
        vm.login = function(user){
            console.log(vm.user);
            $state.go('dashboard'); // if success
        };
        
        vm.register = function(user){
          user = {};//Empty user object after submit  
        };
    }
})(); 