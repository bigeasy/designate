module.exports = function (forward, comparator, paginator, versions) {
    const iterator = paginator[Symbol.asyncIterator]()
    let done = false, candidate = null
    return {
        [Symbol.asyncIterator]: function () {
            return this
        },
        next: async function () {
            if (done) {
                return { done: true, value: null }
            }
            const next = await iterator.next()
            if (next.done) {
                done = true
                if (candidate == null) {
                    return { done: true, value: null }
                }
                return { done: false, value: [ candidate ] }
            }
            const gathered = []
            for (const item of next.value) {
                if (versions[item.key.version]) {
                    if (candidate == null) { // It will be true just once, but hey.
                        candidate = item
                    } else if (comparator(candidate.key.value, item.key.value) != 0) {
                        gathered.push(candidate)
                        candidate = item
                    }
                    if (forward) {
                        candidate = item
                    }
                }
            }
            return { done: false, value: gathered }
        }
    }
}
