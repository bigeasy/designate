require('./proof')(4, prove)

function prove (async, assert) {
    var designate = require('..')
    var revise = require('revise')
    var riffle = require('riffle')
    var versions = {}, visited
    ; [ 0, 1 ].forEach(function (version) { versions[version] = true })
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
        serialize(__dirname + '/fixtures/designate.json', tmp, async())
    }, function () {
        strata.open(async())
    }, function () {
        riffle.forward(strata, async())
    }, function (iterator) {
        var designator = designate.forward(comparator, versions, visited = {}, iterator)
        var records = []
        async(function () {
            var loop = async(function () {
                designator.next(async())
            }, function (more) {
                if (more) {
                    var item
                    while (item = designator.get()) {
                        records.push(item.record)
                    }
                } else {
                    return [ loop.break ]
                }
            })()
        }, function () {
            designator.unlock(async())
        }, function () {
            assert(records,
             [ { value: 'a', version: 1 },
               { value: 'b', version: 0 },
               { value: 'c', version: 1 },
               { value: 'd', version: 0 },
               { value: 'e', version: 0 },
               { value: 'f', version: 0 },
               { value: 'g', version: 1 },
               { value: 'h', version: 0 },
               { value: 'i', version: 0 } ]
            , 'forward records')
            assert(Object.keys(visited).sort(), [ 0, 1, 2 ], 'forward visited')
        })
    }, function () {
        riffle.reverse(strata, async())
    }, function (iterator) {
        var designator = designate.reverse(comparator, versions, visited = {}, iterator)
        var records = []
        async(function () {
            var loop = async(function () {
                designator.next(async())
            }, function (more) {
                if (more) {
                    var item
                    while (item = designator.get()) {
                        records.push(item.record)
                    }
                } else {
                    return [ loop.break ]
                }
            })()
        }, function () {
            designator.unlock(async())
        }, function () {
            assert(records,
             [ { value: 'i', version: 0 },
               { value: 'h', version: 0 },
               { value: 'g', version: 1 },
               { value: 'f', version: 0 },
               { value: 'e', version: 0 },
               { value: 'd', version: 0 },
               { value: 'c', version: 1 },
               { value: 'b', version: 0 },
               { value: 'a', version: 1 } ]
            , 'reverse records')
            assert(Object.keys(visited).sort(), [ 0, 1, 2 ], 'reverse visited')
        })
    }, function () {
        strata.close(async())
    })
}
