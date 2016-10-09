(function(){
    'use strict';
    
    angular
        .module('app')
        .controller('brandMtnCtrl', brandMtnCtrl);
    
    function brandMtnCtrl($scope, $timeout, $filter, $rootScope, $location){
        var vm = this;
        $rootScope.showSection = $location.path() == "/login";
          console.log($rootScope.showSection);
        var createBrandBtn = document.getElementById('create-brand-btn');
        var brandRef = firebase.database().ref('brands');
        var brandList = [];
        var brandId;
        
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
            brandId =  vm.brands[index].id;
            
            brandRef.child(brandId).once('value')
                .then(function(data) {
                    $timeout(function() {
                        vm.brandNameEdit = data.val().name; 
                    });
                }).catch(function(error) {
                    swal('Error', error.message, 'error');
                });

            $('#edit').openModal();
        };
        
        vm.delete = function(index){
            var id =  vm.brands[index].id;
            
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
                brandRef.child(id).remove()
                    .then(function(data) {
                        swal("Deleted!", id + " has been deleted.", "success");
                    }).catch(function(error) {
                        swal('Error', error.message, 'error');
                    });
            });
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

        vm.brandFormOnUpdate = function() {
            var editBrandBtn = document.getElementById('edit-brand-btn');

            editBrandBtn.disabled = true;

            brandRef.child(brandId).update({
                name: vm.brandNameEdit
            }).then(function(data) {
                editBrandBtn = false;
                $('#edit').closeModal();

                swal('Success', 'Brand successfully updated', 'success');
            }).catch(function(error) {
                swal('Error', error.message, 'error');
            });
        }
    }
})(); 