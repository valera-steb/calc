/**
 * Created by steb on 19/06/2016.
 */
var calcApp = angular.module('calc', []);

;

/**
 * Created by steb on 19/06/2016.
 */
(function () {
    angular.module('calc').controller('calcCtrl', ['$scope', 'factory', '$timeout', calcCtrl]);

    function calcCtrl($scope, factory, $timeout) {
        $scope.numPad = [];
        $scope.value = '0';
        $scope.radix;


        var m = {
            buildNumPad: function (arr) {
                var obj = {};

                for (var i = 0; i < 16; i++) {
                    obj[i] = i;
                    arr.push(i);
                }

                arr.splice(0, 1);
                arr.push(obj['0']);
            },

            initCore: function (cs) {
                with (cs.co) {
                    screen.setValue = function (v) {
                        $timeout(function () {
                            $scope.value = v.value;
                        });
                    };

                    keyPad.setRadix = function (v) {
                        $scope.radix = v;
                    }
                }

                $scope.onKeyPad = function (operation) {
                    cs.setState('keyPadPressed', operation);
                };

                $scope.$watch('radix', function (newV, oldV) {
                    if (newV == oldV)
                        return;

                    $timeout(function () {
                        cs.setState('incomingRadix', newV);
                    });
                });

            }
        };

        m.buildNumPad($scope.numPad);
        factory.promise.then(m.initCore);
    }
})();;

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

    angular.module('calc').directive('numPadButton', ['factory', numPadButton]);

    function numPadButton(factory) {
        return {
            template: '<button ng-click="click()">{{::name}}</button>',

            link: function (scope, iElement, iAttrs, controller) {
                scope.value = Number(iAttrs.value);
                scope.name = namesMap.getName(scope.value);

                scope.click = function(){
                    factory.promise.then(function(cs){
                        cs.setState('numPadPressed', scope.name);
                    });
                }
            }
        }
    }

})();;

/**
 * Created by steb on 19/06/2016.
 */
(function () {
    angular.module('calc').service('factory', ['$q', factory]);

    function factory($q) {
        var
            def = $q.defer(),
            factory;


        require(['core/ControlSystem', 'core/utils'], function (ControlSystem, utils) {
            var cs = new ControlSystem();
            cs.init(function () {
                factory.utils = utils;
                def.resolve(cs);
            });
        });

        return factory = {
            promise: def.promise,
            utils: null
        };
    }
})();