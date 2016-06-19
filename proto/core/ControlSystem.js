/**
 * Created by steb on 19/06/2016.
 */
define([], function () {
   
    return function ControlSystem() {
        var
            m = {
                isSetting: false,
                hasSubScan: false,

                makeScan: function () {
                    if(m.isSetting)
                        return m.hasSubScan = true;
                    
                    
                },
                
                loadTargets: function (targetsNames, callback) {
                    var targets = [];

                    (function loadTarget(id) {
                        if (id == targetsNames.length) {
                            callback(targets);
                            return;
                        }

                        require(['./targets' + targetsNames[id]], function (target) {
                            targets.push(target);
                            loadTarget(id + 1);
                        });
                    })(0);
                }
            },

            cs = {
                targets: [
                    'testTarget'
                ],
                
                currentState: {
                    // ui
                    numPadPressed: null,
                    keyPadPressed: null,
                    radix: 10,
                    
                    // ui model
                    formattedValue: null
                },
                setState: function (name, value) {
                    cs.currentState['name'] = value;
                    m.makeScan();
                },
                
                init: function(callback){
                    m.loadTargets(cs.targets, function (targets) {
                        cs.targets = targets;
                        callback();
                    });
                }
            };

        return cs;
    }
});