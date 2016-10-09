(function(){
    'use strict';
    
    angular
        .module('app')
        .controller('productMtnCtrl', productMtnCtrl);
    
    function productMtnCtrl($timeout, $filter, $rootScope, $location, $state) {

        var vm = this;
        $rootScope.showSection = $location.path() == "/login";
        var productRef = firebase.database().ref('products');
        var brandRef = firebase.database().ref('brands');
        var categoryRef = firebase.database().ref('categories');
        var productList = [];
        var brandList = [];
        var categoryList = [];
        var productId;
        var productObj = {};
        var brands;

        var auth = firebase.auth();
        var userRef = firebase.database().ref('users');

        auth.onAuthStateChanged(function(user) {
            if(user) {
                $('#log-out').show();
                $('.user').hide();

                userRef.child(user.uid).once('value', function(data) {
                    $('#register').closeModal();

                    if(!data.val().isAdmin) {
                        $state.go('productOrder');
                    } else {
                        $('#user-name').html(data.val().name);
                        $('#user-email').html(user.email);
                    }
                });
            } else {
                $('#log-out').hide();

                $state.go('login');
            }
        });

        brandRef.once('value')
            .then(function(data) {
                // $timeout(function() {

                    data.forEach(function(childData) {
                        brandList.push({
                            id: childData.key,
                            name: childData.val().name
                        });
                    });

                    vm.brands = brandList;
                // });
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

                vm.categories = categoryList;
            }).catch(function(error) {
                swal('Error', error.message, 'error');
            });

        productRef.on('value', function(data) {
            $timeout(function() {
                var product = {};

                productList = [];
            	
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
            productId =  vm.products[index].id;
            
            productRef.child(productId).once('value')
                .then(function(data) {
                    var productDetails = data.val();

                    vm.details.selectedCategoryEdit = [];

                    $timeout(function() {
                        vm.details.productNameEdit = productDetails.name;
                        vm.details.productPriceEdit = Number(productDetails.price);
                        vm.details.selectedBrandEdit = {
                            id: productDetails.brand
                        };
                        
                        productDetails.categories.forEach(function(element, index, array) {
                            vm.details.selectedCategoryEdit.push({
                                id: element
                            });
                        });
                    });
                });

            $('#editProduct').openModal();
        };

        vm.delete = function(index){
            productId =  vm.products[index].id;
            
            swal({
                title: "Are you sure?",
                text: null,
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: false
            },
            function(){
                productRef.child(productId).remove()
                    .then(function(data) {
                        swal("Deleted!", productId + " has been deleted.", "success");
                    }).catch(function(error) {
                        swal('Error', error.message, 'error');
                    });
            });
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

        vm.productOnUpdate = function() {
            var editProductBtn = document.getElementById('edit-product-btn');

            productList = [];
            editProductBtn.disabled = true;

            vm.details.selectedCategoryEdit.forEach(function(element, index, array) {
                productList.push(element.id);
            });

            productRef.child(productId).update({
                name: vm.details.productNameEdit,
                brand: vm.details.selectedBrandEdit.id,
                categories: productList,
                price: vm.details.productPriceEdit
            }).then(function(data) {
                $timeout(function() {
                    vm.details = {};
                });

                editProductBtn.disabled = false;

                $('#editProduct').closeModal();

                swal('Success', 'Product Successfully Updated', 'success');
            }).catch(function(error) {
                swal('Error', error.message, 'error');
            });;
        };
    }
})(); 