/**
 * Created by steb on 24/08/2016.
 */
import {ControlObject} from './ControlObject';

class M {
    constructor(private cs:ControlSystem) {
    }

    loadTargets(targetsNames, callback) {
        var targets = [];

        (function loadTarget(id) {
            if (id == targetsNames.length) {
                callback(targets);
                return;
            }

            (window as any).require(['core/targets/' + targetsNames[id] + 'Target'], function (target:any) {
                target.targetName = targetsNames[id];
                targets.push(target);
                loadTarget(id + 1);
            });
        })(0);
    }
}

export class CurrentState {
    // ui
    numPadPressed:string = null;
    keyPadPressed:string = null;
    incomingRadix:string = null;

    // ui model
    formattedValue = null;
    currentRadix:Number = 10;
    incomingOperand = null;
    operation = null;

    // graph
    calcState:string = 'wait';
    calcStateTransit:string = null;
    oldCalcState:string = null;

    // core
    operationResult = null;
    operationError = null;

    //
    accumulator = null;
}

export class ControlSystem {

    private m = new M(this);

    targets:any = [
        'reset',
        'incomingArgument',
        //'storeOperation',
        'calcState',
        'accumulateValue',
        //'incomingCommand',
        'changeRadix'
    ];

    //currentState = new CurrentState();
    state = new CurrentState();


    co = new ControlObject.CO(this);

    init(callback) {
        this.m.loadTargets(this.targets, (targets) => {
            this.targets = targets;
            callback();
        });
    }
}