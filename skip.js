var cadence = require('cadence')
var riffle = require('riffle')

function Forward (comparator, versions, iterator, record, visited, key, size) {
    this._iterator = iterator
    this._comparator = comparator
    this._versions = versions
    this._visited = visited
    this._next = { record: record, key: key, size: size }
}

function valid (versions, visited) {
    return function (key) {
        visited[key.version] = true
        return versions[key.version]
    }
}

Forward.prototype.next = cadence(function (async) {
    if (!this._next) return []
    async(function () {
        var next = this._next
        async(function () {
            this._iterator.next(valid(this._versions, this._visited), async())
        }, function (record, key, size) {
            if (key && this._comparator(key.value, next.key.value) == 0) {
                next = { record: record, key: key, size: size }
            } else {
                this._next = record && { record: record, key: key, size: size }
                return [ async, next.record, next.key, next.size ]
            }
        })()
    })
})

Forward.prototype.unlock = function (callback) {
    this._iterator.unlock(callback)
}

exports.forward = cadence(function (async, strata, comparator, versions, visited, key) {
    var composite = key ? { value: key, version: 0 } : null
    async(function () {
        riffle.forward(strata, composite, async())
    }, function (iterator) {
        async (function () {
            iterator.next(valid(versions, visited), async())
        }, function (record, key, size) {
            return new Forward(comparator, versions, iterator, record, visited, key, size)
        })
    })
})

function Reverse (comparator, versions, iterator, record, visited, key, size) {
    this._iterator = iterator
    this._comparator = comparator
    this._versions = versions
    this._visisted = visited
    this._next = { record: record, key: key, size: size }
}

Reverse.prototype.next = cadence(function (async) {
    if (!this._next) return []
    async(function () {
        var next = this._next
        async(function () {
            this._iterator.next(valid(this._versions, this._visisted), async())
        }, function (record, key, size) {
            if (!key || this._comparator(key.value, next.key.value) != 0) {
                this._next = record && { record: record, key: key, size: size }
                return [ async, next.record, next.key, next.size ]
            }
        })()
    })
})

Reverse.prototype.unlock = function (callback) {
    this._iterator.unlock(callback)
}

exports.reverse = cadence(function (async, strata, comparator, versions, visited, key) {
    var composite = key ? { value: key, version: Number.MAX_VALUE } : null
    async(function () {
        riffle.reverse(strata, composite, async())
    }, function (iterator) {
        async (function () {
            iterator.next(valid(versions, visited), async())
        }, function (record, key, size) {
            return new Reverse(comparator, versions, iterator, record, visited, key, size)
        })
    })
})
