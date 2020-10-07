module.exports = function (comparator, undesignated) {
    let done = false, previous = null
    const iterator = {
        done: false,
        next (promises, consume, terminator = iterator) {
            undesignated.next(promises, items => {
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
