/**
 * Created by steb on 19/06/2016.
 */
define(['./ControlObject'], function (ControlObject) {

    return function ControlSystem() {
        var
            m = {
                isSetting: false,
                hasSubScan: false,

                makeScan: function () {
                    if (m.isSetting)
                        return m.hasSubScan = true;

                    m.isSetting = true;
                    do {
                        m.hasSubScan = false;

                        for (var i in cs.targets) {
                            var target = cs.targets[i];
                            if (!target(cs, cs.co))
                                continue;

                            console.log(i, target.name);
                            break;
                        }
                    } while (m.hasSubScan);

                    m.isSetting = false;
                },

                loadTargets: function (targetsNames, callback) {
                    var targets = [];

                    (function loadTarget(id) {
                        if (id == targetsNames.length) {
                            callback(targets);
                            return;
                        }

                        require(['core/targets/' + targetsNames[id] + 'Target'], function (target) {
                            target.name = targetsNames[id];
                            targets.push(target);
                            loadTarget(id + 1);
                        });
                    })(0);
                }
            },

            cs = {
                targets: [
                    'reset',
                    'incoming',
                    'calcState',
                    'incomingCommand',
                    'changeRadix'
                ],

                currentState: {
                    // ui
                    numPadPressed: null,
                    keyPadPressed: null,
                    incomingRadix: null,

                    // ui model
                    formattedValue: null,
                    currentRadix: 10,
                    incomingOperand: null,
                    operation: null,

                    // graph
                    calcState: 'wait',
                    oldCalcState: null,

                    // core
                    operationResult: null,
                    operationError: null,

                    // 
                    accumulator: null,
                },
                setState: function (name, value) {
                    cs.currentState[name] = value;
                    m.makeScan();
                },

                co: new ControlObject(),

                init: function (callback) {
                    m.loadTargets(cs.targets, function (targets) {
                        cs.targets = targets;
                        callback();
                    });
                }
            };

        return cs;
    }
});