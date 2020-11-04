require('proof')(4, async okay => {
    const advance = require('advance')
    const designate = require('..')
    const ascension = require('ascension')

    const items = [{
        key: [ 'a', 3 ]
    }, {
        key: [ 'a', 2 ]
    }, {
        key: [ 'a', 1 ]
    }, {
        key: [ 'd', 1 ]
    }]

    const expected = [{
        key: [ 'a', 3 ]
    }, {
        key: [ 'd', 1 ]
    }]

    const comparator = ascension([ String ], object => object)

    {
        const forward = advance([ items ])
        const gathered = [], promises = []
        const iterator = designate(comparator, forward)
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
        const reverse = advance([ items ], { reverse: true })
        const gathered = [], promises = []
        const iterator = designate(comparator, reverse)
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
        const empty = advance([])
        const gathered = [], promises = []
        const iterator = designate(comparator, empty)
        iterator.next(promises, items => {
            for (const item of items) {
                gathered.push(item)
            }
        })
        okay(gathered, [], 'empty')
    }

    {
        const comparator = ascension([ String, Number ], object => object)
        const mapped = advance([[{
            key: [[ 'a' ]],
            value: [[ 'a' ]],
            items: [{
                key: [[ 'a', 0 ], 2 ]
            }, {
                key: [[ 'a', 0 ], 1 ]
            }, {
                key: [[ 'a', 1 ], 0 ]
            }]
        }], [{
            key: [[ 'b' ]],
            value: [[ 'b' ]],
            items: []
        }]], { map: true })
        const gathered = []
        const iterator = designate(comparator, mapped)
        while (! iterator.done) {
            iterator.next(null, items => {
                for (const item of items) {
                    gathered.push(item)
                }
            })
        }
        okay(gathered, [{
            key: [[ 'a' ]],
            value: [[ 'a' ]],
            items: [{
                key: [[ 'a', 0 ], 2 ],
            }, {
                key: [[ 'a', 1 ], 0 ],
            }]
        }, {
            key: [[ 'b' ]],
            value: [[ 'b' ]],
            items: []
        }], 'mapped')
    }
})
