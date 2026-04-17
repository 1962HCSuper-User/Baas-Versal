const express = require('express');
const got = require('got').default; // For got v12+
const cheerio = require('cheerio');
const { CookieJar } = require('tough-cookie');
const app = express();
const port = 8000;

// ------------------ CONFIG ------------------
const EMP_CODE = '196200010'; // <-- replace with actual empcode
const PASSWORD = '196200010'; // <-- replace with actual password
const BASE_URL = 'http://192.168.200.112:73';
// --------------------------------------------

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // For serving static files if needed (e.g., custom CSS/JS)

// Reusable got instance with persistent cookies
const cookieJar = new CookieJar();
const req = got.extend({
    cookieJar,
    prefixUrl: BASE_URL,
    throwHttpErrors: false
});

// Function to scrape and return data object
async function scrapeData(memberNo, accountNo) {
    // Step 1: GET login page
    let loginRes = await req.get('login');
    let $ = cheerio.load(loginRes.body);
    let loginForm = {
        __VIEWSTATE: $('#__VIEWSTATE').val(),
        __VIEWSTATEGENERATOR: $('#__VIEWSTATEGENERATOR').val(),
        __EVENTVALIDATION: $('#__EVENTVALIDATION').val(),
        txtuser: EMP_CODE,
        txtpass: PASSWORD,
        Button1: 'Login'
    };

    // Step 2: POST login
    loginRes = await req.post('login', { form: loginForm });

    if (!loginRes.body.includes('Welcome')) {
        throw new Error('Login failed - check credentials or network');
    }

    // Step 3: GET ImageView page
    let imageViewRes = await req.get('ImageView');
    $ = cheerio.load(imageViewRes.body);
    const searchForm = {
        __VIEWSTATE: $('#__VIEWSTATE').val(),
        __VIEWSTATEGENERATOR: $('#__VIEWSTATEGENERATOR').val(),
        __EVENTVALIDATION: $('#__EVENTVALIDATION').val(),
        __EVENTTARGET: $('#__EVENTTARGET').val() || '',
        __EVENTARGUMENT: $('#__EVENTARGUMENT').val() || '',
        txtfrommemberno: memberNo || '',
        txtfromaccnumber: accountNo || '',
        Button1: 'View'
    };

    // Step 4: POST search
    imageViewRes = await req.post('ImageView', { form: searchForm });
    $ = cheerio.load(imageViewRes.body);

    // Step 5: Extract data
    const memDate = $('#lblMemdate').text().trim();
    const memTag = $('#lblmemtag').text().trim();
    const accTag = $('#lblacctag').text().trim();
    const memberNoImage = $('#lblmembernoimage').text().trim();
    const accountNoImage = $('#lblaccountnoimage').text().trim();
    const file1 = $('#lbfile1').text().trim();
    const file2 = $('#lbfile2').text().trim();

    // Step 6: Fetch PDFs if present
    let pdf1Base64 = '';
    let pdf2Base64 = '';
    const pdf1Url = $('#pdf').attr('data');
    const pdf2Url = $('#pdf2').attr('data');

    if (pdf1Url) {
        const pdf1Buffer = await req.get(pdf1Url, { responseType: 'buffer' });
        pdf1Base64 = pdf1Buffer.body.toString('base64');
    }
    if (pdf2Url) {
        const pdf2Buffer = await req.get(pdf2Url, { responseType: 'buffer' });
        pdf2Base64 = pdf2Buffer.body.toString('base64');
    }

    return {
        memDate,
        memTag,
        accTag,
        memberNoImage,
        accountNoImage,
        file1,
        file2,
        pdf1Base64,
        pdf2Base64
    };
}

// Function to render the full page HTML with form at top and optional results below
function renderPage(data = null, error = null) {
    const currentYear = new Date().getFullYear();
    let resultsHtml = '';
    if (error) {
        resultsHtml = `<div class="alert alert-danger mt-4">${error}</div>`;
    } else if (data) {
        resultsHtml = `
            <div class="card mt-4" id="infoCard" style="display: none;">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h2 class="mb-0">Fetched Information</h2>
                    <button class="btn btn-sm btn-outline-secondary" onclick="toggleInfo()">Toggle</button>
                </div>
                <div class="card-body">
                    <div class="info">
                        <p><strong>Membership Date:</strong> ${data.memDate}</p>
                        <p><strong>Membership Form:</strong> ${data.memTag}</p>
                        <p><strong>Account Opening Form:</strong> ${data.accTag}</p>
                        <p><strong>Member No Image:</strong> ${data.memberNoImage}</p>
                        <p><strong>Account No Image:</strong> ${data.accountNoImage}</p>
                        <p><strong>File 1:</strong> ${data.file1}</p>
                        <p><strong>File 2:</strong> ${data.file2}</p>
                    </div>
                </div>
            </div>
            <p class="mt-4"><strong>Membership Date:</strong> ${data.memDate}</p>
            <div class="card mt-4">
                <div class="card-header">
                    <h2 class="mb-0">PDF Documents</h2>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6 mb-4">
                            <h4 class="text-center mb-3">Membership Form</h4>
                            ${data.pdf1Base64 ? `<object class="pdf-viewer" type="application/pdf" data="data:application/pdf;base64,${data.pdf1Base64}"></object>` : '<p class="text-center">Image Not Found</p>'}
                        </div>
                        <div class="col-md-6 mb-4">
                            <h4 class="text-center mb-3">Account Opening Form</h4>
                            ${data.pdf2Base64 ? `<object class="pdf-viewer" type="application/pdf" data="data:application/pdf;base64,${data.pdf2Base64}"></object>` : '<p class="text-center">Image Not Found</p>'}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Data Scraper - Professional Interface</title>
            <link rel="icon" href="/favicon.ico?v=2" type="image/x-icon">
<link rel="shortcut icon" href="/favicon.ico?v=2" type="image/x-icon">
            
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            <style>
                /* ====== GLOBAL ====== */
                body {
                  margin: 0;
                  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
                  background: #f4f6f9;
                  color: #333;
                }

                a {
                  text-decoration: none;
                  color: inherit;
                }

                h1,
                h2,
                h3,
                h4 {
                  margin: 0;
                }

                /* ====== HEADER ====== */
                header {
                  background: linear-gradient(90deg, #004080, #0066cc);
                  color: white;
                  padding: 20px 40px;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                }

                header h1 {
                  font-size: 24px;
                  font-weight: 600;
                  letter-spacing: 0.5px;
                }

                header span {
                  font-size: 14px;
                  opacity: 0.9;
                }

                /* ====== NAV ====== */
                nav {
                  background: #0055aa;
                  display: flex;
                  justify-content: center;
                  padding: 12px 0;
                }

                nav a {
                  color: white;
                  font-weight: 500;
                  margin: 0 20px;
                  font-size: 15px;
                  position: relative;
                }

                nav a::after {
                  content: "";
                  display: block;
                  height: 2px;
                  background: white;
                  width: 0;
                  transition: width 0.3s ease;
                  margin: 0 auto;
                }

                nav a:hover::after {
                  width: 100%;
                }

                /* ====== FOOTER ====== */
                footer {
                  background: #004080;
                  color: white;
                  text-align: center;
                  padding: 15px;
                  font-size: 14px;
                }

                /* ====== MAIN CONTENT ====== */
                main {
                  min-height: calc(100vh - 200px);
                  padding: 20px;
                }

                .container {
                  max-width: 1200px;
                  margin: auto;
                }

                .form-container {
                  background-color: #ffffff; /* White form */
                  padding: 20px;
                  border-radius: 10px;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                .form-control {
                  border-color: #ced4da;
                }

                .btn-primary {
                  background-color: #0d6efd;
                  border: none;
                }

                .btn-secondary {
                  background-color: #6c757d;
                  border: none;
                }

                .card {
                  background-color: #ffffff;
                  border: none;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                  border-radius: 10px;
                  overflow: hidden;
                }

                .card-header {
                  background-color: #e9ecef;
                  font-weight: bold;
                }

                .info p {
                  font-size: 18px;
                  margin: 10px 0;
                }

                .pdf-viewer {
                  width: 100%;
                  height: 800px;
                  border: 1px solid #dee2e6;
                  border-radius: 5px;
                }

                .input-group-text {
                  background-color: #e9ecef;
                }

                .form-row {
                  display: flex;
                  gap: 10px;
                }

                .form-row .input-group {
                  flex: 1;
                }

                .quick-links-grid {
                  display: grid;
                  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                  gap: 20px;
                  margin-top: 15px;
                }

                .link-box {
                  background: #f9fbff;
                  border: 1px solid #e0e7ff;
                  border-radius: 10px;
                  padding: 25px 20px;
                  text-align: center;
                  color: #004080;
                  font-weight: 500;
                  font-size: 15px;
                  transition: all 0.3s ease;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                }

                .link-box .icon {
                  font-size: 32px;
                  margin-bottom: 12px;
                  transition: transform 0.3s ease;
                }

                .link-box:hover {
                  background: #004080;
                  color: white;
                  transform: translateY(-5px);
                  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
                }

                .link-box:hover .icon {
                  transform: scale(1.2) rotate(10deg);
                }

                /* ====== RESPONSIVE ====== */
                @media (max-width: 768px) {
                  header,
                  main {
                    padding: 20px;
                  }

                  nav {
                    flex-wrap: wrap;
                  }

                  nav a {
                    margin: 10px;
                  }

                  .card {
                    padding: 20px;
                  }
                }
            </style>
        </head>
        <body>
            <header>
                <h1>Sahara India Pariwar</h1>
                <span>Secure • Reliable • Professional</span>
            </header>
            <nav>
                <a href="/Home">Home</a>
                <a href="/Sahara_Credit">Sahara Credit Cooperative Society Ltd.</a>
                <a href="/amount">Deposit Amount Check</a>
                <a href="/sarayan">Universal</a>
                <a href="/AddUser">About</a>        
                <a href="/reports">Other Portal</a>
                <a href="/about">73 Image View</a>
            </nav>
            <main>
                <div class="container">
                    <div class="form-container mt-4">
                        <h2 class="text-center mb-4">Enter Details to Fetch Data</h2>
                        <form id="scrapeForm" action="/" method="POST">
                            <div class="form-row">
                                <div class="input-group">
                                    <span class="input-group-text"><i class="fas fa-user"></i></span>
                                    <input type="text" class="form-control" id="memberNo" name="memberNo" placeholder="e.g., 61631600738">
                                </div>
                                <div class="input-group">
                                    <span class="input-group-text"><i class="fas fa-lock"></i></span>
                                    <input type="text" class="form-control" id="accountNo" name="accountNo" placeholder="e.g., 61636201638">
                                </div>
                            </div>
                            <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-3">
                                <button type="button" class="btn btn-secondary me-md-2" onclick="clearForm()"><i class="fas fa-times"></i> Clear</button>
                                <button type="submit" class="btn btn-primary"><i class="fas fa-search"></i> Search</button>
                            </div>
                        </form>
                    </div>
                    ${resultsHtml}
                </div>
            </main>
            <footer>
                © ${currentYear} Banking System. All rights reserved.
            </footer>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
            <script>
                function clearForm() {
                    document.getElementById('memberNo').value = '';
                    document.getElementById('accountNo').value = '';
                }

                function toggleInfo() {
                    const card = document.getElementById('infoCard');
                    if (card.style.display === 'none') {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                }

                document.getElementById('scrapeForm').addEventListener('submit', function(event) {
                    const memberNo = document.getElementById('memberNo').value.trim();
                    const accountNo = document.getElementById('accountNo').value.trim();
                    if (!memberNo && !accountNo) {
                        event.preventDefault();
                        alert('Please provide at least one of Member No or Account No.');
                    }
                });

                // Ensure Enter key submits the form
                document.addEventListener('keypress', function(event) {
                    if (event.key === 'Enter') {
                        const form = document.getElementById('scrapeForm');
                        if (document.activeElement === document.getElementById('memberNo') || document.activeElement === document.getElementById('accountNo')) {
                            form.submit();
                        }
                    }
                });
            </script>
        </body>
        </html>
    `;
}

// Routes
app.route('/')
    .get((req, res) => {
        res.send(renderPage());
    })
    .post(async (req, res) => {
        let { memberNo, accountNo } = req.body;
        memberNo = memberNo ? memberNo.trim() : '';
        accountNo = accountNo ? accountNo.trim() : '';

        if (!memberNo && !accountNo) {
            return res.send(renderPage(null, 'Please provide at least one of Member No or Account No.'));
        }

        try {
            const data = await scrapeData(memberNo, accountNo);
            res.send(renderPage(data));
        } catch (err) {
            console.error(err);
            res.send(renderPage(null, `Error: ${err.message}`));
        }
    });

app.get('/Home', (req, res) => {
    res.redirect('https://192.168.1.100:5000/');  // auto redirect immediately
});


app.get('/Sahara_Credit', (req, res) => {
    res.redirect('https://192.168.1.100:5000/Sahara_Credit');  // auto redirect immediately
});


app.get('/sarayan', (req, res) => {
    res.redirect('https://192.168.1.100:5000/sarayan');  // auto redirect immediately
});

app.get('/amount', (req, res) => {
    res.redirect('https://192.168.1.100:5000/amount');  // auto redirect immediately
});


// app.get('/about', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'PortflioInLight.html'));
// }); 


app.get("/favicon.ico", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "Sahara-Logo-Web.ico"));
});


app.get('/about', (req, res) => {
    res.redirect('http://192.168.1.100:8000/');  // auto redirect immediately
});


app.get('/reports', (req, res) => {
    res.redirect('https://192.168.1.100:5000/reports');  // auto redirect immediately
});


app.get('/Main-Home', (req, res) => {
    res.redirect('https://192.168.1.100:5000/');  // auto redirect immediately
});



app.listen(port, "0.0.0.0" , () => console.log(`Server running at http://192.168.1.100:${port}`));