(function(){
    'use strict';
    
    angular
        .module('app')
        .controller('dashboardCtrl', dashboardCtrl);
    
    function dashboardCtrl($rootScope, $location){
        var vm = this;
        $rootScope.showSection = $location.path() == "/login";
          console.log($rootScope.showSection);
        vm.name = "Pakyu";
        console.log("Log this shit");
    }
})(); 