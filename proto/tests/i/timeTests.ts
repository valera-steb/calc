/**
 * Created by steb on 03/09/2016.
 */
/// <reference path="../jasmine.d.ts" />

import * as cst from '../../infrastructure/csStructure';

class State {
}
class CS extends cst.ControlSystem<State, CS, CO> {
    constructor() {
        super(State, CO);
    }
}
class CO extends cst.ControlObject<State, CS, CO> {
    timeStamper = new cst.TimeStamper();
}

describe('csStructure:time', function () {
    var cs:CS;

    beforeEach(function () {
        cs = new CS();

        cs.co.cs.init(cs.co.timeStamper.callbacks);
    });

    describe('cs inegration', function () {
        var time: cst.TimeStamper;

        beforeEach(function(){
            cs.co.cs.setStates({
                'x0': 2, 'x1': 3
            });
            cs.co.cs.setState('x2', 20);
            cs.co.cs.setState('x3', 10);

            time = cs.co.timeStamper;
        });

        it('isOlder', function () {

            expect(time.isOlder('x0', 'x1')).toBeFalsy('0-1');
            expect(time.isOlder('x1', 'x0')).toBeFalsy('1-0');

            expect(time.isOlder('x2', 'x1')).toBeFalsy('2-1');
            expect(time.isOlder('x1', 'x2')).toBeTruthy('1-2');

            expect(time.isOlder('x2', 'x3')).toBeTruthy('2-3');
            expect(time.isOlder('x3', 'x2')).toBeFalsy('3-2');

            expect(time.isOlder('unnoun', 'x2')).toBeFalsy('unnoun-2');
            expect(time.isOlder('x2', 'unnoun')).toBeFalsy('2-unnoun');
        });
        
        it('isSame', function () {
            expect(time.isSame('x0', 'x1')).toBeTruthy();
            expect(time.isSame('x1', 'x0')).toBeTruthy();

            expect(time.isSame('x2', 'x1')).toBeFalsy('2-1');
            expect(time.isSame('x1', 'x2')).toBeFalsy('1-2');

            expect(time.isSame('unnoun', 'x2')).toBeFalsy('unnoun-2');
            expect(time.isSame('x2', 'unnoun')).toBeFalsy('2-unnoun');
        });
    })
});
