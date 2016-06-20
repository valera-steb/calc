/**
 * Created by steb on 20/06/2016.
 */
define(['core/ControlSystem'], function(ControlSystem){
    return function(setCs){
        var cs;
        
        beforeAll(function (done) {
            cs = new ControlSystem();
            cs.init(done);
            setCs(cs);
        });

        beforeEach(function () {
            cs.setState('keyPadPressed', 'reset');
        });

    }
});