[![Actions Status](https://github.com/bigeasy/designate/workflows/Node%20CI/badge.svg)](https://github.com/bigeasy/designate/actions)
[![codecov](https://codecov.io/gh/bigeasy/designate/branch/master/graph/badge.svg)](https://codecov.io/gh/bigeasy/designate)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Iterate an MVCC b-tree cursor selecting the most recent version of a record.

| What          | Where                                         |
| --- | --- |
| Discussion    | https://github.com/bigeasy/designate/issues/1 |
| Documentation | https://bigeasy.github.io/designate           |
| Source        | https://github.com/bigeasy/designate          |
| Issues        | https://github.com/bigeasy/designate/issues   |
| CI            | https://travis-ci.org/bigeasy/designate       |
| Coverage:     | https://codecov.io/gh/bigeasy/designate       |
| License:      | MIT                                           |


```
npm install designate
```

Designate takes a map of valid versions. It will skip records that do not have a
version in the valid version map, then select the greatest version from the
available versions. It also mainatins a list of versions visisted during the
iteration. This is used to implement multi-version concurrency control in a
Strata b-tree and is part of the [MVCC](https://github.com/bigeasy/mvcc) library
and the [Strata](https://github.com/bigeasy/strata) universe.
