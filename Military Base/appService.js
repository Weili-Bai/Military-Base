const oracledb = require('oracledb');
const fs = require('fs');
const loadEnvFile = require('./utils/envUtil');

const envVariables = loadEnvFile('./.env');

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
  user: envVariables.ORACLE_USER,
  password: envVariables.ORACLE_PASS,
  connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
  poolMin: 1,
  poolMax: 3,
  poolIncrement: 1,
  poolTimeout: 60
};

// initialize connection pool
async function initializeConnectionPool() {
  try {
    await oracledb.createPool(dbConfig);
    console.log('Connection pool started');
  } catch (err) {
    console.error('Initialization error: ' + err.message);
  }
}

async function closePoolAndExit() {
  console.log('\nTerminating');
  try {
    await oracledb.getPool().close(10); // 10 seconds grace period for connections to finish
    console.log('Pool closed');
    process.exit(0);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

initializeConnectionPool();

process
  .once('SIGTERM', closePoolAndExit)
  .once('SIGINT', closePoolAndExit);

// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
  let connection;
  try {
    connection = await oracledb.getConnection();
    return await action(connection);
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function testOracleConnection() {
  return await withOracleDB(async (connection) => true).catch(() => false);
}

async function runInitScript() {
  return await withOracleDB(async (connection) => {
    const sqlScript = fs.readFileSync('./init.sql', 'utf-8');
    const statements = sqlScript.split(';').map(stmt => stmt.trim()).filter(stmt => stmt.length > 0);
    for (const stmt of statements) {
      try {
        await connection.execute(stmt);
      } catch (e) {
        console.error("Error executing statement:", stmt, e.message);
      }
    }
    await connection.commit();
    return true;
  });
}

async function insertGetBudget(budgetDocumentNumber, budgetDate, budgetAmount, budgetDescription, baseLocation) {
  return await withOracleDB(async (connection) => {
    const baseCheck = await connection.execute(
      `SELECT * FROM Base WHERE BaseLocation = :baseLocation`,
      [baseLocation]
    );
    if (baseCheck.rows.length === 0) {
      await connection.execute(
        `INSERT INTO Base (BaseLocation, BaseAreaSize) VALUES (:baseLocation, :defaultArea)`,
        { baseLocation: baseLocation, defaultArea: 100 },
        { autoCommit: true }
      );
    }
    const result = await connection.execute(
      `INSERT INTO GetBudget (BudgetDocumentNumber, BudgetDate, BudgetAmount, BudgetDescription, BaseLocation)
       VALUES (:budgetDocumentNumber, TO_DATE(:budgetDate, 'YYYY-MM-DD'), :budgetAmount, :budgetDescription, :baseLocation)`,
      {
        budgetDocumentNumber: budgetDocumentNumber,
        budgetDate: budgetDate,
        budgetAmount: budgetAmount,
        budgetDescription: budgetDescription,
        baseLocation: baseLocation
      },
      { autoCommit: true }
    );
    return result.rowsAffected && result.rowsAffected > 0;
  }).catch(err => {
    console.error("Error in insertGetBudget:", err);
    throw err;
  });
}

async function updateGetBudget(budgetDocumentNumber, budgetDate, budgetAmount, budgetDescription, baseLocation) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      `UPDATE GetBudget
       SET BudgetDate = TO_DATE(:budgetDate, 'YYYY-MM-DD'),
           BudgetAmount = :budgetAmount,
           BudgetDescription = :budgetDescription,
           BaseLocation = :baseLocation
       WHERE BudgetDocumentNumber = :budgetDocumentNumber`,
      {
        budgetDate: budgetDate,
        budgetAmount: budgetAmount,
        budgetDescription: budgetDescription,
        baseLocation: baseLocation,
        budgetDocumentNumber: budgetDocumentNumber
      },
      { autoCommit: true }
    );
    return result.rowsAffected && result.rowsAffected > 0;
  }).catch(err => {
    console.error("Error in updateGetBudget:", err);
    throw err;
  });
}

async function deleteDuty(dutyID) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      `DELETE FROM Duty WHERE DutyID = :dutyID`,
      { dutyID: dutyID },
      { autoCommit: true }
    );
    return result.rowsAffected && result.rowsAffected > 0;
  }).catch(err => {
    console.error("Error in deleteDuty:", err);
    throw err;
  });
}

async function selectSoldier(conditions) {
  const allowedAttributes = ["SoldierID", "Rank", "Sex", "ServiceYear", "Age", "SoldierName"];
  const allowedOperators = ["=", "!=", "<", "<=", ">", ">=", "LIKE"];
  let query = "SELECT * FROM Soldier";
  const binds = {};
  if (conditions && conditions.length > 0) {
    const conds = [];
    conditions.forEach((cond, index) => {
      if (!allowedAttributes.includes(cond.attribute)) {
        throw new Error("Invalid attribute: " + cond.attribute);
      }
      if (!allowedOperators.includes(cond.operator)) {
        throw new Error("Invalid operator: " + cond.operator);
      }
      const bindName = "val" + index;
      conds.push((index > 0 ? cond.connector + " " : "") + `${cond.attribute} ${cond.operator} :${bindName}`);
      binds[bindName] = cond.value;
    });
    query += " WHERE " + conds.join(" ");
  }
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(query, binds);
    return { rows: result.rows, columns: result.metaData };
  });
}

async function projectSoldier(attributes) {
  const allowed = ["SoldierID", "Rank", "Sex", "ServiceYear", "Age", "SoldierName"];
  if (!attributes || attributes.length === 0) {
    throw new Error("No attributes selected");
  }
  const selected = attributes.filter(attr => allowed.includes(attr));
  if (selected.length === 0) {
    throw new Error("No valid attributes selected");
  }
  const query = "SELECT " + selected.join(", ") + " FROM Soldier";
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(query);
    return { rows: result.rows, columns: result.metaData };
  });
}

async function joinSoldierCombat(award) {
  return await withOracleDB(async (connection) => {
    const query = `
      SELECT s.SoldierID, s.SoldierName, s.Rank, h.Award, h.CombatRecordDescription
      FROM Soldier s
      JOIN HasCombatRecord h ON s.SoldierID = h.SoldierID
      WHERE h.Award = :award
    `;
    const result = await connection.execute(query, { award });
    return { rows: result.rows, columns: result.metaData };
  });
}

async function aggregationSoldier() {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(`
      SELECT Rank, COUNT(*) AS numSoldiers, AVG(Age) AS avgAge
      FROM Soldier
      GROUP BY Rank
    `);
    return { rows: result.rows, columns: result.metaData };
  });
}

async function aggregationHavingSoldier() {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(`
      SELECT Rank, COUNT(*) AS numSoldiers, AVG(Age) AS avgAge
      FROM Soldier
      GROUP BY Rank
      HAVING COUNT(*) > 1
    `);
    return { rows: result.rows, columns: result.metaData };
  });
}

async function nestedAggregationSoldier() {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(`
      SELECT Rank, AVG(Age) AS avgAge
      FROM Soldier
      GROUP BY Rank
      HAVING AVG(Age) <= ALL (
        SELECT AVG(Age)
        FROM Soldier
        GROUP BY Rank
      )
    `);
    return { rows: result.rows, columns: result.metaData };
  });
}

async function divisionSoldier() {
  return await withOracleDB(async (connection) => {
    const query = `
      SELECT S.SoldierID, S.SoldierName
      FROM Soldier S
      WHERE NOT EXISTS (
          SELECT D.DutyID
          FROM Duty D
          WHERE NOT EXISTS (
              SELECT W.DutyID
              FROM WorkAs W
              WHERE W.SoldierID = S.SoldierID
                AND W.DutyID = D.DutyID
          )
      )
    `;
    const result = await connection.execute(query);
    return { rows: result.rows, columns: result.metaData };
  });
}


async function fetchTableData(tableName) {
  const allowedTables = [
    "Duty", "Soldier", "Base", "GetBudget", "HasCombatRecord",
    "ContainsBuildingAndFields", "Vehicle", "Weapon", "Manage",
    "Use", "MountsOn", "Ammo", "Drive", "Barracks", "Storage",
    "IsIn", "RetiredSoldier", "DeadSoldier", "ActiveSoldier",
    "EarnsSalary", "Maintains", "Keep", "Shoot", "WorkAs", "Store"
  ];
  if (!allowedTables.includes(tableName)) {
    throw new Error("Invalid table name");
  }
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(`SELECT * FROM ${tableName}`);
    return { rows: result.rows, columns: result.metaData };
  });
}

module.exports = {
  testOracleConnection,
  fetchTableData,
  insertGetBudget,
  updateGetBudget,
  deleteDuty,
  runInitScript,
  selectSoldier,
  projectSoldier,
  joinSoldierCombat,
  aggregationSoldier,
  aggregationHavingSoldier,
  nestedAggregationSoldier,
  divisionSoldier
};
