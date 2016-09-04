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
});