/**
 * Created by steb on 19/06/2016.
 */
define('core/ControlObject',[],function () {
    return function ControlObject() {
        var co = {
            // ui view
            screen: {
                setValue: function (v) {
                    console.log('co.screen.setValue', v);
                }
            },
            numPad: {
                setActivityMap: function () {

                }
            },
            keyPad: {
                setRadix: function(radix){
                    console.log('co.keyPad.setRadix', radix);
                }
            },
            //
            uiModel: {
                formatValue: function () {

                }
            },
            calcGraph: {
                graph: {
                    'error': {'reset': 'wait'},
                    'wait': {
                        'onKeyPad': 'wait2',
                        'reset': 'wait'
                    },
                    'wait2': {
                        'onKeyPad': ['wait2', 'wait', 'error'],
                        'reset': 'wait'
                    }
                },

                onKeyPad: function () {

                },
                onNumPad: function () {

                },
                reset: function () {

                }
            },
            //
            core: (function () {
                var
                    maxValue = 4294967295, // FFFF-FFFF
                    core,
                    map = {
                        'A': 10,
                        'B': 11,
                        'C': 12,
                        'D': 13,
                        'E': 14,
                        'F': 15,

                        10: 'A',
                        11: 'B',
                        12: 'C',
                        13: 'D',
                        14: 'E',
                        15: 'F',

                        toDec: function (x) {
                            var k = this[x];
                            return k || Number(x);
                        },
                        toX: function (a) {
                            var k = this[a];
                            return k || String(a);
                        }
                    };

                function execute(a, b, setUp) {
                    var
                        normA = core.convert(a, 10),
                        normB = core.convert(b, 10);

                    normA = Number(normA.value) * (normA.negative ? -1 : 1);
                    normB = Number(normB.value) * (normB.negative ? -1 : 1);

                    var z = normA + normB;
                    if (!core.isOutOfRange(z))
                        return setUp.value(
                            core.convert({
                                value: String(z),
                                radix: 10,
                                negative: z < 0
                            }, a.radix)
                        );

                    setUp.error();
                    setUp.value(null);
                }

                return core = {

                    convert: function (x, toRadix, setUp) {
                        var decValue = 0;
                        for (var len = x.value.length, i = len - 1; i > -1; i--) {
                            decValue += Math.pow(x.radix, len - i - 1) * map.toDec(x.value[i]);
                        }

                        var ret = [];
                        while (decValue) {
                            var num = decValue % toRadix;
                            ret.push(map.toX(num));
                            decValue = Math.floor(decValue / toRadix);
                        }
                        ret.reverse();
                        ret = {
                            value: ret.length ? ret.join('') : '0',
                            radix: toRadix,
                            negative: x.negative
                        };

                        if (setUp && setUp.value)
                            setUp.value(ret);
                        return ret;
                    },

                    add: execute,

                    dec: function (a, b, setUp) {
                        execute(a, {
                            value: b.value,
                            negative: !b.negative
                        }, setUp)
                    },

                    isOutOfRange: function (x) {
                        return Math.abs(x) > maxValue;
                    }
                }
            })()

        };

        return co;
    }
});
/**
 * Created by steb on 19/06/2016.
 */
define('core/ControlSystem',['./ControlObject'], function (ControlObject) {

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
/**
 * Created by steb on 20/06/2016.
 */
define('core/utils',[], function () {
    var utils;

    return utils = {

        copyValues: function (from, to) {
            for (var i in from) {
                to[i] = from[i];
            }
        }
    };
});
/**
 * Created by steb on 20/06/2016.
 */
define('core/targets/resetTarget',['../utils'], function (utils) {
    
    return function (cs, co) {
        if (cs.currentState.keyPadPressed != 'reset')
            return false;
        
        var st = getDefault();
        utils.copyValues(st, cs.currentState);
        co.screen.setValue({value:'0'});
        return true;
    };
    
    
    function getDefault() {
        return {
            // ui
            numPadPressed: null,
            keyPadPressed: null,
            incomingRadix: null,

            // ui model
            formattedValue: null,
            //currentRadix: 10, - оставляем как есть
            incomingOperand: null,

            // graph
            calcState: 'wait',

            // core
            operationResult: null,
            operationError: null,

            // 
            accumulator: null,
            operation: null
        }
    }

});

/**
 * Created by steb on 20/06/2016.
 */
define('core/targets/incomingTarget',[], function () {

    return function (cs, co) {

        var key = getStateKey(cs.currentState, co);

        switch (key) {
            case 'noData':
                return false;

            case 'lockedInput':
                cs.setState('numPadPressed', null);
                return true;

            case 'increment':
                var
                    cSt = cs.currentState,
                    newNum = {
                        value: (cSt.incomingOperand ? cSt.incomingOperand.value : '') + cSt.numPadPressed,
                        radix: cSt.currentRadix,
                        negative: false
                    };

                var dec = co.core.convert(newNum, 10);
                if(!co.core.isOutOfRange(Number(dec.value))){
                    cs.setState('incomingOperand', newNum);
                    co.screen.setValue(newNum);
                }
                
                cs.setState('numPadPressed', null);

                return true;

            default:
                return false;
        }
    };


    function getStateKey(currentState, cs) {
        if (currentState.numPadPressed == null)
            return 'noData';

        if (['error', null].indexOf(currentState.calcState) > -1)
            return 'lockedInput';

        if (['wait'].indexOf(currentState.calcState) > -1)
            return 'increment';

        return 'none';
    }

});
/**
 * Created by steb on 20/06/2016.
 */
define('core/targets/calcStateTarget',[], function () {

    return function (cs, co) {

        var
            key = getStateKey(cs.currentState, co),
            cSt = cs.currentState;

        switch (key) {
        }
    };

    function getStateKey(currentState, cs) {
        var
            hasAccumulator = currentState.accumulator != null,
            hasOperation = currentState.operation == null,
            hasNextOperation = ['add', 'dec'].indexOf(currentState.keyPadPressed) > -1,
            hasEqualOperation = currentState.keyPadPressed == 'equal',
            hasIncomingOperand = currentState.incomingOperand != null;

        if (currentState.calcState == 'error')
            return 'error';

        if (
            !hasAccumulator && !hasOperation &&
            hasNextOperation &&
            hasIncomingOperand
        ) return 'toWait2';

        if (
            !hasIncomingOperand &&
                hasOperation &&
                hasAccumulator
        )
            return '';
    }
});
/**
 * Created by steb on 20/06/2016.
 */
define('core/targets/incomingCommandTarget',[], function () {

    return function (cs, co) {

        var
            key = getStateKey(cs.currentState, co),
            cSt = cs.currentState;

        switch (key) {
        }
    };

    function getStateKey(currentState, cs) {
        
    }
});

/**
 * Created by steb on 20/06/2016.
 */
define('core/targets/changeRadixTarget',[], function () {

    return function (cs, co) {

        var
            key = getStateKey(cs.currentState, co),
            cSt = cs.currentState;

        switch (key) {
            case 'noData':
                return false;

            case 'reentered':
                cs.setState('incomingRadix', null);
                return true;

            case 'lockedInput':
                cs.setState('incomingRadix', null);
                co.keyPad.setRadix(cSt.currentRadix);
                return true;

            case 'convert':
                cs.setState('currentRadix', cSt.incomingRadix);
                cs.setState('incomingRadix', null);
                co.keyPad.setRadix(cSt.currentRadix);

                if(!cSt.incomingOperand)
                    return true;
                
                var converted = co.core.convert(cSt.incomingOperand, cSt.currentRadix);
                cs.setState('incomingOperand', converted);
                co.screen.setValue(converted);

                return true;

            default:
                return false;
        }
    };


    function getStateKey(currentState, cs) {
        if (currentState.incomingRadix == null)
            return 'noData';

        if (currentState.incomingRadix == currentState.currentRadix)
            return 'reentered';

        if (['error', null].indexOf(currentState.calcState) > -1)
            return 'lockedInput';

        if (currentState.calcState == 'wait')
            return 'convert';

        if (currentState.calcState == 'wait2')
            return 'calculate';

        return 'none';
    }
});
