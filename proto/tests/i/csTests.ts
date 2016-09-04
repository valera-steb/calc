/**
 * Created by steb on 02/09/2016.
 */
/// <reference path="../jasmine.d.ts" />

import * as cst from '../../infrastructure/ControlSystem';

class State {
}
class CS extends cst.ControlSystem<State, CS, CO> {
    constructor() {
        super(State, CO);
    }
}
class CO extends cst.ControlObject<State, CS, CO> {
}

describe('csStructure:cs', function () {
    it('must exist', function () {
        var cs = new CS;

        expect(cs).toBeDefined();
        expect(cs.co).toBeDefined();
        expect(cs.co.cs).toBeDefined();
    });

    it('must scan', function () {
        var
            cs = new CS,
            has = false;

        cs.targets = [x=>has = true];
        expect(has).toBeFalsy();

        cs.co.cs.lunchScan();
        expect(has).toBeTruthy();
    });

    describe('callbacks', function () {
        var cs, setted;

        function build(callbacks) {
            setted = null;

            cs = new CS();
            var cals = new cst.CoCsCallbacks(callbacks);

            cs.co.cs.init(cals);
        }

        it('beforeSetState', function () {
            build({
                'beforeSetState': (n, v)=>setted = n + v
            });

            expect(setted).toBeFalsy();

            cs.co.cs.setState('x', 'y');
            expect(setted).toBe('xy');

            setted = null;
            cs.co.cs.setStates({'z': 1});
            expect(setted).toBe('z1');
        });

        it('beforeScan', function () {
            build({
                'beforeScan': (n, v)=>setted = true
            });

            expect(setted).toBeFalsy();

            cs.co.cs.setState('x', 'y');
            expect(setted).toBeTruthy('onSetState');

            setted = null;
            cs.co.cs.setStates({'z': 1});
            expect(setted).toBeTruthy('onSetStates');

            setted = null;
            cs.co.cs.lunchScan();
            expect(setted).toBeTruthy('onLunchScan');
        });

        xit('afterScan', function () {

        });

        xit('beforeSetVector', function () {

        });

        it('onActiveTarget', function () {
            build({
                'onActiveTarget': (t)=>setted = t
            });

            expect(setted).toBeFalsy();
            cs.co.cs.lunchScan();
            expect(setted).toBeFalsy();

            cs.targets = [()=>true];
            cs.co.cs.lunchScan();
            expect(setted).toBe(cs.targets[0]);
        });
    });
});