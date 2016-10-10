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
        vm.transaction = {};

		var productRef = firebase.database().ref('products');
		var categoryRef = firebase.database().ref('categories');
		var brandRef = firebase.database().ref('brands');
        var productOrderRef = firebase.database().ref('orders');

        $('#side-nav-btn').show();

        var auth = firebase.auth();
        var userRef = firebase.database().ref('users');

        auth.onAuthStateChanged(function(user) {
            if(user) {
                if(!user.isAnonymous) {
                    $('#log-out').show();

                    userRef.child(user.uid).once('value', function(data) {
                        $('#register').closeModal();

                        if(data.val() && !data.val().isAdmin) {
                            $('.user').show();
                            $('.admin').hide();

                            $('#user-name').html(data.val().name);
                            $('#user-email').html(user.email);

                            $timeout(function() {
                                vm.transaction.strCustomerName = data.val().name;
                                vm.transaction.strAddress = data.val().address;
                                vm.transaction.strContactNo = data.val().contactNumber;
                                vm.transaction.strEmail = user.email;

                                $('#billOutName').prop('disabled', true);
                                $('#billOutEmail').prop('disabled', true);
                                $('#billOutEmail').prop('disabled', true);
                                $('#billOutContactNo').prop('disabled', true);
                            })
                        } else {
                            $state.go('dashboard');
                        }
                    });
                } else {
                    if(vm.orderList) {
                        saveOrder(user);
                    }
                }
            } else {
                $('#side-nav-btn').hide();
                $('#log-out').hide();
            }
        });

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

        vm.submitOrder 		=	function() {
            var currentUser = firebase.auth().currentUser;

            if(currentUser) {
                saveOrder(currentUser);
            } else {
                auth.signInAnonymously().catch(function(error) {
                    swal('Error', error.message, 'error');
                });
            }
        }

        function saveOrder(user) {
            var productOrderObj = {
                userId: user.uid,
                orders: productOrderList,
                deliveryAddress: vm.transaction.strAddress,
                orderDate: Date.now()
            };

            vm.orderList.forEach(function(element, index, array) {
                var id = element.product.id;

                productOrderList['order' + (index + 1)] = {
                    productId: element.product.id,
                    quantity: element.quantity
                };
            });

            if(user.isAnonymous) {
                productOrderObj.name = vm.transaction.strCustomerName;
                productOrderObj.contactNumber = vm.transaction.strContactNo;
                productOrderObj.email = vm.transaction.strEmail;
                productOrderObj.isAnonymous = true;
            } else {
                productOrderObj.isAnonymous = false;
            }

            productOrderRef.push(productOrderObj)
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