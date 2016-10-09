(function(){
    'use strict';
    
    angular
        .module('app')
        .controller('categoryMtnCtrl', categoryMtnCtrl);
    
    function categoryMtnCtrl($scope, $timeout, $filter, $rootScope, $location, $state) {
        var vm = this;
        $rootScope.showSection = $location.path() == "/login";
        var createCategoryBtn = document.getElementById('create-category-btn');
        var categoryRef = firebase.database().ref('categories');
        var categoryList = [];
        var categoryId;
        var categoryObj = {};
        
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
                    }
                });
            } else {
                $('#log-out').hide();

                $state.go('login');
            }
        });
        
        categoryRef.on('value', function(data) {
        	categoryList = [];

        	$timeout(function() {
        		data.forEach(function(childData) {
        			categoryList.push({
        				id: childData.key,
        				name: childData.val().name
        			});
                    categoryList        =   $filter('orderBy')(categoryList, 'name', false);
        		});

        		vm.categories = categoryList;
        	});
        });

     	vm.update = function(index){
            categoryId =  vm.categories[index].id; 

            categoryRef.child(categoryId).once('value')
                .then(function(data) {
                    $timeout(function() {
                        vm.categoryNameEdit = data.val().name;
                    });

                    $('#editCategory').openModal();
                }).catch(function(error) {
                    swal('Error', error.message, 'error');
                });
        };
        
        vm.delete = function(index){
            categoryId =  vm.categories[index].id;
            
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
                categoryRef.child(categoryId).remove()
                    .then(function(data) {
                        swal("Deleted!", categoryId + " has been deleted.", "success");
                    }).catch(function(error) {
                        swal('Error', error.message, 'error');
                    });
            });
        };
        
        vm.view = function(index){
            var id =  vm.categories[index].id;
            alert(id);
        };

        vm.categoryFormOnSubmit = function() {
        	createCategoryBtn.disabled = true;

        	categoryRef.push({
        		name: vm.categoryName
        	}).then(function(data) {
                createCategoryBtn.disabled = false;
                
                $timeout(function() {
                    vm.categoryName = '';
                });

                $('#addCategory').closeModal();
                
        		swal('Success', 'Category Successfully Added', 'success');
        	}).catch(function(error) {
        		alert(error.message);
        	});
        };

        vm.categoryFormEditOnUpdate = function() {
            var editCategoryBtn = document.getElementById('edit-category-btn');

            editCategoryBtn.disabled = true;

            categoryRef.child(categoryId).update({
                name: vm.categoryNameEdit
            })
            .then(function() {
                editCategoryBtn.disabled = false;

                $('#editCategory').closeModal();
                
                swal('Success', categoryId + ' has been updated.', 'success');
            }).catch(function(error) {
                swal('Error', error.message, 'error');
            });
        }
    }
})(); 