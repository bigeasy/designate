require('proof')(3, async okay => {
    const advance = require('advance')
    const designate = require('..')

    const items = [{
        key: { version: 3, value: 'a' }
    }, {
        key: { version: 2, value: 'a' }
    }, {
        key: { version: 1, value: 'a' }
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

    {
        const forward = advance.forward([ items ])
        const gathered = [], promises = []
        const iterator = designate.forward(comparator, forward)
        while (! iterator.done) {
            iterator.next(promises, items => {
                for (const item of items) {
                    gathered.push(item)
                }
            })
            while (promises.length != 0) {
                await promises.shift()
            }
        }
        okay(gathered, expected, 'forward')
    }

    {
        const reverse = advance.reverse([ items ])
        const gathered = [], promises = []
        const iterator = designate.reverse(comparator, reverse)
        while (! iterator.done) {
            iterator.next(promises, items => {
                for (const item of items) {
                    gathered.push(item)
                }
            })
            while (promises.length != 0) {
                await promises.shift()
            }
        }
        okay(gathered, expected.slice().reverse(), 'reverse')
    }

    {
        const empty = advance.forward([])
        const gathered = [], promises = []
        const iterator = designate.reverse(comparator, empty)
        iterator.next(promises, items => {
            for (const item of items) {
                gathered.push(item)
            }
        })
        okay(gathered, [], 'empty')
    }
})
