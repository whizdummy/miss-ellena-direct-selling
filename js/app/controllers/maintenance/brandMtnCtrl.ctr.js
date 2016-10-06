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
            var id =  vm.brands[index].id;
            
            swal({
                title: "Are you sure?",
                text: "You will not be able to recover this imaginary file!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: false
            },
            function(){
                brandRef.child(id).remove()
                    .then(function(data) {
                        swal("Deleted!", id + " has been deleted.", "success");
                    }).catch(function(error) {
                        swal('Error', error.message, 'error');
                    });
            });
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
                createBrandBtn.disabled = false;
                $('#add').closeModal();

        		swal('Success', 'Brand Successfully Added', 'success');
        	}).catch(function(error) {
        		alert(error.message);
        	});
        };
    }
})(); 