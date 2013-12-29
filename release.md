### Iterate Across All Records

Keys are now the last argument to the `forward` and `reverse` constructors. When
no key is provided, iteration begins from the left-most record for forward
iterators. When no key is provided for reverse iterators, iteration begins from
the right-most record.

### Issue by Issue

 * Specify key as last parameter to iterator constructor. #20.
 * Iterate backward from the right-most. #18.
 * Iterate forward from left-most record. #17.
