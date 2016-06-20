/**
 * Created by steb on 20/06/2016.
 */
define([], function () {
    var utils;

    return utils = {

        copyValues: function (from, to) {
            for (var i in from) {
                to[i] = from[i];
            }
        }
    };
});