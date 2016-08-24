/**
 * Created by steb on 20/06/2016.
 */
define([], function () {

    return function (cs, co) {

        var
            key = getStateKey(cs.currentState, co),
            cSt = cs.currentState;

        switch (key) {
            case 'operationEntered':
                co.calcGraph.onOperation(cs);
                return true;
        }
    };

    function getStateKey(currentState, cs) {
        if(currentState.keyPadPressed){
            switch (currentState.keyPadPressed){
                case '-':
                case '+':
                    return 'operationEntered';
                case 'equal':
                    return 'hasEqual';
                case 'reset':
                    return 'reset';
                default:
                    return 'error';
            }
        }
        
        var
            hasAccumulator = currentState.accumulator != null,
            hasOperation = currentState.operation == null,
            hasNextOperation = ['add', 'dec'].indexOf(currentState.keyPadPressed) > -1,
            hasEqualOperation = currentState.keyPadPressed == 'equal',
            hasIncomingOperand = currentState.incomingOperand != null;

        if (currentState.calcState == 'error')
            return 'error';

        if (
            !hasAccumulator && !hasOperation &&
            hasNextOperation &&
            hasIncomingOperand
        ) return 'toWait2';

        if (
            !hasIncomingOperand &&
                hasOperation &&
                hasAccumulator
        )
            return '';
    }
});