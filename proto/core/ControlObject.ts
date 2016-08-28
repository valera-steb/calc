/**
 * Created by steb on 24/08/2016.
 */
import {ControlSystem as CS, ICalcValue} from "./ControlSystem";
import * as utils from './utils';

export namespace ControlObject {

    export class CO {
        constructor(private _cs:CS) {
        }

        cs = new ControlSystem(this._cs);

        // ui view
        screen = new (class {
            setValue(v) {
                console.log('co.screen.setValue', v);
            }
        });

        numPad = {
            setActivityMap: function () {

            }
        };

        keyPad = {
            setRadix: function (radix) {
                console.log('co.keyPad.setRadix', radix);
            }
        };

        //
        uiModel = {
            formatValue: function (value:ICalcValue):string {
                var st = '';
                if (value.negative)
                    st += '-';
                return st += value.value;
            }
        };

        calcGraph = new ControlObject.CalcGraph();

        //
        core = (function () {
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
                            value: String(Math.abs(z)),
                            radix: 10,
                            negative: z < 0
                        }, a.radix)
                    );

                setUp.error();
                setUp.value(null);
            }

            return core = {

                convert: function (x, toRadix, setUp?) {
                    var decValue = 0;
                    for (var len = x.value.length, i = len - 1; i > -1; i--) {
                        decValue += Math.pow(x.radix, len - i - 1) * map.toDec(x.value[i]);
                    }

                    var ret:any = [];
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
        })();

    }


    export class ControlSystem {

        constructor(private cs:CS) {
        }

        setState(name:string, value:any) {
            this.cs.state[name] = value;
            this.lunchScan();
            return true;
        }

        setStates(nameValues) {
            for (var name in nameValues) {
                this.cs.state[name] = nameValues[name];
            }
            this.lunchScan();
            return true;
        }

        setVector(newVector) {
            this.cs.targets = newVector;
            this.m.targetsChanged = true;
        }

        lunchScan() {
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
        }

        private m = {
            isSetting: false,
            hasSubScan: false,
            targetsChanged: false,
        };
    }


    export class CalcGraph {
        constructor() {
            var actions = ['onOperation', 'onNumPad', 'onEqual', 'reset'];

            for (var i in actions) {
                let action = actions[i];
                this[action] = function (cs:CS) {
                    var
                        calcState = cs.state.calcState,
                        v = this.graph[calcState],
                        newState = v[action] || 'error';

                    if (newState != '')
                        cs.co.cs.setStates({
                            'calcStateTransit': calcState + '-' + newState,
                            'calcState': newState
                        });
                }
            }
        }

        private graph = {
            'error': {'reset': 'wait'},
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

        onOperation(cs:CS) {
        }

        onNumPad(cs:CS) {
        }

        onEqual(cs:CS) {
        }

        reset(cs:CS) {
        }
    }
}