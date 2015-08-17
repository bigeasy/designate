var cadence = require('cadence')

function Designator (comparator, forward, versions, visited, iterator) {
    this._comparator = comparator
    this._forward = forward
    this._versions = versions
    this._visited = visited
    this._iterator = iterator
}

Designator.prototype.get = function () {
    if (this._done) {
        var item = this._item
        this._item = null
        return item
    }
    for (;;) {
        var item = this._iterator.get()
        if (item == null) {
            return null
        }
        this._visited[item.key.version] = true
        if (!this._versions[item.key.version]) {
            continue
        }
        if (this._item == null) {
            this._item = item
        } else if (this._comparator(this._item.key.value, item.key.value) != 0) {
            var designated = this._item
            this._item = item
            return designated
        }
        if (this._forward) {
            this._item = item
        }
    }
}

Designator.prototype.next = cadence(function (async) {
    if (this._done) {
        return [ false ]
    }
    async(function () {
        this._iterator.next(async())
    }, function (more) {
        this._done = !more
        return [ true ]
    })
})

Designator.prototype.unlock = function (callback) {
    this._iterator.unlock(callback)
}

exports.forward = function (comparator, versions, visited, iterator) {
    return new Designator(comparator, true, versions, visited, iterator)
}

exports.reverse = function (comparator, versions, visited, iterator) {
    return new Designator(comparator, false, versions, visited, iterator)
}
