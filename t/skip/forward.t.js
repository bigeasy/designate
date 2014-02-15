require('./proof')(6, function (step, serialize, deepEqual, Strata, tmp) {
    var iterate = require('../..')
    var revise = require('revise')
    var visited
    function extractor (record) {
        return record.value
    }
    function comparator (a, b) {
        return a < b ? -1 : a > b ? 1 : 0
    }
    var strata = new Strata({
        extractor: revise.extractor(extractor),
        comparator: revise.comparator(comparator),
        leafSize: 3, branchSize: 3,
        directory: tmp
    })
    step(function () {
        serialize(__dirname + '/fixtures/nine.json', tmp, step())
    }, function () {
        strata.open(step())
    }, function () {
        var forward = iterate.forward(strata, comparator, { 0: true }, visited = {}, 'a', step())
    }, function (iterator) {
        var records = [], keys = [], sizes = []
        step(function () {
            step(function () {
                iterator.next(step())
            }, function (record, key, size) {
                if (record) {
                    records.push(record.value)
                    keys.push(key.value)
                    sizes.push(size)
                } else {
                    step(null)
                }
            })()
        }, function () {
            iterator.unlock()
        }, function () {
            return step(null, records, keys, sizes)
        })
    }, function (records, keys, sizes) {
        deepEqual(records, [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i' ], 'keyed records')
        deepEqual(keys, [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i' ], 'keyed keys')
        deepEqual(sizes, [ 76, 76, 76, 76, 76, 76, 76, 76, 76 ], 'keyed sizes')
        deepEqual(Object.keys(visited), [ 0 ], 'keyed visited')
    }, function () {
        var forward = iterate.forward(strata, comparator, { 0: true }, visited, step())
    }, function (iterator) {
        var records = []
        step(function () {
            step(function () {
                iterator.next(step())
            }, function (record) {
                if (record) records.push(record.value)
                else step(null)
            })()
        }, function () {
            iterator.unlock()
        }, function () {
            return [ records ]
        })
    }, function (records) {
        deepEqual(records, [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i' ], 'least records')
        deepEqual(Object.keys(visited), [ 0 ], 'least visited')
    }, function () {
        strata.close(step())
    })
})
