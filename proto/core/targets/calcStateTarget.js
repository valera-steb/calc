/**
 * Created by steb on 20/06/2016.
 */
define([], function () {

    return function (cs, co) {

        var
            key = getStateKey(cs.currentState, co),
            cSt = cs.currentState;

        switch (key) {
        }
    };

    function getStateKey(currentState, cs) {
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