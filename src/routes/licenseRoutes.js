const express = require('express');
const router = express.Router();
const pool = require('../../db');
const bcrypt = require('bcryptjs');

// Screen 3: License Validity
router.get('/license/validate', async (req, res) => {
  const { clientid } = req.query;

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
    console.error('🔥 License Query Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Screen 4: Login Validation
router.get('/user/login', async (req, res) => {
  const { username, password, clientid } = req.query;

  if (!username || !password || !clientid) {
    return res.status(400).json({ error: 'username, password, and clientid are required' });
  }

  try {
    const result = await pool.query(
      `SELECT u.userid, u.username, u.passwordhash, t.tenantid, t.clientid, t.name AS tenant_name
       FROM um_users u
       JOIN to_tenantmaster t ON u.tenantid = t.tenantid
       WHERE u.username = $1 AND t.clientid = $2`,
      [username, clientid]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid username or clientid' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.passwordhash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    res.json({
      success: true,
      userid: user.userid,
      tenantid: user.tenantid,
      clientid: user.clientid,
      tenant_name: user.tenant_name
    });
  } catch (err) {
    console.error('🔥 Login Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Screen 5: User Profile
router.get('/user/profile', async (req, res) => {
  const { userid, clientid } = req.query;

  if (!userid || !clientid) {
    return res.status(400).json({ error: 'userid and clientid are required' });
  }

  try {
    const result = await pool.query(
      `SELECT a.userid, a.firstname, a.lastname, a.profileurl, a.designation, d.departmentname,
              a.employeeid, a.email, a.contactnumber
       FROM um_users a
       INNER JOIN to_departmentmaster d ON a.departmentid = d.departmentid
       INNER JOIN to_tenantmaster t ON a.tenantid = t.tenantid
       WHERE a.userid = $1 AND t.clientid = $2`,
      [userid, clientid]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('🔥 Profile Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
