(function(){
    'use strict';
    
    angular
        .module('app')
        .controller('productOrderCrtl', productOrderCrtl);
    
    function productOrderCrtl(){
        var vm = this;
        vm.orderList = [{}];
        vm.quantity = 0;
        vm.totalPrice = 0;
        vm.persons = [{
				    "id": 860,
				    "image": "images/pormon.jpg",
				    "firstName": "Superman",
				    "lastName": "Yoda",
				    "category": "Awesome",
				    "price": 100

				}, {
				    "id": 870,
				    "image": "images/pormon.jpg",
				    "firstName": "Foo",
				    "lastName": "Whateveryournameis",
				    "category": "Awesome",
				    "price": 100
				}, {
				    "id": 590,
				    "image": "images/pormon.jpg",
				    "firstName": "Toto",
				    "lastName": "Titi",
				    "category": "Awesome",
				    "price": 100
				}, {
				    "id": 803,
				    "image": "images/pormon.jpg",
				    "firstName": "Luke",
				    "lastName": "Kyle",
				    "category": "Awesome",
				    "price": 100
				}];
        
        vm.addToCart = function(index){
          vm.orderList.push({
             orderName: vm.persons[index].firstName,
             quantity: vm.quantity,
             price: vm.quantity*vm.persons[index].price
          }); 
            
         vm.orderList.forEach(function(){
             vm.totalPrice += vm.orderList.price;
         });
        };
    }
})(); 