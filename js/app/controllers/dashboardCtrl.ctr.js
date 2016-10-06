(function(){
    'use strict';
    
    angular
        .module('app')
        .controller('dashboardCtrl', dashboardCtrl);
    
    function dashboardCtrl(){
        var vm = this;
        
        vm.name = "Pakyu";
        console.log("Log this shit");
    }
})(); 