/**
 * Created by steb on 20/06/2016.
 */
define(['../utils'], function (utils) {
    
    return function (cs, co) {
        if (cs.currentState.keyPadPressed != 'reset')
            return false;
        
        var st = getDefault();
        utils.copyValues(st, cs.currentState);
        return true;
    };
    
    
    function getDefault() {
        return {
            // ui
            numPadPressed: null,
            keyPadPressed: null,
            incomingRadix: null,

            // ui model
            formattedValue: null,
            //currentRadix: 10, - оставляем как есть
            incomingOperand: null,

            // graph
            calcState: 'wait',

            // core
            operationResult: null,
            operationError: null,

            // 
            accumulator: null,
            operation: null
        }
    }

});
