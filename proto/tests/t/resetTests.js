/**
 * Created by steb on 20/06/2016.
 */
define(['./_init'], function (_init) {

    describe('cs: resetTarget', function () {
        var cs;
        
        _init(function (_cs) {
            cs = _cs;
        });


        it('Наиболее приоритетная, срабатывает всегда при нажатии сброса', function () {
            cs.setState('numPadPressed', '1');
            cs.setState('incomingRadix', 12);

            expect(cs.currentState.currentRadix).toBe(12);
            expect(cs.currentState.incomingOperand.value).not.toBeNull();

            cs.setState('keyPadPressed', 'reset');
            expect(compare({
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
            }, cs.currentState)).toBeTruthy();
        });
    });

    function compare(r, i) {
        if (!_.isPlainObject(r) && !_.isArray(r))return r === i;
        if (!i)return !1;
        for (var n in r)if (!compare(r[n], i[n]))return !1;
        return !0
    }
});