(function(){
    'use strict';
    
    angular
        .module('app')
        .controller('loginCtrl', loginCtrl);
    
    function loginCtrl(){
        var vm = this;
        
        vm.user = {};
    }
})(); 