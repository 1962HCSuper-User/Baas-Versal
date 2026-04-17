const express = require("express");
const mysql = require("mysql2");
const router = express.Router();
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "196200010#$Harsh", // change this
  database: "bass"       // change to your DB
});

router.get("/generateFile96/:memberNo", (req, res) => {
  const memberNo = req.params.memberNo;
  // Fetch member data
  db.query("SELECT * FROM membermast_getdata96 WHERE MMBRNO = ?", [memberNo], (err, memberResults) => {
    if (err || !memberResults[0]) {
      return res.json({ error: "Member not found" });
    }
    const member = memberResults[0];
    // Fetch accounts for this member
    let accountsSql = `
      SELECT DISTINCT
    d.*,
    d.MATURDATE AS MATURDATE,
    d.EFFECTIVEDATE AS EFFECTIVE_DATE,
    d.INTROTYPE AS INTRO_TYPE,
    b.BRNCNAME,
    b.REGIONNAME  -- pick fields you actually need from brncmast
FROM accmast_getdata96 d
JOIN SCHEMAST s
    ON d.SCHECODE = s.SCHECODE
   AND d.SCVTYPE = s.SCVTYPE
LEFT JOIN brncmast b
    ON b.BRANCHCODE = d.BRANCHCODE
WHERE s.COMPCODE NOT IN ('90','02')
  AND d.MMBRNO = ?
;
    `;
    db.query(accountsSql, [memberNo], (err2, accountResults) => {
      if (err2) {
        return res.json({ error: "Error fetching accounts" });
      }
      const accounts = accountResults;
      // Fetch additional details for accounts (from same table)
      const accountNumbers = accounts.map(acc => acc.ACCNUMBER);
      let depcResults = [];
      if (accountNumbers.length === 0) {
        return res.json({ error: "No accounts found" });
      }
      const depcSql = `
        SELECT
          BRANCHCODE, ACCNUMBER, DATEOFBIRTH, AGE, OCCUPAT,
          FATHHUSNAME, LOCADDRES, PERMADDR, NOMINEE1 AS NOM1, NOMINEE2 AS NOM2, NOMINEE3 AS NOM3, NOMINEE4 AS NOM4, RECEIPTNO
        FROM accmast_getdata96
        WHERE ACCNUMBER IN (${accountNumbers.map(() => "?").join(",")})
      `;
      db.query(depcSql, accountNumbers, (err3, results) => {
        if (err3) {
          return res.json({ error: "Error fetching additional details" });
        }
        depcResults = results;
        // Now generate the file content (same as before)
        const formatDDMMYYYY = (date) => {
          if (!date) return "";
          const d = new Date(date);
          const day = String(d.getDate()).padStart(2, "0");
          const month = String(d.getMonth() + 1).padStart(2, "0");
          const year = d.getFullYear();
          return `${day}${month}${year}`;
        };
        let personal = `
=== MEMBER INFO ===
membershipNo: ${member.MMBRNO || ""}
fullName: ${member.MEMBER_NAM || ""}
dateOfBirth: ${member.DOB ? formatDDMMYYYY(member.DOB) : ""}
dateOfBirthFormated: ${member.DOB ? new Date(member.DOB).toISOString().split('T')[0] : ""}
SEX: ${member.GENDER || ""}
mobileNo: ${member.MOBILENO || ""}
address: ${member.ADDRESS || ""}, ${member.CITY || ""},- ${member.PIN || ""}
OCCUPATION: ${member.OCCUPATION || ""}
houseNo:
Village: ${member.ADDRESS || ""}
street: ${member.ADDRESS || ""}
post: ${member.CITY || ""}
district: ${member.CITY || ""}
CITY: ${member.CITY || ""}
state: ${member.STATE || ""}
pincode: ${member.PIN || ""}
mobileNo: ${member.MOBILENO || ""}
guardianName: ${member.FATSPONAME || ""}
MOTHERNAME:
WFATHUSNAME:
WITNESS:
REGDATE: ${member.REGDATE || ""}
DOM:
AGE: ${member.AGE || ""}
CHILDS:
PERMNT_ADDRESS: ${member.ADDRESS || ""} ${member.CITY || ""} ${member.STATE || ""} - ${member.PIN || ""}
PRSNT_ADDRESS:
RELIGION:
CASTE:
panCard: ${member.PANGIRNO || ""}
BGROUP:
COUNTRY:
MSTATUS:
EDUCATION:
Verifier: JAGDISH PRASAD
VerifierCode: 196200010
VerifierFatherName: OM PRAKASH
VerifierAddress: KALWARI, HATHRAS
EMAIL:
PHONENO: ${member.PHONENO || ""}
STDCODE: ${member.STDCODE || ""}
MBRTYPE: ${member.MBRTYPE || ""}
SHAREAMT: ${member.SHAREAMT || ""}
SHARECOUNT: ${member.SHARECOUNT || ""}
ALPHAFLAG: ${member.ALPHAFLAG || ""}
NOM1NAME: ${member.NOM1NAME || ""}
NOMREL1: ${member.NOMREL1 || ""}
NOM1DOB: ${member.NOM1DOB || ""}
NOM1PROP: ${member.NOM1PROP || ""}
NOM2NAME: ${member.NOM2NAME || ""}
NOMREL2: ${member.NOMREL2 || ""}
NOM2DOB: ${member.NOM2DOB || ""}
NOM2PROP: ${member.NOM2PROP || ""}
CSTDNNM: ${member.CSTDNNM || ""}
CSTDNREL: ${member.CSTDNREL || ""}
---------------------
`;
        let accountInfos = accounts.map((row, i) => {
          const depc = depcResults.find(d => d.ACCNUMBER === row.ACCNUMBER) || {};
          let parsedNominee = {};
          if (depc.NOM1) {
            const parts = depc.NOM1.split(',');
            if (parts.length >= 4) {
              parsedNominee.name = parts[0].trim();
              parsedNominee.relation = parts[1].trim();
              parsedNominee.age = parts[2].trim();
              parsedNominee.proportion = parts[3].trim();
            }
          }
          return `
=== ACCOUNT INFO (FORM${i + 1}) ===
accountNo: ${row.ACCNUMBER || ""}
schemeName: ${row.SCHECODE || ""}
SCVTYPE: ${row.SCVTYPE || ""}
ACCOUNTNAME: ${row.ACCOUNTNAME || ""}
age: ${depc.AGE || member.AGE || ""}
accountOpeningDate: ${row.ACCOPENDATE ? formatDDMMYYYY(row.ACCOPENDATE) : ""}
accountOpeningDateFormatted: ${row.ACCOPENDATE ? (() => {
  const d = new Date(row.ACCOPENDATE);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
})() : ""}
BRANCHCODE: ${row.BRANCHCODE || ""}
applicationNo: ${row.APPLNUMBER || ""}
FLDWCODE: ${row.FLDWCODE || ""}
ACCTRFDATE: ${row.ACCTRFDATE || ""}
MATURDATE: ${row.MATURDATE || ""}
DEPOSTMODE: ${row.DEPOSTMODE || ""}
centreCode: ${row.BRANCHCODE || ""}
centreName: ${row.BRNCNAME || ""}
region: ${row.REGIONNAME || ""}
paymentMode: CASH
proofDocument: ADDHAR CARD
INTPMODE: ${row.INTPMODE || ""}
DAYSOFDEP: ${row.DAYSOFDEP || ""}
receiptNo: ${row.RECEIPTNO || ""}
certificateNo: ${row.PBKORCERTNUM || ""}
denomination: ${row.PRODUCTVALUE || ""}
amount: ${row.PRODUCTVALUE || ""}
amountInWords: ${typeof numberToWords === 'function' ? numberToWords(Number(row.DENOMINATION || 0)) : 'N/A'} Only
nomineeName: ${parsedNominee.name || ""}
nomineeAge: ${parsedNominee.age || ""}
nomineeAgeFromDepc: ${depc.AGE || ""}
nomineeRelation: ${parsedNominee.relation || ""}
proportion: ${parsedNominee.proportion || ""}
nominee1: ${depc.NOM1 || ""}
nominee2: ${depc.NOM2 || ""}
`;
        }).join("\n\n---------------------\n\n");
        const fileContent = personal + "\n\n" + accountInfos;
        const sanitizedKey = memberNo.replace(/[^a-zA-Z0-9]/g, '_');
        const fileName = `${sanitizedKey}.txt`;
        const downloadsDir = path.join(__dirname, "public/Pending");
        if (!fs.existsSync(downloadsDir)) {
          fs.mkdirSync(downloadsDir, { recursive: true });
        }
        const filePath = path.join(downloadsDir, fileName);
        fs.writeFileSync(filePath, fileContent, "utf8");
        res.json({ fileName });
      });
    });
  });
});

module.exports = router;
