(function(){
    'use strict';
    
    var app = angular
        .module("app", ['ui.router', 'datatables', 'ui.materialize'])
        .config(function($stateProvider, $urlRouterProvider){
       
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'js/app/templates/login.html',
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
             .state('brandMtn', {
                url: '/brands',
                templateUrl: 'js/app/templates/brandsMtn.html',
                controller: 'brandMtnCtrl as vm'
            })
            .state('categoryMtn', {
                url: '/categories',
                templateUrl: 'js/app/templates/categoryMtn.html',
                controller: 'categoryMtnCtrl as vm'
            })
           
            .state('productOrder', {
                url: '/order',
                templateUrl: 'js/app/templates/productOrder.html',
                controller: 'productOrderCrtl as vm'
            })
            .state('customerOrder', {
                url: '/account',
                templateUrl: 'js/app/templates/customerOrder.html',
                controller: 'customerOrderCtrl as vm'
            });

        $urlRouterProvider.otherwise('/login')
    })
    
    .run(function($rootScope, $location) {
          $rootScope.showSection = $location.path() == "/login";
    });
})();
