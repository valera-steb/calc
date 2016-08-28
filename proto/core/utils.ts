/**
 * Created by steb on 28/08/2016.
 */
export function copyValues(from, to) {
    for (var i in from) {
        to[i] = from[i];
    }
}

export function clear(obj){
    var clean = {};
    for(var i in obj){
        var val = obj[i];
        if(val)
            clean[i] = val;
    }
    return clean;
}