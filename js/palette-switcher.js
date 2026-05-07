// ── PALETTE SWITCHER (temporary — remove when done) ───────────
const PALETTES = [
  { name: 'Ballpoint Notebook', bg:'#F3F1E9', bgCard:'#E6E2D7', paper:'#F3F1E9', gridInk:'0,34,255', gridOpacity:'0.055', ink:'#20201A', inkMid:'#55544A', inkLight:'#9A988B', accent:'#0619C8', accentMid:'#1029D8', accentLight:'#5267E8', cream:'#FAF8EF', modalBg:'#F0ECE2', navBg:'243,241,233', navOpacity:'0.78', border:'rgba(6,25,200,0.14)' },
  { name: 'Warm Linen',     bg:'#E8E0D0', bgCard:'#DDD5C4', ink:'#1C2416', inkMid:'#4A5242', inkLight:'#8A9082', accent:'#2D3D26', accentMid:'#3E5234', accentLight:'#6B8060', cream:'#F0EAD8', modalBg:'#EDE8DC', navBg:'232,224,208' },
  { name: 'Chalk & Slate',  bg:'#F0EEE8', bgCard:'#E4E1D8', ink:'#1A1F2E', inkMid:'#454C5E', inkLight:'#8A90A0', accent:'#1A1F2E', accentMid:'#2E3650', accentLight:'#6672A0', cream:'#F8F6F0', modalBg:'#EAE8E0', navBg:'240,238,232' },
  { name: 'Dusty Rose',     bg:'#EDE0DC', bgCard:'#E0D0CB', ink:'#261A18', inkMid:'#5A4240', inkLight:'#9A8280', accent:'#8C3A30', accentMid:'#A04840', accentLight:'#C07870', cream:'#F5EDE8', modalBg:'#E8DCD8', navBg:'237,224,220' },
  { name: 'Sage & Cream',   bg:'#E8EDE4', bgCard:'#DAE0D4', ink:'#1C2418', inkMid:'#485040', inkLight:'#8A9280', accent:'#3A5030', accentMid:'#506840', accentLight:'#7A9868', cream:'#F4F6F0', modalBg:'#E2E8DC', navBg:'232,237,228' },
  { name: 'Paper & Ink',    bg:'#F5F2EA', bgCard:'#EBE7DC', ink:'#14120C', inkMid:'#403C30', inkLight:'#807860', accent:'#3D2B00', accentMid:'#5A4010', accentLight:'#8A6830', cream:'#FBF8F0', modalBg:'#EEE9DE', navBg:'245,242,234' },
  { name: 'Steel Blue',     bg:'#E8EEF4', bgCard:'#D8E2EC', ink:'#0C1824', inkMid:'#304050', inkLight:'#7090A8', accent:'#0C3050', accentMid:'#1A4870', accentLight:'#4A7898', cream:'#F0F5F8', modalBg:'#E0E8F0', navBg:'232,238,244' },
  { name: 'Midnight',       bg:'#12141A', bgCard:'#1C1F28', ink:'#E8EAF0', inkMid:'#9099B0', inkLight:'#505870', accent:'#E8EAF0', accentMid:'#B0B8D0', accentLight:'#6870A0', cream:'#E8EAF0', modalBg:'#181B24', navBg:'18,20,26' },
  { name: 'Matrix',         bg:'#050F08', bgCard:'#081408', ink:'#00FF41', inkMid:'#00C832', inkLight:'#007820', accent:'#00FF41', accentMid:'#00C832', accentLight:'#009020', cream:'#00FF41', modalBg:'#081408', navBg:'5,15,8' },
  { name: 'Hacker Gold',    bg:'#0A0800', bgCard:'#140F00', ink:'#FFD700', inkMid:'#C8A800', inkLight:'#786200', accent:'#FFD700', accentMid:'#C8A800', accentLight:'#886800', cream:'#FFD700', modalBg:'#0E0B00', navBg:'10,8,0' },
  { name: 'Cyberpunk',      bg:'#0D001A', bgCard:'#160030', ink:'#F0F0F0', inkMid:'#C0C0C0', inkLight:'#808080', accent:'#FF007F', accentMid:'#CC0066', accentLight:'#8800FF', cream:'#FFE0FF', modalBg:'#10002A', navBg:'13,0,26' },
  { name: 'Neon Tokyo',     bg:'#080818', bgCard:'#100820', ink:'#F0F8FF', inkMid:'#A0B8D0', inkLight:'#506080', accent:'#00F5FF', accentMid:'#FF00AA', accentLight:'#7700FF', cream:'#E0F8FF', modalBg:'#0C0820', navBg:'8,8,24' },
  { name: 'Acid Yellow',    bg:'#F5FF00', bgCard:'#E8F000', ink:'#0A0A00', inkMid:'#302800', inkLight:'#605000', accent:'#0A0A00', accentMid:'#282800', accentLight:'#484800', cream:'#FFFF80', modalBg:'#EEFF00', navBg:'245,255,0' },
  { name: 'Vaporwave',      bg:'#FFE8F8', bgCard:'#F8D0F0', ink:'#280838', inkMid:'#582878', inkLight:'#9850A8', accent:'#FF40C0', accentMid:'#C820A0', accentLight:'#8800C0', cream:'#FFF0FF', modalBg:'#F8E0F5', navBg:'255,232,248' },
  { name: 'Retro Terminal', bg:'#001400', bgCard:'#001800', ink:'#33FF33', inkMid:'#22CC22', inkLight:'#117711', accent:'#33FF33', accentMid:'#22BB22', accentLight:'#118811', cream:'#33FF33', modalBg:'#001800', navBg:'0,20,0' },
  { name: 'Deep Ocean',     bg:'#050E1A', bgCard:'#0A1828', ink:'#B0D8F8', inkMid:'#6098C0', inkLight:'#305878', accent:'#00B8FF', accentMid:'#0080C0', accentLight:'#004880', cream:'#D0ECFF', modalBg:'#081420', navBg:'5,14,26' },
  { name: 'Warm Noir',      bg:'#1A1410', bgCard:'#221A14', ink:'#F0E8D8', inkMid:'#B0A090', inkLight:'#706050', accent:'#E8A040', accentMid:'#C07820', accentLight:'#885010', cream:'#F8EED8', modalBg:'#1E1812', navBg:'26,20,16' },
  { name: 'Arctic',         bg:'#EEF4F8', bgCard:'#E0ECF4', ink:'#0C2030', inkMid:'#305070', inkLight:'#7098B8', accent:'#0090D0', accentMid:'#006898', accentLight:'#4090B8', cream:'#F8FCFF', modalBg:'#E8F2F8', navBg:'238,244,248' },
  { name: 'Rust & Stone',   bg:'#2A1C14', bgCard:'#341E14', ink:'#F0DCC8', inkMid:'#C09878', inkLight:'#806040', accent:'#E05020', accentMid:'#B03818', accentLight:'#803018', cream:'#F8E8D0', modalBg:'#301E18', navBg:'42,28,20' },
  { name: 'Mint Chip',      bg:'#E8F5EE', bgCard:'#D8EEE0', ink:'#0C2018', inkMid:'#305040', inkLight:'#70A080', accent:'#008050', accentMid:'#006038', accentLight:'#40A870', cream:'#F0FBF4', modalBg:'#E0F0E8', navBg:'232,245,238' },
  { name: 'Solar Flare',    bg:'#1A0800', bgCard:'#240C00', ink:'#FFE8C0', inkMid:'#D09050', inkLight:'#885020', accent:'#FF6000', accentMid:'#CC4000', accentLight:'#882800', cream:'#FFF0D8', modalBg:'#1E0C00', navBg:'26,8,0' },
  { name: 'Archive Signal', bg:'#F3F0E8', bgCard:'#E1DED4', ink:'#11100C', inkMid:'#474033', inkLight:'#92876F', accent:'#D71920', accentMid:'#A80F16', accentLight:'#FF4A3D', cream:'#FFF9EA', modalBg:'#ECE7DA', navBg:'243,240,232' },
  { name: 'Studio Black',   bg:'#090909', bgCard:'#171717', ink:'#F2EBDC', inkMid:'#B9AD98', inkLight:'#70685C', accent:'#F04D23', accentMid:'#C43A18', accentLight:'#FF8A4C', cream:'#F7EEDC', modalBg:'#111111', navBg:'9,9,9' },
  { name: 'Bleach Lime',    bg:'#FAF8E8', bgCard:'#ECE8D1', ink:'#10120A', inkMid:'#424530', inkLight:'#85885E', accent:'#B7FF1A', accentMid:'#6E9900', accentLight:'#D9FF66', cream:'#FFFFF0', modalBg:'#F0ECD6', navBg:'250,248,232' },
  { name: 'Press Cyan',     bg:'#F7F5EF', bgCard:'#E7E2D8', ink:'#15120F', inkMid:'#403B35', inkLight:'#887F73', accent:'#00A7B5', accentMid:'#00717A', accentLight:'#46DDE8', cream:'#FFF8EC', modalBg:'#EEE9DF', navBg:'247,245,239' },
  { name: 'Oxide Red',      bg:'#201B18', bgCard:'#302820', ink:'#F1DDC3', inkMid:'#C2A98B', inkLight:'#766551', accent:'#D13F1F', accentMid:'#9F2D16', accentLight:'#F27A45', cream:'#FFEAD0', modalBg:'#281F1A', navBg:'32,27,24' },
  { name: 'Electric Paper', bg:'#FBFAF2', bgCard:'#EBE8DC', ink:'#080808', inkMid:'#33312C', inkLight:'#817C6F', accent:'#1E4DFF', accentMid:'#1636B8', accentLight:'#6F8DFF', cream:'#FFFDF4', modalBg:'#F0ECE2', navBg:'251,250,242' },
  { name: 'Bruised Chrome', bg:'#18171D', bgCard:'#24232B', ink:'#EAE7EF', inkMid:'#A8A0B4', inkLight:'#6B6374', accent:'#B5FF00', accentMid:'#84BD00', accentLight:'#D6FF5D', cream:'#F5F0FA', modalBg:'#1F1E25', navBg:'24,23,29' },
  { name: 'Poster Blue',    bg:'#0A2A66', bgCard:'#10377A', ink:'#FFF4D8', inkMid:'#D7C6A6', inkLight:'#8FA3CA', accent:'#FFCF00', accentMid:'#D69E00', accentLight:'#FFE36B', cream:'#FFF7DF', modalBg:'#09245A', navBg:'10,42,102' },
  { name: 'Bone Magenta',   bg:'#F6F1E5', bgCard:'#E6DFCF', ink:'#150F15', inkMid:'#463746', inkLight:'#897789', accent:'#C0007A', accentMid:'#870057', accentLight:'#F044B0', cream:'#FFF7EA', modalBg:'#EEE5D8', navBg:'246,241,229' },
  { name: 'Toxic Slate',    bg:'#161C1B', bgCard:'#222A28', ink:'#EAF7E8', inkMid:'#A9BDA5', inkLight:'#647260', accent:'#39FF14', accentMid:'#24B80C', accentLight:'#87FF6B', cream:'#F0FFE8', modalBg:'#1B2321', navBg:'22,28,27' },
];

let currentPalette = 0;

function applyPalette(p) {
  const r = document.documentElement.style;
  r.setProperty('--bg', p.bg);
  r.setProperty('--bg-card', p.bgCard);
  r.setProperty('--paper', p.paper || p.bg);
  r.setProperty('--grid-ink', p.gridInk || '0,34,255');
  r.setProperty('--grid-opacity', p.gridOpacity || '0.045');
  r.setProperty('--ink', p.ink);
  r.setProperty('--ink-mid', p.inkMid);
  r.setProperty('--ink-light', p.inkLight);
  r.setProperty('--green', p.accent);
  r.setProperty('--green-mid', p.accentMid);
  r.setProperty('--green-light', p.accentLight);
  r.setProperty('--cream', p.cream);
  r.setProperty('--modal-bg', p.modalBg);
  r.setProperty('--border', p.border || `rgba(${hexToRgb(p.ink)},0.13)`);
  // Nav background inline style (for the rgba transparency)
  const nav = document.querySelector('nav');
  nav.style.background = `rgba(${p.navBg},${p.navOpacity || '0.88'})`;
  // Update switcher active state
  document.querySelectorAll('.ps-swatch').forEach((sw, i) => {
    sw.classList.toggle('ps-active', i === currentPalette);
  });
  document.getElementById('ps-name').textContent = p.name;
  document.getElementById('ps-index').textContent = `${currentPalette + 1} / ${PALETTES.length}`;
}

function hexToRgb(hex) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? `${parseInt(r[1],16)},${parseInt(r[2],16)},${parseInt(r[3],16)}` : '0,0,0';
}

function initPaletteSwitcher() {
  const sw = document.createElement('div');
  sw.id = 'palette-switcher';
  sw.innerHTML = `
    <div id="ps-header">
      <span id="ps-label">Палитра</span>
      <button id="ps-toggle" data-palette-action="toggle">−</button>
    </div>
    <div id="ps-name">${PALETTES[0].name}</div>
    <div id="ps-swatches">${PALETTES.map((p,i) => `
      <button class="ps-swatch${i===0?' ps-active':''}" title="${p.name}" data-palette-index="${i}" style="background:${p.bg};border-color:${p.accent}">
        <span style="background:${p.accent}"></span>
      </button>`).join('')}
    </div>
    <div id="ps-nav">
      <button data-palette-action="prev">←</button>
      <span id="ps-index">1 / ${PALETTES.length}</span>
      <button data-palette-action="next">→</button>
    </div>
  `;
  document.body.appendChild(sw);
  sw.addEventListener('click', event => {
    const swatch = event.target.closest('[data-palette-index]');
    if (swatch) {
      selectPalette(Number(swatch.dataset.paletteIndex));
      return;
    }

    const action = event.target.closest('[data-palette-action]')?.dataset.paletteAction;
    if (action === 'prev') prevPalette();
    if (action === 'next') nextPalette();
    if (action === 'toggle') toggleSwitcher();
  });

  const style = document.createElement('style');
  style.textContent = `
    #palette-switcher {
      position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 9999;
      background: rgba(20,20,20,0.92); color: #f0f0f0;
      border-radius: 10px; padding: 0.75rem;
      font-family: system-ui, sans-serif; font-size: 11px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.5);
      width: 220px;
      backdrop-filter: blur(10px);
      transition: opacity 0.3s;
    }
    #palette-switcher.collapsed #ps-swatches,
    #palette-switcher.collapsed #ps-nav,
    #palette-switcher.collapsed #ps-name { display: none; }
    #ps-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem; }
    #ps-label { font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; opacity: 0.5; }
    #ps-toggle { background: none; border: none; color: #f0f0f0; cursor: pointer; font-size: 16px; line-height: 1; padding: 0 0.25rem; }
    #ps-name { font-size: 12px; font-weight: 500; margin-bottom: 0.6rem; opacity: 0.9; }
    #ps-swatches { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 0.6rem; }
    .ps-swatch {
      width: 26px; height: 26px; border-radius: 4px; border: 2px solid transparent;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: transform 0.15s, border-color 0.15s;
    }
    .ps-swatch:hover { transform: scale(1.15); }
    .ps-swatch.ps-active { border-color: white !important; transform: scale(1.15); }
    .ps-swatch span { width: 10px; height: 10px; border-radius: 50%; display: block; }
    #ps-nav { display: flex; align-items: center; justify-content: space-between; }
    #ps-nav button { background: rgba(255,255,255,0.1); border: none; color: #f0f0f0; cursor: pointer; border-radius: 4px; padding: 0.25rem 0.6rem; font-size: 13px; transition: background 0.15s; }
    #ps-nav button:hover { background: rgba(255,255,255,0.25); }
    #ps-index { opacity: 0.5; font-size: 10px; }
  `;
  document.head.appendChild(style);
}

function selectPalette(i) {
  currentPalette = i;
  applyPalette(PALETTES[i]);
}
function nextPalette() { selectPalette((currentPalette + 1) % PALETTES.length); }
function prevPalette() { selectPalette((currentPalette - 1 + PALETTES.length) % PALETTES.length); }
function toggleSwitcher() {
  const sw = document.getElementById('palette-switcher');
  const collapsed = sw.classList.toggle('collapsed');
  document.getElementById('ps-toggle').textContent = collapsed ? '+' : '−';
}

window.initPaletteSwitcher = initPaletteSwitcher;
