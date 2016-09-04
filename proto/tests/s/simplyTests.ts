/**
 * Created by steb on 04/09/2016.
 */
/// <reference path="../jasmine.d.ts" />

import {ControlSystem} from 'core/ControlSystem';
import * as utils from 'core/utils';

describe('ControlSystem:simply scenarios', function () {
    var 
        cs = new ControlSystem(),
        freshState = {},
        csCo = cs.co.cs;
    
    beforeAll(function(done){
        cs.init(done);
        utils.copyValues(cs.state, freshState);
    });
    
    beforeEach(function () {
        utils.copyValues(freshState, cs.state);
        csCo.setStates(freshState);
    });
    
    it('2+2=4', function () {
        csCo.setState('numPadPressed', 2);
        expect(cs.state.displayValue).toBe('2');
        
        csCo.setState('keyPadPressed', '+');
        expect(cs.state.displayValue).toBe('0');
        
        csCo.setState('numPadPressed', 2);
        expect(cs.state.displayValue).toBe('2');
        
        csCo.setState('keyPadPressed', 'equal');
        expect(cs.state.displayValue).toBe('4');
    });

    it('12-301=-289', function () {
        csCo.setState('numPadPressed', 1);
        csCo.setState('numPadPressed', 2);
        expect(cs.state.displayValue).toBe('12');

        csCo.setState('keyPadPressed', '-');
        expect(cs.state.displayValue).toBe('0');

        csCo.setState('numPadPressed', 3);
        csCo.setState('numPadPressed', 0);
        csCo.setState('numPadPressed', 1);
        expect(cs.state.displayValue).toBe('301');

        csCo.setState('keyPadPressed', 'equal');
        expect(cs.state.displayValue).toBe('-289');
    });

    it('5 radix(2) 101', function () {
        csCo.setState('numPadPressed', 5);
        csCo.setState('incomingRadix', 2);

        expect(cs.state.incomingOperand.radix).toBe(2);
        expect(cs.state.incomingOperand.value).toBe('101');

        expect(cs.state.displayValue).toBe('101');
    });

    it('= => 0', function () {
        csCo.setState('keyPadPressed', 'equal');

        expect(cs.state.displayValue).toBe('0');
        expect(cs.state.calcState).toBe('wait');
    });

    it('ffff ffff + 1 = error', function () {
        csCo.setState('incomingRadix', 16);
        for(var i=0;i<8;i++)
            csCo.setState('numPadPressed', 'F');

        expect(cs.state.displayValue).toBe('FFFF FFFF');

        csCo.setState('keyPadPressed', '+');
        csCo.setState('numPadPressed', 1);
        csCo.setState('keyPadPressed', 'equal');

        expect(cs.state.displayValue).toBe('error');
    })
});