/**
 * Created by steb on 20/06/2016.
 */
define([], function () {

    return function (cs, co) {

        var
            key = getStateKey(cs.currentState, co),
            cSt = cs.currentState;

        switch (key) {
            case 'noData':
                return false;

            case 'reentered':
                cs.setState('incomingRadix', null);
                return true;

            case 'lockedInput':
                cs.setState('incomingRadix', null);
                co.keyPad.setRadix(cSt.currentRadix);
                return true;

            case 'convert':
                cs.setState('currentRadix', cSt.incomingRadix);
                cs.setState('incomingRadix', null);
                co.keyPad.setRadix(cSt.currentRadix);

                if(!cSt.incomingOperand)
                    return true;
                
                var converted = co.core.convert(cSt.incomingOperand, cSt.currentRadix);
                cs.setState('incomingOperand', converted);
                co.screen.setValue(converted);

                return true;

            default:
                return false;
        }
    };


    function getStateKey(currentState, cs) {
        if (currentState.incomingRadix == null)
            return 'noData';

        if (currentState.incomingRadix == currentState.currentRadix)
            return 'reentered';

        if (['error', null].indexOf(currentState.calcState) > -1)
            return 'lockedInput';

        if (currentState.calcState == 'wait')
            return 'convert';

        if (currentState.calcState == 'wait2')
            return 'calculate';

        return 'none';
    }
});