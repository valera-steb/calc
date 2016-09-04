/**
 * Created by steb on 04/09/2016.
 */
import {ControlObject} from "../ControlObject";
import {ControlSystem, CurrentState} from "../ControlSystem";
import {TimeStamper} from 'infrastructure/csStructure';

export = displayValueTarget;
function displayValueTarget(cs:ControlSystem, co:ControlObject):boolean {

    var
        key = getKey(cs.state, co.timer);

    switch (key) {
        case 'displayError':
            co.cs.setState('displayValue', 'error');
            break;

        case 'display0':
            co.cs.setState('displayValue', '0');
            break;

        case 'displayResult':
            co.cs.setState('displayValue', co.uiModel.formatValue(cs.state.operationResult));
            break;

        case 'displayOperand':
            co.cs.setState('displayValue', co.uiModel.formatValue(cs.state.incomingOperand));
            break;

        default:
            return false;
    }

    co.screen.setValue(cs.state.displayValue);
    return true;
}


function getKey(state:CurrentState, timer:TimeStamper) {
    var
        key = 0,
        isCalcStateNewer = timer.isNewer('calcState', 'displayValue'),
        isIncomingOperandNewer = timer.isNewer('incomingOperand', 'displayValue'),
        isOperationResultNewer = timer.isNewer('operationResult', 'displayValue');

    if (state.calcState == 'error')
        return isCalcStateNewer ? 'displayError' : 'none';
    
    if(isCalcStateNewer &&
    ['wait-wait2', 'wait2-wait2'].indexOf(state.calcStateTransit)>-1)
        return 'display0';

    if(isOperationResultNewer && state.operationResult!=null)
        return 'displayResult';

    if(isIncomingOperandNewer && state.incomingOperand !=null)
        return 'displayOperand';
}
