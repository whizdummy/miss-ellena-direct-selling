(function(){
    'use strict';
    
    angular
        .module("app", ['ui.router', 'datatables'])
        .config(function($stateProvider, $urlRouterProvider){
       
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'main.html',
                controller: 'loginCtrl as vm'
            })
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: 'js/app/templates/dashboardTpl.html',
                controller: 'dashboardCtrl as vm'
            })
            .state('productsMtn', {
                url: '/products',
                templateUrl: 'js/app/templates/productsMtn.html',
                controller: 'productMtnCtrl as vm'
            })
            .state('categoryMtn', {
                url: '/categories',
                templateUrl: 'js/app/templates/categoryMtn.html',
                controller: 'categoryMtnCtrl as vm'
            })
            .state('productOrder', {
                url: '/order',
                templateUrl: 'js/app/templates/productOrder.html',
                controller: 'inventoryCtrl as vm'
            });

        $urlRouterProvider.otherwise('/dashboard')
    });;
})();
