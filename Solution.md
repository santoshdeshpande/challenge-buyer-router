### Code Challenge

This is a solution to the code challenge as described in the README.md

### Assumptions

* Redis server is available on the local machine where the tests are
  being run. This can be improved to read from a config file later on
* Checks for malformed buyer requests are not handled such as missing
  keys or data
* No performance tests have been done against the code

### Solution

* Multiple buckets are created to hold various pieces of information are
  described below
* Each buyers complete json is stored keyed to the buyer:id key. So for
  buyer with id 'c' the entire information can be found in buyer:c
* Each of the offers for a buyer is stored using a key as buyer:id$index
  where $index is the position in the offer list. This is to quickly
narrow down the offer that is most suitable. 
* Each of the various criteria is used as a key to store the various
  members belonging to that key i.e as a set. For example device:desktop
returns all buyer:id$index combinations that have desktop as a device. 
* Set intersection is used to find out members who satisfy the query in
  the route and then sorted by value to redirect to the correct location

### Files

* lib/server.js - Contains the server code
* lib/redis-client.js - Contains the interaction with redis. This can be
  used to keep the methods same and replaced with a different store as
all the actions pertaining to redis is abstracted here.
