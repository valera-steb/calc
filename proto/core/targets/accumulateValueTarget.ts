/**
 * Created by steb on 24/08/2016.
 */
import {ControlObject} from "../ControlObject";
import {CurrentState, ControlSystem} from "../ControlSystem";

export = accumulateValueTarget;
function accumulateValueTarget(cs:ControlSystem, co:ControlObject) {

    var
        key = getStateKey(cs.state);

    switch (key) {
        case 'accumulateIncomingOperand':
            //co.screen.setValue({value: 0});
            
            return co.cs.setStates({
                'accumulator': cs.state.incomingOperand,
                'incomingOperand': null,
                'calcStateTransit': null
            });
    }
}

function getStateKey(st:CurrentState) {
    if (st.calcStateTransit == 'wait-wait2' && st.incomingOperand)
        return 'accumulateIncomingOperand';
}