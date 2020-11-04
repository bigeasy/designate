const mvcc = require('mvcc')

module.exports = function (comparator, source) {
    switch (source.type) {
    case mvcc.FORWARD: {
            let done = false, previous = null
            const iterator = {
                done: false,
                next (promises, consume, terminator = iterator) {
                    source.next(promises, items => {
                        const gathered = []
                        for (const item of items) {
                            if (
                                previous == null || // It will be true just once, but hey.
                                comparator(previous.key[0], item.key[0]) != 0
                            ) {
                                gathered.push(item)
                                previous = item
                            }
                        }
                        consume(gathered)
                    }, terminator)
                }
            }
            return iterator
        }
        break
    case mvcc.REVERSE: {
            let candidate = null
            const scope = { done: false }
            const iterator = {
                done: false,
                next (trampoline, consume, terminator = iterator) {
                    if (scope.done) {
                        terminator.done = true
                    } else {
                        source.next(trampoline, items => {
                            const gathered = []
                            for (const item of items) {
                                if (
                                    candidate != null && // It will be true just once, but hey.
                                    comparator(candidate.key[0], item.key[0]) != 0
                                ) {
                                    gathered.push(candidate)
                                }
                                candidate = item
                            }
                            consume(gathered)
                        }, {
                            set done (done) {
                                if (candidate != null) {
                                    consume([ candidate ])
                                }
                                scope.done = done
                            }
                        })
                    }
                }
            }
            return iterator
        }
        break
    case mvcc.MAP: {
            let done = false, previous = null
            const iterator = {
                done: false,
                next (trampoline, consume, terminator = iterator) {
                    source.next(trampoline, items => {
                        for (const outer of items) {
                            const filtered = []
                            let previous = null
                            for (const inner of outer.items) {
                                if (
                                    previous == null ||
                                    comparator(previous.key[0], inner.key[0]) != 0
                                ) {
                                    filtered.push(inner)
                                }
                                previous = inner
                            }
                            outer.items = filtered
                        }
                        consume(items)
                    }, terminator)
                }
            }
            return iterator
        }
        break
    }
}
