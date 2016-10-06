(function(){
    'use strict';
    
    angular
        .module('app')
        .controller('brandMtnCtrl', brandMtnCtrl);
    
    function brandMtnCtrl($scope, $timeout){
        var vm = this;

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
        	brandRef.push({
        		name: vm.brandName
        	}).then(function(data) {
        		alert('Yehey!');

        		$('#add').closeModal();
        	}).catch(function(error) {
        		alert(error.message);
        	});
        };
    }
})(); 