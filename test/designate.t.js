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

    {
        const comparator = ascension([ String, Number ], object => object)
        const mapped = advance.forward([[{
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
        }]])
        const gathered = []
        const iterator = designate.map(comparator, mapped)
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
