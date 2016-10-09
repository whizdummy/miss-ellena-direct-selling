(function(){
    'use strict';
    
    angular
        .module('app')
        .controller('customerOrderCtrl', productOrderCrtl);
    
    function productOrderCrtl($timeout, $filter, $rootScope, $location, $state) {
        $rootScope.showSection = $location.path() == "/login";
        var vm = this;
        var customerId  =   "GeI5sYucC2fKxvAJbsq6bYp15Xo2";
        var ordersRef = firebase.database().ref('orders');
        var productRef = firebase.database().ref('products');
        var userOrderList = [];
        var productList     =   [];

        var auth = firebase.auth();
        var userRef = firebase.database().ref('users');

        auth.onAuthStateChanged(function(user) {
            if(user) {
                $('#log-out').show();

                userRef.child(user.uid).once('value', function(data) {
                    $('#register').closeModal();

                    if(!data.val().isAdmin) {
                        $('.user').show();
                        $('.admin').hide();

                        $('#user-name').html(data.val().name);
                        $('#user-email').html(user.email);
                    } else {
                        $state.go('dashboard');
                    }
                });
            } else {
                $state.go('login');
            }
        });

        productRef.once('value')
            .then(function(data){

                data.forEach(function(childData){

                    productList.push({
                        id: childData.key,
                        name: childData.val().name,
                        price: childData.val().price,
                        imageUrl: childData.val().imageUrl != null ? childData.val().imageUrl
                            : 'http://alphagled.com/wp-content/themes/456ecology/assets//img/no-product-image.png'
                    });

                });

            });

        ordersRef.on('value', function(data) {
                $timeout(function(){
            		data.forEach(function(childData) {
            			if(childData.val().userId == customerId) {
                            var order = childData.val();
                            order.id = childData.key;
            				userOrderList.push(order);
            			}
            		});

            		vm.userOrders         =   userOrderList;
                    vm.userOrders.forEach(function(order){

                        order.orderDate        =   moment(order.order_date).format('MMM D, YYYY');
                        order.totalPrice        =   0;
                        order.orders = Object.keys(order.orders).map(function(k) { return order.orders[k] });
                        order.orders.forEach(function(orderDetail){

                            productList.forEach(function(product){

                                if (orderDetail.productId == product.id){

                                    orderDetail.productName = product.name;
                                    orderDetail.productPrice = product.price;
                                    orderDetail.productImage = product.imageUrl;
                                    order.totalPrice += (orderDetail.quantity * product.price);

                                }//end if

                            });
                            order.vat = order.totalPrice * .12;

                        });

                    });
                    vm.userOrders           =   $filter('orderBy')(vm.userOrders, 'orderDate', false);
                });             

        	});

        vm.viewOrders           =   function(order){

            $('#viewOrders').openModal();
            vm.orders       =   $filter('orderBy')(order.orders, 'productName', false);
            vm.totalPrice   =   order.totalPrice;

        }

        vm.cancelOrder          =   function(order, index){

            swal({
                title: "Are you sure?",
                text: "You will not be able to undo this action!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, cancel order!",
                closeOnConfirm: false
            },
            function(){
                ordersRef.child(order.id).remove()
                    .then(function(data) {
                        swal("Success!", "Order has been cancelled.", "success");
                    }).catch(function(error) {
                        swal('Error', error.message, 'error');
                    });
            });

        }
    }
})(); 