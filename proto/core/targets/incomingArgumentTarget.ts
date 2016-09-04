/**
 * Created by steb on 28/08/2016.
 */
import {ControlObject} from "../ControlObject";
import {ControlSystem, CurrentState} from "../ControlSystem";


export  = incomingArgumentTarget;
function incomingArgumentTarget(cs:ControlSystem, co:ControlObject) {

    var key = getStateKey(cs.state);

    switch (key) {
        case 'noData':
            return false;

        case 'lockedInput':
            return co.cs.setState('numPadPressed', null);

        case 'increment':
            var
                cSt = cs.state,
                newNum = {
                    value: (cSt.incomingOperand ? cSt.incomingOperand.value : '') + cSt.numPadPressed,
                    radix: cSt.currentRadix,
                    negative: false
                };

            var dec = co.core.convert(newNum, 10);
            if (!co.core.isOutOfRange(Number(dec.value))) {
                co.cs.setStates({
                    'incomingOperand': newNum,
                    'calcStateTransit': null
                });
                co.screen.setValue(newNum);
            }

            return co.cs.setState('numPadPressed', null);

        default:
            return false;
    }
}


function getStateKey(currentState: CurrentState) {
    if (currentState.numPadPressed == null)
        return 'noData';

    if (['error', null].indexOf(currentState.calcState) > -1)
        return 'lockedInput';

    if (['wait', 'wait2'].indexOf(currentState.calcState) > -1)
        return 'increment';

    return 'none';
}
