const pool = require('../../db'); // PostgreSQL connection

exports.getLicenseDetails = async (req, res) => {
  const { clientid } = req.query;

  if (!clientid) {
    return res.status(400).json({ error: 'clientid is required' });
  }

  try {
    const result = await pool.query(
      `SELECT t.tenantid, t.name AS tenant_name, t.clientid, a.appid, a.productname, a.validupto, a.isactive,
       CASE WHEN a.validupto >= CURRENT_DATE THEN 'Valid' ELSE 'Expired' END AS license_status
       FROM to_tenantmaster t
       JOIN ap_applicensemaster a ON t.tenantid = a.tenantid
       WHERE a.isactive = true AND t.clientid = $1`,
      [clientid]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('🔥 SQL Error:', err); // <== Add this
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
