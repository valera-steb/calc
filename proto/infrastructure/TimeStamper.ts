/**
 * Created by steb on 03/09/2016.
 */

import * as cst from './ControlSystem';

class MapStub {
    private _map;

    constructor() {
        var w = window as any;
        if (!w.WeakMap)
            return;

        this._map = new w.WeakMap();
        this.set = this._map.set;
        this.get = this._map.get;
    }

    set(key, obj) {

    }

    get(key) {

    }
}

export class TimeStamper {

    constructor() {

    }

    private _tick = 0;
    private _map = {};

    callbacks = new cst.CoCsCallbacks({
        'beforeScan': ()=> {
            this._tick++;
        },
        'beforeSetState': (name, value)=> {
            this._map[name] = this._tick;
        }
    });

    isSame(name1:string, name2:string):boolean {
        var t1 = this._map[name1];
        if (typeof t1 != 'number')
            return false;

        return t1 == this._map[name2];
    }

    isOlder(name1:string, name2:string):boolean {
        var t1 = this._map[name1];
        if (typeof t1 != 'number')
            return false;

        return t1 < Number(this._map[name2]);
    }
    
    isNewer(name1:string, name2:string):boolean {
        var t1 = this._map[name1];
        if (typeof t1 != 'number')
            return false;

        return t1 > Number(this._map[name2]);
    }
}