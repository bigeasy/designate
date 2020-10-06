module.exports = function (comparator, nested) {
    let candidate = null
    const scope = { done: false }
    const iterator = {
        done: false,
        next (promises, consume, terminator = iterator) {
            if (scope.done) {
                terminator.done = true
            } else {
                nested.next(promises, items => {
                    const gathered = []
                    for (const item of items) {
                        if (
                            candidate != null && // It will be true just once, but hey.
                            comparator(candidate.key.value, item.key.value) != 0
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
