module.exports = function (comparator, paginator) {
    const iterator = paginator[Symbol.asyncIterator]()
    let done = false, previous = null
    return {
        [Symbol.asyncIterator]: function () {
            return this
        },
        next: async function () {
            const next = await iterator.next()
            if (next.done) {
                return { done: true, value: null }
            }
            const gathered = []
            for (const item of next.value) {
                if (
                    previous == null || // It will be true just once, but hey.
                    comparator(previous.key.value, item.key.value) != 0
                ) {
                    gathered.push(item)
                    previous = item
                }
            }
            return { done: false, value: gathered }
        }
    }
}
