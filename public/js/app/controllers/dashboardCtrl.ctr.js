(function(){
    'use strict';
    
    angular
        .module('app')
        .controller('dashboardCtrl', dashboardCtrl);
    
    function dashboardCtrl($rootScope, $location){
        var vm = this;
        $rootScope.showSection = $location.path() == "/login";
    }
})(); 