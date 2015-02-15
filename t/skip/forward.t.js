require('./proof')(4, prove)

function prove (async, assert) {
    var iterate = require('../..')
    var revise = require('revise')
    var visited
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
        var forward = iterate.forward(strata, comparator, { 0: true }, visited = {}, 'a', async())
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
            assert(records, [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i' ], 'keyed records')
            assert(Object.keys(visited), [ 0 ], 'keyed visited')
            iterator.unlock(async())
        })
    }, function () {
        var forward = iterate.forward(strata, comparator, { 0: true }, visited, async())
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
            assert(records, [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i' ], 'least records')
            assert(Object.keys(visited), [ 0 ], 'least visited')
            iterator.unlock(async())
        })
    }, function () {
        strata.close(async())
    })
}
