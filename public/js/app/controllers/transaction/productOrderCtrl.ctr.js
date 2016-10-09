(function(){
    'use strict';
    
    angular
        .module('app')
        .controller('productOrderCrtl', productOrderCrtl);
    
    function productOrderCrtl($timeout, $filter, $rootScope, $location, $state){
        var vm = this;
        $rootScope.showSection = $location.path() == "/login";
        var productList 		=	[];
        var brandList 			=	[];
        var categoryList 		=	[];
        var productOrderList    =   [];
        var wahaha
        vm.orderList = [];
        vm.quantity = 0;
        vm.totalPrice = 0;

		var productRef = firebase.database().ref('products');
		var categoryRef = firebase.database().ref('categories');
		var brandRef = firebase.database().ref('brands');
        var productOrderRef = firebase.database().ref('orders');

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
        				price: childData.val().price,
                        imageUrl: childData.val().imageUrl != null ? childData.val().imageUrl
                            : 'http://alphagled.com/wp-content/themes/456ecology/assets//img/no-product-image.png'
        			});
                    productList       =   $filter('orderBy')(productList, 'name', false);
        		});

        		vm.products = productList;
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

        vm.submitOrder 		=	function(){

        	console.log(vm.transaction);
            console.log(vm.orderList);

        	// alert('Submitted...');

            vm.orderList.forEach(function(element, index, array) {
                var id = element.product.id;

                productOrderList['order' + (index + 1)] = {
                    productId: element.product.id,
                    quantity: element.quantity
                };
            });

            productOrderRef.push({
                userId: 'GeI5sYucC2fKxvAJbsq6bYp15Xo2',
                orders: productOrderList,
                orderDate: Date.now()
            })
            .then(function(data) {
                $timeout(function() {
                    vm.orderList = [];
                });
                $('#viewCart').closeModal();

                swal('Success', 'Product successfully ordered', 'success');
            }).catch(function(error) {
                swal('Error', error.message, 'error');
            });
        }


    }
})(); 