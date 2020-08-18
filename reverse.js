const designate = require('./designate')

module.exports = function (comparator, iterator, versions, visited) {
    return designate(false, comparator, iterator, versions, visited)
}
