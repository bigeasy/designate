require('./proof')(2, function (step, serialize, deepEqual, Strata, tmp) {
    var iterate = require('../..')
    var mvcc = require('mvcc')
    var versions = {}
    ; [ 0, 1, 2 ].forEach(function (version) { versions[version] = true })
    function extractor (record) {
        return record.value
    }
    function comparator (a, b) {
        return a < b ? -1 : a > b ? 1 : 0
    }
    var strata = new Strata({
        extractor: mvcc.extractor(extractor),
        comparator: mvcc.comparator(comparator),
        leafSize: 3, branchSize: 3,
        directory: tmp
    })
    step(function () {
        serialize(__dirname + '/fixtures/skip.json', tmp, step())
    }, function () {
        strata.open(step())
    }, function () {
        iterate.reverse(strata, comparator, versions, 'i', step())
    }, function (iterator) {
        var records = []
        var versions = []
        step(function () {
            step(function () {
                iterator.next(step())
            }, function (record) {
                if (record) {
                    records.push(record.value)
                    versions.push(record.version)
                } else {
                    step(null)
                }
            })()
        }, function () {
            iterator.unlock()
        }, function () {
            deepEqual(records, [ 'i', 'h', 'g', 'f', 'e', 'd', 'c', 'b', 'a' ], 'records')
            deepEqual(versions, [ 0, 0, 1, 0, 2, 0, 2, 0, 1 ], 'versions')
        })
    }, function () {
        strata.close(step())
    })
})
