const mongoose = require('mongoose');
const assert = require('assert');

describe('MongoDB Docker', function() {
  it('should connect to the database', function(done) {
    this.timeout(5000); // increase timeout to 5000ms
    mongoose.connect('mongodb://root:example@mongo:27017/', { useNewUrlParser: true, useUnifiedTopology: true });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
      assert.equal(db.readyState, 1);
      done();
    });
  });
});

