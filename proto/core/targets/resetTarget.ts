/**
 * Created by steb on 28/08/2016.
 */
import * as utils from '../utils';
import {ControlObject} from "../ControlObject";
import {ControlSystem} from "../ControlSystem";

export = resetTarget;
function resetTarget(cs:ControlSystem, co:ControlObject) {
    if (cs.state.keyPadPressed != 'reset')
        return false;

    var st = getDefault();
    utils.copyValues(st, cs.state);
    co.screen.setValue('0');
    return true;
}


function getDefault() {
    return {
        // ui
        displayValue: '0',

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