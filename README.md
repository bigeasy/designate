Iterate an MVCC b-tree cursor selecting the most recent version of a record.

Designate takes a map of valid versions. It will skip records that do not have a
version in the valid version map, then select the greatest version from the
available versions. It also mainatins a list of versions visisted during the
iteration. This is used to implement multi-version concurrency control in a
Strata b-tree and is part of the [MVCC](https://github.com/bigeasy/mvcc) library
and the [Strata](https://github.com/bigeasy/strata) universe.
