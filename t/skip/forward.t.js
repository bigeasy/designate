require('./proof')(6, function (async, assert) {
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
    async(function () {
        serialize(__dirname + '/fixtures/nine.json', tmp, async())
    }, function () {
        strata.open(async())
    }, function () {
        var forward = iterate.forward(strata, comparator, { 0: true }, visited = {}, 'a', async())
    }, function (iterator) {
        var records = [], keys = [], sizes = []
        async(function () {
            async(function () {
                iterator.next(async())
            }, function (record, key, size) {
                if (record) {
                    records.push(record.value)
                    keys.push(key.value)
                    sizes.push(size)
                } else {
                    return [ async ]
                }
            })()
        }, function () {
            iterator.unlock(async())
        }, function () {
            return [ async, records, keys, sizes ]
        })
    }, function (records, keys, sizes) {
        assert(records, [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i' ], 'keyed records')
        assert(keys, [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i' ], 'keyed keys')
        assert(sizes, [ 76, 76, 76, 76, 76, 76, 76, 76, 76 ], 'keyed sizes')
        assert(Object.keys(visited), [ 0 ], 'keyed visited')
    }, function () {
        var forward = iterate.forward(strata, comparator, { 0: true }, visited, async())
    }, function (iterator) {
        var records = []
        async(function () {
            async(function () {
                iterator.next(async())
            }, function (record) {
                if (record) records.push(record.value)
                else return [ async ]
            })()
        }, function () {
            iterator.unlock(async())
        }, function () {
            return [ records ]
        })
    }, function (records) {
        assert(records, [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i' ], 'least records')
        assert(Object.keys(visited), [ 0 ], 'least visited')
    }, function () {
        strata.close(async())
    })
})
