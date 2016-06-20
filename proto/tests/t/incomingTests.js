/**
 * Created by steb on 20/06/2016.
 */
define(['./_init', 'core/utils'], function (_init, utils) {

    describe('cs: incomingTarget', function () {
        var cs;

        _init(function (_cs) {
            cs = _cs;
        });

        it('работает в таких состояниях: ', function () {
            cs.setState('numPadPressed', '6');

            expect(cs.currentState.numPadPressed).toBeNull();
            expect(cs.currentState.incomingOperand.value).toBe('6');
        });

        describe('блокирует ввод по достижению предела', function () {
            it('FFFF FFF0(16)', function () {
                utils.copyValues({
                        incomingOperand: {
                            value: 'FFFFFFF0',
                            radix: 16,
                            negative: false
                        },
                        currentRadix: 16
                    },
                    cs.currentState);

                cs.setState('numPadPressed', 'A');

                expect(cs.currentState.incomingOperand.value).toBe('FFFFFFF0');
            })
        })
    });
});