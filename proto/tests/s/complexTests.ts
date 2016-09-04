/**
 * Created by steb on 04/09/2016.
 */
/// <reference path="../jasmine.d.ts" />

import {ControlSystem} from 'core/ControlSystem';
import * as utils from 'core/utils';

describe('ControlSystem:complex scenarios', function () {
    var
        cs = new ControlSystem(),
        freshState = {},
        csCo = cs.co.cs;

    beforeAll(function (done) {
        cs.init(done);
        utils.copyValues(cs.state, freshState);
    });

    beforeEach(function () {
        utils.copyValues(freshState, cs.state);
        csCo.setStates(freshState);
    });
    
    it('1+2+3=6', function () {
        
    })
});