module.exports = function (comparator, nested) {
    let done = false, previous = null
    const iterator = {
        done: false,
        next (promises, consume, terminator = iterator) {
            nested.next(promises, items => {
                const gathered = []
                for (const item of items) {
                    if (
                        previous == null || // It will be true just once, but hey.
                        comparator(previous.key.value, item.key.value) != 0
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
