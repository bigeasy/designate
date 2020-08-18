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
        const visited = {}
        for await (const items of designate.forward(comparator, forward, versions, visited)) {
            for (const item of items) {
                gathered.push(item)
            }
        }
        okay({
            items: gathered,
            visited: Object.keys(visited).sort()
        }, {
            items: expected,
            visited: [ '1', '2', '3' ]
        }, 'forward')
    }

    {
        const visited = {}
        const reverse = advance.reverse([ items ])
        gathered.length = 0
        for await (const items of designate.reverse(comparator, reverse, versions, visited)) {
            for (const item of items) {
                gathered.push(item)
            }
        }
        okay({
            items: gathered,
            visited: Object.keys(visited).sort()
        }, {
            items: expected.slice().reverse(),
            visited: [ '1', '2', '3' ]
        }, 'reverse')
    }

    {
        const visited = {}
        const empty = advance.forward([])
        gathered.length = 0
        for await (const items of designate.forward(comparator, empty, versions, visited)) {
            for (const item of items) {
                gathered.push(item)
            }
        }
        okay({
            items: gathered,
            visited: visited
        }, {
            items: [],
            visited: {}
        }, 'empty')
    }
})
