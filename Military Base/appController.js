const express = require('express');
const appService = require('./appService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/check-db-connection', async (req, res) => {
  try {
    const isConnect = await appService.testOracleConnection();
    res.send(isConnect ? 'connected' : 'unable to connect');
  } catch (error) {
    res.send('unable to connect');
  }
});

router.post('/run-init', async (req, res) => {
  try {
    const result = await appService.runInitScript();
    res.json({ success: true, message: "Init script executed successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/insert-getbudget', async (req, res) => {
  const { budgetDocumentNumber, budgetDate, budgetAmount, budgetDescription, baseLocation } = req.body;
  try {
    const insertResult = await appService.insertGetBudget(
      budgetDocumentNumber,
      budgetDate,
      budgetAmount,
      budgetDescription,
      baseLocation
    );
    if (insertResult) {
      res.json({ success: true });
    } else {
      res.status(500).json({ success: false });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/update-getbudget', async (req, res) => {
  const { budgetDocumentNumber, budgetDate, budgetAmount, budgetDescription, baseLocation } = req.body;
  try {
    const updateResult = await appService.updateGetBudget(
      budgetDocumentNumber,
      budgetDate,
      budgetAmount,
      budgetDescription,
      baseLocation
    );
    if (updateResult) {
      res.json({ success: true });
    } else {
      res.status(500).json({ success: false });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/delete-duty', async (req, res) => {
  const { dutyID } = req.body;
  try {
    const deleteResult = await appService.deleteDuty(dutyID);
    if (deleteResult) {
      res.json({ success: true });
    } else {
      res.status(500).json({ success: false });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/select-soldier', async (req, res) => {
  try {
    const { conditions } = req.body;
    const data = await appService.selectSoldier(conditions);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/project-soldier', async (req, res) => {
  try {
    const { attributes } = req.body;
    const data = await appService.projectSoldier(attributes);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/join-soldier-combat', async (req, res) => {
  try {
    const { award } = req.body;
    const data = await appService.joinSoldierCombat(award);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/aggregation-soldier', async (req, res) => {
  try {
    const data = await appService.aggregationSoldier();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/aggregation-having-soldier', async (req, res) => {
  try {
    const data = await appService.aggregationHavingSoldier();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/nested-aggregation-soldier', async (req, res) => {
  try {
    const data = await appService.nestedAggregationSoldier();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/division-soldier', async (req, res) => {
  try {
    const data = await appService.divisionSoldier();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


router.get('/table-data', async (req, res) => {
  const tableName = req.query.table;
  try {
    const data = await appService.fetchTableData(tableName);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
