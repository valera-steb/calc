/**
 * Created by steb on 19/06/2016.
 */
(function(){
    angular.module('calc').controller('calcCtrl', ['$scope', calcCtrl]);

    function calcCtrl($scope){
        $scope.numPad = [];


        var m = {
            buildNumPad: function (arr) {
                var obj = {};

                for(var i=0; i<16; i++){
                    obj[i] = i;
                    arr.push(i);
                }

                arr.splice(0, 1);
                arr.push(obj['0']);
            }
        };

        m.buildNumPad($scope.numPad);
    }
})();