(function(){
    'use strict';
    
    angular
        .module('app')
        .controller('categoryMtnCtrl', categoryMtnCtrl);
    
    function categoryMtnCtrl($scope, $timeout, $filter){
        var vm = this;

        var createCategoryBtn = document.getElementById('create-category-btn');
        var categoryRef = firebase.database().ref('categories');
        var categoryList = [];
        
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
            var id =  vm.categories[index].id;            
        };
        
        vm.delete = function(index){
          var id =  vm.categories[index].id;
            alert(id);
            vm.details.productName = id;
            
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
        		swal('Success', 'Category Successfully Added', 'success');

        		createCategoryBtn.disabled = false;
        		vm.categoryName = '';
        		$('#addCategory').closeModal();
        	}).catch(function(error) {
        		alert(error.message);
        	});
        };
    }
})(); 