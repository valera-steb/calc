/**
 * Created by steb on 20/06/2016.
 */
define(['./_init', 'core/utils'], function (_init, utils) {

    describe('cs: changeRadixTarget', function () {
        var cs;

        _init(function (_cs) {
            cs = _cs;
        });


        xit('работает в таких случаях: calcState[wait|wait2]');

        xit('возвращает к предыдущему состоянию переключатель в UI, если не работает');

        describe('при преобразовании', function(){
            xit('если есть, выполняет предыдущую операцию с текущими операндами, и результат переводит');

            it('если есть только введенный сейчас операнд - переводит', function () {
                utils.copyValues({
                        incomingOperand: {
                            value: 'A2F',
                            radix: 16,
                            negative: false
                        },
                        currentRadix: 16
                    },
                    cs.currentState);

                cs.setState('incomingRadix', 10);

                expect(cs.currentState.currentRadix).toBe(10);
                expect(cs.currentState.incomingOperand.value).toBe('2607');
            });
        })
    });
});