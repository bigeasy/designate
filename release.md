### Off By One

The underlying library Riffle was incorrectly beginning from the first record
greater than the sought key instead of the first record less than the sought key
when the key cannot be found. This ruins our reverse since we use a key that can
never be found, one with a version number that is the maximum version number.

### Issue by Issue

 * Upgrade Riffle to 0.0.4. #26.
 * Reverse iterator stops at one past the key. #25.
