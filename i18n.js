// i18n.js — bilingual strings (English + Hindi). Add new keys here, not in JSX.
// Access via window.T('key') or T('key', { name: 'Sagar' }) for interpolation.

(function () {
  const STR = {
    en: {
      app_title: 'Family Tree',
      search_placeholder: 'Search members…',
      zoom_out: 'Zoom out',
      zoom_in: 'Zoom in',
      zoom_reset: 'Reset view',
      import_csv: 'Import CSV',
      add_member: '+ Add Member',
      add_me: 'Add me',
      find_me: 'Find me',
      are_you_in_tree: 'Are you in the tree?',
      lang_toggle: 'हिन्दी',
      // welcome banner
      welcome_known_title: 'Hi {name} 👋',
      welcome_known_sub: 'Sagar made this for the family. You\'re in here — but a lot of your branch is still missing.',
      welcome_missing_title: 'Hi {name} 👋',
      welcome_missing_sub: 'Sagar made this for the family. You\'re not in the tree yet — spend 60 seconds to add yourself?',
      welcome_generic_title: '{n} of us are in here. Are you?',
      welcome_generic_sub: 'Sagar built this for the family — Daliyas, Kalantris, Kasats, Sawals, Mantris across 5 generations. Your branch is probably incomplete. Two minutes to fix that.',
      welcome_cta_add: 'I\'m missing — add me',
      welcome_cta_browse: 'Just browse',
      welcome_cta_find: 'Find me in the tree',
      // detail panel
      family: 'Family',
      male: 'Male',
      female: 'Female',
      alive: 'Alive',
      deceased: 'Deceased',
      unknown: 'Unknown',
      born: 'Born',
      parents: 'Parents',
      spouse: 'Spouse',
      children: 'Children',
      siblings: 'Siblings',
      // add member modal
      add_modal_title: 'Add Family Member',
      add_modal_sub: 'Define one relationship — all other connections will be inferred.',
      field_name: 'Full Name *',
      field_name_ph: 'e.g. Priya Sharma',
      field_gender: 'Gender',
      field_status: 'Status',
      field_dob: 'Date of Birth',
      field_dob_ph: 'e.g. 1965',
      field_notes: 'Notes',
      field_notes_ph: 'Born surname, etc.',
      field_photo: 'Photo URL (optional)',
      field_relationship: 'Relationship',
      field_type: 'Type',
      field_existing: 'Existing Member',
      rel_spouse_of: 'Spouse of',
      rel_child_of: 'Child of',
      rel_parent_of: 'Parent of',
      rel_sibling_of: 'Sibling of',
      cancel: 'Cancel',
      add_to_tree: 'Add to Tree',
      err_name_required: 'Name is required.',
      // legend
      legend: 'Legend',
      // footer pill
      pill_members: '{n} members',
      pill_families: '{n} families',
      pill_unions: '{n} unions',
      pill_pending: '{n} pending ✨',
      // submission success
      submitted_title: 'Got it. Sagar will review and add this shortly.',
      submitted_sub: 'Want to share with the family?',
      submitted_share: 'Share on WhatsApp',
      submitted_add_another: 'Add another relative',
      submitted_done: 'I\'m done',
      // misc
      tooltip_b: 'b.',
    },
    hi: {
      app_title: 'परिवार वृक्ष',
      search_placeholder: 'सदस्य खोजें…',
      zoom_out: 'छोटा करें',
      zoom_in: 'बड़ा करें',
      zoom_reset: 'रीसेट',
      import_csv: 'CSV आयात करें',
      add_member: '+ सदस्य जोड़ें',
      add_me: 'मुझे जोड़ें',
      find_me: 'मुझे ढूँढें',
      are_you_in_tree: 'क्या आप इस वृक्ष में हैं?',
      lang_toggle: 'English',
      welcome_known_title: 'नमस्ते {name} 👋',
      welcome_known_sub: 'सागर ने यह पूरे परिवार के लिए बनाया है। आप यहाँ हैं — पर आपकी शाखा अभी अधूरी है।',
      welcome_missing_title: 'नमस्ते {name} 👋',
      welcome_missing_sub: 'सागर ने यह पूरे परिवार के लिए बनाया है। आप अभी वृक्ष में नहीं हैं — 60 सेकंड में खुद को जोड़ें?',
      welcome_generic_title: '{n} लोग पहले से जुड़ चुके हैं। आप?',
      welcome_generic_sub: 'सागर ने यह पूरे परिवार के लिए बनाया है — दलिया, कलंत्री, कसत, सावल, मंत्री — 5 पीढ़ियाँ। आपकी शाखा अभी अधूरी होगी। 2 मिनट में पूरा करें।',
      welcome_cta_add: 'मैं नहीं हूँ — मुझे जोड़ें',
      welcome_cta_browse: 'बस देखें',
      welcome_cta_find: 'मुझे वृक्ष में ढूँढें',
      family: 'परिवार',
      male: 'पुरुष',
      female: 'महिला',
      alive: 'जीवित',
      deceased: 'स्वर्गवासी',
      unknown: 'अज्ञात',
      born: 'जन्म',
      parents: 'माता-पिता',
      spouse: 'जीवनसाथी',
      children: 'संतान',
      siblings: 'भाई-बहन',
      add_modal_title: 'परिवार सदस्य जोड़ें',
      add_modal_sub: 'एक रिश्ता बताएँ — बाकी जुड़ाव अपने आप पहचान लिए जाएँगे।',
      field_name: 'पूरा नाम *',
      field_name_ph: 'जैसे प्रिया शर्मा',
      field_gender: 'लिंग',
      field_status: 'स्थिति',
      field_dob: 'जन्म तिथि',
      field_dob_ph: 'जैसे 1965',
      field_notes: 'टिप्पणी',
      field_notes_ph: 'जन्म से उपनाम, आदि',
      field_photo: 'फोटो URL (वैकल्पिक)',
      field_relationship: 'रिश्ता',
      field_type: 'प्रकार',
      field_existing: 'मौजूदा सदस्य',
      rel_spouse_of: 'के पति/पत्नी',
      rel_child_of: 'की संतान',
      rel_parent_of: 'के माता/पिता',
      rel_sibling_of: 'के भाई/बहन',
      cancel: 'रद्द करें',
      add_to_tree: 'वृक्ष में जोड़ें',
      err_name_required: 'नाम आवश्यक है।',
      legend: 'विवरण',
      pill_members: '{n} सदस्य',
      pill_families: '{n} परिवार',
      pill_unions: '{n} विवाह',
      pill_pending: '{n} प्रतीक्षित ✨',
      submitted_title: 'मिल गया। सागर जल्द ही इसे जोड़ देंगे।',
      submitted_sub: 'परिवार के साथ साझा करें?',
      submitted_share: 'WhatsApp पर साझा करें',
      submitted_add_another: 'कोई और जोड़ें',
      submitted_done: 'बस इतना ही',
      tooltip_b: 'जन्म',
    },
  };

  const URL_PARAMS = new URLSearchParams(location.search);
  const initial = URL_PARAMS.get('lang')
    || localStorage.getItem('ft_lang')
    || (navigator.language && navigator.language.toLowerCase().startsWith('hi') ? 'hi' : 'en');

  window.__LANG = initial in STR ? initial : 'en';
  window.__INVITE = URL_PARAMS.get('invite') || null; // person not yet in tree
  window.__TO = URL_PARAMS.get('to') || null;          // person already in tree (their id)

  window.T = function (key, vars) {
    const dict = STR[window.__LANG] || STR.en;
    let s = dict[key];
    if (s == null) s = STR.en[key];
    if (s == null) return key;
    if (vars) for (const k in vars) s = s.replace(new RegExp('\\{' + k + '\\}', 'g'), vars[k]);
    return s;
  };

  window.setLang = function (l) {
    if (!STR[l]) return;
    window.__LANG = l;
    localStorage.setItem('ft_lang', l);
    // re-render via custom event so React can listen
    window.dispatchEvent(new Event('ft-lang-change'));
  };

  window.STRINGS = STR; // expose for debugging
})();
