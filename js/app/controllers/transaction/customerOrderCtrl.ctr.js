(function(){
    'use strict';
    
    angular
        .module('app')
        .controller('customerOrderCtrl', productOrderCrtl);
    
    function productOrderCrtl($timeout, $filter){
        
        var vm = this;
        var customerId  =   "GeI5sYucC2fKxvAJbsq6bYp15Xo2";
        var ordersRef = firebase.database().ref('orders');
        var productRef = firebase.database().ref('products');
        var userOrderList = [];
        var productList     =   [];

        productRef.once('value')
            .then(function(data){

                data.forEach(function(childData){

                    productList.push({
                        id: childData.key,
                        name: childData.val().name,
                        price: childData.val().price
                    });

                });

            });

        ordersRef.once('value')
        	.then(function(data) {
        		data.forEach(function(childData) {
        			if(childData.val().userId == customerId) {
        				userOrderList.push(childData.val());
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
                                order.totalPrice += (orderDetail.quantity * product.price);

                            }//end if

                        });

                    });

                });
                vm.userOrders           =   $filter('orderBy')(vm.userOrders, 'orderDate', false);
                console.log(vm.userOrders);               

        	}).catch(function(error) {
        		swal('Error', error.message, 'error');
        	})
    }
})(); 