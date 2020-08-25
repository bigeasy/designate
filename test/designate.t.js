require('proof')(3, async okay => {
    const advance = require('advance')
    const designate = require('..')

    const items = [{
        key: { version: 1, value: 'a' }
    }, {
        key: { version: 2, value: 'a' }
    }, {
        key: { version: 3, value: 'a' }
    }, {
        key: { version: 1, value: 'd' }
    }]

    const expected = [{
        key: { version: 3, value: 'a' }
    }, {
        key: { version: 1, value: 'd' }
    }]

    function comparator (left, right) {
        return left < right ? -1 : left > right ? 1 : 0
    }

    const versions = { 1: true, 3: true }
    const forward = advance.forward([ items ])
    const gathered = []
    {
        for await (const items of designate.forward(comparator, forward, versions)) {
            for (const item of items) {
                gathered.push(item)
            }
        }
        okay(gathered, expected, 'forward')
    }

    {
        const reverse = advance.reverse([ items ])
        gathered.length = 0
        for await (const items of designate.reverse(comparator, reverse, versions)) {
            for (const item of items) {
                gathered.push(item)
            }
        }
        okay(gathered, expected.slice().reverse(), 'reverse')
    }

    {
        const empty = advance.forward([])
        gathered.length = 0
        for await (const items of designate.forward(comparator, empty, versions)) {
            for (const item of items) {
                gathered.push(item)
            }
        }
        okay(gathered, [], 'EMpty')
    }
})
