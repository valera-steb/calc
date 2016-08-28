/**
 * Created by steb on 28/08/2016.
 */
import {ControlObject} from "../ControlObject";
import {CurrentState, ControlSystem} from "../ControlSystem";

export = calculateTarget;
function calculateTarget(cs:ControlSystem, co:ControlObject.CO) {
    var key = getKey(cs.state);

    function setError() {
        console.log('error');
    }

    switch (key) {
        case 'calculate+show':
            co.core[map[cs.state.operation]](
                cs.state.accumulator,
                cs.state.incomingOperand,
                {
                    value: z => {
                        co.cs.setStates({
                            'calcStateTransit': null,
                            'incomingOperand': null,
                            'accumulator': null,
                            'operationResult': z
                        });
                        co.screen.setValue(z);
                    },
                    error: setError
                }
            );
            return true;

        case 'calculate+accumulate':
            co.core[map[cs.state.operation]](
                cs.state.accumulator,
                cs.state.incomingOperand,
                {
                    value: z=> {
                        co.screen.setValue({value: 0});
                        co.cs.setStates({
                            'calcStateTransit': null,
                            'incomingOperand': null,
                            'accumulator': z,
                            'operationResult': null
                        });
                    },
                    error: setError
                }
            );
            return true;
    }
}

var map = {
    '+': 'add',
    '-': 'dec'
};

function getKey(st:CurrentState) {
    if (st.calcStateTransit == 'wait2-wait')
        return 'calculate+show';

    if (st.calcStateTransit == 'wait2-wait2')
        return 'calculate+accumulate';
}