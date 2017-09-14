"use strict";

// Build instance
class Instance {

  // Initial constructor
  constructor(options) {
    // Declare variables
    this.currentDbState = {};
    this.configDbState = {};
  }

}

// Exports
module.exports = (options) => new Instance(options);
