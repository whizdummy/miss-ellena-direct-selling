(function(){
    'use strict';
    
    angular
        .module('app')
        .controller('brandMtnCtrl', brandMtnCtrl);
    
    function brandMtnCtrl(){
        var vm = this;
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

    }
})(); 