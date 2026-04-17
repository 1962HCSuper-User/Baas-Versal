const express = require("express");
const mysql = require("mysql2");
const router = express.Router();
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "196200010#$Harsh", // change this
  database: "bass"       // change to your DB
});

router.post("/membersearch96", (req, res) => {
  const { MMBRNO, ACCOUNTNAME, ACCNUMBER, PASSBOOKNO, RECEIPTNO, APPLNUMBER, ACCOPENDATE } = req.body;
  let accountsSql = `
  SELECT DISTINCT
    acc.MMBRNO AS MemberNo,
    acc.*,
    acc.MATURDATE AS MATURDATE,
    acc.EFFECTIVEDATE AS EFFECTIVE_DATE,
    acc.INTROTYPE AS INTRO_TYPE
  FROM accmast_getdata96 acc
  INNER JOIN SCHEMAST s
    ON acc.SCHECODE = s.SCHECODE
   AND acc.SCVTYPE = s.SCVTYPE
  WHERE s.COMPCODE NOT IN ('90','02')
  `;

  let params = [];
  if (MMBRNO) { accountsSql += " AND acc.MMBRNO = ?"; params.push(MMBRNO); }
  if (ACCOUNTNAME) { accountsSql += " AND acc.ACCOUNTNAME LIKE ?"; params.push("%" + ACCOUNTNAME + "%"); }
  if (ACCNUMBER) { accountsSql += " AND acc.ACCNUMBER = ?"; params.push(ACCNUMBER); }
  if (PASSBOOKNO) { accountsSql += " AND acc.NPBKORCERTNUM = ?"; params.push(PASSBOOKNO); }
  if (RECEIPTNO) { accountsSql += " AND acc.RECEIPTNO = ?"; params.push(RECEIPTNO); }
  if (APPLNUMBER) { accountsSql += " AND acc.APPLNUMBER = ?"; params.push(APPLNUMBER); }
  if (ACCOPENDATE) { accountsSql += " AND acc.ACCOPENDATE = ?"; params.push(ACCOPENDATE); }
  accountsSql += " LIMIT 500";

db.query(accountsSql, params, (err2, accountResults) => {
    if (err2) return res.send("❌ Error: " + err2);
    // Remove duplicate rows from accountResults (though DISTINCT should handle it, this is a safety net)
    const uniqueAccountResults = Array.from(new Map(accountResults.map(row => [row.ACCNUMBER, row])).values());
    // Group accounts by MemberNo
    const groups = {};
    uniqueAccountResults.forEach(row => {
      const key = row.MemberNo;
      if (!groups[key]) {
        groups[key] = { accounts: [] };
      }
      groups[key].accounts.push(row);
    });
    // Collect unique memberNos
    let memberNos = new Set(uniqueAccountResults.map(r => r.MemberNo));
    if (MMBRNO && !memberNos.has(MMBRNO)) {
      memberNos.add(MMBRNO);
    }
    let groupKeys = Array.from(memberNos);
    groupKeys.forEach(key => {
      if (!groups[key]) {
        groups[key] = { accounts: [] };
      }
    });
    // Fetch additional details for each account (from same table)
    const accountNumbers = uniqueAccountResults.map(acc => acc.ACCNUMBER);
    let depcResults = []; // Default empty array
    function processGroups() {
      if (groupKeys.length === 0) {
        res.render("Get96HQ", {
          memberInfo: null,
          accounts: [],
          depcAccounts: [],
          member: "",
          notFound: true,
          downloadFile: null
        });
        return;
      }
      let processed = 0;
      groupKeys.forEach(key => {
        db.query("SELECT * FROM membermast_getdata96 WHERE MMBRNO = ?", [key], (err, memberResults) => {
          if (err) {
            console.error("Error querying member:", err);
            // Continue or handle error
          }
          groups[key].member = memberResults[0] || null;
          processed++;
          if (processed === groupKeys.length) {
            // Do NOT create files here; files will be generated on button press via /generateFile96
            // Determine render params
            let memberInfo = null;
            let selectedAccounts = uniqueAccountResults;
            let selectedDepc = depcResults;
            let member = "";
            let notFound = groupKeys.length === 0;
            let downloadFile = null; // Set to null initially; button will still show if memberInfo exists
            if (groupKeys.length === 1) {
              let key = groupKeys[0];
              memberInfo = groups[key].member;
              selectedAccounts = groups[key].accounts;
              selectedDepc = depcResults.filter(d => selectedAccounts.some(a => a.ACCNUMBER === d.ACCNUMBER));
              member = key;
              notFound = !memberInfo;
              downloadFile = memberInfo ? true : null; // Use true to indicate button should show (but no pre-created file)
            } else if (groupKeys.length > 1) {
              memberInfo = null;
              member = "";
              notFound = false;
              // For multiple members, perhaps handle differently (e.g., no button, or list them), but assuming single for button
            }
            res.render("Get96HQ", {
              memberInfo,
              accounts: selectedAccounts,
              depcAccounts: selectedDepc,
              member,
              notFound,
              downloadFile
            });
          }
        });
      });
    }
    if (accountNumbers.length > 0) {
      const depcSql = `
        SELECT
          BRANCHCODE, ACCNUMBER, DATEOFBIRTH, AGE, OCCUPAT,
          FATHHUSNAME, LOCADDRES, PERMADDR, NOMINEE1 AS NOM1, NOMINEE2 AS NOM2, NOMINEE3 AS NOM3, NOMINEE4 AS NOM4, RECEIPTNO
        FROM accmast_getdata96
        WHERE ACCNUMBER IN (${accountNumbers.map(() => "?").join(",")})
      `;
      db.query(depcSql, accountNumbers, (err3, results) => {
        if (err3) return res.send("❌ Error: " + err3);
        // Remove duplicates from depcResults if any
        const uniqueDepcResults = Array.from(new Map(results.map(row => [row.ACCNUMBER, row])).values());
        depcResults = uniqueDepcResults;
        processGroups();
      });
    } else {
      depcResults = [];
      processGroups();
    }
    
  });
});

module.exports = router;
