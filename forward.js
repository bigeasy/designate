const designate = require('./designate')

module.exports = function (comparator, iterator, versions, visited) {
    return designate(true, comparator, iterator, versions, visited)
}
