define('infrastructure/ControlSystem',["require", "exports"], function (require, exports) {
    "use strict";
    var ControlSystem = (function () {
        function ControlSystem(tState, tControlObject) {
            this.state = new tState();
            this.co = new tControlObject(this);
        }
        return ControlSystem;
    }());
    exports.ControlSystem = ControlSystem;
    var ControlObject = (function () {
        function ControlObject(cs) {
            this.cs = new ControlSystemObject(cs);
        }
        return ControlObject;
    }());
    exports.ControlObject = ControlObject;
    var ControlSystemObject = (function () {
        function ControlSystemObject(cs) {
            this.cs = cs;
            this.m = {
                isSetting: false,
                hasSubScan: false,
                targetsChanged: false
            };
            this.events = new CoCsCallbacks({});
        }
        ControlSystemObject.prototype.init = function (events) {
            if (events)
                this.events = events;
        };
        ControlSystemObject.prototype.setState = function (name, value) {
            this.events.beforeSetState(name, value);
            this.cs.state[name] = value;
            this.lunchScan();
            return true;
        };
        ControlSystemObject.prototype.setStates = function (nameValues) {
            for (var name in nameValues) {
                var value = nameValues[name];
                this.events.beforeSetState(name, value);
                this.cs.state[name] = value;
            }
            this.lunchScan();
            return true;
        };
        ControlSystemObject.prototype.setVector = function (newVector) {
            this.events.beforeSetVector(newVector);
            this.cs.targets = newVector;
            this.m.targetsChanged = true;
        };
        ControlSystemObject.prototype.lunchScan = function () {
            var m = this.m;
            if (m.isSetting)
                return m.hasSubScan = true;
            m.isSetting = true;
            do {
                this.events.beforeScan();
                m.hasSubScan = false;
                for (var i in this.cs.targets) {
                    var target = this.cs.targets[i];
                    if (target(this.cs, this.cs.co)) {
                        this.events.onActiveTarget(target);
                        break;
                    }
                }
                this.events.afterScan();
            } while (m.hasSubScan && !m.targetsChanged);
            m.isSetting = false;
            if (m.targetsChanged) {
                m.hasSubScan = false;
                m.targetsChanged = false;
                this.lunchScan();
            }
        };
        return ControlSystemObject;
    }());
    exports.ControlSystemObject = ControlSystemObject;
    var CoCsCallbacks = (function () {
        function CoCsCallbacks(params) {
            if (!params)
                return;
            var events = ['beforeSetState', 'beforeScan', 'afterScan', 'beforeSetVector', 'onActiveTarget'];
            for (var i in events) {
                var outerHandler = params[events[i]];
                if (outerHandler)
                    this[events[i]] = outerHandler;
            }
        }
        CoCsCallbacks.prototype.beforeSetState = function (name, value) {
        };
        CoCsCallbacks.prototype.beforeScan = function () {
        };
        CoCsCallbacks.prototype.afterScan = function () {
        };
        CoCsCallbacks.prototype.beforeSetVector = function (newVector) {
        };
        CoCsCallbacks.prototype.onActiveTarget = function (target) {
        };
        return CoCsCallbacks;
    }());
    exports.CoCsCallbacks = CoCsCallbacks;
});
//# sourceMappingURL=ControlSystem.js.map;
define('infrastructure/TimeStamper',["require", "exports", './ControlSystem'], function (require, exports, cst) {
    "use strict";
    var MapStub = (function () {
        function MapStub() {
            var w = window;
            if (!w.WeakMap)
                return;
            this._map = new w.WeakMap();
            this.set = this._map.set;
            this.get = this._map.get;
        }
        MapStub.prototype.set = function (key, obj) {
        };
        MapStub.prototype.get = function (key) {
        };
        return MapStub;
    }());
    var TimeStamper = (function () {
        function TimeStamper() {
            var _this = this;
            this._tick = 0;
            this._map = {};
            this.callbacks = new cst.CoCsCallbacks({
                'beforeScan': function () {
                    _this._tick++;
                },
                'beforeSetState': function (name, value) {
                    _this._map[name] = _this._tick;
                }
            });
        }
        TimeStamper.prototype.isSame = function (name1, name2) {
            var t1 = this._map[name1];
            if (typeof t1 != 'number')
                return false;
            return t1 == this._map[name2];
        };
        TimeStamper.prototype.isOlder = function (name1, name2) {
            var t1 = this._map[name1];
            if (typeof t1 != 'number')
                return false;
            return t1 < Number(this._map[name2]);
        };
        TimeStamper.prototype.isNewer = function (name1, name2) {
            var t1 = this._map[name1];
            if (typeof t1 != 'number')
                return false;
            return t1 > Number(this._map[name2]);
        };
        return TimeStamper;
    }());
    exports.TimeStamper = TimeStamper;
});
//# sourceMappingURL=TimeStamper.js.map;
define('infrastructure/csStructure',["require", "exports", './ControlSystem', './TimeStamper'], function (require, exports, ControlSystem_1, TimeStamper_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    __export(ControlSystem_1);
    __export(TimeStamper_1);
});
//# sourceMappingURL=csStructure.js.map;
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('core/ControlObject',["require", "exports", 'infrastructure/csStructure'], function (require, exports, csStructure) {
    "use strict";
    var ControlObject = (function (_super) {
        __extends(ControlObject, _super);
        function ControlObject() {
            _super.apply(this, arguments);
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
                formatValue: function (o) {
                    var st = '';
                    if (o.radix == 16 && o.value.length > 3)
                        st = o.value.slice(0, st.length - 4) + ' ' + o.value.slice(st.length - 4);
                    else
                        st = o.value;
                    if (o.negative)
                        st = '-' + st;
                    return st;
                }
            };
            this.calcGraph = new CalcGraph();
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
                            negative: !b.negative,
                            radix: b.radix
                        }, setUp);
                    },
                    isOutOfRange: function (x) {
                        return Math.abs(x) > maxValue;
                    }
                };
            })();
            this.timer = new csStructure.TimeStamper();
        }
        ControlObject.prototype.loadTargets = function (targetsNames, callback) {
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
        return ControlObject;
    }(csStructure.ControlObject));
    exports.ControlObject = ControlObject;
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
            var actions = ['onOperation', 'onNumPad', 'onEqual', 'reset', 'onError'];
            var _loop_1 = function() {
                var action = actions[i];
                this_1[action] = function (cs) {
                    var calcState = cs.state.calcState, v = this.graph[calcState], newState = v[action];
                    newState = newState || newState == '' ? newState : "error";
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
        CalcGraph.prototype.onError = function (cs) {
        };
        return CalcGraph;
    }());
    exports.CalcGraph = CalcGraph;
});
//# sourceMappingURL=ControlObject.js.map;
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
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('core/ControlSystem',["require", "exports", './ControlObject', 'infrastructure/csStructure', './utils'], function (require, exports, co, csStructure, utils) {
    "use strict";
    var CurrentState = (function () {
        function CurrentState() {
            this.displayValue = '0';
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
    var ControlSystem = (function (_super) {
        __extends(ControlSystem, _super);
        function ControlSystem() {
            _super.call(this, CurrentState, co.ControlObject);
            this.targets = [
                'reset',
                'displayValue',
                'incomingArgument',
                'calcState',
                'calculate',
                'accumulateValue',
                'changeRadix'
            ];
            this.state = new CurrentState();
        }
        ControlSystem.prototype.init = function (callback) {
            var _this = this;
            this.co.loadTargets(this.targets, function (targets) {
                _this.targets = targets;
                _this.co.cs.setStates(_this.state);
                callback();
            });
            var timerCallbacks = this.co.timer.callbacks, onActiveTarget = timerCallbacks.onActiveTarget;
            timerCallbacks.onActiveTarget = function (target) {
                console.log(target.name, utils.clear(_this.state));
                onActiveTarget(target);
            };
            this.co.cs.init(timerCallbacks);
        };
        return ControlSystem;
    }(csStructure.ControlSystem));
    exports.ControlSystem = ControlSystem;
});
//# sourceMappingURL=ControlSystem.js.map;
define('core/targets/accumulateValueTarget',["require", "exports"], function (require, exports) {
    "use strict";
    function accumulateValueTarget(cs, co) {
        var key = getStateKey(cs.state);
        switch (key) {
            case 'accumulateIncomingOperand':
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
            co.cs.setState('operationError', 'overflow');
            co.calcGraph.onError(cs);
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
                    },
                    error: setError
                });
                return true;
            case 'calculate+accumulate':
                co.core[map[cs.state.operation]](cs.state.accumulator, cs.state.incomingOperand, {
                    value: function (z) {
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
define('core/targets/displayValueTarget',["require", "exports"], function (require, exports) {
    "use strict";
    function displayValueTarget(cs, co) {
        var key = getKey(cs.state, co.timer);
        switch (key) {
            case 'displayError':
                co.cs.setState('displayValue', 'error');
                break;
            case 'display0':
                co.cs.setState('displayValue', '0');
                break;
            case 'displayResult':
                co.cs.setState('displayValue', co.uiModel.formatValue(cs.state.operationResult));
                break;
            case 'displayOperand':
                co.cs.setState('displayValue', co.uiModel.formatValue(cs.state.incomingOperand));
                break;
            default:
                return false;
        }
        co.screen.setValue(cs.state.displayValue);
        return true;
    }
    function getKey(state, timer) {
        var key = 0, isCalcStateNewer = timer.isNewer('calcState', 'displayValue'), isIncomingOperandNewer = timer.isNewer('incomingOperand', 'displayValue'), isOperationResultNewer = timer.isNewer('operationResult', 'displayValue');
        if (state.calcState == 'error')
            return isCalcStateNewer ? 'displayError' : 'none';
        if (isCalcStateNewer &&
            ['wait-wait2', 'wait2-wait2'].indexOf(state.calcStateTransit) > -1)
            return 'display0';
        if (isOperationResultNewer && state.operationResult != null)
            return 'displayResult';
        if (isIncomingOperandNewer && state.incomingOperand != null)
            return 'displayOperand';
    }
    return displayValueTarget;
});
//# sourceMappingURL=displayValueTarget.js.map;
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
        co.screen.setValue('0');
        return true;
    }
    function getDefault() {
        return {
            displayValue: '0',
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
