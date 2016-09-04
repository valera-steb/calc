/**
 * Created by steb on 24/08/2016.
 */
import * as co from './ControlObject';
import * as csStructure from 'infrastructure/csStructure';
import * as utils from './utils';

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

export class ControlSystem extends csStructure.ControlSystem<
    CurrentState, ControlSystem, co.ControlObject>{

    constructor(){
        super(CurrentState, co.ControlObject);
    }

    targets:any = [
        'reset',
        'incomingArgument',
        'calcState',
        'calculate',
        'accumulateValue',
        'changeRadix'
    ];

    state = new CurrentState();


    init(callback) {
        this.co.loadTargets(this.targets, (targets) => {
            this.targets = targets;
            callback();
        });

        var
            timerCallbacks = this.co.timer.callbacks,
            onActiveTarget = timerCallbacks.onActiveTarget;

        timerCallbacks.onActiveTarget = (target)=>{
            console.log(target.name, utils.clear(this.state));
            onActiveTarget(target);
        };
        this.co.cs.init(timerCallbacks);
    }
}


export interface ICalcValue {
    value:string,
    radix:Number,
    negative:boolean
}
