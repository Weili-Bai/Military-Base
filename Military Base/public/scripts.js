/*
 * These functions below are for various webpage functionalities. 
 * Each function serves to process data on the frontend:
 *      - Before sending requests to the backend.
 *      - After receiving responses from the backend.
 * 
 * To tailor them to your specific needs,
 * adjust or expand these functions to match both your 
 *   backend endpoints 
 * and 
 *   HTML structure.
 * 
 */


// This function checks the database connection and updates its status on the frontend.
async function checkDbConnection() {
  const statusElem = document.getElementById('dbStatus');
  const loadingGifElem = document.getElementById('loadingGif');

  const response = await fetch('/check-db-connection', {
      method: "GET"
  });

  // Hide the loading GIF once the response is received.
  loadingGifElem.style.display = 'none';
  // Display the statusElem's text in the placeholder.
  statusElem.style.display = 'inline';

  response.text()
  .then((text) => {
      statusElem.textContent = text;
  })
  .catch((error) => {
      statusElem.textContent = 'connection timed out';  // Adjust error handling if required.
  });
}

async function runInitScript() {
  try {
    const response = await fetch('/run-init', { method: 'POST' });
    const responseData = await response.json();
    const msgElem = document.getElementById('runInitMsg');
    if (responseData.success) {
      msgElem.textContent = "Database initialized successfully!";
    } else {
      msgElem.textContent = "Error: " + (responseData.error || "Initialization failed");
    }
  } catch (err) {
    console.error("Error in runInitScript:", err);
  }
}

async function insertGetBudgetRecord(event) {
  event.preventDefault();
  const docNum = document.getElementById('insertBudgetDocNum').value;
  const budgetDate = document.getElementById('insertBudgetDate').value;
  const budgetAmount = document.getElementById('insertBudgetAmount').value;
  const budgetDescription = document.getElementById('insertBudgetDescription').value;
  const baseLocation = document.getElementById('insertBudgetBaseLocation').value;
  try {
    const response = await fetch('/insert-getbudget', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        budgetDocumentNumber: docNum,
        budgetDate: budgetDate,
        budgetAmount: budgetAmount,
        budgetDescription: budgetDescription,
        baseLocation: baseLocation
      })
    });
    const responseData = await response.json();
    const msgElem = document.getElementById('insertBudgetResultMsg');
    if (responseData.success) {
      msgElem.textContent = "GetBudget record inserted successfully!";
    } else {
      msgElem.textContent = "Error: " + (responseData.error || "Insertion failed");
    }
  } catch (err) {
    console.error("Error in insertGetBudgetRecord:", err);
  }
}

async function updateGetBudgetRecord(event) {
  event.preventDefault();
  const budgetDocNum = document.getElementById('updateBudgetDocNum').value;
  const newBudgetDate = document.getElementById('updateBudgetDate').value;
  const newBudgetAmount = document.getElementById('updateBudgetAmount').value;
  const newBudgetDescription = document.getElementById('updateBudgetDescription').value;
  const newBaseLocation = document.getElementById('updateBudgetBaseLocation').value;
  try {
    const response = await fetch('/update-getbudget', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        budgetDocumentNumber: budgetDocNum,
        budgetDate: newBudgetDate,
        budgetAmount: newBudgetAmount,
        budgetDescription: newBudgetDescription,
        baseLocation: newBaseLocation
      })
    });
    const responseData = await response.json();
    const msgElem = document.getElementById('updateBudgetResultMsg');
    if (responseData.success) {
      msgElem.textContent = "GetBudget record updated successfully!";
    } else {
      msgElem.textContent = "Error: " + (responseData.error || "Update failed");
    }
  } catch (err) {
    console.error("Error in updateGetBudgetRecord:", err);
  }
}

async function deleteDutyRecord(event) {
  event.preventDefault();
  const dutyID = document.getElementById('deleteDutyID').value;
  try {
    const response = await fetch('/delete-duty', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dutyID: dutyID })
    });
    const responseData = await response.json();
    const msgElem = document.getElementById('deleteDutyResultMsg');
    if (responseData.success) {
      msgElem.textContent = "Duty record deleted successfully!";
    } else {
      msgElem.textContent = "Error: " + (responseData.error || "Deletion failed");
    }
  } catch (err) {
    console.error("Error in deleteDutyRecord:", err);
  }
}

function addConditionBlock() {
  const container = document.getElementById("conditionsContainer");
  const newBlock = document.createElement("div");
  newBlock.classList.add("conditionBlock");

  // Connector dropdown for conditions after the first
  const connectorSelect = document.createElement("select");
  connectorSelect.classList.add("connector");
  const andOption = document.createElement("option");
  andOption.value = "AND";
  andOption.textContent = "AND";
  const orOption = document.createElement("option");
  orOption.value = "OR";
  orOption.textContent = "OR";
  connectorSelect.appendChild(andOption);
  connectorSelect.appendChild(orOption);
  newBlock.appendChild(connectorSelect);

  // Attribute dropdown
  const attrSelect = document.createElement("select");
  attrSelect.classList.add("attribute");
  ["SoldierID", "Rank", "Sex", "ServiceYear", "Age", "SoldierName"].forEach(attr => {
    const option = document.createElement("option");
    option.value = attr;
    option.textContent = attr;
    attrSelect.appendChild(option);
  });
  newBlock.appendChild(attrSelect);

  // Operator dropdown
  const opSelect = document.createElement("select");
  opSelect.classList.add("operator");
  ["=", "!=", "<", "<=", ">", ">="].forEach(op => {
    const option = document.createElement("option");
    option.value = op;
    option.textContent = op;
    opSelect.appendChild(option);
  });
  newBlock.appendChild(opSelect);

  // Value input
  const valInput = document.createElement("input");
  valInput.type = "text";
  valInput.classList.add("value");
  valInput.placeholder = "Value";
  newBlock.appendChild(valInput);

  container.appendChild(newBlock);
}

async function selectSoldierRecords(event) {
  event.preventDefault();
  const conditionBlocks = document.querySelectorAll("#conditionsContainer .conditionBlock");
  const conditions = [];
  conditionBlocks.forEach((block, index) => {
    const attribute = block.querySelector(".attribute").value;
    const operator = block.querySelector(".operator").value;
    const value = block.querySelector(".value").value;
    let connector = "";
    if (index > 0) {
      connector = block.querySelector(".connector").value;
    }
    conditions.push({ attribute, operator, value, connector });
  });
  try {
    const response = await fetch('/select-soldier', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conditions })
    });
    const responseData = await response.json();
    const resultDiv = document.getElementById("selectSoldierResult");
    resultDiv.innerHTML = "";
    if (responseData.success) {
      const data = responseData.data.rows;
      const columns = responseData.data.columns;
      if (data.length === 0) {
        resultDiv.textContent = "No matching records found.";
        return;
      }
      const table = document.createElement("table");
      table.border = "1";
      const thead = document.createElement("thead");
      const headerRow = document.createElement("tr");
      columns.forEach(col => {
        const th = document.createElement("th");
        th.textContent = _.startCase(col.name.toLowerCase());
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      table.appendChild(thead);
      const tbody = document.createElement("tbody");
      data.forEach(row => {
        const tr = document.createElement("tr");
        row.forEach(cell => {
          const td = document.createElement("td");
          td.textContent = cell;
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      resultDiv.appendChild(table);
    } else {
      resultDiv.textContent = "Error: " + (responseData.error || "Search failed");
    }
  } catch (err) {
    console.error("Error in selectSoldierRecords:", err);
  }
}

async function projectSoldierRecords(event) {
  event.preventDefault();
  const checkboxes = document.querySelectorAll("#projectSoldier input[name='attribute']:checked");
  const attributes = Array.from(checkboxes).map(cb => cb.value);
  try {
    const response = await fetch('/project-soldier', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attributes })
    });
    const responseData = await response.json();
    const resultDiv = document.getElementById("projectSoldierResult");
    resultDiv.innerHTML = "";
    if (responseData.success) {
      const data = responseData.data.rows;
      const columns = responseData.data.columns;
      if (data.length === 0) {
        resultDiv.textContent = "No matching records found.";
        return;
      }
      const table = document.createElement("table");
      table.border = "1";
      const thead = document.createElement("thead");
      const headerRow = document.createElement("tr");
      columns.forEach(col => {
        const th = document.createElement("th");
        th.textContent = _.startCase(col.name.toLowerCase());
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      table.appendChild(thead);
      const tbody = document.createElement("tbody");
      data.forEach(row => {
        const tr = document.createElement("tr");
        row.forEach(cell => {
          const td = document.createElement("td");
          td.textContent = cell;
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      resultDiv.appendChild(table);
    } else {
      resultDiv.textContent = "Error: " + (responseData.error || "Projection failed");
    }
  } catch (err) {
    console.error("Error in projectSoldierRecords:", err);
  }
}

async function joinQueryRecords(event) {
  event.preventDefault();
  const award = document.getElementById("awardInput").value;
  try {
    const response = await fetch("/join-soldier-combat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ award })
    });
    const responseData = await response.json();
    const resultDiv = document.getElementById("joinQueryResult");
    resultDiv.innerHTML = "";
    if (responseData.success) {
      const data = responseData.data.rows;
      const columns = responseData.data.columns;
      if (data.length === 0) {
        resultDiv.textContent = "No matching records found.";
        return;
      }
      const table = document.createElement("table");
      table.border = "1";
      const thead = document.createElement("thead");
      const headerRow = document.createElement("tr");
      columns.forEach(col => {
        const th = document.createElement("th");
        th.textContent = _.startCase(col.name.toLowerCase());
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      table.appendChild(thead);
      const tbody = document.createElement("tbody");
      data.forEach(row => {
        const tr = document.createElement("tr");
        row.forEach(cell => {
          const td = document.createElement("td");
          td.textContent = cell;
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      resultDiv.appendChild(table);
    } else {
      resultDiv.textContent = "Error: " + (responseData.error || "Join query failed");
    }
  } catch (err) {
    console.error("Error in joinQueryRecords:", err);
  }
}

async function runAggregationSoldier() {
  try {
    const response = await fetch('/aggregation-soldier', { method: 'GET' });
    const responseData = await response.json();
    const resultDiv = document.getElementById("aggregationSoldierResult");
    resultDiv.innerHTML = "";
    if (responseData.success) {
      const data = responseData.data.rows;
      const columns = responseData.data.columns;
      if (data.length === 0) {
        resultDiv.textContent = "No results found.";
        return;
      }
      const table = document.createElement("table");
      table.border = "1";
      const thead = document.createElement("thead");
      const headerRow = document.createElement("tr");
      columns.forEach(col => {
         const th = document.createElement("th");
         th.textContent = _.startCase(col.name.toLowerCase());
         headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      table.appendChild(thead);
      const tbody = document.createElement("tbody");
      data.forEach(row => {
         const tr = document.createElement("tr");
         row.forEach(cell => {
            const td = document.createElement("td");
            td.textContent = cell;
            tr.appendChild(td);
         });
         tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      resultDiv.appendChild(table);
    } else {
      resultDiv.textContent = "Error: " + (responseData.error || "Aggregation query failed");
    }
  } catch (err) {
    console.error("Error in runAggregationSoldier:", err);
  }
}

async function runAggregationHaving() {
  try {
    const response = await fetch('/aggregation-having-soldier', { method: 'GET' });
    const responseData = await response.json();
    const resultDiv = document.getElementById("aggregationHavingResult");
    resultDiv.innerHTML = "";
    if (responseData.success) {
      const data = responseData.data.rows;
      const columns = responseData.data.columns;
      if (data.length === 0) {
        resultDiv.textContent = "No results found.";
        return;
      }
      const table = document.createElement("table");
      table.border = "1";
      const thead = document.createElement("thead");
      const headerRow = document.createElement("tr");
      columns.forEach(col => {
        const th = document.createElement("th");
        th.textContent = _.startCase(col.name.toLowerCase());
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      table.appendChild(thead);
      const tbody = document.createElement("tbody");
      data.forEach(row => {
        const tr = document.createElement("tr");
        row.forEach(cell => {
          const td = document.createElement("td");
          td.textContent = cell;
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      resultDiv.appendChild(table);
    } else {
      resultDiv.textContent = "Error: " + (responseData.error || "Query failed");
    }
  } catch (err) {
    console.error("Error in runAggregationHaving:", err);
  }
}

async function runNestedAggregation() {
  try {
    const response = await fetch('/nested-aggregation-soldier', { method: 'GET' });
    const responseData = await response.json();
    const resultDiv = document.getElementById("nestedAggResult");
    resultDiv.innerHTML = "";
    if (responseData.success) {
      const data = responseData.data.rows;
      const columns = responseData.data.columns;
      if (data.length === 0) {
        resultDiv.textContent = "No results found.";
        return;
      }
      const table = document.createElement("table");
      table.border = "1";
      const thead = document.createElement("thead");
      const headerRow = document.createElement("tr");
      columns.forEach(col => {
        const th = document.createElement("th");
        th.textContent = _.startCase(col.name.toLowerCase());
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      table.appendChild(thead);
      const tbody = document.createElement("tbody");
      data.forEach(row => {
        const tr = document.createElement("tr");
        row.forEach(cell => {
          const td = document.createElement("td");
          td.textContent = cell;
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      resultDiv.appendChild(table);
    } else {
      resultDiv.textContent = "Error: " + (responseData.error || "Query failed");
    }
  } catch (err) {
    console.error("Error in runNestedAggregation:", err);
  }
}

async function runDivisionQuery() {
  try {
    const response = await fetch('/division-soldier', { method: 'GET' });
    const responseData = await response.json();
    const resultDiv = document.getElementById("divisionQueryResult");
    resultDiv.innerHTML = "";
    if (responseData.success) {
      const data = responseData.data.rows;
      const columns = responseData.data.columns;
      if (data.length === 0) {
        resultDiv.textContent = "No matching records found.";
        return;
      }
      const table = document.createElement("table");
      table.border = "1";
      const thead = document.createElement("thead");
      const headerRow = document.createElement("tr");
      columns.forEach(col => {
        const th = document.createElement("th");
        th.textContent = _.startCase(col.name.toLowerCase());
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      table.appendChild(thead);
      const tbody = document.createElement("tbody");
      data.forEach(row => {
        const tr = document.createElement("tr");
        row.forEach(cell => {
          const td = document.createElement("td");
          td.textContent = cell;
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      resultDiv.appendChild(table);
    } else {
      resultDiv.textContent = "Error: " + (responseData.error || "Division query failed");
    }
  } catch (err) {
    console.error("Error in runDivisionQuery:", err);
  }
}


async function fetchTableDataForSelectedTable() {
  const selectElem = document.getElementById('tableSelect');
  const tableName = selectElem.value;
  try {
    const response = await fetch(`/table-data?table=${tableName}&_=${Date.now()}`, { method: 'GET' });
    const responseData = await response.json();
    const tableDataDiv = document.getElementById('tableData');
    tableDataDiv.innerHTML = '';
    if (responseData.success) {
      const data = responseData.data.rows;
      const columns = responseData.data.columns;
      if (data.length === 0) {
        tableDataDiv.textContent = `No rows found in ${tableName}`;
        return;
      }
      const table = document.createElement('table');
      table.border = '1';
      const thead = document.createElement('thead');
      const tbody = document.createElement('tbody');
      const headerRow = document.createElement('tr');
      columns.forEach(col => {
        const th = document.createElement('th');
        th.textContent = _.startCase(col.name.toLowerCase());
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      data.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(cell => {
          const td = document.createElement('td');
          if (cell instanceof Date) {
            td.textContent = cell.toLocaleDateString();
          } else if (typeof cell === 'string') {
            const parsedDate = new Date(cell);
            td.textContent = isNaN(parsedDate) ? cell : parsedDate.toLocaleDateString();
          } else {
            td.textContent = cell;
          }
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
      
      table.appendChild(thead);
      table.appendChild(tbody);
      tableDataDiv.appendChild(table);
    } else {
      tableDataDiv.textContent = "Error fetching data.";
    }
  } catch (error) {
    console.error("Error in fetchTableDataForSelectedTable:", error);
  }
}

// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
document.addEventListener("DOMContentLoaded", function() {
  checkDbConnection();
  document.getElementById("runInit").addEventListener("click", runInitScript);
  document.getElementById("insertGetBudget").addEventListener("submit", insertGetBudgetRecord);
  document.getElementById("updateGetBudget").addEventListener("submit", updateGetBudgetRecord);
  document.getElementById("deleteDuty").addEventListener("submit", deleteDutyRecord);
  document.getElementById("viewTableButton").addEventListener("click", fetchTableDataForSelectedTable);
  document.getElementById("addCondition").addEventListener("click", addConditionBlock);
  document.getElementById("selectSoldier").addEventListener("submit", selectSoldierRecords);
  document.getElementById("projectSoldier").addEventListener("submit", projectSoldierRecords);
  document.getElementById("joinQuery").addEventListener("submit", joinQueryRecords);
  document.getElementById("aggregationSoldierBtn").addEventListener("click", runAggregationSoldier);
  document.getElementById("aggregationHavingBtn").addEventListener("click", runAggregationHaving);
  document.getElementById("nestedAggBtn").addEventListener("click", runNestedAggregation);
  document.getElementById("divisionQueryBtn").addEventListener("click", runDivisionQuery);
});
