// FamilyTreeApp.jsx — Modern minimal family tree

const { useState, useEffect, useRef, useMemo } = React;

const NW = 196, NH = 84;     // wider, modern card
const AVR = 24;              // avatar radius
const GY = 220;              // generation height (must match familyData.js)

// Modern color tokens — gender as a subtle accent only
const ACCENT = {
  M: '#3b6fb5',
  F: '#b53b72',
};
const STATUS_DOT = { Alive: '#2f9e6f', Deceased: '#a3a7ad', Unknown: '#c8cbd0' };

// Family identity colors (for headers + frames)
const FAMILY_THEME = {
  Daliya:   { ink: '#2f5d4f', soft: 'rgba(47,93,79,0.06)',  border: 'rgba(47,93,79,0.18)' },
  Kalantri: { ink: '#a4502b', soft: 'rgba(164,80,43,0.06)', border: 'rgba(164,80,43,0.20)' },
  Kasat:    { ink: '#4d4a86', soft: 'rgba(77,74,134,0.06)', border: 'rgba(77,74,134,0.20)' },
  Other:    { ink: '#4a4d54', soft: 'rgba(74,77,84,0.06)',  border: 'rgba(74,77,84,0.18)' },
};
const themeOf = fam => FAMILY_THEME[fam] || FAMILY_THEME.Other;
const initials = name => name.trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

// ── PersonNode (modern card) ─────────────────────────────────────────────────
function PersonNode({ person, pos, isSelected, isHighlighted, isDimmed, isCollapsed, hasChildren, onSelect, onHover, onHoverEnd, onCollapse }) {
  if (!pos) return null;
  const { gender, status, family } = person;
  const accent = ACCENT[gender] || ACCENT.M;
  const fam = themeOf(family);
  const deceased = status === 'Deceased';
  const hasPhoto = !!person.photoUrl;
  const x = pos.cx - NW / 2, y = pos.cy - NH / 2;

  const alpha   = isDimmed ? 0.32 : 1;
  const cardBg  = '#ffffff';
  const cardBorder = isSelected ? '#15171a'
                  : isHighlighted ? fam.ink
                  : isDimmed ? '#e8e6df'
                  : '#e3e1da';
  const sw = isSelected ? 2 : 1;

  const avCx = x + AVR + 14;
  const avCy = pos.cy;
  const textX = avCx + AVR + 12;

  const clipId = `clip-${person.id}`;

  // Use first names + given middle names only — band already shows surname
  const parts = person.name.trim().split(' ');
  const first = parts.length > 1 ? parts.slice(0, -1).join(' ') : person.name;
  // If person's birth family differs from their display column, show birth family as a small tag
  const displayFam = (typeof FD !== 'undefined' && FD.layout && FD.layout.__displayFam && FD.layout.__displayFam[person.id]) || person.family;
  const showBirthTag = displayFam !== person.family;

  return (
    <g style={{ opacity: alpha, cursor: 'pointer' }}
      onClick={e => { e.stopPropagation(); onSelect(person); }}
      onMouseEnter={e => onHover(person, e)}
      onMouseLeave={onHoverEnd}>

      <defs>
        {hasPhoto && (
          <clipPath id={clipId}>
            <circle cx={avCx} cy={avCy} r={AVR} />
          </clipPath>
        )}
      </defs>

      {/* selection halo */}
      {(isSelected || isHighlighted) && (
        <rect x={x - 5} y={y - 5} width={NW + 10} height={NH + 10} rx={16}
          fill="none"
          stroke={isSelected ? '#15171a' : fam.ink}
          strokeOpacity={isSelected ? 0.18 : 0.12}
          strokeWidth={6}
        />
      )}

      {/* card shadow */}
      <rect x={x} y={y + 3} width={NW} height={NH} rx={14}
        fill="rgba(20,22,25,0.05)" />

      {/* card */}
      <rect x={x} y={y} width={NW} height={NH} rx={14}
        fill={cardBg} stroke={cardBorder} strokeWidth={sw}
      />

      {/* left gender accent stripe */}
      <rect x={x} y={y + 12} width={3} height={NH - 24} rx={1.5}
        fill={accent} opacity={isDimmed ? 0.25 : 0.85} />

      {/* avatar */}
      {hasPhoto ? (
        <>
          <circle cx={avCx} cy={avCy} r={AVR + 1.5} fill="none" stroke={accent} strokeOpacity={0.25} strokeWidth={1} />
          <image href={person.photoUrl}
            x={avCx - AVR} y={avCy - AVR} width={AVR * 2} height={AVR * 2}
            clipPath={`url(#${clipId})`} preserveAspectRatio="xMidYMid slice" />
        </>
      ) : (
        <>
          <circle cx={avCx} cy={avCy} r={AVR}
            fill={isDimmed ? '#f3f1ec' : `${accent}14`}
            stroke={isDimmed ? '#e3e1da' : `${accent}33`}
            strokeWidth={1} />
          <text x={avCx} y={avCy + 4} textAnchor="middle" fontSize={13}
            fontFamily="Inter, sans-serif" fill={isDimmed ? '#b8b6af' : accent}
            fontWeight="600">
            {initials(person.name)}
          </text>
        </>
      )}

      {/* name (single line — surname shown by family band) */}
      <text x={textX} y={showBirthTag ? pos.cy - 2 : pos.cy + 4}
        fontFamily="Inter, sans-serif" fontSize={14} fontWeight="600"
        fill={isDimmed ? '#aeaca5' : '#15171a'}
        letterSpacing="-0.005em">
        {first}{deceased && ' †'}
      </text>
      {showBirthTag && (
        <text x={textX} y={pos.cy + 14}
          fontFamily="Inter, sans-serif" fontSize={10} fontWeight="500"
          fill={isDimmed ? '#c2c0b9' : themeOf(person.family).ink}
          letterSpacing={0.4}>
          née {person.family}
        </text>
      )}

      {/* status dot */}
      <circle cx={x + NW - 14} cy={y + 14} r={4}
        fill={isDimmed ? '#dbd9d2' : (STATUS_DOT[status] || STATUS_DOT.Unknown)} />

      {/* dob */}
      {person.dob && (
        <text x={x + NW - 12} y={y + NH - 10} textAnchor="end"
          fontSize={10} fill={isDimmed ? '#c2c0b9' : '#8a8d94'}
          fontFamily="Inter, sans-serif" fontWeight="500">
          {person.dob}
        </text>
      )}

      {/* collapse pill */}
      {hasChildren && (
        <g onClick={e => { e.stopPropagation(); onCollapse(person.id); }}
          style={{ cursor: 'pointer' }}>
          <circle cx={pos.cx} cy={y + NH + 14} r={11}
            fill={isCollapsed ? '#15171a' : '#fff'}
            stroke={isCollapsed ? '#15171a' : '#d6d4cd'}
            strokeWidth={1.2}
            style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.08))' }} />
          <text x={pos.cx} y={y + NH + 18.5} textAnchor="middle" fontSize={13}
            fontFamily="Inter, sans-serif" fontWeight="600"
            fill={isCollapsed ? '#fff' : '#4a4d54'}
            style={{ pointerEvents: 'none' }}>
            {isCollapsed ? '+' : '−'}
          </text>
        </g>
      )}
    </g>
  );
}

// ── Edges ─────────────────────────────────────────────────────────────────────
function Edges({ people, layout, visibleIds, highlightedIds }) {
  const drawn = new Set();
  const elems = [];
  const baseStroke = '#c8c6bf';
  const hlStroke = '#15171a';
  const displayFam = layout.__displayFam || {};

  // Helper: a parent→child edge is "natal" (dotted) when the child is a married
  // woman whose display column differs from her parent's display column.
  function isNatalLink(parentId, childId) {
    const child = people.find(x => x.id === childId);
    if (!child || child.gender !== 'F') return false;
    return (displayFam[childId] || child.family) !== (displayFam[parentId] || people.find(x => x.id === parentId)?.family);
  }

  for (const p of people) {
    if (!visibleIds.has(p.id) || !layout[p.id]) continue;
    const spId = FD.getSpouseId(p.id);
    const key = spId ? [p.id, spId].sort().join('~') : p.id;
    if (drawn.has(key)) continue;
    drawn.add(key);

    const pp = layout[p.id];
    const sp = spId && visibleIds.has(spId) ? layout[spId] : null;
    const hl = highlightedIds && (highlightedIds.has(p.id) || (spId && highlightedIds.has(spId)));
    const stroke = hl ? hlStroke : baseStroke;
    const sw = hl ? 1.8 : 1.2;

    if (sp) {
      const [L, R] = pp.cx < sp.cx ? [pp, sp] : [sp, pp];
      elems.push(
        <line key={`couple-${key}`}
          x1={L.cx + NW / 2} y1={L.cy} x2={R.cx - NW / 2} y2={R.cy}
          stroke={stroke} strokeWidth={sw} />
      );
    }

    const childSet = new Set(FD.getChildIds(p.id));
    if (spId) FD.getChildIds(spId).forEach(c => childSet.add(c));
    const allChildren = [...childSet].filter(c => visibleIds.has(c) && layout[c]);
    // Split: regular children (same column) vs natal-only (married-out daughters)
    const children = allChildren.filter(c => !isNatalLink(p.id, c));
    const natalChildren = allChildren.filter(c => isNatalLink(p.id, c));

    // Render natal (dotted) lines for married-out daughters
    natalChildren.forEach(child => {
      const cp = layout[child];
      const startX = pp.cx, startY = pp.cy + NH / 2;
      const endX = cp.cx, endY = cp.cy - NH / 2;
      const midY = (startY + endY) / 2;
      elems.push(
        <path key={`natal-${p.id}-${child}`}
          d={`M ${startX} ${startY} C ${startX} ${midY} ${endX} ${midY} ${endX} ${endY}`}
          fill="none" stroke={hl ? hlStroke : '#a4502b'}
          strokeWidth={hl ? 1.8 : 1.3}
          strokeDasharray="3,4" opacity={0.7} />
      );
    });

    if (!children.length) continue;

    const parentMidX = sp ? (pp.cx + sp.cx) / 2 : pp.cx;
    const parentBotY = sp ? pp.cy : pp.cy + NH / 2;

    const childCys = children.map(c => layout[c].cy);
    const minTopY = Math.min(...childCys) - NH / 2;
    const jY = (parentBotY + minTopY) / 2;
    const cxs = children.map(c => layout[c].cx);
    const leftX = Math.min(parentMidX, ...cxs);
    const rightX = Math.max(parentMidX, ...cxs);

    const isCross = (minTopY - parentBotY) > GY * 1.5
                  || Math.abs(parentMidX - (cxs.reduce((a,b)=>a+b,0)/cxs.length)) > 600;

    if (isCross) {
      children.forEach(child => {
        const cp = layout[child];
        const bendY = (parentBotY + cp.cy - NH / 2) / 2;
        elems.push(
          <path key={`cross-${p.id}-${child}`}
            d={`M ${parentMidX} ${parentBotY} C ${parentMidX} ${bendY + 30} ${cp.cx} ${bendY - 30} ${cp.cx} ${cp.cy - NH / 2}`}
            fill="none" stroke={hl ? hlStroke : '#a4502b'}
            strokeWidth={hl ? 2 : 1.4}
            strokeDasharray="6,4" opacity={0.85} />
        );
      });
    } else {
      // Rounded orthogonal connectors
      const r = 10;
      elems.push(
        <path key={`drop-${key}`}
          d={`M ${parentMidX} ${parentBotY} L ${parentMidX} ${jY}`}
          stroke={stroke} strokeWidth={sw} fill="none" />
      );
      if (children.length > 1 || Math.abs(parentMidX - cxs[0]) > 5) {
        elems.push(
          <path key={`bar-${key}`}
            d={`M ${leftX} ${jY} L ${rightX} ${jY}`}
            stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
        );
      }
      children.forEach(child => {
        const cp = layout[child];
        elems.push(
          <path key={`cdrop-${key}-${child}`}
            d={`M ${cp.cx} ${jY} L ${cp.cx} ${cp.cy - NH / 2}`}
            stroke={stroke} strokeWidth={sw} fill="none" />
        );
      });
    }
  }

  return <g>{elems}</g>;
}

// ── Family Bands ──────────────────────────────────────────────────────────────
function FamilyBands({ layout }) {
  const bands = layout.__families || [];
  return (
    <g>
      {bands.map((b, i) => {
        const t = themeOf(b.name);
        return (
          <g key={b.name + i}>
            {/* soft tinted column */}
            <rect x={b.x1} y={b.minY} width={b.x2 - b.x1} height={b.maxY - b.minY}
              rx={28} ry={28}
              fill={t.soft} stroke={t.border} strokeWidth={1.2} />

            {/* family title */}
            <g>
              <text x={(b.x1 + b.x2) / 2} y={b.minY - 28}
                textAnchor="middle"
                fontFamily="Fraunces, Georgia, serif"
                fontSize={28} fontWeight="600"
                fill={t.ink}>
                {b.name}
              </text>
              <text x={(b.x1 + b.x2) / 2} y={b.minY - 10}
                textAnchor="middle"
                fontFamily="Inter, sans-serif"
                fontSize={11} fontWeight="500"
                letterSpacing={3}
                fill={t.ink} opacity={0.55}>
                FAMILY
              </text>
            </g>
          </g>
        );
      })}
    </g>
  );
}

// ── Generation guides (subtle horizontal rule + label per generation) ─────────
function GenGuides({ layout }) {
  const bands = layout.__families || [];
  if (!bands.length) return null;
  const minX = Math.min(...bands.map(b => b.x1)) - 20;
  const maxX = Math.max(...bands.map(b => b.x2)) + 20;

  // collect unique cy values from layout (excluding meta)
  const cys = new Set();
  Object.entries(layout).forEach(([k, v]) => {
    if (k === '__families' || !v || typeof v !== 'object' || v.cy == null) return;
    cys.add(v.cy);
  });
  const sorted = [...cys].sort((a, b) => a - b);

  return (
    <g>
      {sorted.map((cy, i) => (
        <g key={cy}>
          <line x1={minX} y1={cy} x2={maxX} y2={cy}
            stroke="#000" strokeOpacity={0.04} strokeWidth={1}
            strokeDasharray="2,5" />
          <text x={minX - 12} y={cy + 4} textAnchor="end"
            fontFamily="Inter, sans-serif" fontSize={10}
            fontWeight={600} fill="#8a8d94" letterSpacing={1.5}>
            {`G${['I','II','III','IV','V','VI','VII'][i] || i + 1}`}
          </text>
        </g>
      ))}
    </g>
  );
}

// ── TreeCanvas ────────────────────────────────────────────────────────────────
function TreeCanvas({ people, layout, selectedId, highlightedIds, collapsedIds, transform, setTransform, onSelect, setTooltip, onCollapse }) {
  const svgRef = useRef(null);
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const visibleIds = useMemo(() => {
    const vis = new Set(people.map(p => p.id));
    function hide(id) {
      FD.getChildIds(id).forEach(c => {
        vis.delete(c);
        const sp = FD.getSpouseId(c); if (sp) vis.delete(sp);
        hide(c);
      });
      const sp = FD.getSpouseId(id);
      if (sp) FD.getChildIds(sp).forEach(c => { vis.delete(c); hide(c); });
    }
    collapsedIds.forEach(id => hide(id));
    return vis;
  }, [people, collapsedIds]);

  useEffect(() => {
    const el = svgRef.current; if (!el) return;
    const onWheel = e => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.12 : 0.9;
      setTransform(t => {
        const ns = Math.min(Math.max(t.scale * factor, 0.12), 4);
        const rect = el.getBoundingClientRect();
        const mx = e.clientX - rect.left, my = e.clientY - rect.top;
        return { x: mx + (t.x - mx) * (ns / t.scale), y: my + (t.y - my) * (ns / t.scale), scale: ns };
      });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const onDown = e => { if (e.button !== 0) return; dragging.current = true; lastPos.current = { x: e.clientX, y: e.clientY }; e.currentTarget.style.cursor = 'grabbing'; };
  const onMove = e => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPos.current.x, dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setTransform(t => ({ ...t, x: t.x + dx, y: t.y + dy }));
  };
  const onUp = e => { dragging.current = false; if (e.currentTarget) e.currentTarget.style.cursor = 'grab'; };

  const childCounts = useMemo(() => {
    const m = {};
    people.forEach(p => { m[p.id] = FD.getChildIds(p.id).length; });
    return m;
  }, [people]);

  return (
    <svg ref={svgRef} width="100%" height="100%"
      style={{ display: 'block', cursor: 'grab' }}
      onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
      onClick={() => onSelect(null)}>

      <defs>
        <pattern id="dot-bg" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#000" opacity="0.05" />
        </pattern>
      </defs>

      <rect width="100%" height="100%" fill="#f6f5f2" />
      <rect width="100%" height="100%" fill="url(#dot-bg)" />

      <g transform={`translate(${transform.x},${transform.y}) scale(${transform.scale})`}>
        <FamilyBands layout={layout} />
        <GenGuides layout={layout} />
        <Edges people={people} layout={layout}
          visibleIds={visibleIds} highlightedIds={highlightedIds} />
        {people.filter(p => visibleIds.has(p.id)).map(p => (
          <PersonNode key={p.id} person={p} pos={layout[p.id]}
            isSelected={p.id === selectedId}
            isHighlighted={!!(highlightedIds && highlightedIds.has(p.id))}
            isDimmed={!!(highlightedIds && !highlightedIds.has(p.id))}
            isCollapsed={collapsedIds.has(p.id)}
            hasChildren={childCounts[p.id] > 0}
            onSelect={onSelect}
            onHover={(person, e) => setTooltip({ person, x: e.clientX, y: e.clientY })}
            onHoverEnd={() => setTooltip(null)}
            onCollapse={onCollapse} />
        ))}
      </g>
    </svg>
  );
}

// ── DetailPanel ───────────────────────────────────────────────────────────────
function DetailPanel({ person, onClose, onNavigate }) {
  if (!person) return null;
  const spouseId = FD.getSpouseId(person.id);
  const parentIds = FD.getParentIds(person.id);
  const childIds = [...new Set(FD.getChildIds(person.id))];
  const sibIds = FD.getSiblingIds(person.id);
  const accent = ACCENT[person.gender] || ACCENT.M;
  const fam = themeOf(person.family);

  function RelLink({ id }) {
    const p = FD.getPerson(id); if (!p) return null;
    return (
      <button onClick={() => onNavigate(id)}
        style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', background: 'transparent', border: '1px solid #e3e1da', padding: '8px 10px', borderRadius: 8, color: '#15171a', fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500, cursor: 'pointer', textAlign: 'left', marginBottom: 6, transition: 'background 0.12s, border-color 0.12s' }}
        onMouseEnter={e => { e.currentTarget.style.background = '#f6f5f2'; e.currentTarget.style.borderColor = '#d6d4cd'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#e3e1da'; }}>
        <span style={{ width: 24, height: 24, borderRadius: '50%', background: `${ACCENT[p.gender] || ACCENT.M}14`, color: ACCENT[p.gender] || ACCENT.M, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 10, fontWeight: 600 }}>
          {initials(p.name)}
        </span>
        <span style={{ flex: 1 }}>{p.name}</span>
        {p.status === 'Deceased' && <span style={{ fontSize: 11, color: '#a3a7ad' }}>†</span>}
      </button>
    );
  }

  const hasPhoto = !!person.photoUrl;
  return (
    <div className="detail-panel">
      <button className="close-btn" onClick={onClose}>✕</button>

      <div style={{ marginBottom: 18 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 9px', borderRadius: 6, background: fam.soft, border: `1px solid ${fam.border}`, fontSize: 10, fontWeight: 600, color: fam.ink, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 }}>
          {person.family || 'Family'}
        </div>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: `${accent}10`, border: `1.5px solid ${accent}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
            {hasPhoto
              ? <img src={person.photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ fontSize: 18, color: accent, fontWeight: 600 }}>{initials(person.name)}</span>}
          </div>
          <div>
            <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 20, color: '#15171a', fontWeight: 600, lineHeight: 1.15, letterSpacing: '-0.01em' }}>{person.name}</h2>
            <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
              <span className={person.gender === 'M' ? 'badge badge-male' : 'badge badge-female'}>
                {person.gender === 'M' ? T('male') : T('female')}
              </span>
              <span className="badge" style={{ color: STATUS_DOT[person.status] || '#8a8d94' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: STATUS_DOT[person.status] || '#8a8d94', display: 'inline-block' }}></span>
                {person.status === 'Alive' ? T('alive') : person.status === 'Deceased' ? T('deceased') : T('unknown')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {person.dob && <div className="detail-row"><span className="detail-label">{T('born')}</span><span>{person.dob}</span></div>}
      {person.notes && <div style={{ background: '#f6f5f2', borderRadius: 8, padding: '10px 12px', fontSize: 12.5, color: '#4a4d54', marginBottom: 14, lineHeight: 1.5 }}>{person.notes}</div>}

      <div style={{ height: 1, background: '#e3e1da', margin: '14px 0' }} />

      {spouseId && <div className="rel-section"><div className="rel-label">{T('spouse')}</div><RelLink id={spouseId} /></div>}
      {parentIds.length > 0 && <div className="rel-section"><div className="rel-label">{T('parents')}</div>{parentIds.map(id => <RelLink key={id} id={id} />)}</div>}
      {childIds.length > 0 && <div className="rel-section"><div className="rel-label">{T('children')}</div>{childIds.map(id => <RelLink key={id} id={id} />)}</div>}
      {sibIds.length > 0 && <div className="rel-section"><div className="rel-label">{T('siblings')}</div>{sibIds.map(id => <RelLink key={id} id={id} />)}</div>}
    </div>
  );
}

// ── AddMemberModal ────────────────────────────────────────────────────────────
function AddMemberModal({ people, onAdd, onClose, prefillName }) {
  const [form, setForm] = useState({ name: prefillName || '', gender: 'M', dob: '', status: 'Alive', notes: '', photoUrl: '' });
  const [relType, setRelType] = useState('child');
  const [targetId, setTargetId] = useState(people[0]?.id || '');
  const [error, setError] = useState('');
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  function submit(e) {
    e.preventDefault();
    if (!form.name.trim()) { setError(T('err_name_required')); return; }
    onAdd({ ...form, name: form.name.trim() }, relType, targetId);
  }

  const REL = [
    { v: 'spouse', l: T('rel_spouse_of') },
    { v: 'child',  l: T('rel_child_of') },
    { v: 'parent', l: T('rel_parent_of') },
    { v: 'sibling', l: T('rel_sibling_of') },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 22, color: '#15171a', marginBottom: 4, fontWeight: 600, letterSpacing: '-0.01em' }}>{T('add_modal_title')}</h2>
        <p style={{ fontSize: 13, color: '#8a8d94', marginBottom: 22 }}>{T('add_modal_sub')}</p>
        <form onSubmit={submit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-row" style={{ gridColumn: '1/-1' }}>
              <label>{T('field_name')}</label>
              <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder={T('field_name_ph')} autoFocus />
            </div>
            <div className="form-row">
              <label>{T('field_gender')}</label>
              <select className="form-input" value={form.gender} onChange={e => set('gender', e.target.value)}>
                <option value="M">{T('male')}</option><option value="F">{T('female')}</option>
              </select>
            </div>
            <div className="form-row">
              <label>{T('field_status')}</label>
              <select className="form-input" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="Alive">{T('alive')}</option>
                <option value="Deceased">{T('deceased')}</option>
                <option value="Unknown">{T('unknown')}</option>
              </select>
            </div>
            <div className="form-row">
              <label>{T('field_dob')}</label>
              <input className="form-input" value={form.dob} onChange={e => set('dob', e.target.value)} placeholder={T('field_dob_ph')} />
            </div>
            <div className="form-row">
              <label>{T('field_notes')}</label>
              <input className="form-input" value={form.notes} onChange={e => set('notes', e.target.value)} placeholder={T('field_notes_ph')} />
            </div>
            <div className="form-row" style={{ gridColumn: '1/-1' }}>
              <label>{T('field_photo')}</label>
              <input className="form-input" value={form.photoUrl} onChange={e => set('photoUrl', e.target.value)} placeholder="https://…" />
            </div>
          </div>

          <div style={{ background: '#f6f5f2', borderRadius: 10, padding: '14px 16px', margin: '14px 0 4px', border: '1px solid #e3e1da' }}>
            <p style={{ fontSize: 11, color: '#8a8d94', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>{T('field_relationship')}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 10 }}>
              <div className="form-row" style={{ margin: 0 }}>
                <label>{T('field_type')}</label>
                <select className="form-input" value={relType} onChange={e => setRelType(e.target.value)}>
                  {REL.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
              <div className="form-row" style={{ margin: 0 }}>
                <label>{T('field_existing')}</label>
                <select className="form-input" value={targetId} onChange={e => setTargetId(e.target.value)}>
                  {people.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          {error && <p style={{ color: '#c0392b', fontSize: 12, marginTop: 8 }}>{error}</p>}
          <div style={{ display: 'flex', gap: 10, marginTop: 18, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>{T('cancel')}</button>
            <button type="submit" className="btn">{T('add_to_tree')}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Wizard (contribution flow) ────────────────────────────────────────────────
function Wizard({ people, prefillName, anchorPersonId, onClose, onAdded }) {
  const [step, setStep] = useState(1);
  const TOTAL = 3;

  const [name, setName] = useState(prefillName || '');
  const [gender, setGender] = useState('M');
  const [anchorId, setAnchorId] = useState(anchorPersonId || '');
  const [anchorQuery, setAnchorQuery] = useState('');
  const [relType, setRelType] = useState('child');
  const [dob, setDob] = useState('');
  const [status, setStatus] = useState('Alive');
  const [photoUrl, setPhotoUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  // anchor search
  const anchorMatches = useMemo(() => {
    const q = anchorQuery.trim().toLowerCase();
    if (!q) return [];
    return people.filter(p => p.name.toLowerCase().includes(q)).slice(0, 6);
  }, [anchorQuery, people]);

  const anchorPerson = useMemo(() => people.find(p => p.id === anchorId), [anchorId, people]);

  function next() { setError(''); setStep(s => Math.min(s + 1, TOTAL)); }
  function back() { setError(''); setStep(s => Math.max(s - 1, 1)); }

  async function submit() {
    if (!name.trim()) { setError(T('err_name_required')); setStep(1); return; }
    if (!anchorId) { setError(T('wiz_s2_title')); setStep(2); return; }
    setSending(true); setError('');
    const body = {
      name: name.trim(), gender, dob: dob.trim(), status, photoUrl: photoUrl.trim(), notes: notes.trim(),
      anchorId, anchorName: anchorPerson?.name || '', relType,
      contributorName: '',
      inviteToken: window.__INVITE || window.__TO || '',
      lang: window.__LANG, honeypot,
    };
    const url = (window.CONFIG && window.CONFIG.APPS_SCRIPT_URL) || '';
    try {
      if (url) {
        // Apps Script web apps: avoid CORS preflight by using text/plain.
        const r = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(body),
        });
        const j = await r.json().catch(() => ({}));
        if (j.ok === false) throw new Error(j.error || 'submission failed');
      } else {
        // Offline: queue locally so nothing is lost.
        const q = JSON.parse(localStorage.getItem('ft_pending') || '[]');
        q.push({ ts: Date.now(), ...body });
        localStorage.setItem('ft_pending', JSON.stringify(q));
      }
      setDone(true);
      if (onAdded) onAdded(body);
    } catch (e) {
      setError(T('wiz_err') + ' (' + e.message + ')');
    } finally {
      setSending(false);
    }
  }

  function resetForAnother(prev) {
    // Reuse just-added person as the implicit anchor for the next entry
    setStep(1);
    setName(''); setDob(''); setPhotoUrl(''); setNotes('');
    setStatus('Alive'); setGender('M');
    setError(''); setDone(false);
    // The just-submitted person isn't in `people` yet (it's pending); leave anchor as-is
    // so the contributor naturally re-anchors to their last entry's anchor (their spouse, etc.)
  }

  function whatsAppShare() {
    const url = location.origin + location.pathname;
    const msg = T('wa_share_msg', { url });
    const wa = 'https://wa.me/?text=' + encodeURIComponent(msg);
    window.open(wa, '_blank');
  }

  // ── Render ──
  if (done) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-box" onClick={e => e.stopPropagation()}
          style={{ width: 460, textAlign: 'center', padding: '36px 30px 28px' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
          <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 24, fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 8 }}>{T('wiz_thanks_title')}</h2>
          <p style={{ fontSize: 13.5, color: '#4a4d54', marginBottom: 22, lineHeight: 1.5 }}>{T('wiz_thanks_sub')}</p>
          {!(window.CONFIG && window.CONFIG.APPS_SCRIPT_URL) && (
            <p style={{ fontSize: 12, color: '#a4502b', background: '#fdf3ec', padding: '8px 12px', borderRadius: 8, marginBottom: 18 }}>
              {T('wiz_offline')}
            </p>
          )}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn" onClick={resetForAnother}>{T('wiz_add_another')}</button>
            <button className="btn btn-ghost" onClick={whatsAppShare}>{T('wiz_share_whatsapp')}</button>
            <button className="btn btn-ghost" onClick={onClose}>{T('wiz_done')}</button>
          </div>
        </div>
      </div>
    );
  }

  const stepHeader = (
    <div style={{ fontSize: 11, color: '#8a8d94', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 4 }}>
      {T('wiz_step', { n: step, total: TOTAL })}
    </div>
  );

  const progress = (
    <div style={{ display: 'flex', gap: 4, marginBottom: 18 }}>
      {Array.from({ length: TOTAL }).map((_, i) => (
        <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i < step ? '#15171a' : '#e3e1da' }} />
      ))}
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()} style={{ width: 460, padding: '28px 26px 24px' }}>
        {stepHeader}
        {progress}

        {/* honeypot — invisible to humans, irresistible to bots */}
        <input type="text" name={window.CONFIG?.HONEYPOT_FIELD || 'website'}
          value={honeypot} onChange={e => setHoneypot(e.target.value)}
          autoComplete="off" tabIndex={-1}
          style={{ position: 'absolute', left: -9999, top: -9999, opacity: 0 }} />

        {step === 1 && (
          <>
            <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 6 }}>{T('wiz_s1_title')}</h2>
            <p style={{ fontSize: 13, color: '#8a8d94', marginBottom: 18 }}>{T('wiz_s1_sub')}</p>

            <div className="form-row">
              <input className="form-input" value={name} onChange={e => setName(e.target.value)}
                placeholder={T('wiz_name_ph')} autoFocus style={{ fontSize: 16, padding: '14px 14px' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 4 }}>
              {['M', 'F'].map(g => (
                <button key={g} type="button" onClick={() => setGender(g)}
                  style={{
                    padding: '14px', borderRadius: 10, cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 600,
                    background: gender === g ? '#15171a' : '#fff',
                    color: gender === g ? '#fff' : '#15171a',
                    border: gender === g ? '1px solid #15171a' : '1px solid #e3e1da',
                  }}>
                  {g === 'M' ? T('male') : T('female')}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 6 }}>{T('wiz_s2_title')}</h2>
            <p style={{ fontSize: 13, color: '#8a8d94', marginBottom: 18 }}>{T('wiz_s2_sub')}</p>

            <div className="form-row">
              <input className="form-input" value={anchorPerson ? anchorPerson.name : anchorQuery}
                onChange={e => { setAnchorId(''); setAnchorQuery(e.target.value); }}
                onFocus={() => { if (anchorPerson) { setAnchorQuery(anchorPerson.name); setAnchorId(''); } }}
                placeholder={T('wiz_anchor_ph')} style={{ fontSize: 15, padding: '12px 14px' }} />
              {anchorMatches.length > 0 && !anchorId && (
                <div style={{ marginTop: 6, background: '#fff', border: '1px solid #e3e1da', borderRadius: 8, overflow: 'hidden' }}>
                  {anchorMatches.map(p => (
                    <div key={p.id} onClick={() => { setAnchorId(p.id); setAnchorQuery(''); }}
                      style={{ padding: '10px 12px', cursor: 'pointer', fontSize: 13, display: 'flex', justifyContent: 'space-between' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f6f5f2'}
                      onMouseLeave={e => e.currentTarget.style.background = ''}>
                      <span>{p.name}</span>
                      <span style={{ fontSize: 11, color: '#8a8d94' }}>{p.family}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {anchorPerson && (
              <div style={{ background: '#f6f5f2', padding: '14px 16px', borderRadius: 10, border: '1px solid #e3e1da', marginTop: 10 }}>
                <div style={{ fontSize: 11, color: '#8a8d94', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500, marginBottom: 10 }}>{T('wiz_rel_intro')}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[['spouse', 'wiz_rel_spouse'], ['child', 'wiz_rel_child'], ['parent', 'wiz_rel_parent'], ['sibling', 'wiz_rel_sibling']].map(([v, k]) => (
                    <button key={v} type="button" onClick={() => setRelType(v)}
                      style={{
                        padding: '10px', borderRadius: 8, cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500,
                        background: relType === v ? '#15171a' : '#fff',
                        color: relType === v ? '#fff' : '#15171a',
                        border: relType === v ? '1px solid #15171a' : '1px solid #e3e1da',
                      }}>
                      {T(k)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {step === 3 && (
          <>
            <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 6 }}>{T('wiz_s3_title')}</h2>
            <p style={{ fontSize: 13, color: '#8a8d94', marginBottom: 18 }}>{T('wiz_s3_sub')}</p>

            <div className="form-row">
              <label>{T('wiz_dob_label')}</label>
              <input className="form-input" value={dob} onChange={e => setDob(e.target.value)} placeholder={T('wiz_dob_ph')} />
            </div>
            <div className="form-row">
              <label>{T('wiz_status_label')}</label>
              <select className="form-input" value={status} onChange={e => setStatus(e.target.value)}>
                <option value="Alive">{T('alive')}</option>
                <option value="Deceased">{T('deceased')}</option>
              </select>
            </div>
            <div className="form-row">
              <label>{T('wiz_photo_label')}</label>
              <input className="form-input" value={photoUrl} onChange={e => setPhotoUrl(e.target.value)} placeholder="https://…" />
            </div>
            <div className="form-row">
              <label>{T('wiz_notes_label')}</label>
              <input className="form-input" value={notes} onChange={e => setNotes(e.target.value)} placeholder={T('field_notes_ph')} />
            </div>
          </>
        )}

        {error && <p style={{ color: '#c0392b', fontSize: 12, marginTop: 8 }}>{error}</p>}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 22 }}>
          <button type="button" className="btn btn-ghost" onClick={step === 1 ? onClose : back}>
            {step === 1 ? T('cancel') : T('wiz_back')}
          </button>
          {step < TOTAL && (
            <button type="button" className="btn"
              disabled={(step === 1 && !name.trim()) || (step === 2 && !anchorId)}
              onClick={next}>{T('wiz_next')}</button>
          )}
          {step === TOTAL && (
            <button type="button" className="btn" onClick={submit} disabled={sending}>
              {sending ? T('wiz_sending') : T('wiz_submit')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Tooltip ───────────────────────────────────────────────────────────────────
function Tooltip({ tip }) {
  if (!tip) return null;
  const { person, x, y } = tip;
  const fam = themeOf(person.family);
  return (
    <div style={{ position: 'fixed', left: x + 16, top: y - 10, background: '#15171a', color: '#fff', borderRadius: 8, padding: '10px 12px', fontSize: 12, pointerEvents: 'none', zIndex: 400, fontFamily: 'Inter, sans-serif', lineHeight: 1.5, maxWidth: 220, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
      <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 3, letterSpacing: '-0.005em' }}>{person.name}</div>
      <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: 1, textTransform: 'uppercase', color: '#9aa1ad', marginBottom: 4 }}>
        {person.family} {T('family')}
      </div>
      <div style={{ color: '#c8cbd0', fontSize: 11 }}>
        {person.gender === 'M' ? T('male') : T('female')} · {person.status === 'Alive' ? T('alive') : person.status === 'Deceased' ? T('deceased') : T('unknown')}
      </div>
      {person.dob && <div style={{ color: '#9aa1ad', fontSize: 11 }}>{T('tooltip_b')} {person.dob}</div>}
      {person.notes && <div style={{ color: '#9aa1ad', fontSize: 11, marginTop: 3 }}>{person.notes}</div>}
    </div>
  );
}

// ── Legend ────────────────────────────────────────────────────────────────────
function Legend() {
  const fams = ['Daliya', 'Kalantri', 'Kasat'];
  return (
    <div className="legend">
      <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8a8d94', marginBottom: 8, fontWeight: 600 }}>{T('legend')}</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {fams.map(f => {
          const t = themeOf(f);
          return (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 12, height: 12, borderRadius: 4, background: t.soft, border: `1px solid ${t.border}` }}></span>
              <span style={{ color: t.ink, fontWeight: 500 }}>{f}</span>
            </div>
          );
        })}
        <div style={{ height: 1, background: '#e3e1da', margin: '4px 0' }} />
        {[['#3b6fb5', T('male')], ['#b53b72', T('female')]].map(([c, lbl]) => (
          <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 3, height: 12, borderRadius: 1.5, background: c, marginLeft: 4, marginRight: 5 }}></span>
            <span>{lbl}</span>
          </div>
        ))}
        <div style={{ height: 1, background: '#e3e1da', margin: '4px 0' }} />
        {[['#2f9e6f', T('alive')], ['#a3a7ad', T('deceased')]].map(([c, lbl]) => (
          <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: c, marginLeft: 2, marginRight: 4 }}></span>
            <span>{lbl}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── WelcomeOverlay ────────────────────────────────────────────────────────────
function WelcomeOverlay({ kind, name, count, onAdd, onFind, onClose }) {
  const title = kind === 'known'   ? T('welcome_known_title',   { name })
              : kind === 'missing' ? T('welcome_missing_title', { name })
              :                       T('welcome_generic_title', { n: count });
  const sub   = kind === 'known'   ? T('welcome_known_sub')
              : kind === 'missing' ? T('welcome_missing_sub')
              :                       T('welcome_generic_sub');
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}
        style={{ width: 460, textAlign: 'center', padding: '36px 30px 28px' }}>
        <div style={{ fontSize: 44, marginBottom: 10 }}>🌳</div>
        <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 26, fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 10, lineHeight: 1.2 }}>{title}</h2>
        <p style={{ fontSize: 14, color: '#4a4d54', marginBottom: 22, lineHeight: 1.5 }}>{sub}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          {kind === 'known' && <button className="btn" onClick={onFind}>{T('welcome_cta_find')}</button>}
          {kind === 'missing' && <button className="btn" onClick={onAdd}>{T('welcome_cta_add')}</button>}
          {kind === 'generic' && (
            <>
              <button className="btn" onClick={onAdd}>{T('welcome_cta_add')}</button>
              <button className="btn btn-ghost" onClick={onFind}>{T('welcome_cta_find')}</button>
            </>
          )}
          <button className="btn btn-ghost" onClick={onClose}>{T('welcome_cta_browse')}</button>
        </div>
      </div>
    </div>
  );
}

// ── FloatingCTA — always-visible "Are you in the tree?" pill ──────────────────
function FloatingCTA({ onAdd, onFind }) {
  return (
    <div style={{
      position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)',
      background: '#15171a', color: '#fff', padding: '10px 12px 10px 16px',
      borderRadius: 999, boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
      display: 'flex', alignItems: 'center', gap: 10, zIndex: 80,
      fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500,
    }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 14 }}>👋</span>{T('are_you_in_tree')}
      </span>
      <button onClick={onAdd}
        style={{ background: '#fff', color: '#15171a', border: 'none', padding: '6px 12px', borderRadius: 999, fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
        {T('add_me')}
      </button>
      <button onClick={onFind}
        style={{ background: 'transparent', color: '#fff', border: '1px solid #4a4d54', padding: '6px 12px', borderRadius: 999, fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
        {T('find_me')}
      </button>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
function App() {
  // Re-render on language toggle. T() reads from window.__LANG live.
  const [, setLangVer] = useState(0);
  useEffect(() => {
    const on = () => setLangVer(v => v + 1);
    window.addEventListener('ft-lang-change', on);
    return () => window.removeEventListener('ft-lang-change', on);
  }, []);

  const [people, setPeople] = useState([...FD.people]);
  const [relationships, setRelationships] = useState([...FD.relationships]);
  const [layout, setLayout] = useState({ ...FD.layout });
  const [selectedId, setSelectedId] = useState(null);
  const [highlightedIds, setHighlightedIds] = useState(null);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [tooltip, setTooltip] = useState(null);
  const [collapsedIds, setCollapsedIds] = useState(new Set());
  const [transform, setTransform] = useState({ x: 80, y: 80, scale: 0.7 });
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);

  // Fetch approved submissions + pending count on mount. Merges contributions
  // into the in-memory tree so the visible tree always reflects approved adds.
  useEffect(() => {
    const url = window.CONFIG && window.CONFIG.APPS_SCRIPT_URL;
    if (!url) return;
    async function fetchAndMerge() {
      try {
        const r = await fetch(url + '?action=list', { method: 'GET' });
        const j = await r.json();
        if (j.pending != null) setPendingCount(j.pending);
        if (Array.isArray(j.approved) && j.approved.length) {
          let merged = 0;
          for (const sub of j.approved) {
            const existing = FD.people.find(p => p.name.trim().toLowerCase() === (sub.name || '').trim().toLowerCase());
            if (existing) continue; // already merged in a prior session
            const anchor = sub.anchorId ? FD.getPerson(sub.anchorId)
                          : FD.people.find(p => p.name.trim().toLowerCase() === (sub.anchorName || '').trim().toLowerCase());
            if (!anchor) continue;
            FD.addMember({
              name: sub.name,
              gender: sub.gender || 'M',
              dob: sub.dob || '',
              status: sub.living || 'Alive',
              photoUrl: sub.photoUrl || '',
              notes: sub.notes || '',
              family: anchor.family,
            }, sub.relType || 'child', anchor.id);
            merged++;
          }
          if (merged) {
            setPeople([...FD.people]);
            setRelationships([...FD.relationships]);
            setLayout({ ...FD.layout });
          }
        }
      } catch (e) {
        console.warn('approved-fetch failed:', e);
      }
    }
    fetchAndMerge();
    const ms = (window.CONFIG && window.CONFIG.REFRESH_MS) || 0;
    if (ms > 0) {
      const id = setInterval(fetchAndMerge, ms);
      return () => clearInterval(id);
    }
  }, []);

  // Welcome overlay — driven by ?to= (known member) or ?invite= (missing) or first visit.
  const welcomeMeta = useMemo(() => {
    if (window.__TO) {
      const p = FD.getPerson(window.__TO);
      if (p) return { kind: 'known', name: p.name.split(' ')[0], targetId: p.id };
    }
    if (window.__INVITE) {
      const first = window.__INVITE.split(/[-_\s]/)[0];
      const name = first.charAt(0).toUpperCase() + first.slice(1);
      return { kind: 'missing', name, prefill: window.__INVITE.replace(/[-_]/g, ' ') };
    }
    if (!localStorage.getItem('ft_seen')) return { kind: 'generic' };
    return null;
  }, []);
  const [showWelcome, setShowWelcome] = useState(!!welcomeMeta);

  function dismissWelcome() {
    localStorage.setItem('ft_seen', '1');
    setShowWelcome(false);
  }
  function openAddFlow() {
    dismissWelcome();
    setShowWizard(true);
  }
  function openFindFlow() {
    dismissWelcome();
    setTimeout(() => document.querySelector('.search-input')?.focus(), 50);
  }

  // If invited as a known member, fly the canvas to their card after first render.
  useEffect(() => {
    if (welcomeMeta?.kind === 'known' && welcomeMeta.targetId) {
      setTimeout(() => flyTo(welcomeMeta.targetId), 300);
    }
    // eslint-disable-next-line
  }, []);

  const searchResults = useMemo(() => {
    const q = search.trim().toLowerCase(); if (!q) return [];
    return people.filter(p => p.name.toLowerCase().includes(q));
  }, [search, people]);

  function handleSelect(person) {
    if (!person) { setSelectedId(null); setHighlightedIds(null); return; }
    if (person.id === selectedId) { setSelectedId(null); setHighlightedIds(null); }
    else { setSelectedId(person.id); setHighlightedIds(FD.getLineage(person.id)); }
  }

  function flyTo(id) {
    const p = FD.getPerson(id); if (!p) return;
    handleSelect(p);
    const pos = FD.layout[id];
    if (pos) {
      const vw = window.innerWidth, vh = window.innerHeight - 64;
      const ns = 0.9;
      setTransform({ x: vw / 2 - pos.cx * ns, y: vh / 2 - pos.cy * ns, scale: ns });
    }
  }

  function handleAddMember(data, relType, targetId) {
    FD.addMember(data, relType, targetId);
    setPeople([...FD.people]);
    setRelationships([...FD.relationships]);
    setLayout({ ...FD.layout });
    setShowModal(false);
  }

  function handleCollapse(id) {
    setCollapsedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  // ── CSV import ─────────────────────────────────────────────────────────────
  function parseCsv(text) {
    const rows = [];
    let i = 0, field = '', row = [], inQ = false;
    while (i < text.length) {
      const c = text[i];
      if (inQ) {
        if (c === '"' && text[i+1] === '"') { field += '"'; i += 2; continue; }
        if (c === '"') { inQ = false; i++; continue; }
        field += c; i++;
      } else {
        if (c === '"') { inQ = true; i++; continue; }
        if (c === ',') { row.push(field); field = ''; i++; continue; }
        if (c === '\r') { i++; continue; }
        if (c === '\n') { row.push(field); rows.push(row); field = ''; row = []; i++; continue; }
        field += c; i++;
      }
    }
    if (field.length || row.length) { row.push(field); rows.push(row); }
    return rows.filter(r => r.some(x => x && x.trim()));
  }

  function handleCsvImport(file) {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const rows = parseCsv(String(e.target.result || ''));
        if (rows.length < 2) { setToast({ type: 'err', msg: 'CSV is empty or malformed.' }); return; }
        const header = rows[0].map(h => h.trim().toLowerCase());
        const idx = (k) => header.findIndex(h => h.includes(k));
        const ni = idx('name'), gi = idx('gender'), di = idx('birth') >= 0 ? idx('birth') : idx('dob'),
              si = idx('status'), pi = idx('photo'),
              ri = header.findIndex(h => h.includes('relation')), mi = header.findIndex(h => h.includes('select') || h.includes('member'));

        // Map CSV relationship words → addMember relType
        const RELMAP = {
          spouse: 'spouse', wife: 'spouse', husband: 'spouse', husaband: 'spouse',
          child: 'child', son: 'child', daughter: 'child',
          parent: 'parent', father: 'parent', mother: 'parent',
          sibling: 'sibling', brother: 'sibling', sister: 'sibling',
        };

        const findIdByName = (name) => {
          const n = (name || '').trim().toLowerCase();
          if (!n) return null;
          const p = FD.people.find(x => x.name.trim().toLowerCase() === n);
          return p ? p.id : null;
        };

        let added = 0, skipped = 0, errs = [];
        for (let r = 1; r < rows.length; r++) {
          const row = rows[r];
          const name = (row[ni] || '').trim();
          if (!name) continue;
          // Skip if already exists
          if (findIdByName(name)) { skipped++; continue; }
          const genderRaw = (row[gi] || '').trim().toLowerCase();
          const gender = genderRaw.startsWith('f') ? 'F' : 'M';
          const dob = (row[di] || '').trim();
          const statusRaw = (row[si] || '').trim();
          const status = /alive/i.test(statusRaw) ? 'Alive' : /dec/i.test(statusRaw) ? 'Deceased' : 'Unknown';
          const photoUrl = pi >= 0 ? (row[pi] || '').trim() : '';
          const relRaw = ri >= 0 ? (row[ri] || '').trim().toLowerCase() : '';
          const targetName = mi >= 0 ? (row[mi] || '').trim() : '';

          // Family inferred from surname
          const family = name.split(' ').slice(-1)[0];

          if (!relRaw || !targetName) {
            // Standalone — add as bare person
            const newId = name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z_]/g, '').slice(0, 20) + '_' + Date.now() + '_' + r;
            FD.people.push({ id: newId, name, gender, dob, status, photoUrl, family, notes: '' });
            FD.layout = (function(){ try { return FD.layout; } catch(_){ return {}; } })();
            added++;
            continue;
          }

          const relType = RELMAP[relRaw] || 'child';
          const targetId = findIdByName(targetName);
          if (!targetId) { errs.push(`Row ${r+1}: "${targetName}" not found`); continue; }
          FD.addMember({ name, gender, dob, status, photoUrl, family, notes: '' }, relType, targetId);
          added++;
        }

        // Sync state
        setPeople([...FD.people]);
        setRelationships([...FD.relationships]);
        setLayout({ ...FD.layout });

        setToast({ type: errs.length ? 'warn' : 'ok',
          msg: `Imported ${added}${skipped ? `, skipped ${skipped} duplicate${skipped>1?'s':''}` : ''}${errs.length ? `, ${errs.length} error${errs.length>1?'s':''}` : ''}.` });
      } catch (err) {
        console.error(err);
        setToast({ type: 'err', msg: 'Failed to parse CSV.' });
      }
    };
    reader.onerror = () => setToast({ type: 'err', msg: 'Could not read file.' });
    reader.readAsText(file);
  }

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const zoomIn = () => setTransform(t => ({ ...t, scale: Math.min(t.scale * 1.2, 4) }));
  const zoomOut = () => setTransform(t => ({ ...t, scale: Math.max(t.scale * 0.8, 0.12) }));
  const reset = () => setTransform({ x: 80, y: 80, scale: 0.7 });

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>

      <div className="tree-header">
        <h1><span className="dot"></span> {T('app_title')}</h1>

        <div className="search-wrap">
          <input className="search-input" value={search} onChange={e => setSearch(e.target.value)}
            placeholder={T('search_placeholder')} />
          {searchResults.length > 0 && (
            <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, background: '#fff', border: '1px solid #e3e1da', borderRadius: 10, zIndex: 300, boxShadow: '0 8px 24px rgba(20,20,20,0.08)', overflow: 'hidden' }}>
              {searchResults.map((p, i) => (
                <div key={p.id} onClick={() => { flyTo(p.id); setSearch(''); }}
                  style={{ padding: '10px 14px', cursor: 'pointer', fontSize: 13, color: '#15171a', borderBottom: i < searchResults.length - 1 ? '1px solid #f0eee7' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f6f5f2'}
                  onMouseLeave={e => e.currentTarget.style.background = ''}>
                  <span>{p.name}</span>
                  <span style={{ fontSize: 10, fontWeight: 500, padding: '2px 8px', borderRadius: 4, background: themeOf(p.family).soft, color: themeOf(p.family).ink, border: `1px solid ${themeOf(p.family).border}` }}>{p.family}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="zoom-controls">
          <button className="zoom-btn" onClick={zoomOut} title={T('zoom_out')}>−</button>
          <button className="zoom-btn" onClick={reset} title={T('zoom_reset')}>⌂</button>
          <button className="zoom-btn" onClick={zoomIn} title={T('zoom_in')}>+</button>
        </div>

        <button className="btn btn-ghost" onClick={() => fileInputRef.current?.click()} title={T('import_csv')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 2 }}><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>
          {T('import_csv')}
        </button>
        <input ref={fileInputRef} type="file" accept=".csv,text/csv" style={{ display: 'none' }}
          onChange={e => { const f = e.target.files?.[0]; if (f) handleCsvImport(f); e.target.value = ''; }} />
        <button className="btn" onClick={() => setShowModal(true)}>{T('add_member')}</button>
        <button className="btn btn-ghost" onClick={() => window.setLang(window.__LANG === 'en' ? 'hi' : 'en')}
          title="Switch language" style={{ minWidth: 64, justifyContent: 'center' }}>
          {T('lang_toggle')}
        </button>
      </div>

      <div className="canvas-wrap">
        <TreeCanvas people={people} layout={layout}
          selectedId={selectedId} highlightedIds={highlightedIds}
          collapsedIds={collapsedIds} transform={transform}
          setTransform={setTransform} onSelect={handleSelect}
          setTooltip={setTooltip} onCollapse={handleCollapse} />
      </div>

      {selectedId && (
        <DetailPanel person={FD.getPerson(selectedId)}
          onClose={() => handleSelect(null)} onNavigate={flyTo} />
      )}
      {showModal && <AddMemberModal people={people} onAdd={handleAddMember} onClose={() => setShowModal(false)} prefillName={welcomeMeta?.prefill} />}
      <Tooltip tip={tooltip} />
      <Legend />
      {showWelcome && welcomeMeta && (
        <WelcomeOverlay
          kind={welcomeMeta.kind}
          name={welcomeMeta.name}
          count={people.length}
          onAdd={openAddFlow}
          onFind={openFindFlow}
          onClose={dismissWelcome}
        />
      )}
      {!showWelcome && !showModal && !showWizard && <FloatingCTA onAdd={() => setShowWizard(true)} onFind={openFindFlow} />}
      {showWizard && (
        <Wizard
          people={people}
          prefillName={welcomeMeta?.prefill}
          anchorPersonId={selectedId || (welcomeMeta?.kind === 'known' ? welcomeMeta.targetId : null)}
          onClose={() => setShowWizard(false)}
          onAdded={() => { /* keep wizard open for "add another" */ }}
        />
      )}

      {toast && (
        <div style={{ position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)', background: toast.type === 'err' ? '#3a1010' : toast.type === 'warn' ? '#3a2a10' : '#15171a', color: '#fff', padding: '10px 16px', borderRadius: 10, fontSize: 13, fontFamily: 'Inter, sans-serif', fontWeight: 500, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', zIndex: 500, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: toast.type === 'err' ? '#ff6b6b' : toast.type === 'warn' ? '#f0b040' : '#2f9e6f' }}></span>
          {toast.msg}
          <button onClick={() => setToast(null)} style={{ marginLeft: 4, background: 'transparent', border: 'none', color: '#9aa1ad', cursor: 'pointer', fontSize: 14, padding: 0, lineHeight: 1 }}>✕</button>
        </div>
      )}

      <div className="footer-pill">
        <span>{T('pill_members', { n: people.length })}</span>
        <span className="sep"></span>
        <span>{T('pill_families', { n: (layout.__families || []).length })}</span>
        <span className="sep"></span>
        <span>{T('pill_unions', { n: relationships.filter(r => r.type === 'spouse').length })}</span>
        {pendingCount > 0 && (
          <>
            <span className="sep"></span>
            <span style={{ color: '#c47a3d', fontWeight: 600 }}>{T('pill_pending', { n: pendingCount })}</span>
          </>
        )}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
