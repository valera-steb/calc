/**
 * Created by steb on 19/06/2016.
 */
(function () {
    angular.module('calc').controller('calcCtrl', ['$scope', 'factory', '$timeout', calcCtrl]);

    function calcCtrl($scope, factory, $timeout) {
        $scope.numPad = [];
        $scope.value = '0';
        $scope.radix = '10';


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
                            $scope.value = uiModel.formatValue(v);
                        });
                    };

                    keyPad.setRadix = function (v) {
                        $scope.radix = v;
                    };

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
            }
        };

        m.buildNumPad($scope.numPad);
        factory.promise.then(m.initCore);
    }
})();