require('./proof')(6, prove)

function prove (async, assert) {
    var iterate = require('../..')
    var revise = require('revise')
    var versions = {}, visited
    ; [ 0, 1, 2 ].forEach(function (version) { versions[version] = true })
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
        serialize(__dirname + '/fixtures/skip.json', tmp, async())
    }, function () {
        strata.open(async())
    }, function () {
        iterate.forward(strata, comparator, versions, visited = {}, 'a', async())
    }, function (iterator) {
        var records = []
        var versions = []
        async(function () {
            async(function () {
                iterator.next(async())
            }, function (record) {
                if (record) {
                    records.push(record.value)
                    versions.push(record.version)
                } else {
                    return [ async ]
                }
            })()
        }, function () {
            iterator.unlock(async())
        }, function () {
            assert(records, [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i' ], 'forward records')
            assert(versions, [ 1, 0, 2, 0, 2, 0, 1, 0, 0 ], 'forward versions')
            assert(Object.keys(visited).sort(), [ 0, 1, 2 ], 'forward visited')
        })
    }, function () {
        iterate.reverse(strata, comparator, versions, visited = {}, 'i', async())
    }, function (iterator) {
        var records = []
        var versions = []
        async(function () {
            async(function () {
                iterator.next(async())
            }, function (record) {
                if (record) {
                    records.push(record.value)
                    versions.push(record.version)
                } else {
                    return [ async ]
                }
            })()
        }, function () {
            iterator.unlock(async())
        }, function () {
            assert(records, [ 'i', 'h', 'g', 'f', 'e', 'd', 'c', 'b', 'a' ], 'reverse records')
            assert(versions, [ 0, 0, 1, 0, 2, 0, 2, 0, 1 ], 'reverse versions')
            assert(Object.keys(visited).sort(), [ 0, 1, 2 ], 'reverse visited')
        })
    }, function () {
        strata.close(async())
    })
}
