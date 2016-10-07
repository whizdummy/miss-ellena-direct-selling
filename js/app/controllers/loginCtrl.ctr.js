(function(){
    'use strict';
    
    angular
        .module('app')
        .controller('loginCtrl', loginCtrl);
    
    function loginCtrl(){
        var vm = this;
        
        vm.user = {};
        
        vm.login = function(user){
            console.log(vm.user);
        };
        
        vm.register = function(user){
          user = {};//Empty user object after submit  
        };
    }
})(); 