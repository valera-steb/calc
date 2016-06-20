/**
 * Created by steb on 20/06/2016.
 */
define([], function () {

    return function (cs, co) {

        var key = getStateKey(cs.currentState, co);

        switch (key) {
            case 'noData':
                return false;

            case 'lockedInput':
                cs.setState('numPadPressed', null);
                return true;

            case 'increment':
                var
                    cSt = cs.currentState,
                    newNum = {
                        value: cSt.numPadPressed + (cSt.incomingOperand ? cSt.incomingOperand.value : ''),
                        radix: cSt.currentRadix,
                        negative: false
                    };

                var dec = co.core.convert(newNum, 10);
                if(!co.core.isOutOfRange(Number(dec.value))){
                    cs.setState('incomingOperand', newNum);
                    co.screen.setValue(newNum);
                }
                
                cs.setState('numPadPressed', null);

                return true;

            default:
                return false;
        }
    };


    function getStateKey(currentState, cs) {
        if (currentState.numPadPressed == null)
            return 'noData';

        if (['error', null].indexOf(currentState.calcState) > -1)
            return 'lockedInput';

        if (['wait'].indexOf(currentState.calcState) > -1)
            return 'increment';

        return 'none';
    }

});