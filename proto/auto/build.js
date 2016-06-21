/**
 * Created by steb on 21/06/2016.
 */
({
    baseUrl: "../",
    name: "core/ControlSystem",
    out: "../dist/core.js",
    include:[
        'core/targets/resetTarget',
        'core/targets/incomingTarget',
        'core/targets/calcStateTarget',
        'core/targets/incomingCommandTarget',
        'core/targets/changeRadixTarget'
    ],
    optimize: 'none',
    preserveLicenseComments: true
})