require('./proof')(2, prove)

function prove (async, assert) {
    var designate = require('..')
    var revise = require('revise')
    var riffle = require('riffle')
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
        riffle.reverse(strata, { value: 'i' }, async())
    }, function (iterator) {
        var designator = designate.reverse(comparator, { 0: true }, visited, iterator)
        var records = []
        async(function () {
            var loop  = async(function () {
                designator.next(async())
            }, function (more) {
                if (more) {
                    var item
                    while (item = designator.get()) {
                        records.push(item.record.value)
                    }
                } else {
                    return [ loop.break ]
                }
            })()
        }, function () {
            assert(records, [ 'i', 'h', 'g', 'f', 'e', 'd', 'c', 'b', 'a' ], 'keyed records')
            assert(Object.keys(visited), [ 0 ], 'keyed visited')
            designator.unlock(async())
        })
    }, function () {
        strata.close(async())
    })
}
