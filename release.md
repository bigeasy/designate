### Dependency Upgrades

Upgraded [Riffle](https://github.com/bigeasy/riffle) and
[Strata](https://github.com/bigeasy/strata). The project MVCC has been converted
into module that is a collection of other module, including this one. The
functions that we were using in MVCC have been moved into
[Revise](https://github.com/bigeasy/revise), so we've replaced the MVCC
dependency with Revise.

### Issue by Issue

 * Replace MVCC with Revise. #23.
 * Upgrade Riffle to 0.0.3. #21.
