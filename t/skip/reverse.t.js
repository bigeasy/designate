require('./proof')(4, prove)

function prove (async, assert) {
    var iterate = require('../..')
    var revise = require('revise')
    var visited = {}
    function extractor (record) {
        return record.value
    }
    function comparator (a, b) {
        return a < b ? -1 : a > b ? 1 : 0
    }
    var strata = createStrata({
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
        var records = []
        async(function () {
            var loop  = async(function () {
                iterator.next(async())
            }, function (items) {
                if (items == null) {
                    return [ loop ]
                }
                items.forEach(function (item) {
                    records.push(item.record.value)
                })
            })()
        }, function () {
            assert(records, [ 'i', 'h', 'g', 'f', 'e', 'd', 'c', 'b', 'a' ], 'keyed records')
            assert(Object.keys(visited), [ 0 ], 'keyed visited')
            iterator.unlock(async())
        })
    }, function () {
        iterate.reverse(strata, comparator, { 0: true }, visited, 'h', async())
    }, function (iterator) {
        var records = []
        async(function () {
            var loop = async(function () {
                iterator.next(async())
            }, function (items) {
                if (items == null) {
                    return [ loop ]
                }
                items.forEach(function (item) {
                    records.push(item.record.value)
                })
            })()
        }, function () {
            assert(records, [ 'h', 'g', 'f', 'e', 'd', 'c', 'b', 'a' ], 'greatest records')
            assert(Object.keys(visited), [ 0 ], 'greatest visited')
            iterator.unlock(async())
        })
    }, function () {
        strata.close(async())
    })
}
