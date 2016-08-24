/**
 * Created by steb on 23/08/2016.
 */
define([], function () {

    return function (cs, co) {

        var
            key = getStateKey(cs.currentState, co),
            cSt = cs.currentState;

        switch (key) {
            case 'storeOperation':
                cs.setState('operation', cSt.keyPadPressed);
                cs.setState('keyPadPressed', null);
                return true;
        }
    };

    function getStateKey(currentState, cs) {
        var calcStateMove = currentState.oldCalcState+'-'+currentState.calcState;

        if(calcStateMove == 'wait-wait2' && currentState.keyPadPressed)
            return 'storeOperation';
    }
});