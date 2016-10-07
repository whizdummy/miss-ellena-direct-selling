(function(){
    'use strict';
    
    angular
        .module('app')
        .controller('customerOrderCtrl', productOrderCrtl);
    
    function productOrderCrtl($timeout, $filter){
        
        var customerId  =   "GeI5sYucC2fKxvAJbsq6bYp15Xo2";
        var ordersRef = firebase.database().ref('orders');
        var userOrderList = [];

        ordersRef.once('value')
        	.then(function(data) {
        		data.forEach(function(childData) {
        			if(childData.val().userId == customerId) {
        				userOrderList.push(childData.val());
        			}
        		});

        		console.log(userOrderList);
        	}).catch(function(error) {
        		swal('Error', error.message, 'error');
        	})
    }
})(); 