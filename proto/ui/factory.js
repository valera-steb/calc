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