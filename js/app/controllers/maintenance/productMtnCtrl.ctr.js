(function(){
    'use strict';
    
    angular
        .module('app')
        .controller('productMtnCtrl', productMtnCtrl);
    
    function productMtnCtrl($timeout, $filter, $rootScope, $location){

        var vm = this;
        $rootScope.showSection = $location.path() == "/login";
          console.log($rootScope.showSection);
        var productRef = firebase.database().ref('products');
        var brandRef = firebase.database().ref('brands');
        var categoryRef = firebase.database().ref('categories');
        var productList = [];
        var brandList = [];
        var categoryList = [];
        var productId;
        var productObj = {};
        var brands;

        brandRef.once('value')
            .then(function(data) {
                $timeout(function() {

                    data.forEach(function(childData) {
                        brandList.push({
                            id: childData.key,
                            name: childData.val().name
                        });
                    });

                    vm.brands = brandList;
                });
            }).catch(function(error) {
                swal('Error', error.message, 'error');
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

        productRef.on('value', function(data) {
            $timeout(function(){
                var product = {};
            	
                data.forEach(function(childData) {
                    product = {
                        id: childData.key,
                        name: childData.val().name,
                        price: childData.val().price,
                        brand: childData.val().brand,
                        categories: childData.val().categories,
                        imageUrl: childData.val().imageUrl != null ? childData.val().imageUrl
                                : 'http://alphagled.com/wp-content/themes/456ecology/assets//img/no-product-image.png'
                    };
                    
                    // To remove undefined value when concatinating values
                    product.categoryName = '';  

                    vm.brands.forEach(function(brand) {
                        if(brand.id == product.brand) {
                            product.brandName = brand.name;
                        }
                    });

                    vm.categories.forEach(function(category) {
                        product.categories.forEach(function(productCategory) {
                            if(category.id == productCategory) {
                                product.categoryName += category.name + ', ';
                            }
                        });
                    });

                    // Remove trailing ", " at the end
                    product.categoryName = product.categoryName.slice(0, -2);

            		productList.push(product);
            	});
                
            	vm.products = $filter('orderBy')(productList, 'name', false);
            });
        });

        vm.details = {};
        
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
            var createProductBtn = document.getElementById('create-product-btn');

        	productList = [];
            createProductBtn.disabled = true;

        	vm.details.selectedCategory.forEach(function(element, index, array) {
        		productList.push(element.id);
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

                createProductBtn.disabled = false;

        		$('#addProduct').closeModal();

        		swal('Success', 'Product Successfully Added', 'success');
        	}).catch(function(error) {
        		swal('Error', error.message, 'error');
        	});
        };
    }
})(); 