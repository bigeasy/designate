require('./proof')(6, function (async, assert) {
    var iterate = require('../..')
    var revise = require('revise')
    var visited = {}
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
        iterate.reverse(strata, comparator, { 0: true }, visited, 'i', async())
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
                    return [ async, records ]
                }
            })()
        }, function () {
            iterator.unlock(async())
        }, function () {
            return [ async, records, keys, sizes ]
        })
    }, function (records, keys, sizes) {
        assert(records, [ 'i', 'h', 'g', 'f', 'e', 'd', 'c', 'b', 'a' ], 'keyed records')
        assert(keys, [ 'i', 'h', 'g', 'f', 'e', 'd', 'c', 'b', 'a' ], 'keyed keys')
        assert(sizes, [ 76, 76, 76, 76, 76, 76, 76, 76, 76 ], 'keyed sizes')
        assert(Object.keys(visited), [ 0 ], 'keyed visited')
    }, function () {
        iterate.reverse(strata, comparator, { 0: true }, visited, 'h', async())
    }, function (iterator) {
        var records = []
        async(function () {
            async(function () {
                iterator.next(async())
            }, function (record) {
                if (record) records.push(record.value)
                else return [ async, records ]
            })()
        }, function () {
            iterator.unlock(async())
        }, function () {
            return [ records ]
        })
    }, function (records) {
        assert(records, [ 'h', 'g', 'f', 'e', 'd', 'c', 'b', 'a' ], 'greatest records')
        assert(Object.keys(visited), [ 0 ], 'greatest visited')
    }, function () {
        strata.close(async())
    })
})
