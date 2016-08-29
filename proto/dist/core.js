define('core/utils',["require", "exports"], function (require, exports) {
    "use strict";
    function copyValues(from, to) {
        for (var i in from) {
            to[i] = from[i];
        }
    }
    exports.copyValues = copyValues;
    function clear(obj) {
        var clean = {};
        for (var i in obj) {
            var val = obj[i];
            if (val)
                clean[i] = val;
        }
        return clean;
    }
    exports.clear = clear;
});
//# sourceMappingURL=utils.js.map;
define('core/ControlObject',["require", "exports", './utils'], function (require, exports, utils) {
    "use strict";
    var ControlObject;
    (function (ControlObject) {
        var CO = (function () {
            function CO(_cs) {
                this._cs = _cs;
                this.cs = new ControlSystem(this._cs);
                this.screen = new ((function () {
                    function class_1() {
                    }
                    class_1.prototype.setValue = function (v) {
                        console.log('co.screen.setValue', v);
                    };
                    return class_1;
                }()));
                this.numPad = {
                    setActivityMap: function () {
                    }
                };
                this.keyPad = {
                    setRadix: function (radix) {
                        console.log('co.keyPad.setRadix', radix);
                    }
                };
                this.uiModel = {
                    formatValue: function (value) {
                        var st = '';
                        if (value.negative)
                            st += '-';
                        return st += value.value;
                    }
                };
                this.calcGraph = new ControlObject.CalcGraph();
                this.core = (function () {
                    var maxValue = 4294967295, core, map = {
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
                        var normA = core.convert(a, 10), normB = core.convert(b, 10);
                        normA = Number(normA.value) * (normA.negative ? -1 : 1);
                        normB = Number(normB.value) * (normB.negative ? -1 : 1);
                        var z = normA + normB;
                        if (!core.isOutOfRange(z))
                            return setUp.value(core.convert({
                                value: String(Math.abs(z)),
                                radix: 10,
                                negative: z < 0
                            }, a.radix));
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
                            }, setUp);
                        },
                        isOutOfRange: function (x) {
                            return Math.abs(x) > maxValue;
                        }
                    };
                })();
            }
            return CO;
        }());
        ControlObject.CO = CO;
        var ControlSystem = (function () {
            function ControlSystem(cs) {
                this.cs = cs;
                this.m = {
                    isSetting: false,
                    hasSubScan: false,
                    targetsChanged: false,
                };
            }
            ControlSystem.prototype.setState = function (name, value) {
                this.cs.state[name] = value;
                this.lunchScan();
                return true;
            };
            ControlSystem.prototype.setStates = function (nameValues) {
                for (var name in nameValues) {
                    this.cs.state[name] = nameValues[name];
                }
                this.lunchScan();
                return true;
            };
            ControlSystem.prototype.setVector = function (newVector) {
                this.cs.targets = newVector;
                this.m.targetsChanged = true;
            };
            ControlSystem.prototype.lunchScan = function () {
                var m = this.m;
                if (m.isSetting)
                    return m.hasSubScan = true;
                m.isSetting = true;
                do {
                    m.hasSubScan = false;
                    for (var i in this.cs.targets) {
                        var target = this.cs.targets[i];
                        if (target(this.cs, this.cs.co)) {
                            console.log(target.name, utils.clear(this.cs.state));
                            break;
                        }
                    }
                } while (m.hasSubScan && !m.targetsChanged);
                m.isSetting = false;
                if (m.targetsChanged) {
                    m.hasSubScan = false;
                    m.targetsChanged = false;
                    this.lunchScan();
                }
            };
            return ControlSystem;
        }());
        ControlObject.ControlSystem = ControlSystem;
        var CalcGraph = (function () {
            function CalcGraph() {
                this.graph = {
                    'error': { 'reset': 'wait' },
                    'wait': {
                        'onOperation': 'wait2',
                        'onNumPad': '',
                        'onEqual': '',
                        'reset': 'wait'
                    },
                    'wait2': {
                        'onOperation': 'wait2',
                        'onNumPad': '',
                        'onEqual': 'wait',
                        'reset': 'wait'
                    }
                };
                var actions = ['onOperation', 'onNumPad', 'onEqual', 'reset'];
                var _loop_1 = function() {
                    var action = actions[i];
                    this_1[action] = function (cs) {
                        var calcState = cs.state.calcState, v = this.graph[calcState], newState = v[action] || 'error';
                        if (newState != '')
                            cs.co.cs.setStates({
                                'calcStateTransit': calcState + '-' + newState,
                                'calcState': newState
                            });
                    };
                };
                var this_1 = this;
                for (var i in actions) {
                    _loop_1();
                }
            }
            CalcGraph.prototype.onOperation = function (cs) {
            };
            CalcGraph.prototype.onNumPad = function (cs) {
            };
            CalcGraph.prototype.onEqual = function (cs) {
            };
            CalcGraph.prototype.reset = function (cs) {
            };
            return CalcGraph;
        }());
        ControlObject.CalcGraph = CalcGraph;
    })(ControlObject = exports.ControlObject || (exports.ControlObject = {}));
});
//# sourceMappingURL=ControlObject.js.map;
define('core/ControlSystem',["require", "exports", './ControlObject'], function (require, exports, ControlObject_1) {
    "use strict";
    var M = (function () {
        function M(cs) {
            this.cs = cs;
        }
        M.prototype.loadTargets = function (targetsNames, callback) {
            var targets = [];
            (function loadTarget(id) {
                if (id == targetsNames.length) {
                    callback(targets);
                    return;
                }
                window.require(['core/targets/' + targetsNames[id] + 'Target'], function (target) {
                    target.targetName = targetsNames[id];
                    targets.push(target);
                    loadTarget(id + 1);
                });
            })(0);
        };
        return M;
    }());
    var CurrentState = (function () {
        function CurrentState() {
            this.numPadPressed = null;
            this.keyPadPressed = null;
            this.incomingRadix = null;
            this.currentRadix = 10;
            this.incomingOperand = null;
            this.operation = null;
            this.calcState = 'wait';
            this.calcStateTransit = null;
            this.operationResult = null;
            this.operationError = null;
            this.accumulator = null;
        }
        return CurrentState;
    }());
    exports.CurrentState = CurrentState;
    var ControlSystem = (function () {
        function ControlSystem() {
            this.m = new M(this);
            this.targets = [
                'reset',
                'incomingArgument',
                'calcState',
                'calculate',
                'accumulateValue',
                'changeRadix'
            ];
            this.state = new CurrentState();
            this.co = new ControlObject_1.ControlObject.CO(this);
        }
        ControlSystem.prototype.init = function (callback) {
            var _this = this;
            this.m.loadTargets(this.targets, function (targets) {
                _this.targets = targets;
                callback();
            });
        };
        return ControlSystem;
    }());
    exports.ControlSystem = ControlSystem;
});
//# sourceMappingURL=ControlSystem.js.map;
define('core/targets/accumulateValueTarget',["require", "exports"], function (require, exports) {
    "use strict";
    function accumulateValueTarget(cs, co) {
        var key = getStateKey(cs.state);
        switch (key) {
            case 'accumulateIncomingOperand':
                co.screen.setValue({ value: 0 });
                return co.cs.setStates({
                    'accumulator': cs.state.incomingOperand,
                    'incomingOperand': null,
                    'calcStateTransit': null
                });
        }
    }
    function getStateKey(st) {
        if (st.calcStateTransit == 'wait-wait2' && st.incomingOperand)
            return 'accumulateIncomingOperand';
    }
    return accumulateValueTarget;
});
//# sourceMappingURL=accumulateValueTarget.js.map;
define('core/targets/calcStateTarget',["require", "exports"], function (require, exports) {
    "use strict";
    function calcStateTarget(cs, co) {
        var key = getStateKey(cs.state);
        switch (key) {
            case 'operationEntered':
                co.calcGraph.onOperation(cs);
                return co.cs.setStates({
                    'keyPadPressed': null,
                    'operation': cs.state.keyPadPressed
                });
            case 'hasEqual':
                co.calcGraph.onEqual(cs);
                return co.cs.setState('keyPadPressed', null);
            case 'numPadPressed':
                co.calcGraph.onNumPad(cs);
                return true;
        }
    }
    function getStateKey(currentState) {
        if (!currentState.keyPadPressed || currentState.calcStateTransit)
            return '';
        if (currentState.numPadPressed)
            return 'numPadPressed';
        switch (currentState.keyPadPressed) {
            case '-':
            case '+':
                return 'operationEntered';
            case 'equal':
                return 'hasEqual';
            case 'reset':
                return 'reset';
            default:
                return 'error';
        }
    }
    return calcStateTarget;
});
//# sourceMappingURL=calcStateTarget.js.map;
define('core/targets/calculateTarget',["require", "exports"], function (require, exports) {
    "use strict";
    function calculateTarget(cs, co) {
        var key = getKey(cs.state);
        function setError() {
            console.log('error');
        }
        switch (key) {
            case 'calculate+show':
                co.core[map[cs.state.operation]](cs.state.accumulator, cs.state.incomingOperand, {
                    value: function (z) {
                        co.cs.setStates({
                            'calcStateTransit': null,
                            'incomingOperand': null,
                            'accumulator': null,
                            'operationResult': z
                        });
                        co.screen.setValue(z);
                    },
                    error: setError
                });
                return true;
            case 'calculate+accumulate':
                co.core[map[cs.state.operation]](cs.state.accumulator, cs.state.incomingOperand, {
                    value: function (z) {
                        co.screen.setValue({ value: 0 });
                        co.cs.setStates({
                            'calcStateTransit': null,
                            'incomingOperand': null,
                            'accumulator': z,
                            'operationResult': null
                        });
                    },
                    error: setError
                });
                return true;
        }
    }
    var map = {
        '+': 'add',
        '-': 'dec'
    };
    function getKey(st) {
        if (st.calcStateTransit == 'wait2-wait')
            return 'calculate+show';
        if (st.calcStateTransit == 'wait2-wait2')
            return 'calculate+accumulate';
    }
    return calculateTarget;
});
//# sourceMappingURL=calculateTarget.js.map;
define('core/targets/changeRadixTarget',["require", "exports"], function (require, exports) {
    "use strict";
    function changeRadixTarget(cs, co) {
        var key = getStateKey(cs.state), cSt = cs.state;
        switch (key) {
            case 'noData':
                return false;
            case 'reentered':
                return co.cs.setState('incomingRadix', null);
            case 'lockedInput':
                co.cs.setState('incomingRadix', null);
                co.keyPad.setRadix(cSt.currentRadix.toString());
                return true;
            case 'convert':
                co.cs.setState('currentRadix', Number(cSt.incomingRadix));
                co.cs.setState('incomingRadix', null);
                co.keyPad.setRadix(cSt.currentRadix.toString());
                if (!cSt.incomingOperand)
                    return true;
                var converted = co.core.convert(cSt.incomingOperand, cSt.currentRadix);
                co.cs.setState('incomingOperand', converted);
                co.screen.setValue(converted);
                return true;
            default:
                return false;
        }
    }
    function getStateKey(currentState) {
        if (currentState.incomingRadix == null)
            return 'noData';
        if (currentState.incomingRadix == currentState.currentRadix.toString())
            return 'reentered';
        if (['error', null].indexOf(currentState.calcState) > -1)
            return 'lockedInput';
        if (currentState.calcState == 'wait')
            return 'convert';
        if (currentState.calcState == 'wait2')
            return 'calculate';
        return 'none';
    }
    return changeRadixTarget;
});
//# sourceMappingURL=changeRadixTarget.js.map;
define('core/targets/incomingArgumentTarget',["require", "exports"], function (require, exports) {
    "use strict";
    function incomingArgumentTarget(cs, co) {
        var key = getStateKey(cs.state);
        switch (key) {
            case 'noData':
                return false;
            case 'lockedInput':
                return co.cs.setState('numPadPressed', null);
            case 'increment':
                var cSt = cs.state, newNum = {
                    value: (cSt.incomingOperand ? cSt.incomingOperand.value : '') + cSt.numPadPressed,
                    radix: cSt.currentRadix,
                    negative: false
                };
                var dec = co.core.convert(newNum, 10);
                if (!co.core.isOutOfRange(Number(dec.value))) {
                    co.cs.setStates({
                        'incomingOperand': newNum,
                        'calcStateTransit': null
                    });
                    co.screen.setValue(newNum);
                }
                return co.cs.setState('numPadPressed', null);
            default:
                return false;
        }
    }
    function getStateKey(currentState) {
        if (currentState.numPadPressed == null)
            return 'noData';
        if (['error', null].indexOf(currentState.calcState) > -1)
            return 'lockedInput';
        if (['wait', 'wait2'].indexOf(currentState.calcState) > -1)
            return 'increment';
        return 'none';
    }
    return incomingArgumentTarget;
});
//# sourceMappingURL=incomingArgumentTarget.js.map;
define('core/targets/resetTarget',["require", "exports", '../utils'], function (require, exports, utils) {
    "use strict";
    function resetTarget(cs, co) {
        if (cs.state.keyPadPressed != 'reset')
            return false;
        var st = getDefault();
        utils.copyValues(st, cs.state);
        co.screen.setValue({ value: '0' });
        return true;
    }
    function getDefault() {
        return {
            numPadPressed: null,
            keyPadPressed: null,
            incomingRadix: null,
            formattedValue: null,
            incomingOperand: null,
            calcState: 'wait',
            operationResult: null,
            operationError: null,
            accumulator: null,
            operation: null
        };
    }
    return resetTarget;
});
//# sourceMappingURL=resetTarget.js.map;
