'use strict';

// Load Modules
import poolManager from 'mysql-connection-pool-manager';
import {} from './lib';

// Build instance
class DBSync {
  // Initial constructor
  constructor(db, options = {}) {
    // Declare variables
    this.currentDBState = {};
    this.configDBState = {};
    // Bind methods
    this.sync = this.sync.bind(this);
    // Default settings
    this.config = Object.assign(
      {
        idleCheckInterval: 1000,
        maxConnextionTimeout: 30000,
        idlePoolTimeout: 3000,
        errorLimit: 5,
        preInitDelay: 50,
        sessionTimeout: 60000,
        mySQLSettings: db,
        databaseKey: 'Database',
        fieldKey: 'Name',
        userKey: 'User',
        fieldKeyType: 'Type',
        fieldKeyDefault: 'Default',
        fieldKeyKey: 'Key',
        fieldKeyExtra: 'Extra',
        filePath: undefined
      },
      options
    );
    // Assign mysql settings
    this.mysqli = poolManager(this.config);
  }

  // Syncronise the database and the configuration
  sync() {
    if (!this.config.filePath) {
      throw new Error(`The file path is not defined!`);
    }
  }
}

// Exports
module.exports = options => new DBSync(options);
