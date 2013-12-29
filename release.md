Release notes for pending release 0.0.2.

### Accumulate Visited Versions

Both the forward and reverse iterators now require an empty object as a final
parameter to their constructor. The empty object is used as a set recording each
version encountered as a key with a boolean value of `true`.

[Amalgamate](https://github.com/bigeasy/amalgamate) reports the set of visited
versions after merging an iterator into a primary tree so that an application
can amend it's housekeeping to mark the versions in the set as merged.

### Iterate Across Ignored Versions

Although it was already implemented, it was not tested.

### Issue by Issue

 * Accumulate visited versions. #15.
 * Forward iterate across invalid versions. #9.
 * Reverse iterate across invalid versions. #8.
