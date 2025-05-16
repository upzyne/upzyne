const express = require('express');
const app = express();
const PORT = 4000;

// Dummy license data
const licenses = [
  {
    tenantid: 1002,
    tenant_name: 'Infusyx',
    clientid: 'INFUSYX',
    appid: 2,
    productname: 'Upzyne Lead Management',
    validupto: '2026-04-23T18:30:41.498+05:30',
    isactive: true,
    license_status: 'Valid'
  }
];

// GET /api/license?clientid=INFUSYX
app.get('/api/license', (req, res) => {
  const { clientid } = req.query;
  const result = licenses.filter(l => l.clientid === clientid);

  if (result.length > 0) {
    res.json({
      status: 'success',
      message: 'License details retrieved successfully',
      data: result
    });
  } else {
    res.json({
      status: 'error',
      message: `License not found for clientid ${clientid}`,
      data: []
    });
  }
});

app.listen(PORT, () => {
  console.log(`Mock API server running at http://localhost:${PORT}`);
});
