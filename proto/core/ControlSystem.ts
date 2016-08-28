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
    currentRadix:Number = 10;
    incomingOperand:ICalcValue = null;
    operation = null;

    // graph
    calcState:string = 'wait';
    calcStateTransit:string = null;

    // core
    operationResult:ICalcValue = null;
    operationError = null;

    //
    accumulator:ICalcValue = null;
}

export class ControlSystem {

    private m = new M(this);

    targets:any = [
        'reset',
        'incomingArgument',
        'calcState',
        'calculate',
        'accumulateValue',
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


export interface ICalcValue {
    value:string,
    radix:Number,
    negative:boolean
}
