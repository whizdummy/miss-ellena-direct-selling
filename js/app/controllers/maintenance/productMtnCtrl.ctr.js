(function(){
    'use strict';
    
    angular
        .module('app')
        .controller('productMtnCtrl', productMtnCtrl);
    
    function productMtnCtrl($timeout, $filter, $q){
        var vm = this;

        var productRef = firebase.database().ref('products');
        var brandRef = firebase.database().ref('brands');
        var categoryRef = firebase.database().ref('categories');
        var productList = [];
        var brandList = [];
        var categoryList = [];
        var productId;
        var productObj = {};
        var brands;

        function getBrandName(callback) {
            brandRef.child('-KTQ-Urcw_MHZVw47gyz').once('value', function(data) {
                        callback(data.val().name);
                    });
        }

        productRef.on('value', function(data) {	
        	data.forEach(function(childData) {
        		productList.push({
        			id: childData.key,
        			name: childData.val().name,
        			price: childData.val().price,
                    imageUrl: childData.val().imageUrl != null ? childData.val().imageUrl
                            : 'http://alphagled.com/wp-content/themes/456ecology/assets//img/no-product-image.png'
                });
        	});

        	vm.products = $filter('orderBy')(productList, 'name', false);
        });

        categoryRef.once('value')
        	.then(function(data) {
        		data.forEach(function(childData) {
        			categoryList.push({
        				id: childData.key,
        				name: childData.val().name
        			});
        		});

        		$timeout(function() {
        			vm.categories = categoryList;
        		});
        	}).catch(function(error) {
        		swal('Error', error.message, 'error');
        	});

        brandRef.once('value')
        	.then(function(data) {
        		data.forEach(function(childData) {
        			brandList.push({
        				id: childData.key,
        				name: childData.val().name
        			});
        		});

        		$timeout(function() {
        			vm.brands = brandList;
        		});
        	}).catch(function(error) {
        		swal('Error', error.message, 'error');
        	});

        vm.details = {};
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
        
        vm.update = function(index){
            var id =  vm.persons[index].id;
            alert(id);
        };
        
        vm.delete = function(index){
          var id =  vm.persons[index].id;
            alert(id);
        };
        
        vm.view = function(index){
            var id =  vm.persons[index].id;
            alert(id);
        };

        vm.create = function() {
        	productList = [];

        	vm.details.selectedCategory.forEach(function(element, index, array) {
        		productList[element.id] = true;
        	});	

        	productRef.push({
        		name: vm.details.productName,
        		image: null,
        		brand: vm.details.selectedBrand.id,
        		categories: productList,
        		price: vm.details.productPrice
        	}).then(function(data) {
        		$timeout(function() {
        			vm.details = {};
        		});

        		$('#addProduct').closeModal();

        		swal('Success', 'Product Successfully Added', 'success');
        	}).catch(function(error) {
        		swal('Error', error.message, 'error');
        	});
        };
    }
})(); 