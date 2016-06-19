/**
 * Created by steb on 19/06/2016.
 */
(function () {
    var namesMap = {
        10: 'A',
        11: 'B',
        12: 'C',
        13: 'D',
        14: 'E',
        15: 'F',
        getName: function(id){
            var name = this[id];
            return name || id;
        }
    };

    angular.module('calc').directive('numPadButton', function () {
        return {
            template: '<button>{{::name}}</button>',

            link: function (scope, iElement, iAttrs, controller) {
                scope.value = Number(iAttrs.value);
                scope.name = namesMap.getName(scope.value);
            }
        }
    });

})();