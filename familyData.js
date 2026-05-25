// familyData.js — Family Tree Data Model + Auto-Layout

const FD = (function () {
  'use strict';

  // ── People (expanded from CSV) ────────────────────────────────────────────
  let people = [
    // Daliya — earliest generations
    { id: 'ramdayalji',    name: 'Ramdayalji Daliya',     gender: 'M', dob: '', status: 'Deceased', notes: '', photoUrl: '', family: 'Daliya' },
    { id: 'ramchandraji',  name: 'Ramchandraji Daliya',   gender: 'M', dob: '', status: 'Deceased', notes: '', photoUrl: '', family: 'Daliya' },
    { id: 'dhapibai',      name: 'Dhapibai Daliya',       gender: 'F', dob: '', status: 'Deceased', notes: '', photoUrl: '', family: 'Daliya' },
    { id: 'narsinghdasji', name: 'Narsinghdasji Daliya',  gender: 'M', dob: '', status: 'Deceased', notes: '', photoUrl: '', family: 'Daliya' },
    { id: 'ratnibai',      name: 'Ratnibai Daliya',       gender: 'F', dob: '', status: 'Deceased', notes: '', photoUrl: '', family: 'Daliya' },
    { id: 'asaramji',      name: 'Asaramji Daliya',       gender: 'M', dob: '', status: 'Alive',    notes: '', photoUrl: '', family: 'Daliya' },
    { id: 'shantadevi',    name: 'Shantadevi Daliya',     gender: 'F', dob: '', status: 'Alive',    notes: '', photoUrl: '', family: 'Daliya' },
    // Asaramji's children
    { id: 'ashok',         name: 'Ashok Daliya',          gender: 'M', dob: '', status: 'Alive',    notes: '', photoUrl: '', family: 'Daliya' },
    { id: 'arun',          name: 'Arun Daliya',           gender: 'M', dob: '', status: 'Deceased', notes: '', photoUrl: '', family: 'Daliya' },
    { id: 'deepak',        name: 'Deepak Daliya',         gender: 'M', dob: '', status: 'Alive',    notes: '', photoUrl: '', family: 'Daliya' },
    // Ashok's wife (Kalantri-born)
    { id: 'santosh',       name: 'Santosh Daliya',        gender: 'F', dob: '', status: 'Alive',    notes: 'Born: Kalantri', photoUrl: '', family: 'Kalantri' },
    // Arun's wife
    { id: 'lata',          name: 'Lata Daliya',           gender: 'F', dob: '', status: 'Alive',    notes: '', photoUrl: '', family: 'Daliya' },
    // Deepak's wife (Sawal-born)
    { id: 'tanu',          name: 'Tanu Daliya',           gender: 'F', dob: '', status: 'Alive',    notes: 'Born: Sawal', photoUrl: '', family: 'Sawal' },
    // Ashok's children
    { id: 'sagar',         name: 'Sagar Daliya',          gender: 'M', dob: '', status: 'Alive',    notes: '', photoUrl: '', family: 'Daliya' },
    { id: 'shruti',        name: 'Shruti Daliya',         gender: 'F', dob: '', status: 'Alive',    notes: '', photoUrl: '', family: 'Daliya' },
    // Arun's son
    { id: 'sarang',        name: 'Sarang Daliya',         gender: 'M', dob: '', status: 'Alive',    notes: '', photoUrl: '', family: 'Daliya' },
    // Deepak's son
    { id: 'akshat',        name: 'Akshat Daliya',         gender: 'M', dob: '', status: 'Alive',    notes: '', photoUrl: '', family: 'Daliya' },
    // Sagar's wife (Kasat-born)
    { id: 'riya',          name: 'Riya Kasat',            gender: 'F', dob: '', status: 'Alive',    notes: 'Born: Kasat', photoUrl: '', family: 'Kasat' },

    // Kalantri family
    { id: 'satyanarayan',  name: 'Satyanarayan Kalantri', gender: 'M', dob: '', status: 'Alive',    notes: '', photoUrl: '', family: 'Kalantri' },
    { id: 'gitadevi',      name: 'Gitadevi Kalantri',     gender: 'F', dob: '', status: 'Deceased', notes: '', photoUrl: '', family: 'Kalantri' },
    { id: 'savitri',       name: 'Savitri Sarda',         gender: 'F', dob: '', status: 'Alive',    notes: 'Born: Kalantri', photoUrl: '', family: 'Kalantri' },
    { id: 'shyam',         name: 'Shyam Kalantri',        gender: 'M', dob: '', status: 'Alive',    notes: '', photoUrl: '', family: 'Kalantri' },
    { id: 'balkrishna',    name: 'Balkrishna Kalantri',   gender: 'M', dob: '', status: 'Alive',    notes: '', photoUrl: '', family: 'Kalantri' },
    { id: 'rajgouri',      name: 'Rajgouri Mantri',       gender: 'F', dob: '', status: 'Alive',    notes: 'Born: Kalantri', photoUrl: '', family: 'Kalantri' },
    { id: 'sarwan',        name: 'Sarwan Mantri',         gender: 'M', dob: '', status: 'Alive',    notes: '', photoUrl: '', family: 'Mantri' },
    { id: 'nikunj',        name: 'Nikunj Mantri',         gender: 'M', dob: '', status: 'Alive',    notes: '', photoUrl: '', family: 'Mantri' },
    { id: 'anuj',          name: 'Anuj Mantri',           gender: 'M', dob: '', status: 'Alive',    notes: '', photoUrl: '', family: 'Mantri' },

    // Kasat family (Riya's birth family)
    { id: 'ravindra',      name: 'Ravindra Kasat',        gender: 'M', dob: '', status: 'Alive',    notes: '', photoUrl: '', family: 'Kasat' },
    { id: 'sangita',       name: 'Sangita Kasat',         gender: 'F', dob: '', status: 'Alive',    notes: '', photoUrl: '', family: 'Kasat' },
    { id: 'vedant',        name: 'Vedant Kasat',          gender: 'M', dob: '', status: 'Alive',    notes: '', photoUrl: '', family: 'Kasat' },

    // Sawal family (Tanu's birth family)
    { id: 'tanvi',         name: 'Tanvi Sawal',           gender: 'F', dob: '', status: 'Alive',    notes: '', photoUrl: '', family: 'Sawal' },
    { id: 'chandan',       name: 'Chandan Kumar',         gender: 'M', dob: '', status: 'Alive',    notes: '', photoUrl: '', family: 'Kumar' },
  ];

  let relationships = [
    // Daliya parental chain
    { type: 'parent', parent: 'ramdayalji',    child: 'ramchandraji'  },
    { type: 'spouse', a: 'ramchandraji',  b: 'dhapibai'  },
    { type: 'parent', parent: 'ramchandraji',  child: 'narsinghdasji' },
    { type: 'parent', parent: 'dhapibai',      child: 'narsinghdasji' },
    { type: 'spouse', a: 'narsinghdasji', b: 'ratnibai' },
    { type: 'parent', parent: 'narsinghdasji', child: 'asaramji'      },
    { type: 'parent', parent: 'ratnibai',      child: 'asaramji'      },
    { type: 'spouse', a: 'asaramji',      b: 'shantadevi'  },
    // Asaramji's kids
    { type: 'parent', parent: 'asaramji',   child: 'ashok'  },
    { type: 'parent', parent: 'shantadevi', child: 'ashok'  },
    { type: 'parent', parent: 'asaramji',   child: 'arun'   },
    { type: 'parent', parent: 'shantadevi', child: 'arun'   },
    { type: 'parent', parent: 'asaramji',   child: 'deepak' },
    { type: 'parent', parent: 'shantadevi', child: 'deepak' },

    { type: 'spouse', a: 'ashok',  b: 'santosh' },
    { type: 'spouse', a: 'arun',   b: 'lata' },
    { type: 'spouse', a: 'deepak', b: 'tanu' },

    // Ashok's children
    { type: 'parent', parent: 'ashok',   child: 'sagar'  },
    { type: 'parent', parent: 'santosh', child: 'sagar'  },
    { type: 'parent', parent: 'ashok',   child: 'shruti' },
    { type: 'parent', parent: 'santosh', child: 'shruti' },
    // Arun + Lata's son
    { type: 'parent', parent: 'arun', child: 'sarang' },
    { type: 'parent', parent: 'lata', child: 'sarang' },
    // Deepak + Tanu's son
    { type: 'parent', parent: 'deepak', child: 'akshat' },
    { type: 'parent', parent: 'tanu',   child: 'akshat' },

    { type: 'spouse', a: 'sagar', b: 'riya' },

    // Kalantri lineage
    { type: 'spouse', a: 'satyanarayan', b: 'gitadevi' },
    { type: 'parent', parent: 'satyanarayan', child: 'santosh' },
    { type: 'parent', parent: 'gitadevi',     child: 'santosh' },
    { type: 'parent', parent: 'satyanarayan', child: 'savitri' },
    { type: 'parent', parent: 'gitadevi',     child: 'savitri' },
    { type: 'parent', parent: 'satyanarayan', child: 'shyam'   },
    { type: 'parent', parent: 'gitadevi',     child: 'shyam'   },
    { type: 'parent', parent: 'satyanarayan', child: 'balkrishna' },
    { type: 'parent', parent: 'gitadevi',     child: 'balkrishna' },
    { type: 'parent', parent: 'satyanarayan', child: 'rajgouri' },
    { type: 'parent', parent: 'gitadevi',     child: 'rajgouri' },
    { type: 'spouse', a: 'rajgouri', b: 'sarwan' },
    { type: 'parent', parent: 'rajgouri', child: 'nikunj' },
    { type: 'parent', parent: 'sarwan',   child: 'nikunj' },
    { type: 'parent', parent: 'rajgouri', child: 'anuj' },
    { type: 'parent', parent: 'sarwan',   child: 'anuj' },

    // Kasat
    { type: 'spouse', a: 'ravindra', b: 'sangita' },
    { type: 'parent', parent: 'ravindra', child: 'riya' },
    { type: 'parent', parent: 'sangita',  child: 'riya' },
    { type: 'parent', parent: 'ravindra', child: 'vedant' },
    { type: 'parent', parent: 'sangita',  child: 'vedant' },

    // Sawal — Tanvi is Tanu's sister
    // (Tanu's parents not given, so we link as siblings via implicit shared parent later)
    { type: 'sibling', a: 'tanu', b: 'tanvi' },
    { type: 'spouse', a: 'tanvi', b: 'chandan' },
  ];

  // Family ordering — left → right on canvas
  const FAMILY_ORDER = ['Sawal', 'Kasat', 'Daliya', 'Kalantri', 'Mantri'];
  const FAMILY_GAP = 200;

  // ── Compute display family ────────────────────────────────────────────────
  // Women who marry into another family are *displayed* in their husband's column,
  // but a dotted "natal" line connects them back to their father.
  function computeDisplayFamilies(ppl, rels) {
    const spouseMap = {};
    rels.forEach(r => {
      if (r.type === 'spouse') { spouseMap[r.a] = r.b; spouseMap[r.b] = r.a; }
    });

    const displayFam = {};
    ppl.forEach(p => {
      displayFam[p.id] = p.family;
    });
    // For each married woman whose birth family differs from her husband's, move her column
    ppl.forEach(p => {
      if (p.gender !== 'F') return;
      const sp = spouseMap[p.id]; if (!sp) return;
      const husband = ppl.find(x => x.id === sp); if (!husband) return;
      if (p.family !== husband.family) {
        displayFam[p.id] = husband.family;
      }
    });
    return displayFam;
  }

  function buildAutoLayout(ppl, rels) {
    const childMap = {}, parentMap = {}, spouseMap = {}, siblingMap = {};
    rels.forEach(r => {
      if (r.type === 'parent') {
        (childMap[r.parent] = childMap[r.parent] || []).push(r.child);
        (parentMap[r.child] = parentMap[r.child] || []).push(r.parent);
      } else if (r.type === 'spouse') {
        spouseMap[r.a] = r.b; spouseMap[r.b] = r.a;
      } else if (r.type === 'sibling') {
        (siblingMap[r.a] = siblingMap[r.a] || []).push(r.b);
        (siblingMap[r.b] = siblingMap[r.b] || []).push(r.a);
      }
    });

    // Generation via relaxation. Siblings are constrained to share a generation.
    const gen = {};
    ppl.forEach(p => { gen[p.id] = 0; });
    let changed = true, guard = 0;
    while (changed && guard++ < 200) {
      changed = false;
      rels.forEach(r => {
        if (r.type === 'parent') {
          const ng = (gen[r.parent] || 0) + 1;
          if ((gen[r.child] || 0) < ng) { gen[r.child] = ng; changed = true; }
        } else if (r.type === 'spouse') {
          const mg = Math.max(gen[r.a] || 0, gen[r.b] || 0);
          if ((gen[r.a] || 0) < mg) { gen[r.a] = mg; changed = true; }
          if ((gen[r.b] || 0) < mg) { gen[r.b] = mg; changed = true; }
        } else if (r.type === 'sibling') {
          const mg = Math.max(gen[r.a] || 0, gen[r.b] || 0);
          if ((gen[r.a] || 0) < mg) { gen[r.a] = mg; changed = true; }
          if ((gen[r.b] || 0) < mg) { gen[r.b] = mg; changed = true; }
        }
      });
    }

    const displayFam = computeDisplayFamilies(ppl, rels);

    // Group by display family + generation
    const byFamGen = {};
    ppl.forEach(p => {
      const fam = displayFam[p.id] || p.family || 'Other';
      const g = gen[p.id] || 0;
      byFamGen[fam] = byFamGen[fam] || {};
      (byFamGen[fam][g] = byFamGen[fam][g] || []).push(p.id);
    });

    const GY = 230;       // generation height (row height)
    const NW = 196;       // card width — must match renderer
    const NS = 60;        // gap between separate units
    const CS = 196;       // distance between centres of a couple
    const newLayout = {};

    const familyOrder = FAMILY_ORDER.filter(f => byFamGen[f]);
    Object.keys(byFamGen).forEach(f => { if (!familyOrder.includes(f)) familyOrder.push(f); });

    let famX = 80;

    familyOrder.forEach(fam => {
      const famGens = byFamGen[fam];
      const gens = Object.keys(famGens).map(Number).sort((a, b) => a - b);

      // Pre-compute widest row to size column
      let maxRowW = NW;
      gens.forEach(g => {
        const ids = famGens[g];
        const seen = new Set();
        let units = 0, w = 0;
        ids.forEach(id => {
          if (seen.has(id)) return;
          seen.add(id);
          const sp = spouseMap[id];
          if (sp && ids.includes(sp) && !seen.has(sp)) {
            seen.add(sp);
            w += CS + NW; units++;
          } else {
            w += NW; units++;
          }
        });
        if (units > 1) w += (units - 1) * NS;
        if (w > maxRowW) maxRowW = w;
      });

      const colCenter = famX + maxRowW / 2;

      gens.forEach(g => {
        const cy = 180 + g * GY;
        const ids = famGens[g];

        const processed = new Set();
        const units = [];
        ids.forEach(id => {
          if (processed.has(id)) return;
          processed.add(id);
          const sp = spouseMap[id];
          if (sp && ids.includes(sp) && !processed.has(sp)) {
            processed.add(sp);
            const isMale = ppl.find(p => p.id === id)?.gender === 'M';
            units.push(isMale ? [id, sp] : [sp, id]);
          } else {
            units.push([id]);
          }
        });

        // Sort units by parent x where placed, else by sibling order
        units.sort((ua, ub) => {
          const ax = ua.flatMap(i => (parentMap[i] || []).map(p => newLayout[p]?.cx).filter(v => v != null));
          const bx = ub.flatMap(i => (parentMap[i] || []).map(p => newLayout[p]?.cx).filter(v => v != null));
          if (!ax.length && !bx.length) return 0;
          if (!ax.length) return -1;
          if (!bx.length) return 1;
          return (ax.reduce((s, v) => s + v, 0) / ax.length) - (bx.reduce((s, v) => s + v, 0) / bx.length);
        });

        let totalW = 0;
        units.forEach((u, i) => {
          totalW += u.length === 2 ? CS + NW : NW;
          if (i < units.length - 1) totalW += NS;
        });

        let x = colCenter - totalW / 2 + NW / 2;
        units.forEach((u) => {
          if (u.length === 2) {
            newLayout[u[0]] = { cx: x, cy };
            newLayout[u[1]] = { cx: x + CS, cy };
            x += CS + NW + NS;
          } else {
            newLayout[u[0]] = { cx: x, cy };
            x += NW + NS;
          }
        });
      });

      famX += maxRowW + FAMILY_GAP;
    });

    // Family bands from actual placed positions
    const familyBands = familyOrder.map(fam => {
      const ids = [];
      Object.values(byFamGen[fam]).forEach(arr => arr.forEach(id => ids.push(id)));
      const xs = ids.map(id => newLayout[id]?.cx).filter(v => v != null);
      const ys = ids.map(id => newLayout[id]?.cy).filter(v => v != null);
      if (!xs.length) return null;
      return {
        name: fam,
        x1: Math.min(...xs) - NW / 2 - 50,
        x2: Math.max(...xs) + NW / 2 + 50,
        minY: Math.min(...ys) - 70,
        maxY: Math.max(...ys) + 80,
      };
    }).filter(Boolean);

    newLayout.__families = familyBands;
    newLayout.__displayFam = displayFam;
    return newLayout;
  }

  let layout = buildAutoLayout(people, relationships);

  function getPerson(id) { return people.find(p => p.id === id) || null; }
  function getSpouseId(id) {
    const r = relationships.find(r => r.type === 'spouse' && (r.a === id || r.b === id));
    return r ? (r.a === id ? r.b : r.a) : null;
  }
  function getChildIds(id) {
    return [...new Set(relationships.filter(r => r.type === 'parent' && r.parent === id).map(r => r.child))];
  }
  function getParentIds(id) {
    return [...new Set(relationships.filter(r => r.type === 'parent' && r.child === id).map(r => r.parent))];
  }
  function getSiblingIds(id) {
    const s = new Set();
    getParentIds(id).forEach(p => getChildIds(p).forEach(c => { if (c !== id) s.add(c); }));
    relationships.forEach(r => {
      if (r.type === 'sibling') {
        if (r.a === id) s.add(r.b);
        if (r.b === id) s.add(r.a);
      }
    });
    return [...s];
  }
  function collectUp(id, v) {
    if (v.has(id)) return; v.add(id);
    const sp = getSpouseId(id); if (sp) v.add(sp);
    getParentIds(id).forEach(p => collectUp(p, v));
    if (sp) getParentIds(sp).forEach(p => collectUp(p, v));
  }
  function collectDown(id, v) {
    if (v.has(id)) return; v.add(id);
    const sp = getSpouseId(id); if (sp) v.add(sp);
    getChildIds(id).forEach(c => collectDown(c, v));
  }
  function getLineage(id) {
    const s = new Set();
    collectUp(id, s); collectDown(id, s);
    getSiblingIds(id).forEach(sib => s.add(sib));
    return s;
  }

  function addMember(data, relType, targetId) {
    const id = data.name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z_]/g, '').slice(0, 20) + '_' + Date.now();
    const target = getPerson(targetId);
    const family = data.family || target?.family || 'Daliya';
    people = [...people, { ...data, family, id }];
    const spouseId = getSpouseId(targetId);

    if (relType === 'spouse') {
      relationships = [...relationships, { type: 'spouse', a: targetId, b: id }];
    } else if (relType === 'child') {
      [targetId, spouseId].filter(Boolean).forEach(p =>
        relationships = [...relationships, { type: 'parent', parent: p, child: id }]);
    } else if (relType === 'parent') {
      relationships = [...relationships, { type: 'parent', parent: id, child: targetId }];
    } else if (relType === 'sibling') {
      const parents = getParentIds(targetId);
      if (parents.length) {
        parents.forEach(p =>
          relationships = [...relationships, { type: 'parent', parent: p, child: id }]);
      } else {
        relationships = [...relationships, { type: 'sibling', a: targetId, b: id }];
      }
    }

    layout = buildAutoLayout(people, relationships);
    return id;
  }

  return {
    get people() { return people; },
    get relationships() { return relationships; },
    get layout() { return layout; },
    getPerson, getSpouseId, getChildIds, getParentIds, getSiblingIds, getLineage, addMember,
  };
})();
