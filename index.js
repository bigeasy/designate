var cadence = require('cadence')
var riffle = require('riffle')

function Forward (comparator, versions, iterator, record, visited, key) {
    this._iterator = iterator
    this._comparator = comparator
    this._versions = versions
    this._visited = visited
    this._next = { record: record, key: key }
}

function valid (versions, visited) {
    return function (key) {
        visited[key.version] = true
        return versions[key.version]
    }
}

Forward.prototype.next = cadence(function (step) {
    if (!this._next) return step(null)
    step(function () {
        var next = this._next
        step(function () {
            this._iterator.next(valid(this._versions, this._visited), step())
        }, function (record, key) {
            if (key && this._comparator(key.value, next.key.value) == 0) {
                next = { record: record, key: key }
            } else {
                this._next = record && { record: record, key: key }
                step(null, next.record, next.key)
            }
        })()
    })
})

Forward.prototype.unlock = function () {
    this._iterator.unlock()
}

exports.forward = cadence(function (step, strata, comparator, versions, visited, key) {
    var composite = { value: key, version: 0 }
    step(function () {
        riffle.forward(strata, composite, step())
    }, function (iterator) {
        step (function () {
            iterator.next(valid(versions, visited), step())
        }, function (record, key) {
            return new Forward(comparator, versions, iterator, record, visited, key)
        })
    })
})

function Reverse (comparator, versions, iterator, record, visited, key) {
    this._iterator = iterator
    this._comparator = comparator
    this._versions = versions
    this._visisted = visited
    this._next = { record: record, key: key }
}

Reverse.prototype.next = cadence(function (step) {
    if (!this._next) return step(null)
    step(function () {
        var next = this._next
        step(function () {
            this._iterator.next(valid(this._versions, this._visisted), step())
        }, function (record, key) {
            if (!key || this._comparator(key.value, next.key.value) != 0) {
                this._next = record && { record: record, key: key }
                step(null, next.record, next.key)
            }
        })()
    })
})

Reverse.prototype.unlock = function () {
    this._iterator.unlock()
}

exports.reverse = cadence(function (step, strata, comparator, versions, visited, key) {
    var composite = { value: key, version: Number.MAX_VALUE }
    step(function () {
        riffle.reverse(strata, composite, step())
    }, function (iterator) {
        step (function () {
            iterator.next(valid(versions, visited), step())
        }, function (record, key) {
            return new Reverse(comparator, versions, iterator, record, visited, key)
        })
    })
})
