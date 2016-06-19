/**
 * Created by steb on 19/06/2016.
 */
define(function () {
    return function ControlObject() {
        var co = {
            // ui view
            screen: {
                setValue: function () {

                }
            },
            numPad: {
                setActivityMap: function () {

                }
            },
            //
            uiModel: {
                formatValue: function () {

                }
            },
            calcGraph: {
                graph: {
                    'waitA': [],
                    'waitB': []
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
                    if (Math.abs(z) < maxValue)
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
                    }
                }
            })()
        };

        return co;
    }
});