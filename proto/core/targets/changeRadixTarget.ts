/**
 * Created by steb on 28/08/2016.
 */

import {ControlObject} from "../ControlObject";
import {ControlSystem, CurrentState} from "../ControlSystem";

export = changeRadixTarget;
function changeRadixTarget(cs:ControlSystem, co:ControlObject.CO) {

    var
        key = getStateKey(cs.state),
        cSt = cs.state;

    switch (key) {
        case 'noData':
            return false;

        case 'reentered':
            return co.cs.setState('incomingRadix', null);

        case 'lockedInput':
            co.cs.setState('incomingRadix', null);
            co.keyPad.setRadix(cSt.currentRadix);
            return true;

        case 'convert':
            co.cs.setState('currentRadix', Number(cSt.incomingRadix));
            co.cs.setState('incomingRadix', null);
            co.keyPad.setRadix(cSt.currentRadix);

            if(!cSt.incomingOperand)
                return true;

            var converted = co.core.convert(cSt.incomingOperand, cSt.currentRadix);
            co.cs.setState('incomingOperand', converted);
            co.screen.setValue(converted);

            return true;

        default:
            return false;
    }
}


function getStateKey(currentState:CurrentState) {
    if (currentState.incomingRadix == null)
        return 'noData';

    if (currentState.incomingRadix == currentState.currentRadix.toString())
        return 'reentered';

    if (['error', null].indexOf(currentState.calcState) > -1)
        return 'lockedInput';

    if (currentState.calcState == 'wait')
        return 'convert';

    if (currentState.calcState == 'wait2')
        return 'calculate';

    return 'none';
}
