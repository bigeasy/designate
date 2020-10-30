module.exports = function (comparator, undesignated) {
    let done = false, previous = null
    const iterator = {
        done: false,
        next (trampoline, consume, terminator = iterator) {
            undesignated.next(trampoline, items => {
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
