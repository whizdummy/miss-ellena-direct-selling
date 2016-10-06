(function(){
    'use strict';
    
    angular
        .module('app')
        .controller('brandMtnCtrl', brandMtnCtrl);
    
    function brandMtnCtrl($scope, $timeout, $filter){
        var vm = this;

        var createBrandBtn = document.getElementById('create-brand-btn');
        var brandRef = firebase.database().ref('brands');
        var brandList = [];
        
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
  
        
        vm.update = function(index){
            var id =  vm.person[index].id;
            alert(id);
        };
        
        vm.delete = function(index){
          var id =  vm.person[index].id;
            alert(id);
            vm.details.productName = id;
            
        };
        
        vm.view = function(index){
            var id =  vm.person[index].id;
            alert(id);
        };

        vm.brandFormOnSubmit = function() {
            createBrandBtn.disabled = true;

        	brandRef.push({
        		name: vm.brandName
        	}).then(function(data) {
        		swal('Success', 'Brand Successfully Added', 'success');

                vm.brandName = '';
                createBrandBtn.disabled = false;
        		$('#add').closeModal();
        	}).catch(function(error) {
        		alert(error.message);
        	});
        };
    }
})(); 