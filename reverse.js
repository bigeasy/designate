module.exports = function (comparator, undesignated) {
    let candidate = null
    const scope = { done: false }
    const iterator = {
        done: false,
        next (promises, consume, terminator = iterator) {
            if (scope.done) {
                terminator.done = true
            } else {
                undesignated.next(promises, items => {
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
