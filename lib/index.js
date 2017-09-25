"use strict";

// FUNCTION: Create Database(s)
export default function CreateDatabase(dbname, callback) {

  // Variables
  let databaseList = [];

  // Create Database
  this.mysqli(`CREATE DATABASE IF NOT EXISTS ${dbname}`, () => {
    this.mysqli(`SHOW DATABASES`, (e) => {
      for (let index in e) {
        if (e.hasOwnProperty(index)) {
          databaseList.push(e[index][this.config.databaseKey]);
        }
      }
      if (databaseList.includes(dbname)) {
        console.log(`Database ${dbname} Created Successfully`);
        if (typeof(callback) === 'function') {
          return callback(0, `OPERATION PASSED - Database ${dbname} Created Successfully`);
        }
      } else {
        console.log(`Database NOT Created Successfully`);
        if (typeof(callback) === 'function') {
          return callback(1, `OPERATION FAILED - Database ${dbname} NOT Created Successfully`);
        }
      }
    });
  });

}

// FUNCTION: Delete Database
export default function DeleteDatabase(dbname, callback) {

  // Variables
  let databaseList = [];

  // Create Database
  this.mysqli(`DROP DATABASE IF EXISTS ${dbname}`, () => {
    this.mysqli(`SHOW DATABASES`, (e) => {
      for (let index in e) {
        if (e.hasOwnProperty(index)) {
          databaseList.push(e[index][this.config.databaseKey]);
        }
      }
      if (!databaseList.includes(dbname)) {
        console.log(`Database ${dbname} Deleted Successfully`);
        if (typeof(callback) === 'function') {
          return callback(0, `OPERATION PASSED - Database ${dbname} Deleted Successfully`);
        }
      } else {
        console.log(`Database NOT Deleted Successfully`);
        if (typeof(callback) === 'function') {
          return callback(1, `OPERATION FAILED - Database ${dbname} NOT Deleted Successfully`);
        }
      }
    });
  });

}

// FUNCTION: Create Table
export default function CreateTable(dbname, tblname, fields, callback) {

  // Table Variable Build
  let tableList = [];
  let tableInsertionList;
  let tableFieldDbName = `Tables_in_${dbname}`;

  // Process Field Insertion SQL
  for (let i in fields) {
    if (fields.hasOwnProperty(i)) {
      tableInsertionList += ` \`${i}\` ${fields[i]},`;
    }
  }

  // Post
  tableInsertionList = tableInsertionList ? tableInsertionList.replace(/undefined|,$|^ /gi, '') : '';

  // Create Table
  if (tableInsertionList) {
    this.mysqli(`USE ${dbname} CREATE TABLE IF NOT EXISTS ${tblname} ${tableInsertionList}`, () => {
      this.mysqli(`USE ${dbname} SHOW TABLES`, (e) => {
        for (let index in e) {
          if (e.hasOwnProperty(index)) {
            tableList.push(e[index][tableFieldDbName]);
          }
        }
        if (tableList.includes(tblname)) {
          console.log(`Table ${tblname} Created Successfully`);
          if (typeof(callback) === 'function') {
            return callback(0, `OPERATION PASSED - Table ${tblname} Created Successfully`);
          }
        } else {
          console.log(`Table ${tblname} NOT Created Successfully`);
          if (typeof(callback) === 'function') {
            return callback(1, `OPERATION FAILED - Table ${tblname} NOT Created Successfully`);
          }
        }
      });
    });
  } else {
    console.log(`Table ${tblname} NOT Created Successfully - No Fields Defined`);
    if (typeof(callback) === 'function') {
      return callback(1, `OPERATION FAILED - Table ${tblname} NOT Created Successfully`);
    }
  }

}

// FUNCTION: Delete Table
export default function DeleteTable(dbname, tblname, callback) {

  // Table Variable Build
  let tableList = [];
  let tableFieldDbName = `Tables_in_${dbname}`;

  // Create Table
  this.mysqli(`USE ${dbname} DROP TABLE IF EXISTS ${tblname}`, () => {
    this.mysqli(`USE ${dbname} SHOW TABLES`, (e) => {
      for (let index in e) {
        if (e.hasOwnProperty(index)) {
          tableList.push(e[index][tableFieldDbName]);
        }
      }
      if (!tableList.includes(tblname)) {
        console.log(`Table ${tblname} Deleted Successfully`);
        if (typeof(callback) === 'function') {
          return callback(0, `OPERATION PASSED - Table ${tblname} Deleted Successfully`);
        }
      } else {
        console.log(`Table ${tblname} NOT Deleted Successfully`);
        if (typeof(callback) === 'function') {
          return callback(1, `OPERATION FAILED - Table ${tblname} NOT Deleted Successfully`);
        }
      }
    });
  });

}

// FUNCTION: Create + Grant Permissions
export default function CreateGrantUserPermissions(user, passwd, dbname, callback) {

  // Super User Credentials
  let sudoUn = this.config.mySQLSettings.username;
  let sudoPw = this.config.mySQLSettings.password;

  // Create & Grant User
  this.mysqli(`GRANT ALL PRIVILEGES ON ${dbname}.* TO ${sudoUn}'@'localhost' IDENTIFIED BY ${sudoPw}`, () => {
    this.mysqli(`CREATE USER IF NOT EXISTS '${user}'@'localhost' IDENTIFIED BY  '${passwd}'`, () => {
      this.mysqli(`GRANT ALL PRIVILEGES ON ${dbname}.* TO  '${user}'@'localhost' IDENTIFIED BY  '${passwd}'`, () => {
        this.mysqli(`FLUSH PRIVILEGES`, () => {
          console.log(`User ${user} + Permissions Created Successfully`);
          if (typeof(callback) === 'function') {
            return callback(0, `OPERATION PASSED - User ${user} + Permissions Created Successfully`);
          }
        });
      });
    });
  });

}

// FUNCTION: Grant Permissions
export default function GrantUserPermissions(user, passwd, dbname, callback) {

  // Create & Grant User
  this.mysqli(`GRANT ALL PRIVILEGES ON ${dbname}.* TO  '${user}'@'localhost' IDENTIFIED BY '${passwd}'`, () => {
    this.mysqli(`FLUSH PRIVILEGES`, () => {
      console.log(`User ${user} Permissions Set Successfully`);
      if (typeof(callback) === 'function') {
        return callback(0, `OPERATION PASSED - User ${user} Created Successfully`);
      }
    });
  });

}

// FUNCTION: Modify Table Field Type
export default function ModifyTableField(dbname, tlbname, field, newtype, callback) {

  // Perform Actions
  ListDatabases((code, dblist) => {
    if (dblist.includes(dbname)) {
      ListTables(dbname, (code, tbllist) => {
        if (tbllist.includes(tlbname)) {
          ListFields(dbname, tlbname, (code, fldList) => {
            let fieldList = [];
            for (let index in fldList) {
              if (fldList.hasOwnProperty(index)) {
                fieldList.push(fldList[index][this.config.fieldKey]);
              }
            }
            if (fieldList.includes(field)) {
              this.mysqli(`USE ${dbname} ALTER TABLE ${tlbname} MODIFY COLUMN ${field} ${newtype}`, () => {
                console.log(`Field ${field} Modified Successfully`);
                if (typeof(callback) === 'function') {
                  return callback(0, `OPERATION PASSED - Field ${field} Modified Successfully`);
                }
              });
            } else {
              console.log(`Field ${field} NOT Modified Successfully. Field Does Not Exist`);
              if (typeof(callback) === 'function') {
                return callback(1, `OPERATION FAILED - Field ${field} NOT Modified Successfully. Field Does Not Exist`);
              }
            }
          });
        } else {
          console.log(`Field ${field} NOT Modified Successfully. Table Does Not Exist`);
          if (typeof(callback) === 'function') {
            return callback(1, `OPERATION FAILED - Field ${field} NOT Modified Successfully. Table Does Not Exist`);
          }
        }
      });
    } else {
      console.log(`Field ${field} NOT Modified Successfully. Database Does Not Exist`);
      if (typeof(callback) === 'function') {
        return callback(1, `OPERATION FAILED - Field ${field} NOT Modified Successfully. Database Does Not Exist`);
      }
    }
  });

}

// FUNCTION: Add Field Name
export default function AddTableField(dbname, tlbname, field, newtype, callback) {

  // Perform Action
  ListDatabases((code, dblist) => {
    if (dblist.includes(dbname)) {
      ListTables(dbname, (code, tbllist) => {
        if (tbllist.includes(tlbname)) {
          ListFields(dbname, tlbname, (code, fldList) => {
            let fieldList = [];
            for (let index in fldList) {
              if (fldList.indexOf(index)) {
                fieldList.push(fldList[index][this.config.fieldKey]);
              }
            }
            if (!fieldList.includes(field)) {
              this.mysqli(`USE ${dbname} ALTER TABLE ${tlbname} ADD COLUMN ${field} ${newtype}`, () => {
                console.log(`Field ${field} Added Successfully`);
                if (typeof(callback) === 'function') {
                  return callback(0, `OPERATION PASSED - Field ${field} Added Successfully`);
                }
              });
            } else {
              console.log(`Field ${field} NOT Added Successfully. Field Already Exists`);
              if (typeof(callback) === 'function') {
                return callback(1, `OPERATION FAILED - Field ${field} NOT Added Successfully. Field Already Exist`);
              }
            }
          });
        } else {
          console.log(`Field ${field} NOT Added Successfully. Table Does Not Exist`);
          if (typeof(callback) === 'function') {
            return callback(1, `OPERATION FAILED - Field ${field} NOT Added Successfully. Table Does Not Exist`);
          }
        }
      });
    } else {
      console.log(`Field ${field} NOT Added Successfully. Database Does Not Exist`);
      if (typeof(callback) === 'function') {
        return callback(1, `OPERATION FAILED - Field ${field} NOT Added Successfully. Database Does Not Exist`);
      }
    }
  });

}

// FUNCTION: Remove Field Name
export default function RemoveTableField(dbname, tlbname, field, callback) {

  // Perform Actions
  ListDatabases((code, dblist) => {
    if (dblist.includes(dbname)) {
      ListTables(dbname, (code, tbllist) => {
        if (tbllist.includes(tlbname)) {
          ListFields(dbname, tlbname, (code, fldList) => {
            let fieldList = [];
            for (let index in fldList) {
              if (fldList.hasOwnProperty(index)) {
                fieldList.push(fldList[index][this.config.fieldKey]);
              }
            }
            if (fieldList.indexOf(field) > -1) {
              this.mysqli(`USE ${dbname} ALTER TABLE ${tlbname} DROP COLUMN ${field}`, () => {
                console.log(`Field ${field} Deleted Successfully`);
                if (typeof(callback) === 'function') {
                  return callback(0, `OPERATION PASSED - Field ${field} Deleted Successfully`);
                }
              });
            } else {
              console.log(`Field ${field} NOT Deleted Successfully. Field Does Not Exist`);
              if (typeof(callback) === 'function') {
                return callback(1, `OPERATION FAILED - Field ${field} NOT Deleted Successfully. Field Does Not Exist`);
              }
            }
          });
        } else {
          console.log(`Field ${field} NOT Deleted Successfully. Table Does Not Exist`);
          if (typeof(callback) === 'function') {
            return callback(1, `OPERATION FAILED - Field ${field} NOT Deleted Successfully. Table Does Not Exist`);
          }
        }
      });
    } else {
      console.log(`Field ${field} NOT Deleted Successfully. Database Does Not Exist`);
      if (typeof(callback) === 'function') {
        return callback(1, `OPERATION FAILED - Field ${field} NOT Deleted Successfully. Database Does Not Exist`);
      }
    }
  });

}

// FUNCTION: List Databases
export default function ListDatabases(callback) {

  // Declare Variables
  let databaseList = [];

  // Modify Table
  this.mysqli(`SHOW DATABASES`, (d) => {
    for (let index in d) {
      if (d.hasOwnProperty(index)) {
        databaseList.push(d[index][this.config.databaseKey]);
      }
    }
    if (typeof(callback) === 'function') {
      return callback(0, databaseList);
    }
  });

}

// FUNCTION: Database Information
export default function ListTablesFields(dbname, callback) {

  // Declare Variables
  let tableDatabase = dbname;
  let tableFieldList = {};
  let tableFieldName = `Tables_in_${tableDatabase}`;

  // Modify Table
  this.mysqli(`USE table Database SHOW TABLES`, (d) => {

    // Declare Field Function
    const GetTableFieldDetails = (table) => {
      let tableName = table;
      ListFields(tableDatabase, table, (code, fldList) => {
        fldList.forEach((elementField) => {
          let LastTable = Object.keys(tableFieldList)[Object.keys(tableFieldList).length - 1];
          let CurrentTable = tableName;
          let LastField = fldList[fldList.length - 1].Name;
          let CurrentField = elementField.Name;
          tableFieldList[tableName][elementField.Name] = elementField.Type;
          if ((CurrentTable === LastTable) && (CurrentField === LastField)) {
            return callback(0, tableFieldList);
          }
        });
      });
    };

    // Build Operations
    for (let i in d) {
      if (d.hasOwnProperty(i)) {
        tableFieldList[d[i][tableFieldName]] = {};
      }
    }

    // Execute operations
    for (let j in tableFieldList) {
      if (tableFieldList.hasOwnProperty(j)) {
        GetTableFieldDetails(j, callback);
      }
    }

  });

}

// FUNCTION: List Tables
export default function ListTables(dbname, callback) {

  // Declare Variables
  let tableDatabase = dbname;
  let tableList = [];

  // Modify Table
  this.mysqli(`USE tableDatabase SHOW TABLES`, (d) => {
    let tableFieldName = 'Tables_in_' + tableDatabase;
    for (let index in d) {
      if (d.hasOwnProperty(index)) {
        tableList.push(d[index][tableFieldName]);
      }
    }
    if (typeof(callback) === 'function') {
      return callback(0, tableList, dbname);
    }
  });

}

// FUNCTION: List Fields
export default function ListFields(dbname, tblname, callback) {

  // Declare Variables
  let fieldList = [];

  // List Fields
  this.mysqli(`USE ${dbname} DESCRIBE ${tblname}`, (d) => {
    for (let index in d) {
      if (d.hasOwnProperty(index)) {
        fieldList.push({
          Name: d[index][this.config.fieldKey],
          Type: d[index][this.config.fieldKeyType],
          Default: d[index][this.config.fieldKeyDefault],
          Key: d[index][this.config.fieldKeyKey],
          Extra: d[index][this.config.fieldKeyExtra]
        });
      }
    }
    if (typeof(callback) === 'function') {
      return callback(0, fieldList, tblname, dbname);
    }
  });

}

// FUNCTION: List Users
export default function ListUsers(callback) {

  // Declare Variables
  let UserList = [];

  // List Users
  this.mysqli(`SELECT \`User\` FROM \`mysql.user\``, (d) => {
    for (let index in d) {
      if (d.hasOwnProperty(index)) {
        UserList.push(d[index][this.config.userKey]);
      }
    }
    if (typeof(callback) === 'function') {
      return callback(0, UserList);
    }
  });

}
