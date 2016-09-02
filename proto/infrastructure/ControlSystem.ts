/**
 * Created by steb on 01/09/2016.
 */

export namespace csStructure {
    export class ControlSystem<
        TState,
        TControlSystem extends ControlSystem<TState, TControlSystem, TControlObject>,
        TControlObject extends ControlObject<TState, TControlSystem, TControlObject>
        > {
        constructor(tState:{new():TState},
                    tControlObject:{new(TControlSystem):TControlObject}) {
            this.state = new tState();
            this.co = new tControlObject(this);
        }

        targets;
        state:TState;
        co:TControlObject;
    }


    export class ControlObject<
        TState,
        TControlSystem extends ControlSystem<TState, TControlSystem, TControlObject>,
        TControlObject extends ControlObject<TState, TControlSystem, TControlObject>
        > {

        constructor(cs:TControlSystem) {
            this.cs = new ControlSystemObject<TState, TControlSystem, TControlObject>(cs);
        }

        cs:ControlSystemObject<TState, TControlSystem, TControlObject>;
    }

    export class ControlSystemObject<
        TState,
        TControlSystem extends ControlSystem<TState, TControlSystem, TControlObject>,
        TControlObject extends ControlObject<TState, TControlSystem, TControlObject>
        > {

        constructor(private cs:TControlSystem) {
        }

        private m = {
            isSetting: false,
            hasSubScan: false,
            targetsChanged: false
        };
        private events = new CoCsCallbacks({});

        init(events:CoCsCallbacks) {
            if (events)
                this.events = events;
        }

        setState(name:string, value:any) {
            this.events.beforeSetState(name, value);

            this.cs.state[name] = value;
            this.lunchScan();
            return true;
        }

        setStates(nameValues) {
            for (var name in nameValues) {
                var value = nameValues[name];
                this.events.beforeSetState(name, value);
                this.cs.state[name] = value;
            }
            this.lunchScan();
            return true;
        }

        setVector(newVector) {
            this.events.beforeSetVector(newVector);

            this.cs.targets = newVector;
            this.m.targetsChanged = true;
        }

        lunchScan() {
            var m = this.m;
            if (m.isSetting)
                return m.hasSubScan = true;

            m.isSetting = true;
            do {
                this.events.beforeScan();
                m.hasSubScan = false;

                for (var i in this.cs.targets) {
                    var target = this.cs.targets[i];
                    if (target(this.cs, this.cs.co)) {
                        this.events.onActiveTarget(target);
                        break;
                    }
                }
                this.events.afterScan();
            } while (m.hasSubScan && !m.targetsChanged);

            m.isSetting = false;

            if (m.targetsChanged) {
                m.hasSubScan = false;
                m.targetsChanged = false;
                this.lunchScan();
            }
        }
    }


    export class CoCsCallbacks {
        constructor(params) {
            if(!params)
                return;
            
            var events = ['beforeSetState', 'beforeScan', 'afterScan', 'beforeSetVector', 'onActiveTarget'];
            for (var i in events) {
                var outerHandler = params[events[i]];
                
                if(outerHandler)
                    this[events[i]] = outerHandler;
            }
        }

        beforeSetState(name:string, value:any) {
        }

        beforeScan() {
        }

        afterScan() {
        }

        beforeSetVector(newVector) {
        }

        onActiveTarget(target) {
        }
    }
}