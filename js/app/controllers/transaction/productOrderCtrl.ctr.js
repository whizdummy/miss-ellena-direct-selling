(function(){
    'use strict';
    
    angular
        .module('app')
        .controller('productOrderCrtl', productOrderCrtl);
    
    function productOrderCrtl($timeout, $filter){
        var vm = this;
        var productList 		=	[];
        var brandList 			=	[];
        var categoryList 		=	[];
        vm.orderList = [];
        vm.quantity = 0;
        vm.totalPrice = 0;
        vm.productList = [{
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

		var productRef = firebase.database().ref('products');
		var categoryRef = firebase.database().ref('categories');
		var brandRef = firebase.database().ref('brands');

		brandRef.on('value', function(data) {
        	brandList = [];

        	$timeout(function() {
        		data.forEach(function(childData) {
        			brandList.push({
        				id: childData.key,
        				name: childData.val().name
        			});
                    brandList       =   $filter('orderBy')(brandList, 'name', false);
        		});

        		vm.brands = brandList;
        	});
        });

        categoryRef.on('value', function(data) {
        	categoryList = [];

        	$timeout(function() {
        		data.forEach(function(childData) {
        			categoryList.push({
        				id: childData.key,
        				name: childData.val().name
        			});
                    categoryList       =   $filter('orderBy')(categoryList, 'name', false);
        		});

        		vm.categories = categoryList;
        	});
        });

		productRef.on('value', function(data) {
        	productList = [];

        	$timeout(function() {
        		data.forEach(function(childData) {
        			productList.push({
        				id: childData.key,
        				name: childData.val().name,
        				price: childData.val().price
        			});
                    productList       =   $filter('orderBy')(productList, 'name', false);
        		});

        		vm.products = productList;
        		console.log(vm.products);
        	});
        });
        
        vm.addToCart = function(product, detail){

        	var orderExist 		=	false;
        	vm.orderList.forEach(function(order){
        		if (order.product.id == product.id){
        			order.quantity += detail.quantity;
        			orderExist 		=	true;
        		}
        	});

        	if (!orderExist){
	        	vm.orderList.push({
		             product: product,
		             quantity: detail.quantity
		        });
		    }
	         
	        vm.totalPrice += (product.price * detail.quantity);
	        detail.quantity 		=	'';
        };


    }
})(); 