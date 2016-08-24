/**
 * Created by steb on 23/08/2016.
 */
define([], function () {

    return function (cs, co) {

        var
            key = getStateKey(cs.currentState, co),
            cSt = cs.currentState;

        switch (key) {
            case 'accumulateIncomingOperand':
                cs.setState('accumulator', cSt.incomingOperand);
                cs.setState('incomingOperand', null);
                co.screen.setValue({value:0});
                return true;
        }
    };

    function getStateKey(currentState, cs) {
        var calcStateMove = currentState.oldCalcState+'-'+currentState.calcState;

        if(calcStateMove == 'wait-wait2' && currentState.incomingOperand)
            return 'accumulateIncomingOperand';
    }
});