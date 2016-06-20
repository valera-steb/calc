/**
 * Created by steb on 20/06/2016.
 */
define(['core/ControlObject'], function (CO) {
    describe('ControlObject.core', function () {
        var core = (new CO).core;

        describe('конвертация чисел', function () {

            it('10(10) => A(16)', function () {
                var dec = {
                    value: '10',
                    radix: 10,
                    negative: false
                };
                core.convert(dec, 16, {
                    value: function (hex) {
                        expect(hex).toEqual({
                            value: 'A',
                            radix: 16,
                            negative: false
                        });
                    }
                });
            });


            it('F2(16) => 242(10)', function () {
                var hex = {
                    value: 'F2',
                    radix: 16,
                    negative: false
                };
                core.convert(hex, 10, {
                    value: function (dec) {

                        expect(dec).toEqual({
                            value: '242',
                            radix: 10,
                            negative: false
                        });
                    }
                });
            });


            it('C BD78(16) => 1100 1011 1101 0111 1000(2)', function () {
                var hex = {
                    value: 'CBD78',
                    radix: 16,
                    negative: false
                };
                core.convert(hex, 2, {
                    value: function (bin) {
                        expect(bin).toEqual({
                            value: '11001011110101111000',
                            radix: 2,
                            negative: false
                        });
                    }
                });
            });
        });


        describe('сложение/вычитание', function () {
            it('123(10) + 97(10) = 220(10)', function () {
                var
                    a = {
                        value: '123',
                        radix: 10,
                        negative: false
                    },
                    b = {
                        value: '97',
                        radix: 10,
                        negative: false
                    };

                core.add(a, b, {
                    value: function (c) {
                        expect(c).toEqual({
                            value: '220',
                            radix: 10,
                            negative: false
                        })
                    }
                });
            });

            it('123(10) + [-97](10) = 26(10)', function () {
                var
                    a = {
                        value: '123',
                        radix: 10,
                        negative: false
                    },
                    b = {
                        value: '97',
                        radix: 10,
                        negative: true
                    };

                core.add(a, b, {
                    value: function (c) {
                        expect(c).toEqual({
                            value: '26',
                            radix: 10,
                            negative: false
                        })
                    }
                });
            });


            it('AB(16) + FE(16) = 1A9(16)', function () {
                var
                    a = {
                        value: 'AB',
                        radix: 16,
                        negative: false
                    },
                    b = {
                        value: 'FE',
                        radix: 16,
                        negative: false
                    };

                core.add(a, b, {
                    value: function (c) {
                        expect(c).toEqual({
                            value: '1A9',
                            radix: 16,
                            negative: false
                        })
                    }
                });
            });
        });


        it('переполнение: FFFF FFF0(16) + 10(16) = null', function () {
            var
                a = {
                    value: 'FFFFFFF0',
                    radix: 16,
                    negative: false
                },
                b = {
                    value: '10',
                    radix: 16,
                    negative: false
                },
                called = false, _c = {};

            core.add(a, b, {
                value: function (c) {
                    _c = c;
                },
                error: function () {
                    called = true;
                }
            });

            expect(_c).toBeNull();
            expect(called).toBeTruthy();
        });
    })
});