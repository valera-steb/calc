/**
 * Created by steb on 25/08/2016.
 */

import {ControlObject} from "../ControlObject";
import {ControlSystem, CurrentState} from "../ControlSystem";

export = calcStateTarget;
function calcStateTarget(cs:ControlSystem, co:ControlObject.CO) {

    var
        key = getStateKey(cs.state);

    switch (key) {
        case 'operationEntered':
            co.calcGraph.onOperation(cs);
            return co.cs.setStates({
                'keyPadPressed': null,
                'operation': cs.state.keyPadPressed
            });
        case 'hasEqual':
            co.calcGraph.onEqual(cs);
            return co.cs.setState('keyPadPressed', null);
    }
}

function getStateKey(currentState:CurrentState) {
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
