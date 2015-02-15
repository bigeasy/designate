var cadence = require('cadence/redux')
var riffle = require('riffle')

function Forward (comparator, validator, iterator, items) {
    this._iterator = iterator
    this._comparator = comparator
    this._validator = validator
    this._items = items
}

function valid (versions, visited) {
    return function (item) {
        visited[item.key.version] = true
        return versions[item.key.version]
    }
}

Forward.prototype.next = cadence(function (async) {
    var loop = async(function () {
        var gathered = [], items = this._items, next = this._next, i = 0
        if (items == null) {
            return [ loop, null ]
        }
        if (next == null) {
            next = items[i++]
        }
        for (var I = items.length; i < I; i++) {
            var item = items[i]
            if (this._comparator(item.key.value, next.key.value) != 0) {
                gathered.push(next)
            }
            next = item
        }
        this._next = next
        if (this._iterator.terminal) {
            gathered.push(next)
        }
        async(function () {
            this._iterator.next(this._validator, async())
        }, function (items) {
            this._items = items
            if (gathered.length === 0) {
                return [ loop() ]
            }
            return [ loop, gathered ]
        })
    })()
})

Forward.prototype.unlock = function (callback) {
    this._iterator.unlock(callback)
}

exports.forward = cadence(function (async, strata, comparator, versions, visited, key) {
    var composite = key ? { value: key, version: 0 } : null
    var validator = valid(versions, visited)
    async(function () {
        riffle.forward(strata, composite, async())
    }, function (iterator) {
        async (function () {
            iterator.next(validator, async())
        }, function (items) {
            return new Forward(comparator, validator, iterator, items)
        })
    })
})

function Reverse (comparator, validator, iterator, items) {
    this._iterator = iterator
    this._comparator = comparator
    this._validator = validator
    this._items = items
}

Reverse.prototype.next = cadence(function (async) {
    var loop = async(function () {
        var gathered = [], items = this._items, next = this._next, i = 0
        if (items == null) {
            return [ loop, null ]
        }
        if (next == null) {
            next = items[i++]
        }
        for (var I = items.length; i != I; i++) {
            var item = items[i]
            if (this._comparator(item.key.value, next.key.value) !== 0) {
                gathered.push(next)
                next = item
            }
        }
        this._next = next
        if (this._iterator.terminal) {
            gathered.push(next)
        }
        async(function () {
            this._iterator.next(this._validator, async())
        }, function (items) {
            this._items = items
            if (gathered.length === 0) {
                return [ loop() ]
            }
            return [ loop, gathered ]
        })
    })()
})

Reverse.prototype.unlock = function (callback) {
    this._iterator.unlock(callback)
}

exports.reverse = cadence(function (async, strata, comparator, versions, visited, key) {
    var composite = key ? { value: key, version: Number.MAX_VALUE } : null
    var validator = valid(versions, visited)
    async(function () {
        riffle.reverse(strata, composite, async())
    }, function (iterator) {
        async (function () {
            iterator.next(validator, async())
        }, function (items) {
            return new Reverse(comparator, validator, iterator, items)
        })
    })
})
