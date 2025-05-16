// src/controllers/licenseController.js
const pool = require('../../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Screen 3: License Validity
exports.getLicenseDetails = async (req, res) => {
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
};

// Screen 4: Login Validation
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query(
      `SELECT u.userid, u.username, u.passwordhash, t.tenantid, t.clientid, t.name AS tenant_name
       FROM um_users u
       JOIN to_tenantmaster t ON u.tenantid = t.tenantid
       WHERE u.username = $1 AND u.tenantid = 1002 AND t.clientid = 'INFUSYX'`,
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid username' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.passwordhash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ userid: user.userid, username: user.username }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error('🔥 Login Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Screen 5: Get User Profile
exports.getUserProfile = async (req, res) => {
  const { userid } = req.user; // comes from JWT middleware
  try {
    const result = await pool.query(
      `SELECT a.userid, a.firstname, a.lastname, a.profileurl, a.designation, d.departmentname,
              a.employeeid, a.email, a.contactnumber
       FROM um_users a
       INNER JOIN to_departmentmaster d ON a.departmentid = d.departmentid
       INNER JOIN to_tenantmaster t ON a.tenantid = t.tenantid
       WHERE a.userid = $1 AND a.tenantid = 1002 AND t.clientid = 'INFUSYX'`,
      [userid]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('🔥 Profile Fetch Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
