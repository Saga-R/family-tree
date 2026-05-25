/*
  Family Tree backend — Google Apps Script.
  Deploy once, paste the resulting Web App URL into ../config.js as APPS_SCRIPT_URL.

  Sheet contract:
    A Submissions tab is auto-created on first POST with the columns below.
    Approve a submission by typing "approved" into the Status column.
    Reject by typing "rejected". Leave blank or "pending" to keep it queued.

  Endpoints:
    POST { name, gender, dob, status, photoUrl, notes,
           anchorId, anchorName, relType,
           contributorName, inviteToken, lang, honeypot }
        → { ok: true } | { ok: false, error: '...' }

    GET  ?action=list  → { approved: [...], pending: N }
*/

const SHEET_ID = '1D78Gf9AD1NnnnSXkE3hT6y8W2cG4YpSgpeuBRHE7DCw';
const TAB = 'Submissions';

const HEADERS = [
  'Timestamp', 'Status', 'Name', 'Gender', 'DOB', 'Living', 'Photo URL', 'Notes',
  'Anchor (existing member)', 'Relationship', 'Anchor ID',
  'Contributor name', 'Invite token', 'Language',
  'Reviewer note', 'Final member ID',
];

function getSheet_() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sh = ss.getSheetByName(TAB);
  if (!sh) {
    sh = ss.insertSheet(TAB);
    sh.appendRow(HEADERS);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#f0eee7');
    sh.setFrozenRows(1);
    sh.setColumnWidth(1, 160);  // timestamp
    sh.setColumnWidth(2, 100);  // status
    sh.setColumnWidth(3, 180);  // name
    sh.setColumnWidth(9, 180);  // anchor
    // status dropdown
    const rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(['pending', 'approved', 'rejected'], true)
      .setAllowInvalid(false)
      .build();
    sh.getRange('B2:B').setDataValidation(rule);
  }
  return sh;
}

function jsonOut_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || '{}');

    // honeypot — silently accept and discard
    if (body.honeypot) return jsonOut_({ ok: true });

    const name = (body.name || '').toString().trim();
    if (!name) return jsonOut_({ ok: false, error: 'Name is required.' });
    if (name.length > 80) return jsonOut_({ ok: false, error: 'Name too long.' });

    const sh = getSheet_();
    sh.appendRow([
      new Date(),
      'pending',
      name,
      body.gender || '',
      body.dob || '',
      body.status || '',
      body.photoUrl || '',
      body.notes || '',
      body.anchorName || '',
      body.relType || '',
      body.anchorId || '',
      body.contributorName || '',
      body.inviteToken || '',
      body.lang || '',
      '', '',
    ]);

    return jsonOut_({ ok: true });
  } catch (err) {
    return jsonOut_({ ok: false, error: String(err) });
  }
}

function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) || 'list';
    if (action !== 'list') return jsonOut_({ ok: false, error: 'unknown action' });

    const sh = getSheet_();
    const last = sh.getLastRow();
    if (last < 2) return jsonOut_({ approved: [], pending: 0 });

    const rows = sh.getRange(2, 1, last - 1, HEADERS.length).getValues();
    const approved = [];
    let pending = 0;

    for (const r of rows) {
      const status = (r[1] || '').toString().toLowerCase().trim();
      if (status === 'approved') {
        approved.push({
          name: (r[2] || '').toString().trim(),
          gender: (r[3] || '').toString().trim(),
          dob: (r[4] || '').toString().trim(),
          living: (r[5] || '').toString().trim(),
          photoUrl: (r[6] || '').toString().trim(),
          notes: (r[7] || '').toString().trim(),
          anchorName: (r[8] || '').toString().trim(),
          relType: (r[9] || '').toString().trim(),
          anchorId: (r[10] || '').toString().trim(),
        });
      } else if (status === '' || status === 'pending') {
        pending++;
      }
    }
    return jsonOut_({ approved: approved, pending: pending });
  } catch (err) {
    return jsonOut_({ ok: false, error: String(err) });
  }
}
