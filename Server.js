const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const axios = require("axios");
const xml2js = require("xml2js");
const cheerio = require("cheerio");


const app = express();
const https = require("https");

app.use(express.urlencoded({ extended: true })); // handles form submissions
app.use(express.json()); // handles JSON requests
// const fs = require('fs').promises; // Use promises version of fs
const fs = require('fs');
const path = require("path");
const PORT = 3000;

app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));


// Serve static files from various directories
app.use('/Pdf', express.static(path.join(__dirname, 'Pdf')));
app.use('/Coordinates', express.static(path.join(__dirname, 'Coordinates')));
app.use('/Stamps', express.static(path.join(__dirname, 'Stamps')));
app.use('/Refrence', express.static(path.join(__dirname, 'Refrence'))); // Note: Ensure spelling matches folder name
app.use('/public/Pending', express.static(path.join(__dirname, 'public/Pending')));
app.use(express.urlencoded({ extended: true }));



                    // SSL For Local System 


// const sslOptions = {
//   key: fs.readFileSync(path.join(__dirname, "key.pem")),
//   cert: fs.readFileSync(path.join(__dirname, "cert.pem")),
// };


// ====== MYSQL CONFIG ======
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "196200010#$Harsh", // change this
  database: "bass"       // change to your DB
});



app.get("/favicon.ico", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "Sahara-Logo-Web.ico"));
});



// API Endpoint: Fetch Branch and Region by Auth Code from BRNCMAST table
// ====== MIDDLEWARE ======
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// ====== ROUTES ======

// ✅ API Endpoint: Get Branch & Region by Branch Code
app.post('/api/branch-region', async (req, res) => {
  const { branchCode } = req.body;

  // Input validation
  if (!branchCode || branchCode.length !== 4 || isNaN(branchCode)) {
    return res.status(400).json({ error: 'Invalid Branch Code: Must be a 4-digit number' });
  }

  try {
    const sql = 'SELECT BRNCNAME AS branchName, REGIONNAME AS regionName FROM BRNCMAST WHERE BRANCHCODE = ?';

    db.query(sql, [branchCode], (err, results) => {
      if (err) {
        console.error('🔥 Database query error:', err.message);
        return res.status(500).json({ error: 'Database query failed', details: err.message });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'No branch or region found for this Branch Code' });
      }

      const { branchName, regionName } = results[0];
      res.json({ branchName, regionName });
    });
  } catch (error) {
    console.error('⚠️ Unexpected server error:', error.message);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});



app.get('/Verify', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index0.6.html'));
});


app.get('/AddUser', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'AddNewUser0.1.html'));
}); 


// app.get('/about', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'PortflioInLight.html'));
// }); 




app.get('/about', (req, res) => {
    res.redirect('http://192.168.1.100:8000');  // auto redirect immediately
});


app.get('/Adhhar', (req, res) => {
    res.redirect('https://myaadhaar.uidai.gov.in/check-aadhaar-validity/en');  // auto redirect immediately
});

app.get('/RESUBMISSION', (req, res) => {
    res.redirect('https://mocresubmit.crcs.gov.in/resubmission/#/depositor/login');  // auto redirect immediately
});

app.get('/Regiter_Login', (req, res) => {
    res.redirect('https://mocrefund.crcs.gov.in/depositor/#/depositor/login');  // auto redirect immediately
});
app.get('/Regiter_New', (req, res) => {
    res.redirect('https://mocrefund.crcs.gov.in/depositor/#/depositor/register');  // auto redirect immediately
});

app.get('/Regiter_New', (req, res) => {
    res.redirect('https://mocrefund.crcs.gov.in/depositor/#/depositor/register');  // auto redirect immediately
});

app.get('/CRN_NO', (req, res) => {
    res.redirect('https://mocrefund.crcs.gov.in/depositor/#/forgotCRN');  // auto redirect immediately
});

app.get('/Number_Change', (req, res) => {
    res.redirect('https://mocrefund.crcs.gov.in/depositor/#/forgotMobile');  // auto redirect immediately
});

app.get('/Adhharlogin', (req, res) => {
    res.redirect('https://myaadhaar.uidai.gov.in/en_IN');  // auto redirect immediately
});


app.get('/NPCI', (req, res) => {
    res.redirect('https://base.npci.org.in/base/homepage');  // auto redirect immediately
});


app.get('/MasterCreation', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'TestAdmin.html'));
});

app.get('/Main-Home', (req, res) => {
    res.redirect('https://192.168.1.100:5000/');  // auto redirect immediately
});

app.get('/Dashboard10000', (req, res) => {
    res.redirect('http://localhost:10000/dashboard');  // auto redirect immediately
});


app.get('/Imageview', (req, res) => {
    res.redirect('http://192.168.1.100:8000');  // auto redirect immediately
});


app.get('/Amount88', (req, res) => {
    res.redirect('http://192.168.1.100:4000');  // auto redirect immediately
});



app.get('/Github-Profile', (req, res) => {
    res.redirect('https://github.com/1962HCSuper-User');  // auto redirect immediately
});

app.get('/Linkdin-Profile', (req, res) => {
    res.redirect('https://www.linkedin.com/public-profile/settings?trk=d_flagship3_profile_self_view_public_profile');  // auto redirect immediately
});

app.get('/Twitter-profile', (req, res) => {
    res.redirect('https://x.com/No_One_Exist0?t=DVDTIuBy8lQNRmCKptvwOw&s=08');  // auto redirect immediately
});

app.get('/Instagram-Profile', (req, res) => {
    res.redirect('https://github.com/1962HCSuper-User');  // auto redirect immediately
});



app.get("/reports", (req, res) => {
  res.render("OtherPortal", { user: null }); // default until login is implemented
});

app.use(express.json());


const pendingDir = path.join(__dirname, 'public/Pending');
if (!fs.existsSync(pendingDir)) {
  fs.mkdirSync(pendingDir);
}

// API to save form
app.post('/saveForm', (req, res) => {
  const { filename, content } = req.body;

  if (!filename || !content) {
    return res.json({ success: false, message: "Missing filename or content" });
  }

  const filePath = path.join(pendingDir, filename);

  fs.writeFile(filePath, content, (err) => {
    if (err) {
      console.error("Error saving file:", err);
      return res.json({ success: false, message: "Error saving file" });
    }
    res.json({ success: true, message: "File saved successfully" });
  });
});


// Serve PDF list from /public/Pdf folder
app.get('/api/pdf-list', (req, res) => {
  const pdfDir = path.join(__dirname, 'public', 'Pdf');
  fs.readdir(pdfDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to read PDF directory' });
    }

    const pdfFiles = files.filter(file => file.toLowerCase().endsWith('.pdf'));
    res.json(pdfFiles);
  });
});


// API to list TXT files in public/Pending
app.get('/api/txt-list', (req, res) => {
  const txtDir = path.join(__dirname, 'public/Pending');
  fs.readdir(txtDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read TXT directory' });
    }
    const txtFiles = files.filter(file => file.endsWith('.txt'));
    res.json(txtFiles);
  });
});

// API to save TXT file
app.post('/api/save-txt', (req, res) => {
  const { filename, content } = req.body || {};
  if (!filename || !content) {
    return res.status(400).json({ error: 'Filename and content are required' });
  }
  const filePath = path.join(__dirname, 'public/Pending', filename);
  fs.writeFile(filePath, content, 'utf8', (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to save TXT file' });
    }
    res.json({ success: true });
  });
});

// API to move TXT file to public/Pending/complete
app.post('/api/move-txt', (req, res) => {
  const { filename } = req.body;
  if (!filename) {
    return res.status(400).json({ error: 'Filename is required' });
  }
  try {
    const sourcePath = path.join(__dirname, 'public', 'Pending', filename);
    const destPath = path.join(__dirname, 'public', 'Pending', 'complete', filename);
    fs.renameSync(sourcePath, destPath);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to move TXT file' });
  }
});








// Homepage with search box
app.get("/", (req, res) => {
  res.render("index", { user: null }); // default until login is implemented
});



// Middleware
const MESSAGES_DIR = path.join(__dirname, 'Messages');

// ✅ Ensure directory exists (callback version)
function ensureDir(dir, callback) {
    fs.access(dir, (err) => {
        if (err) {
            // Directory does not exist, create it
            fs.mkdir(dir, { recursive: true }, callback);
        } else {
            callback(null);
        }
    });
}

app.post('/submit', (req, res) => {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    // Sanitize email and subject for safe filenames
    const sanitizedEmail = email.replace(/[^a-zA-Z0-9@._-]/g, '_');
    const sanitizedSubject = subject.replace(/[^a-zA-Z0-9_-]/g, '_');

    // Get formatted timestamp for filename
    const timestamp = new Date().toISOString()
        .replace(/T/, '_')
        .replace(/:/g, '-')
        .replace(/\..+/, '');

    // Ensure Messages folder exists
    ensureDir(MESSAGES_DIR, (err) => {
        if (err) {
            console.error('Error ensuring Messages dir:', err);
            return res.status(500).json({ error: 'Server error occurred.' });
        }

        // Ensure user email folder exists
        const emailDir = path.join(MESSAGES_DIR, sanitizedEmail);
        ensureDir(emailDir, (err) => {
            if (err) {
                console.error('Error ensuring email dir:', err);
                return res.status(500).json({ error: 'Server error occurred.' });
            }

            // File name includes subject + timestamp
            const fileName = `${sanitizedSubject}_${timestamp}.txt`;
            const filePath = path.join(emailDir, fileName);

            const txtContent =
                `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}\n\n---\nSubmitted on: ${new Date().toISOString()}`;

            // Write file
            fs.writeFile(filePath, txtContent, 'utf8', (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    return res.status(500).json({ error: 'Server error occurred.' });
                }

                res.json({ success: true, message: 'Message saved successfully!' });
            });
        });
    });
});


// Party ledger search (GET and POST)
app.get("/amount", (req, res) => {
  res.render("Amount", { data: null });
});
app.post("/search", (req, res) => {
  const accNumber = req.body.accountNumber;

  const query = `
    SELECT 
        A.YFACODE,
        A.YCRAMOUNT,
        A.YDRAMOUNT,
        A.YTAG,
        A.YPTYTRANSDT,
        B.AHEADNAME,
        A.YDOCREFNO,
        A.YDEPOSTMODE
    FROM 
        YRPTYLEDGERCOOP A
    INNER JOIN 
        FACDMAST B ON B.FACODE = A.YFACODE
    WHERE 
        A.YACCNUMBER = ?
    ORDER BY 
        A.YPTYTRANSDT;
  `;

  db.query(query, [accNumber], (err, results) => {
    if (err) return res.send("❌ Error: " + err);

    let totalCr = 0;
    let totalDr = 0;

    results.forEach(r => {
      // exclude YTAG = 'T' from credit total
      if (r.YTAG !== "T") {
        totalCr += Number(r.YCRAMOUNT) || 0;
      }
      totalDr += Number(r.YDRAMOUNT) || 0;
    });

    res.render("results", {
      data: results,
      account: accNumber,
      totalCr,
      totalDr
    });
  });
});


let referenceMap = {};
try {
  const refContent = fs.readFileSync(path.join(__dirname, 'public', 'Refrence', 'Refrence.txt'), 'utf8');
  refContent.split('\n').forEach(line => {
    if (line.trim()) {
      const [code, pdfName] = line.split(' : ').map(s => s.trim());
      if (code && pdfName) {
        referenceMap[pdfName] = code;
      }
    }
  });
  console.log('Reference map loaded:', referenceMap);
} catch (err) {
  console.error('Error loading Reference.txt:', err);
}

// Helper functions (ported from client-side)
function calculateAgeOnDate(dob, refDate) {
  if (!dob || !refDate) return '';
  const birthDate = new Date(dob);
  const targetDate = new Date(refDate);
  let age = targetDate.getFullYear() - birthDate.getFullYear();
  const m = targetDate.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && targetDate.getDate() < birthDate.getDate())) age--;
  return age;
}

function formatDateDDMMYYYY(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}${month}${year}`;
}


function formatDateDD_MM_YYYY(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`; // 01-01-2000
}


function formatDateYYYYMMDD(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
}

function getSex(gender) {
  if (gender === 'Male') return 'M';
  if (gender === 'Female') return 'F';
  return 'O';
}

function numberToWords(n) {
  const a = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
      "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
  const b = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

  if (n === 0) return "";
  if (n < 20) return a[n];
  if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
  if (n < 1000) return a[Math.floor(n / 100)] + " hundred" + (n % 100 ? " " + numberToWords(n % 100) : "");
  if (n < 100000) return numberToWords(Math.floor(n / 1000)) + " thousand" + (n % 1000 ? " " + numberToWords(n % 1000) : "");
  if (n < 10000000) return numberToWords(Math.floor(n / 100000)) + " lakh" + (n % 100000 ? " " + numberToWords(n % 100000) : "");
  if (n < 10000000000) return numberToWords(Math.floor(n / 10000000)) + " crore" + (n % 10000000 ? " " + numberToWords(n % 10000000) : "");
  return "Number too large";
}

function generateMembershipText(userInfo, m, referenceMap) {
  let txt = '';
  const fullAddress = [userInfo.houseNo, userInfo.city, - userInfo.pin].filter(Boolean).join(' ');
  const dobDDMMYYYY = formatDateDDMMYYYY(userInfo.dob);
  const dobFormatted = formatDateDD_MM_YYYY(userInfo.dob);
  const regDate = formatDateDD_MM_YYYY(m.date);
  const age = calculateAgeOnDate(userInfo.dob, m.date);
  const centreCode = m.accounts[0]?.authCode || '';
  const centreName = m.accounts[0]?.branch || '';
  const region = m.accounts[0]?.region || '';
  const occupation = userInfo.occupation || 'Other';
  const stateAbbr = userInfo.state?.toUpperCase().substring(0, 2) || 'UP';
  const permntAddress = `${fullAddress} `;
  const address = `${fullAddress} `;

  txt += `=== MEMBER INFO ===\n`;
  txt += `membershipNo: ${m.membershipNo}\n`;
  txt += `Company_Code: ${getCompanyCode(m.membershipNo)}\n`;
  txt += `TITLE: 801\n`;
  txt += `fullName: ${userInfo.fullName.toUpperCase()}\n`;
  txt += `dateOfBirth: ${dobDDMMYYYY}\n`;
  txt += `dateOfBirthFormated: ${dobFormatted}\n`;
  txt += `SEX: ${getSex(userInfo.gender)}\n`;
  txt += `mobileNo: ${userInfo.mobile || ''}\n`;
  txt += `address: ${address}\n`;
  txt += `OCCUPATION: ${occupation}\n`;
  txt += `houseNo: ${userInfo.houseNo || ''}\n`;
  txt += `Village: ${userInfo.city}\n`;
  txt += `street: ${userInfo.city}\n`;
  txt += `post: ${userInfo.postOffice}\n`;
  txt += `district: ${userInfo.district}\n`;
  txt += `CITY: ${userInfo.city}\n`;
  txt += `state: ${stateAbbr}\n`;
  txt += `pincode: ${userInfo.pin}\n`;
  txt += `guardianName: ${userInfo.fatherName.toUpperCase()}\n`;
  txt += `MOTHERNAME: \n`;
  txt += `WFATHUSNAME: \n`;
  txt += `WITNESS: \n`;
  txt += `REGDATE: ${regDate}\n`;
  txt += `DOM: \n`;
  txt += `AGE: ${age}\n`;
  txt += `CHILDS: 0\n`;
  txt += `PERMNT_ADDRESS: ${permntAddress}\n`;
  txt += `PRSNT_ADDRESS: - 0\n`;
  txt += `RELIGION: HINDU\n`;
  txt += `CASTE: GE\n`;
  txt += `panCard: ${userInfo.pan || ''}\n`;
  txt += `BGROUP: O+\n`;
  txt += `COUNTRY: INDIA\n`;
  txt += `MSTATUS: M\n`;
  txt += `EDUCATION: 831\n`;
  txt += `Verifier: JAGDISH PRSAD\n`;
  txt += `VerifierCode: 196200010\n`;
  txt += `VerifierFatherName: OM PRAKASH\n`;
  txt += `VerifierAddress: KALWARI, HATHRAS\n`;
  txt += `---------------------\n\n`;

  m.accounts.forEach((a, accIndex) => {
    const accountDateDDMMYYYY = formatDateDDMMYYYY(a.accountDate);
    const accountDateFormatted = formatDateDD_MM_YYYY(a.accountDate);
    
    const memberAge = calculateAgeOnDate(userInfo.dob, a.accountDate);
    const nomineeAge = calculateAgeOnDate(a.nomineeDOB, a.accountDate);
    const schemeCode = referenceMap[a.scheme] || '930128'; // Lookup code from map, default if not found
    const scvType = 1;
    const branchCode = a.authCode;
    const fldwCode = `${a.authCode}10342`;
    const maturDate = formatDateYYYYMMDD(new Date(a.accountDate)); // placeholder
    const depostMode = 'D';
    const paymentMode = 'CASH';
    const proofDocument = 'ADDHAR CARD';
    const intPMode = 'N';
    const daysOfDep = 25;
    const denomination = a.amount;
    const amountNum = parseInt(a.amount);
    const wordsCapitalized = a.amountWords.charAt(0).toUpperCase() + a.amountWords.slice(1);
    const amountInWords = (amountNum < 100 ? 'and ' : '') + wordsCapitalized;
    const passbookNo = a.passNo || 0;
    const proportion = 100;
    const nominee1 = `${a.nomineeName.toUpperCase()},${a.nomineeRelation.toUpperCase()},${nomineeAge},${proportion}`;
    const nominee2 = '';

    txt += `=== ACCOUNT INFO ===\n`;
    txt += `accountNo: ${a.accNo}\n`;
    txt += `schemeName: ${schemeCode}\n`;
    txt += `SCVTYPE: ${scvType}\n`;
    txt += `ACCOUNTNAME: ${userInfo.fullName.toUpperCase()}\n`;
    txt += `age: ${memberAge}\n`;
    txt += `accountOpeningDate: ${accountDateDDMMYYYY}\n`;
    txt += `accountOpeningDateFormatted: ${accountDateFormatted}\n`;
    txt += `BRANCHCODE: ${branchCode}\n`;
    txt += `applicationNo: ${a.appNo}\n`;
    txt += `FLDWCODE: ${fldwCode}\n`;
    txt += `ACCTRFDATE: \n`;
    txt += `MATURDATE: ${maturDate}\n`;
    txt += `DEPOSTMODE: ${depostMode}\n`;
    txt += `paymentMode: ${paymentMode}\n`;
    txt += `proofDocument: ${proofDocument}\n`;
    txt += `INTPMODE: ${intPMode}\n`;
    txt += `DAYSOFDEP: ${daysOfDep}\n`;
    txt += `receiptNo: ${a.recNo}\n`;
    txt += `denomination: ${denomination}\n`;
    txt += `amount: ${a.amount}\n`;
    txt += `amountInWords: ${amountInWords}\n`;
    txt += `certificateNo: ${passbookNo}\n`;
    txt += `nomineeName: ${a.nomineeName.toUpperCase()}\n`;
    txt += `nomineeAge: ${nomineeAge}\n`;
    txt += `nomineeAgeFromDepc: ${nomineeAge}\n`;
    txt += `nomineeRelation: ${a.nomineeRelation.toUpperCase()}\n`;
    txt += `proportion: ${proportion}\n`;
    txt += `nominee1: ${nominee1}\n`;
    txt += `nominee2: ${nominee2}\n`;
    txt += `centreCode: ${centreCode}\n`;
    txt += `centreName: ${centreName}\n`;
    txt += `region: ${region}\n`;
    txt += `---------------------\n\n`;
  });

  return txt;
}


function getCompanyCode(membershipNo) {
  if (!membershipNo) return "";

  const num = membershipNo.toString().trim();
  if (!/^\d+$/.test(num)) return "";

  const len = num.length;
  const firstDigit = num[0];


   if (len === 11) {
    return "90";
  }
  if (len === 12) {
    if (firstDigit === "9") return "96";
    if (firstDigit === "6") return "97";
  }
  return "";
}


// API to save data
app.post('/save', (req, res) => {
  const { userInfo, memberships } = req.body;
  if (!userInfo || !memberships || memberships.length === 0) {
    return res.status(400).json({ success: false, message: 'Invalid data' });
  }

  const pendingDir = path.join(__dirname, 'public', 'Pending');
  if (!fs.existsSync(pendingDir)) {
    fs.mkdirSync(pendingDir);
  }

  try {
    memberships.forEach(m => {
      const txt = generateMembershipText(userInfo, m, referenceMap);
      const filename = `M${m.membershipNo}.txt`;
      fs.writeFileSync(path.join(pendingDir, filename), txt, 'utf8');
    });
    res.json({ success: true });
  } catch (err) {
    console.error('Error saving files:', err);
    res.status(500).json({ success: false, message: 'Failed to save files' });
  }
});



// Helper function to convert numbers up to 10 lakh
function numberToWords(num) {
    const single = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    const twoDigit = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
                      "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    if (!num || num === 0) return "Zero";

    let words = "";

    const lakh = Math.floor(num / 100000);
    const thousand = Math.floor((num % 100000) / 1000);
    const hundred = Math.floor((num % 1000) / 100);
    const remainder = num % 100;

    if (lakh > 0) words += `${convertTwoDigits(lakh)} Lakh `;
    if (thousand > 0) words += `${convertTwoDigits(thousand)} Thousand `;
    if (hundred > 0) words += `${single[hundred]} Hundred `;
    if (remainder > 0) words += `and ${convertTwoDigits(remainder)} `;

    return words.trim();

    function convertTwoDigits(n) {
        if (n < 10) return single[n];
        if (n < 20) return twoDigit[n - 10];
        return `${tens[Math.floor(n / 10)]} ${single[n % 10]}`.trim();
    }
}

// sahara credit advanced search (POST)
app.get("/Sahara_Credit", (req, res) => {
  res.render("advsearch", { data: null });
});

app.post("/advsearch", (req, res) => {
  const {
    BRANCHCODE, ACCNUMBER, SCHECODE, SCVTYPE, DEPOSTMODE, INTPMODE, DAYSOFDEP,
    APPLNUMBER, FLDWCODE, ACCTRFDATE, LAPIRFLAG, JOINTFLAG, AGNSCOLL, MATURDATE,
    NOITEMRET, ACCOUNTNAME, ACCOPENDATE, INTROCODE, TITLE, ALPHAFLAG, PASSBOOKNO,
    RECEIPTNO, DENOMINATION, SIGFLAG, LOANFLAG, STFLAG, SPCPAID, INTRO_TYPE,
    EFFECTIVE_DATE, ISPHOTOYN,
    ACCOUNTNO, MMBRNO, ACCOPENDT
  } = req.body || {};

  let conditions = [];
  let values = [];

  // depimast fields
  if (BRANCHCODE) { conditions.push("depimast.BRANCHCODE = ?"); values.push(BRANCHCODE); }
  if (ACCNUMBER) { conditions.push("depimast.ACCNUMBER = ?"); values.push(ACCNUMBER); }
  if (SCHECODE) { conditions.push("depimast.SCHECODE = ?"); values.push(SCHECODE); }
  if (SCVTYPE) { conditions.push("depimast.SCVTYPE = ?"); values.push(SCVTYPE); }
  if (DEPOSTMODE) { conditions.push("depimast.DEPOSTMODE = ?"); values.push(DEPOSTMODE); }
  if (INTPMODE) { conditions.push("depimast.INTPMODE = ?"); values.push(INTPMODE); }
  if (DAYSOFDEP) { conditions.push("depimast.DAYSOFDEP = ?"); values.push(DAYSOFDEP); }
  if (APPLNUMBER) { conditions.push("depimast.APPLNUMBER = ?"); values.push(APPLNUMBER); }
  if (FLDWCODE) { conditions.push("depimast.FLDWCODE = ?"); values.push(FLDWCODE); }
  if (ACCTRFDATE) { conditions.push("depimast.ACCTRFDATE = ?"); values.push(ACCTRFDATE); }
  if (LAPIRFLAG) { conditions.push("depimast.LAPIRFLAG = ?"); values.push(LAPIRFLAG); }
  if (JOINTFLAG) { conditions.push("depimast.JOINTFLAG = ?"); values.push(JOINTFLAG); }
  if (AGNSCOLL) { conditions.push("depimast.AGNSCOLL = ?"); values.push(AGNSCOLL); }
  if (MATURDATE) { conditions.push("depimast.MATURDATE = ?"); values.push(MATURDATE); }
  if (NOITEMRET) { conditions.push("depimast.NOITEMRET = ?"); values.push(NOITEMRET); }
  if (ACCOUNTNAME) { conditions.push("depimast.ACCOUNTNAME LIKE ?"); values.push("%" + ACCOUNTNAME + "%"); }
  if (ACCOPENDATE) { conditions.push("depimast.ACCOPENDATE = ?"); values.push(ACCOPENDATE); }
  if (INTROCODE) { conditions.push("depimast.INTROCODE = ?"); values.push(INTROCODE); }
  if (TITLE) { conditions.push("depimast.TITLE = ?"); values.push(TITLE); }
  if (ALPHAFLAG) { conditions.push("depimast.ALPHAFLAG = ?"); values.push(ALPHAFLAG); }
  if (PASSBOOKNO) { conditions.push("depimast.PASSBOOKNO = ?"); values.push(PASSBOOKNO); }
  if (RECEIPTNO) { conditions.push("depimast.RECEIPTNO = ?"); values.push(RECEIPTNO); }
  if (DENOMINATION) { conditions.push("depimast.DENOMINATION = ?"); values.push(DENOMINATION); }
  if (SIGFLAG) { conditions.push("depimast.SIGFLAG = ?"); values.push(SIGFLAG); }
  if (LOANFLAG) { conditions.push("depimast.LOANFLAG = ?"); values.push(LOANFLAG); }
  if (STFLAG) { conditions.push("depimast.STFLAG = ?"); values.push(STFLAG); }
  if (SPCPAID) { conditions.push("depimast.SPCPAID = ?"); values.push(SPCPAID); }
  if (INTRO_TYPE) { conditions.push("depimast.INTRO_TYPE = ?"); values.push(INTRO_TYPE); }
  if (EFFECTIVE_DATE) { conditions.push("depimast.EFFECTIVE_DATE = ?"); values.push(EFFECTIVE_DATE); }
  if (ISPHOTOYN) { conditions.push("depimast.ISPHOTOYN = ?"); values.push(ISPHOTOYN); }

  // accountref fields
  if (ACCOUNTNO) { conditions.push("accountref.ACCOUNTNO = ?"); values.push(ACCOUNTNO); }
  if (MMBRNO) { conditions.push("accountref.MMBRNO = ?"); values.push(MMBRNO); }
  if (ACCOPENDT) { conditions.push("accountref.ACCOPENDT = ?"); values.push(ACCOPENDT); }

  // Base SQL without GROUP BY or ORDER BY
  let baseSql = `
  SELECT 
    accountref.MMBRNO AS MMBRNO,
    accountref.ACCOUNTNO,
    depimast.*,

    -- membermast columns wrapped in ANY_VALUE
    ANY_VALUE(membermast.TITLE) AS TITLE,
    ANY_VALUE(membermast.FNAME) AS FNAME,
    ANY_VALUE(membermast.MNAME) AS MNAME,
    ANY_VALUE(membermast.SNAME) AS SNAME,
    ANY_VALUE(membermast.REGDATE) AS REGDATE,
    ANY_VALUE(membermast.PERMNT_ADD) AS PERMNT_ADD,
    ANY_VALUE(membermast.PERMNT_CITY) AS PERMNT_CITY,
    ANY_VALUE(membermast.PERMNT_STATE) AS PERMNT_STATE,
    ANY_VALUE(membermast.PERMNT_PIN) AS PERMNT_PIN,
    ANY_VALUE(membermast.PERMNT_CONTACT) AS PERMNT_CONTACT,
    ANY_VALUE(membermast.PRSNT_ADD) AS PRSNT_ADD,
    ANY_VALUE(membermast.PRSNT_CITY) AS PRSNT_CITY,
    ANY_VALUE(membermast.PRSNT_STATE) AS PRSNT_STATE,
    ANY_VALUE(membermast.PRSNT_PIN) AS PRSNT_PIN,
    ANY_VALUE(membermast.PRSNT_CONTACT) AS PRSNT_CONTACT,
    ANY_VALUE(membermast.OCCUPATION) AS OCCUPATION,
    ANY_VALUE(membermast.AGE) AS AGE,
    ANY_VALUE(membermast.WITNESS) AS WITNESS,
    ANY_VALUE(membermast.WFATHUSNAME) AS WFATHUSNAME,
    ANY_VALUE(membermast.WADDRESS) AS WADDRESS,
    ANY_VALUE(membermast.DOB) AS DOB,
    ANY_VALUE(membermast.SEX) AS SEX,
    ANY_VALUE(membermast.FATHUSNAME) AS FATHUSNAME,
    ANY_VALUE(membermast.MOTHERNAME) AS MOTHERNAME,
    ANY_VALUE(membermast.RELIGION) AS RELIGION,
    ANY_VALUE(membermast.CASTE) AS CASTE,
    ANY_VALUE(membermast.PAN) AS PAN,
    ANY_VALUE(membermast.BGROUP) AS BGROUP,
    ANY_VALUE(membermast.COUNTRY) AS COUNTRY,
    ANY_VALUE(membermast.MSTATUS) AS MSTATUS,
    ANY_VALUE(membermast.DOM) AS DOM,
    ANY_VALUE(membermast.CHILDS) AS CHILDS,
    ANY_VALUE(membermast.EDUCATION) AS EDUCATION,
    ANY_VALUE(membermast.MBRTYPE) AS MBRTYPE,
    ANY_VALUE(membermast.CUSTTYPE) AS CUSTTYPE,
    ANY_VALUE(membermast.RSDADDRESS) AS RSDADDRESS,
    ANY_VALUE(membermast.RSDCONTACT) AS RSDCONTACT,
    ANY_VALUE(membermast.OFFADDRESS) AS OFFADDRESS,
    ANY_VALUE(membermast.OFFCONTACT) AS OFFCONTACT,
    ANY_VALUE(membermast.ALPHAFLAG) AS MEM_ALPHAFLAG,
    ANY_VALUE(membermast.HQFLAG) AS HQFLAG,

    -- depcmast fields
    ANY_VALUE(depcmast.ID) AS DEPC_ID,
    ANY_VALUE(depcmast.BRANCHCODE) AS DEPC_BRANCHCODE,
    ANY_VALUE(depcmast.ACCNUMBER) AS DEPC_ACCNUMBER,
    ANY_VALUE(depcmast.DATEOFBIRTH) AS DEPC_DATEOFBIRTH,
    ANY_VALUE(depcmast.AGE) AS DEPC_AGE,
    ANY_VALUE(depcmast.OCCUPAT) AS DEPC_OCCUPAT,
    ANY_VALUE(depcmast.FATHHUSNAME) AS DEPC_FATHHUSNAME,
    ANY_VALUE(depcmast.LOCADDRES) AS DEPC_LOCADDRES,
    ANY_VALUE(depcmast.PERMADDR) AS DEPC_PERMADDR,
    ANY_VALUE(depcmast.NOM1) AS DEPC_NOM1,
    ANY_VALUE(depcmast.NOM2) AS DEPC_NOM2,
    ANY_VALUE(depcmast.NOM3) AS DEPC_NOM3,
    ANY_VALUE(depcmast.NOM4) AS DEPC_NOM4,
    ANY_VALUE(depcmast.RECEIPTNO) AS DEPC_RECEIPTNO,

    -- brncmast fields
    ANY_VALUE(brncmast.BRNCNAME) AS BRANCH_NAME,
    ANY_VALUE(brncmast.REGIONNAME) AS REGION_NAME

FROM accountref
INNER JOIN depimast ON accountref.ACCOUNTNO = depimast.ACCNUMBER
INNER JOIN membermast ON membermast.MMBRNO = accountref.MMBRNO
LEFT JOIN depcmast ON depcmast.ACCNUMBER = depimast.ACCNUMBER
LEFT JOIN brncmast ON brncmast.BRANCHCODE = depimast.BRANCHCODE
  `;

  // Construct WHERE clause if conditions exist
  let whereClause = "";
  if (conditions.length > 0) {
    whereClause = "WHERE " + conditions.join(" AND ");
  }

  // Add GROUP BY, ORDER BY, and LIMIT
  let sql = baseSql + whereClause + `
GROUP BY accountref.MMBRNO, accountref.ACCOUNTNO, depimast.ID
ORDER BY accountref.MMBRNO, depimast.ACCNUMBER
LIMIT 500
  `;

  // DEBUG: log final SQL and values to catch issues quickly
  // console.log("Final SQL:\n", sql);
  // console.log("Values:\n", values);

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("DB Error:", err);
      return res.send("❌ Error: " + err);
    }

    res.render("advsearch", { data: results });
  });
});

function formatDMY(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return `${String(d.getDate()).padStart(2,"0")}-${String(d.getMonth()+1).padStart(2,"0")}-${d.getFullYear()}`;
}


app.get("/verifyUser/:mmbrno", (req, res) => {
  const MMBRNO = req.params.mmbrno;

  // Base SQL same as above
  let sql = `
  SELECT 
    accountref.MMBRNO AS MMBRNO,
    accountref.ACCOUNTNO,
    depimast.*,
    
    -- membermast columns wrapped in ANY_VALUE
    ANY_VALUE(membermast.TITLE) AS TITLE,
    ANY_VALUE(membermast.FNAME) AS FNAME,
    ANY_VALUE(membermast.MNAME) AS MNAME,
    ANY_VALUE(membermast.SNAME) AS SNAME,
    ANY_VALUE(membermast.REGDATE) AS REGDATE,
    ANY_VALUE(membermast.PERMNT_ADD) AS PERMNT_ADD,
    ANY_VALUE(membermast.PERMNT_CITY) AS PERMNT_CITY,
    ANY_VALUE(membermast.PERMNT_STATE) AS PERMNT_STATE,
    ANY_VALUE(membermast.PERMNT_PIN) AS PERMNT_PIN,
    ANY_VALUE(membermast.PERMNT_CONTACT) AS PERMNT_CONTACT,
    ANY_VALUE(membermast.PRSNT_ADD) AS PRSNT_ADD,
    ANY_VALUE(membermast.PRSNT_CITY) AS PRSNT_CITY,
    ANY_VALUE(membermast.PRSNT_STATE) AS PRSNT_STATE,
    ANY_VALUE(membermast.PRSNT_PIN) AS PRSNT_PIN,
    ANY_VALUE(membermast.PRSNT_CONTACT) AS PRSNT_CONTACT,
    ANY_VALUE(membermast.OCCUPATION) AS OCCUPATION,
    ANY_VALUE(membermast.AGE) AS AGE,
    ANY_VALUE(membermast.WITNESS) AS WITNESS,
    ANY_VALUE(membermast.WFATHUSNAME) AS WFATHUSNAME,
    ANY_VALUE(membermast.WADDRESS) AS WADDRESS,
    ANY_VALUE(membermast.DOB) AS DOB,
    ANY_VALUE(membermast.SEX) AS SEX,
    ANY_VALUE(membermast.FATHUSNAME) AS FATHUSNAME,
    ANY_VALUE(membermast.MOTHERNAME) AS MOTHERNAME,
    ANY_VALUE(membermast.RELIGION) AS RELIGION,
    ANY_VALUE(membermast.CASTE) AS CASTE,
    ANY_VALUE(membermast.PAN) AS PAN,
    ANY_VALUE(membermast.BGROUP) AS BGROUP,
    ANY_VALUE(membermast.COUNTRY) AS COUNTRY,
    ANY_VALUE(membermast.MSTATUS) AS MSTATUS,
    ANY_VALUE(membermast.DOM) AS DOM,
    ANY_VALUE(membermast.CHILDS) AS CHILDS,
    ANY_VALUE(membermast.EDUCATION) AS EDUCATION,
    ANY_VALUE(membermast.MBRTYPE) AS MBRTYPE,
    ANY_VALUE(membermast.CUSTTYPE) AS CUSTTYPE,
    ANY_VALUE(membermast.RSDADDRESS) AS RSDADDRESS,
    ANY_VALUE(membermast.RSDCONTACT) AS RSDCONTACT,
    ANY_VALUE(membermast.OFFADDRESS) AS OFFADDRESS,
    ANY_VALUE(membermast.OFFCONTACT) AS OFFCONTACT,
    ANY_VALUE(membermast.ALPHAFLAG) AS MEM_ALPHAFLAG,
    ANY_VALUE(membermast.HQFLAG) AS HQFLAG,

    -- depcmast fields using ANY_VALUE
    ANY_VALUE(depcmast.ID) AS DEPC_ID,
    ANY_VALUE(depcmast.BRANCHCODE) AS DEPC_BRANCHCODE,
    ANY_VALUE(depcmast.ACCNUMBER) AS DEPC_ACCNUMBER,
    ANY_VALUE(depcmast.DATEOFBIRTH) AS DEPC_DATEOFBIRTH,
    ANY_VALUE(depcmast.AGE) AS DEPC_AGE,
    ANY_VALUE(depcmast.OCCUPAT) AS DEPC_OCCUPAT,
    ANY_VALUE(depcmast.FATHHUSNAME) AS DEPC_FATHHUSNAME,
    ANY_VALUE(depcmast.LOCADDRES) AS DEPC_LOCADDRES,
    ANY_VALUE(depcmast.PERMADDR) AS DEPC_PERMADDR,
    ANY_VALUE(depcmast.NOM1) AS DEPC_NOM1,
    ANY_VALUE(depcmast.NOM2) AS DEPC_NOM2,
    ANY_VALUE(depcmast.NOM3) AS DEPC_NOM3,
    ANY_VALUE(depcmast.NOM4) AS DEPC_NOM4,
    ANY_VALUE(depcmast.RECEIPTNO) AS DEPC_RECEIPTNO,

    -- brncmast fields
    ANY_VALUE(brncmast.BRNCNAME) AS BRANCH_NAME,
    ANY_VALUE(brncmast.REGIONNAME) AS REGION_NAME

FROM accountref
INNER JOIN depimast ON accountref.ACCOUNTNO = depimast.ACCNUMBER
INNER JOIN membermast ON membermast.MMBRNO = accountref.MMBRNO
LEFT JOIN depcmast ON depcmast.ACCNUMBER = depimast.ACCNUMBER
LEFT JOIN brncmast ON brncmast.BRANCHCODE = depimast.BRANCHCODE
WHERE accountref.MMBRNO = ?
GROUP BY accountref.MMBRNO, accountref.ACCOUNTNO, depimast.ID
ORDER BY depimast.ACCNUMBER
  `;

  sql = sql.replace(/;?\s*$/, "");

  db.query(sql, [MMBRNO], (err, results) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ error: "❌ Error: " + err.message });
    }

    if (!results || results.length === 0) {
      return res.status(404).json({ message: "No data found for this user." });
    }

    try {
      // Since filtered by MMBRNO, all rows are for the same member
      const member = results[0];
      const accounts = results;

      let personal = `
=== MEMBER INFO ===
membershipNo: ${member.MMBRNO}
Company_Code: 90
TITLE: ${member.TITLE}
fullName: ${member.FNAME || ""} ${member.MNAME || ""} ${member.SNAME || ""}
dateOfBirth: ${member.DOB ? (() => {
  const d = new Date(member.DOB);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}${month}${year}`;
})() : ""}
dateOfBirthFormated: ${member.DOB ? (() => {
  const d = new Date(member.DOB);
  return isNaN(d) ? "" : `${String(d.getDate()).padStart(2,"0")}-${String(d.getMonth()+1).padStart(2,"0")}-${d.getFullYear()}`;
})() : ""}
SEX: ${member.SEX || ""}
mobileNo: ${member.PERMNT_CONTACT || ""}
address: ${member.PERMNT_ADD || ""}, ${member.PERMNT_CITY || ""},- ${member.PERMNT_PIN || ""}
OCCUPATION: ${member.OCCUPATION || ""}
houseNo: 
Village: ${member.PERMNT_ADD || ""}
street: ${member.PERMNT_ADD || ""}
post: ${member.PERMNT_CITY || ""}
district: ${member.PERMNT_CITY || ""}
CITY: ${member.PERMNT_CITY || ""}
state: ${member.PERMNT_STATE || ""}
pincode: ${member.PERMNT_PIN || ""}
mobileNo: ${member.PRSNT_CONTACT || ""}
guardianName: ${member.FATHUSNAME || ""} 
MOTHERNAME: ${member.MOTHERNAME || ""}
WFATHUSNAME: ${member.WFATHUSNAME || ""}
WITNESS: ${member.WITNESS || ""}
REGDATE: ${formatDMY(member.REGDATE)}
DOM: ${member.DOM || ""}
AGE: ${member.AGE || ""}
CHILDS: ${member.CHILDS || ""}
PERMNT_ADDRESS: ${member.PERMNT_ADD || ""} ${member.PERMNT_CITY || ""} ${member.PERMNT_STATE || ""} - ${member.PERMNT_PIN || ""}
PRSNT_ADDRESS: ${member.PRSNT_ADD || ""} ${member.PRSNT_CITY || ""} ${member.PRSNT_STATE || ""} - ${member.PRSNT_PIN || ""}
RELIGION: ${member.RELIGION || ""}
CASTE: ${member.CASTE || ""}
panCard: ${member.PAN || ""}
AddharCard:
Religion: 
Document1: 
Document2:
BGROUP: ${member.BGROUP || ""}
COUNTRY: ${member.COUNTRY || ""}
MSTATUS: ${member.MSTATUS || ""}
EDUCATION: ${member.EDUCATION || ""}

Verifier: JAGDISH PRSAD
VerifierCode: 196200010
VerifierFatherName: OM PRAKASH
VerifierAddress: KALWARI, HATHRAS
---------------------

`;

      // --- ACCOUNT INFO for each row ---
      let accountInfos = accounts.map((row, i) => {
        // Parse DEPC_NOM1 if available
        let parsedNominee = {};
        if (row.DEPC_NOM1) {
          const parts = row.DEPC_NOM1.split(',');
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
age: ${row.AGE || ""}
accountOpeningDate: ${row.ACCOPENDATE ? (() => {
  const d = new Date(row.ACCOPENDATE);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}${month}${year}`;
})() : ""}
accountOpeningDateFormatted: ${row.ACCOPENDATE ? (() => {
  const d = new Date(row.ACCOPENDATE);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
})() : ""}
centreCode: ${row.BRANCHCODE || ""}
centreName: ${row.BRANCH_NAME || ""}
region: ${row.REGION_NAME || ""}
applicationNo: ${row.APPLNUMBER || ""}
FLDWCODE: ${row.FLDWCODE || ""} 
ACCTRFDATE: ${row.ACCTRFDATE || ""}
MATURDATE: ${row.MATURDATE || ""}
DEPOSTMODE: ${row.DEPOSTMODE || ""}
paymentMode: CASH
proofDocument: ADDHAR CARD
INTPMODE: ${row.INTPMODE || ""}
DAYSOFDEP: ${row.DAYSOFDEP || ""}
certificateNo: ${row.PASSBOOKNO || ""}
receiptNo: ${row.RECEIPTNO || ""}
denomination: ${row.DENOMINATION || ""}
amount: ${row.DENOMINATION || ""}
amountInWords: ${typeof numberToWords === 'function' ? numberToWords(Number(row.DENOMINATION || 0))  : 'N/A'} Only
Passbook NO : ${row.PASSBOOKNO || ""}
nomineeName: ${parsedNominee.name || ""}
nomineeAge: ${parsedNominee.age || ""}
nomineeAgeFromDepc: ${row.DEPC_AGE || ""}
nomineeRelation: ${parsedNominee.relation || ""}
proportion: ${parsedNominee.proportion || ""}
nominee1: ${row.DEPC_NOM1 || ""}
nominee2: ${row.DEPC_NOM2 || ""}
`;
      }).join("\n\n---------------------\n\n");

      // Final file content for this member
      const fileContent = personal + "\n\n" + accountInfos;

      // Save file in a private directory (not under public)
      const sanitizedKey = MMBRNO.replace(/[^a-zA-Z0-9]/g, '_');
      const fileName = `${sanitizedKey}.txt`;
      const downloadsDir = path.join(__dirname, "public/Pending");

      if (!fs.existsSync(downloadsDir)) {
        fs.mkdirSync(downloadsDir, { recursive: true });
      }

      const filePath = path.join(downloadsDir, fileName);
      fs.writeFileSync(filePath, fileContent, "utf8");

      console.log(`File saved at: ${filePath}`);

      // Do not download; just send success response as JSON
      res.status(200).json({ message: `File ${fileName} created successfully in pending folder` });
    } catch (e) {
      console.error('Error creating TXT file:', e);
      return res.status(500).json({ error: "❌ Error creating TXT file: " + e.message });
    }
  });
});

app.use("/downloads", express.static(path.join(__dirname, "public/Pending")));

// Sharayan and Humara // ===== Member Search Page =====
app.get("/sarayan", (req, res) => {
  res.render("membersearch", {
    memberInfo: null,
    accounts: [],
    member: "",
    notFound: false
  });
});
app.post("/membersearch", (req, res) => {

  const { EMMBRNO, ACCOUNTNAME, ACCNUMBER, PASSBOOKNO, RECEIPTNO, APPLNUMBER, ACCOPENDATE } = req.body;

  let accountsSql = `
  SELECT DISTINCT
      CONTREF.EMMBRNO AS MemberNo,
      DEPIMAST.*
  FROM DEPIMAST
  INNER JOIN SCHEMAST 
      ON DEPIMAST.SCHECODE = SCHEMAST.SCHECODE 
     AND DEPIMAST.SCVTYPE = SCHEMAST.SCVTYPE
  INNER JOIN CONTREF 
      ON DEPIMAST.ACCNUMBER = CONTREF.CONTNO
  WHERE SCHEMAST.COMPCODE NOT IN ('90','02')
`;


  let params = [];

  if (EMMBRNO) {
    accountsSql += " AND CONTREF.EMMBRNO = ?";
    params.push(EMMBRNO);
  }
  if (ACCOUNTNAME) {
    accountsSql += " AND DEPIMAST.ACCOUNTNAME LIKE ?";
    params.push("%" + ACCOUNTNAME + "%");
  }
  if (ACCNUMBER) {
    accountsSql += " AND DEPIMAST.ACCNUMBER = ?";
    params.push(ACCNUMBER);
  }
  if (PASSBOOKNO) {
    accountsSql += " AND DEPIMAST.PASSBOOKNO = ?";
    params.push(PASSBOOKNO);
  }
  if (RECEIPTNO) {
    accountsSql += " AND DEPIMAST.RECEIPTNO = ?";
    params.push(RECEIPTNO);
  }
  if (APPLNUMBER) {
    accountsSql += " AND DEPIMAST.APPLNUMBER = ?";
    params.push(APPLNUMBER);
  }
  if (ACCOPENDATE) {
    accountsSql += " AND DEPIMAST.ACCOPENDATE = ?";
    params.push(ACCOPENDATE);
  }

  accountsSql += " LIMIT 500";

  // Run accounts query
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
    if (EMMBRNO && !memberNos.has(EMMBRNO)) {
      memberNos.add(EMMBRNO);
    }
    let groupKeys = Array.from(memberNos);
    groupKeys.forEach(key => {
      if (!groups[key]) {
        groups[key] = { accounts: [] };
      }
    });

    // Fetch DEPCMAST details for each account (if any accounts found)
    const accountNumbers = uniqueAccountResults.map(acc => acc.ACCNUMBER);
    let depcResults = []; // Default empty array

    function processGroups() {
      if (groupKeys.length === 0) {
        res.render("membersearch", {
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
        db.query("SELECT * FROM EMEMBERMAST WHERE EMMBRNO = ?", [key], (err, memberResults) => {
          if (err) {
            console.error("Error querying member:", err);
            // Continue or handle error
          }

          groups[key].member = memberResults[0] || null;

          processed++;
          if (processed === groupKeys.length) {
            // Do NOT create files here; files will be generated on button press via /generateFile

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

            res.render("membersearch", {
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
          FATHHUSNAME, LOCADDRES, PERMADDR, NOM1, NOM2, NOM3, NOM4, RECEIPTNO
        FROM DEPCMAST 
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



// function getCompanyCode(membershipNo) {
//   if (!membershipNo) return "";

//   const firstDigit = membershipNo.toString()[0];

//   if (firstDigit === "9") return "96";
//   if (firstDigit === "6") return "97";

//   return ""; // agar koi aur digit ho
// }


// New endpoint to generate file on button press
app.get("/generateFile/:memberNo", (req, res) => {
  const memberNo = req.params.memberNo;

  // Fetch member data
  db.query("SELECT * FROM EMEMBERMAST WHERE EMMBRNO = ?", [memberNo], (err, memberResults) => {
    if (err || !memberResults[0]) {
      return res.json({ error: "Member not found" });
    }

    const member = memberResults[0];

    // Fetch accounts for this member
    let accountsSql = `
      SELECT DISTINCT
  c.EMMBRNO   AS MemberNo,
  d.*,
  b.BRNCNAME, b.REGIONNAME   -- pick fields you actually need from brncmast
FROM DEPIMAST d
JOIN SCHEMAST s
  ON d.SCHECODE = s.SCHECODE
  AND d.SCVTYPE  = s.SCVTYPE
JOIN CONTREF c
  ON d.ACCNUMBER = c.CONTNO
LEFT JOIN brncmast b
  ON b.BRANCHCODE = d.BRANCHCODE  
WHERE s.COMPCODE NOT IN ('90','02')
  AND c.EMMBRNO = ? 

    `;

    db.query(accountsSql, [memberNo], (err2, accountResults) => {
      if (err2) {
        return res.json({ error: "Error fetching accounts" });
      }

      const accounts = accountResults;

      // Fetch DEPCMAST for accounts
      const accountNumbers = accounts.map(acc => acc.ACCNUMBER);
      let depcResults = [];

      if (accountNumbers.length === 0) {
        return res.json({ error: "No accounts found" });
      }

      const depcSql = `
        SELECT 
          BRANCHCODE, ACCNUMBER, DATEOFBIRTH, AGE, OCCUPAT, 
          FATHHUSNAME, LOCADDRES, PERMADDR, NOM1, NOM2, NOM3, NOM4, RECEIPTNO
        FROM DEPCMAST 
        WHERE ACCNUMBER IN (${accountNumbers.map(() => "?").join(",")})
      `;

      db.query(depcSql, accountNumbers, (err3, results) => {
        if (err3) {
          return res.json({ error: "Error fetching DEPCMAST" });
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
membershipNo: ${member.EMMBRNO || ""}
Company_Code: ${getCompanyCode(member.EMMBRNO)}
fullName: ${member.MEMBER_NAME || ""}
dateOfBirth: ${member.DOB ? formatDDMMYYYY(member.DOB) : ""}
dateOfBirthFormated: ${member.DOB ? (() => {
  const d = new Date(member.DOB);
  return isNaN(d) ? "" : `${String(d.getDate()).padStart(2,"0")}-${String(d.getMonth()+1).padStart(2,"0")}-${d.getFullYear()}`;
})() : ""}
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
REGDATE: ${formatDMY(member.REGDATE)}
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
EMAIL: ${member.EMAIL || ""}
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
region:  ${row.REGIONNAME || ""}
paymentMode: CASH
proofDocument: ADDHAR CARD
INTPMODE: ${row.INTPMODE || ""}
DAYSOFDEP: ${row.DAYSOFDEP || ""}
certificateNo: ${row.PASSBOOKNO || ""}
receiptNo: ${row.RECEIPTNO || ""}
denomination: ${row.DENOMINATION || ""}
amount: ${row.DENOMINATION || ""}
amountInWords: ${typeof numberToWords === 'function' ? numberToWords(Number(row.DENOMINATION || 0)) : 'N/A'} Only
Passbook NO : ${row.PASSBOOKNO || ""}
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

/* ---------------- API ---------------- */
app.get('/api/account/:accnumber', (req, res) => {
  const accnumber = String(req.params.accnumber || '').trim();
  if (!accnumber) return res.status(400).json({ error: 'accnumber required' });

  console.log('[API] searching for accnumber:', accnumber);
  db.query(ACCOUNT_SELECT, [accnumber, accnumber, accnumber], (err, results) => {
    if (err) {
      console.error('[API] query error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (!results || results.length === 0) {
      return res.status(404).json({ message: 'Account not found' });
    }
    res.json(results[0]);
  });
});

/* ---------------- EJS pages ---------------- */
// render search page (always pass the keys so EJS never sees undefined)
app.get('/Search', (req, res) => {
  res.render('search', { error: null, data: null, accnumber: '' });
});

// handle form submission
app.post('/search', (req, res) => {
  const accnumber = String(req.body.accnumber || '').trim();

  if (!accnumber) {
    return res.render('search', {
      error: 'Please enter an account number',
      data: null,
      accnumber: ''
    });
  }

  console.log('[FORM] searching for accnumber:', accnumber);
  db.query(ACCOUNT_SELECT, [accnumber, accnumber, accnumber], (err, results) => {
    if (err) {
      console.error('[FORM] query error:', err);
      return res.render('search', {
        error: 'Database query failed (check server logs)',
        data: null,
        accnumber
      });
    }

    if (!results || results.length === 0) {
      return res.render('search', { error: 'Account not found', data: null, accnumber });
    }

    // Found — render same page but pass data so it shows below the form
    res.render('search', { error: null, data: results[0], accnumber });
  });
});





// ====== START SERVER ======
// app.listen(PORT, "0.0.0.0", () => {
//   console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
// });

app.get("/get96", (req, res) => {
  res.render("Get96HQ", {
    memberInfo: null,
    accounts: [],
    member: "",
    notFound: false
  });
});



app.post("/membersearch96", (req, res) => {
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
  if (MMBRNO) {
    accountsSql += " AND acc.MMBRNO = ?";
    params.push(MMBRNO);
  }
  if (ACCOUNTNAME) {
    accountsSql += " AND acc.ACCOUNTNAME LIKE ?";
    params.push("%" + ACCOUNTNAME + "%");
  }
  if (ACCNUMBER) {
    accountsSql += " AND acc.ACCNUMBER = ?";
    params.push(ACCNUMBER);
  }
  if (PASSBOOKNO) {
    accountsSql += " AND acc.NPBKORCERTNUM = ?";
    params.push(PASSBOOKNO);
  }
  if (RECEIPTNO) {
    accountsSql += " AND acc.RECEIPTNO = ?";
    params.push(RECEIPTNO);
  }
  if (APPLNUMBER) {
    accountsSql += " AND acc.APPLNUMBER = ?";
    params.push(APPLNUMBER);
  }
  if (ACCOPENDATE) {
    accountsSql += " AND acc.ACCOPENDATE = ?";
    params.push(ACCOPENDATE);
  }
  accountsSql += " LIMIT 500";
  // Run accounts query
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
// New endpoint to generate file on button press
app.get("/generateFile96/:memberNo", (req, res) => {
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
Company_Code: 96
fullName: ${member.MEMBER_NAM || ""}
dateOfBirth: ${member.DOB ? formatDDMMYYYY(member.DOB) : ""}
dateOfBirthFormated: ${member.DOB ? (() => {
  const d = new Date(member.DOB);
  return isNaN(d) ? "" : `${String(d.getDate()).padStart(2,"0")}-${String(d.getMonth()+1).padStart(2,"0")}-${d.getFullYear()}`;
})() : ""}
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
REGDATE: ${formatDMY(member.REGDATE)}
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




// Instead of app.listen()


// https.createServer(sslOptions, app).listen(5000, "0.0.0.0", () => {
//   console.log("✅ HTTPS Server running at https://192.168.1.50:5000");
//     console.log("✅ HTTPS Server running at https://192.168.1.100:5000");

// });


module.exports = app;