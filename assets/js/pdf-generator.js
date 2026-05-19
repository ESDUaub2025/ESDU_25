// ──────────────────────────────────────────────────────────
// ESDU Portfolio PDF Generator — Refined Version
// Extracts live DOM content → builds standalone HTML → renders A4 PDF
// via html2pdf.js, then post-processes with jsPDF for page numbers.
// ──────────────────────────────────────────────────────────
ready(() => {
  const pdfBtn = document.getElementById('download-pdf-btn');
  if (!pdfBtn) return;

  pdfBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    if (typeof html2pdf === 'undefined') {
      alert('PDF library not loaded. Please refresh the page and try again.');
      return;
    }

    const originalHTML = pdfBtn.innerHTML;
    pdfBtn.innerHTML = '<span>⏳ Generating PDF…</span>';
    pdfBtn.disabled = true;

    try {
      // Force all reveal-animated elements visible so content can be read
      document.querySelectorAll('[data-reveal]').forEach(el => {
        el.classList.add('visible');
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      await new Promise(r => setTimeout(r, 250));

      // ── DOM helpers ──
      const $ = (sel, ctx) => (ctx || document).querySelector(sel);
      const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
      const txt = el => el ? el.textContent.trim() : '';
      const esc = t => { const d = document.createElement('div'); d.textContent = t; return d.innerHTML; };
      const absUrl = href => {
        if (!href) return '';
        try { return new URL(href, window.location.href).href; }
        catch (_) { return href; }
      };

      // ── Design tokens ──
      const brand = '#840132';
      const teal  = '#006666';
      const amber = '#cc7700';
      const green = '#2d5a27';
      const gold  = '#D4AF37';
      const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      const yr    = new Date().getFullYear();

      // ── Reusable builders ──
      const heading = (title, color = brand) =>
        `<h2 style="color:${color};font-size:16pt;margin:28px 0 8px;padding-bottom:6px;border-bottom:2px solid ${color};">${esc(title)}</h2>`;

      const subtitle = (text) =>
        text ? `<p style="margin:0 0 14px;color:#666;font-style:italic;font-size:10pt;">${esc(text)}</p>` : '';

      const pgBreak = '<div style="page-break-after:always;"></div>';

      const contentCard = (h3, body, accent = brand, bg = '#fff5f8') =>
        `<div style="margin:10px 0;padding:12px 14px;background:${bg};border-left:4px solid ${accent};border-radius:3px;">` +
        `<h3 style="color:${accent};font-size:11pt;margin:0 0 5px;">${esc(h3)}</h3>` +
        `<p style="margin:0;font-size:10pt;line-height:1.5;color:#333;">${esc(body)}</p></div>`;

      // ─────────── Start building HTML ───────────
      let html = '';

      // ═══════════════════════════════════════════
      //  COVER PAGE
      // ═══════════════════════════════════════════
      const heroDesc = txt($('.hero-description p'));

      html += `
        <div style="text-align:center;padding:50px 20px 30px;page-break-after:always;">
          <div style="margin-bottom:40px;">
            <div style="font-size:10.5pt;letter-spacing:3px;text-transform:uppercase;color:#999;margin-bottom:10px;">Environment and Sustainable Development Unit</div>
            <div style="font-size:10pt;color:#aaa;">Faculty of Agricultural and Food Sciences — American University of Beirut</div>
          </div>
          <div style="width:80px;height:3px;background:${brand};margin:0 auto 35px;"></div>
          <h1 style="color:${brand};font-size:34pt;margin:0 0 10px;font-weight:700;">ESDU Portfolio</h1>
          <h2 style="color:#555;font-size:16pt;font-weight:400;margin:0 0 10px;">25 Years of Sustainable Development</h2>
          <p style="color:${amber};font-size:12pt;font-style:italic;margin:0 0 40px;">Exploring Solutions, Defying Uncertainties</p>
          ${heroDesc ? `<p style="max-width:460px;margin:0 auto 40px;font-size:10pt;line-height:1.6;color:#555;">${esc(heroDesc)}</p>` : ''}
          <div style="width:40px;height:2px;background:#ccc;margin:0 auto 40px;"></div>
          <p style="color:#999;font-size:10pt;">${today}</p>
        </div>
      `;

      // ═══════════════════════════════════════════
      //  TABLE OF CONTENTS
      // ═══════════════════════════════════════════
      const tocItems = [
        (() => {
          const sec = $('#foreword');
          if (!sec) return null;
          const title = txt($('.foreword-section-header h2', sec)) || 'Foreword';
          const groups = $$('.foreword-subtle-title', sec).map(el => txt(el)).filter(Boolean);
          return groups.length ? `${title} — ${groups.join(' / ')}` : title;
        })(),
        (() => { const sec = $('#mission');   return sec ? (txt($('h2', sec)) || 'Mission, Vision, Core Values') : null; })(),
        (() => { const sec = $('#story');     return sec ? (txt($('h2', sec)) || 'Our Story') : null; })(),
        (() => { const sec = $('#work');      return sec ? (txt($('h2', sec)) || 'ESDU at Work') : null; })(),
        (() => { const sec = $('#goals');     return sec ? (txt($('h2', sec)) || 'Strategic Goals') : null; })(),
        (() => { const sec = $('#keepers');   return sec ? (txt($('h2', sec)) || txt($('.kotl-card h2', sec)) || 'Keepers of the Land') : null; })(),
        (() => { const sec = $('#impact');    return sec ? (txt($('h2', sec)) || 'Impact & Outreach') : null; })(),
        (() => { const sec = $('#projects');  return sec ? (txt($('h2', sec)) || 'Projects') : null; })(),
        (() => { const sec = $('#partners');  return sec ? (txt($('h2', sec)) || 'Partners and Donors') : null; })(),
        (() => { const sec = $('#resources'); return sec ? (txt($('h2', sec)) || 'Resources') : null; })()
      ].filter(Boolean);

      html += `<div style="padding:30px 0;page-break-after:always;">`;
      html += `<h2 style="color:${brand};font-size:18pt;margin:0 0 24px;text-align:center;">Contents</h2>`;
      tocItems.forEach((label, i) => {
        html += `<div style="padding:9px 4px;border-bottom:1px dotted #ddd;">`;
        html += `<span style="color:${brand};font-weight:600;font-size:11pt;margin-right:10px;">${i + 1}.</span>`;
        html += `<span style="font-size:11pt;color:#333;">${esc(label)}</span>`;
        html += `</div>`;
      });
      html += `</div>`;

      // ═══════════════════════════════════════════
      //  1 · FOREWORD
      // ═══════════════════════════════════════════
      const foreword = $('#foreword');
      if (foreword) {
        const sTitle = txt($('.foreword-section-header h2', foreword)) || 'Foreword';
        const groups = $$('.foreword-grid', foreword);
        const groupTitles = $$('.foreword-subtle-title', foreword).map(el => txt(el)).filter(Boolean);

        if (groups.length) {
          html += `<div style="padding:4px 0;">`;
          html += `<h2 style="color:${brand};font-size:18pt;margin:0 0 6px;padding-bottom:6px;border-bottom:2px solid ${brand};text-align:center;">${esc(sTitle)}</h2>`;

          groups.forEach((group, groupIdx) => {
            const groupCards = $$('.foreword-content', group);
            if (!groupCards.length) return;

            const groupTitle = groupTitles[groupIdx] || '';
            if (groupTitle) {
              html += `<h3 style="margin:16px 0 10px;color:${brand};font-size:11pt;text-transform:uppercase;letter-spacing:.05em;">${esc(groupTitle)}</h3>`;
            }

            groupCards.forEach((article) => {
              const author      = txt($('.author-name', article));
              const authorTitle = txt($('.author-title', article));
              const authorOrg   = txt($('.author-org', article));
              const lead        = txt($('.foreword-closing', article));
              const details     = $$('.foreword-expandable p', article).map(p => txt(p)).filter(Boolean);
              const paras       = [lead, ...details].filter(Boolean);

              if (!paras.length) return;

              html += `<div style="margin:0 0 10px;padding:14px 16px;background:linear-gradient(135deg,#fdf6f8,#fff);border-left:4px solid ${brand};border-radius:4px;page-break-inside:avoid;break-inside:avoid;">`;
              if (author) {
                html += `<div style="margin-bottom:10px;">`;
                html += `<span style="font-weight:700;color:${brand};font-size:12pt;">${esc(author)}</span><br/>`;
                if (authorTitle) html += `<span style="color:#555;font-size:9.5pt;">${esc(authorTitle)}</span><br/>`;
                if (authorOrg)   html += `<span style="color:#888;font-style:italic;font-size:9pt;">${esc(authorOrg)}</span>`;
                html += `</div>`;
              }

              paras.forEach((p, idx) => {
                const extraStyle = idx === 0
                  ? `font-style:italic;font-weight:600;color:${brand};border-left:3px solid ${brand};padding-left:8px;`
                  : '';
                html += `<p style="margin:0 0 8px;text-align:justify;line-height:1.6;font-size:9.5pt;color:#333;${extraStyle}">${esc(p)}</p>`;
              });
              html += `</div>`;
            });
          });

          html += `</div>`;
          html += pgBreak;
        }
      }

      // ═══════════════════════════════════════════
      //  2 · MISSION, VISION, CORE VALUES
      // ═══════════════════════════════════════════
      const mission = $('#mission');
      if (mission) {
        const title = txt($('h2', mission));
        const sub   = txt($('.section-head p', mission));

        if (title) {
          html += heading(title);
          html += subtitle(sub);

          $$('.card-slider .card', mission).forEach(card => {
            const h3 = txt($('h3', card));
            const p  = txt($('p', card));
            if (h3 && p) html += contentCard(h3, p);
          });

          const valuesCard = $('.card-values', mission);
          if (valuesCard) {
            const values = $$('.pill-list li', valuesCard).map(li => txt(li)).filter(t => t);
            if (values.length) {
              html += `<div style="margin:12px 0;padding:12px 14px;background:#fff5f8;border-left:4px solid ${brand};border-radius:3px;">`;
              html += `<h3 style="color:${brand};font-size:12pt;margin:0 0 8px;">Core Values</h3>`;
              html += `<ul style="margin:0;padding-left:18px;font-size:10pt;line-height:1.6;">`;
              values.forEach(v => html += `<li style="margin:3px 0;color:#333;">${esc(v)}</li>`);
              html += `</ul></div>`;
            }
          }
          html += pgBreak;
        }
      }

      // ═══════════════════════════════════════════
      //  3 · OUR STORY / TIMELINE
      // ═══════════════════════════════════════════
      const story = $('#story');
      if (story) {
        const title = txt($('h2', story));
        const sub   = txt($('.section-head p', story));

        if (title) {
          html += heading(title, gold);
          html += subtitle(sub);

          const milestones = $$('.year', story);
          if (milestones.length) {
            milestones.forEach(item => {
              const y = txt($('h4', item));
              const d = txt($('p', item));
              if (y) {
                html += `<div style="margin:6px 0;padding:8px 12px;border-left:3px solid ${gold};background:#fffef5;border-radius:2px;">`;
                html += `<span style="font-size:11pt;font-weight:700;color:${gold};">${esc(y)}</span>`;
                if (d) html += `<span style="margin-left:12px;font-size:9.5pt;color:#444;">${esc(d)}</span>`;
                html += `</div>`;
              }
            });
          } else {
            html += `<p style="font-size:10pt;color:#666;font-style:italic;">Visit the ESDU website to explore the interactive 25-year timeline.</p>`;
          }
          html += pgBreak;
        }
      }

      // ═══════════════════════════════════════════
      //  4 · ESDU AT WORK
      // ═══════════════════════════════════════════
      const work = $('#work');
      if (work) {
        const title = txt($('h2', work));
        const sub   = txt($('.section-head p', work));

        if (title) {
          html += heading(title, teal);
          html += subtitle(sub);

          $$('.slide', work).forEach(slide => {
            const h3 = txt($('h3', slide));
            const p  = txt($('p', slide));
            if (h3 && p) html += contentCard(h3, p, teal, '#f0f8f8');
          });
          html += pgBreak;
        }
      }

      // ═══════════════════════════════════════════
      //  5 · STRATEGIC GOALS 2025-2030
      // ═══════════════════════════════════════════
      const goals = $('#goals');
      if (goals) {
        const title = txt($('h2', goals));
        const sub   = txt($('.section-head p', goals));

        if (title) {
          html += heading(title, green);
          html += subtitle(sub);

          $$('.goal-card', goals).forEach(card => {
            const h3 = txt($('h3', card));
            const p  = txt($('p', card));
            if (h3 && p) html += contentCard(h3, p, green, '#f0f8f0');
          });
          html += pgBreak;
        }
      }

      // ═══════════════════════════════════════════
      //  6 · KEEPERS OF THE LAND
      // ═══════════════════════════════════════════
      const keepers = $('#keepers');
      if (keepers) {
        const title = txt($('.kotl-card h2', keepers)) || txt($('h2', keepers));
        const paras = $$('.kotl-card > p', keepers).map(p => txt(p)).filter(t => t);
        const chips = $$('.chip-list span', keepers).map(s => txt(s)).filter(t => t);

        if (title) {
          html += heading(title, green);
          paras.forEach(p => {
            html += `<p style="margin:0 0 10px;text-align:justify;font-size:10pt;line-height:1.6;color:#333;">${esc(p)}</p>`;
          });
          if (chips.length) {
            html += `<div style="margin:16px 0;padding:12px 14px;background:#f0f8f0;border-left:4px solid ${green};border-radius:3px;">`;
            html += `<strong style="color:${green};font-size:10pt;">Key Topics</strong><br/>`;
            html += `<span style="line-height:2;">${chips.map(c =>
              `<span style="display:inline-block;padding:3px 10px;margin:3px 4px 3px 0;background:#e8f5e9;border-radius:12px;font-size:9pt;color:#2d5a27;">${esc(c)}</span>`
            ).join('')}</span>`;
            html += `</div>`;
          }
          html += pgBreak;
        }
      }

      // ═══════════════════════════════════════════
      //  7 · IMPACT & OUTREACH
      // ═══════════════════════════════════════════
      const impact = $('#impact');
      if (impact) {
        const title = txt($('h2', impact));
        const sub   = txt($('.section-head p', impact));

        if (title) {
          html += heading(title);
          html += subtitle(sub);

          // KPI grid — 2-column table, handles odd count
          const kpis = $$('.kpi', impact);
          if (kpis.length) {
            html += `<table style="width:100%;border-collapse:collapse;margin:10px 0;">`;
            for (let i = 0; i < kpis.length; i += 2) {
              html += `<tr>`;
              for (let j = i; j < Math.min(i + 2, kpis.length); j++) {
                const kpi     = kpis[j];
                const valueEl = $('.kpi-value', kpi);
                const num     = valueEl ? (valueEl.getAttribute('data-count') || txt(valueEl)) : '';
                const label   = txt($('.kpi-label', kpi));
                if (num && label) {
                  html += `<td style="width:50%;padding:12px 8px;text-align:center;background:#fff5f8;border:1px solid #e0c0cc;vertical-align:top;">`;
                  html += `<div style="font-size:20pt;font-weight:700;color:${brand};margin-bottom:4px;">${esc(num)}</div>`;
                  html += `<div style="font-size:8.5pt;color:#555;line-height:1.3;">${esc(label)}</div>`;
                  html += `</td>`;
                }
              }
              if (i + 1 === kpis.length) html += `<td style="width:50%;border:none;"></td>`;
              html += `</tr>`;
            }
            html += `</table>`;
          }

          // Geographic outreach from esduLocations data
          if (typeof esduLocations !== 'undefined') {
            const counts = [];
            if (esduLocations.local && esduLocations.local.length)
              counts.push(`<strong>${esduLocations.local.length}</strong> local partners across Lebanon`);
            if (esduLocations.regional && esduLocations.regional.length)
              counts.push(`<strong>${esduLocations.regional.length}</strong> regional collaborations`);
            if (esduLocations.global && esduLocations.global.length)
              counts.push(`<strong>${esduLocations.global.length}</strong> global connections`);

            if (counts.length) {
              html += `<div style="margin:18px 0 0;padding:12px 14px;background:#f0f8f8;border-left:4px solid ${teal};border-radius:3px;">`;
              html += `<h3 style="color:${teal};font-size:11pt;margin:0 0 8px;">Geographical Outreach</h3>`;
              html += `<ul style="margin:0;padding-left:18px;font-size:10pt;line-height:1.6;">`;
              counts.forEach(c => html += `<li style="margin:3px 0;color:#333;">${c}</li>`);
              html += `</ul></div>`;
            }
          }
          html += pgBreak;
        }
      }

      // ═══════════════════════════════════════════
      //  8 · PROJECTS
      // ═══════════════════════════════════════════
      const projects = $('#projects');
      if (projects) {
        const title = txt($('h2', projects));
        const sub   = txt($('.section-head p', projects));
        const cards = $$('.donor-card a', projects);

        if (title && cards.length) {
          html += heading(title);
          html += subtitle(sub);

          html += `<div style="columns:2;column-gap:24px;font-size:10pt;">`;
          cards.forEach(link => {
            const text = txt(link);
            const url  = absUrl(link.getAttribute('href'));
            if (text && url) {
              html += `<div style="break-inside:avoid;margin:0 0 8px;padding:7px 10px;background:#fafafa;border-radius:3px;border:1px solid #eee;">`;
              html += `<a href="${esc(url)}" style="color:${brand};text-decoration:none;font-size:9.5pt;" target="_blank">${esc(text)}</a>`;
              html += `</div>`;
            }
          });
          html += `</div>`;
          html += pgBreak;
        }
      }

      // ═══════════════════════════════════════════
      //  9 · PARTNERS AND DONORS
      // ═══════════════════════════════════════════
      const partners = $('#partners');
      if (partners) {
        const title = txt($('h2', partners));
        const sub   = txt($('.section-head p', partners));
        const cards = $$('.donor-card a', partners);

        if (title && cards.length) {
          html += heading(title, teal);
          html += subtitle(sub);

          html += `<div style="columns:2;column-gap:24px;font-size:10pt;">`;
          cards.forEach(link => {
            const text = txt(link);
            const url  = absUrl(link.getAttribute('href'));
            if (text && url) {
              html += `<div style="break-inside:avoid;margin:0 0 8px;padding:7px 10px;background:#f0f8f8;border-radius:3px;border:1px solid #d8eaea;">`;
              html += `<a href="${esc(url)}" style="color:${teal};text-decoration:none;font-size:9.5pt;" target="_blank">${esc(text)}</a>`;
              html += `</div>`;
            }
          });
          html += `</div>`;
          html += pgBreak;
        }
      }

      // ═══════════════════════════════════════════
      //  10 · RESOURCES
      // ═══════════════════════════════════════════
      const resources = $('#resources');
      if (resources) {
        const title = txt($('h2', resources));
        const sub   = txt($('.section-head p', resources));
        const files = $$('.file-list a', resources);

        if (title) {
          html += heading(title, green);
          html += subtitle(sub);

          if (files.length) {
            files.forEach(link => {
              const name = txt($('.file-name', link));
              const meta = txt($('.file-meta', link));
              const url  = absUrl(link.getAttribute('href'));
              if (name) {
                html += `<div style="margin:8px 0;padding:10px 14px;background:#f0f8f0;border-left:4px solid ${green};border-radius:3px;">`;
                if (url) {
                  html += `<a href="${esc(url)}" style="color:${green};font-size:11pt;font-weight:600;text-decoration:none;" target="_blank">${esc(name)}</a>`;
                } else {
                  html += `<span style="color:${green};font-size:11pt;font-weight:600;">${esc(name)}</span>`;
                }
                if (meta) html += `<span style="margin-left:8px;font-size:9pt;color:#888;">(${esc(meta)})</span>`;
                html += `</div>`;
              }
            });
          }
        }
      }

      // ═══════════════════════════════════════════
      //  CLOSING PAGE
      // ═══════════════════════════════════════════
      html += `
        <div style="page-break-before:always;text-align:center;padding:80px 20px 40px;">
          <div style="width:60px;height:3px;background:${brand};margin:0 auto 30px;"></div>
          <h2 style="color:${brand};font-size:18pt;margin:0 0 6px;">Environment and Sustainable Development Unit</h2>
          <p style="color:#666;font-size:11pt;margin:0 0 4px;">Faculty of Agricultural and Food Sciences</p>
          <p style="color:#666;font-size:11pt;margin:0 0 30px;">American University of Beirut</p>
          <p style="color:${amber};font-size:11pt;font-style:italic;margin:0 0 50px;">Exploring Solutions, Defying Uncertainties</p>
          <div style="width:40px;height:2px;background:#ccc;margin:0 auto 50px;"></div>
          <p style="font-size:9pt;color:#999;">This document was generated from the ESDU 25th Anniversary Portfolio website.</p>
          <p style="font-size:9pt;color:#999;">Content reflects the latest updates as of ${today}.</p>
          <p style="font-size:9pt;color:#bbb;margin-top:30px;">© ${yr} ESDU — American University of Beirut. All rights reserved.</p>
        </div>
      `;

      // ─────────── Render PDF ───────────
      const container = document.createElement('div');
      container.id = 'pdf-content';
      container.style.cssText = 'width:180mm;margin:0 auto;padding:0 15mm;background:white;font-family:"Montserrat",Arial,Helvetica,sans-serif;color:#222;';
      container.innerHTML = html;
      document.body.appendChild(container);

      await new Promise(r => setTimeout(r, 300));

      const filename = `ESDU_Portfolio_${new Date().toISOString().split('T')[0]}.pdf`;

      const opt = {
        margin:     [12, 12, 16, 12],
        filename:   filename,
        image:      { type: 'jpeg', quality: 0.95 },
        html2canvas:{ scale: 2, useCORS: true, logging: false },
        jsPDF:      { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak:  { mode: ['css', 'legacy'], avoid: ['tr'] }
      };

      // Generate, add page numbers + running header, then save
      const worker = html2pdf().set(opt).from(container).toPdf();
      const pdf    = await worker.get('pdf');

      const totalPages = pdf.internal.getNumberOfPages();
      const pageW      = pdf.internal.pageSize.getWidth();
      const pageH      = pdf.internal.pageSize.getHeight();

      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        if (i > 1) {
          // Page number — bottom center
          pdf.setFontSize(8);
          pdf.setTextColor(170, 170, 170);
          pdf.text(`${i} / ${totalPages}`, pageW / 2, pageH - 6, { align: 'center' });
          // Running header — top right
          pdf.setFontSize(7);
          pdf.setTextColor(132, 1, 50);
          pdf.text('ESDU \u2014 25 Years', pageW - 12, 8, { align: 'right' });
        }
      }

      pdf.save(filename);
      document.body.removeChild(container);

      pdfBtn.innerHTML = '<span>\u2713 PDF Downloaded!</span>';
      setTimeout(() => {
        pdfBtn.innerHTML = originalHTML;
        pdfBtn.disabled = false;
      }, 2500);

    } catch (error) {
      console.error('PDF generation error:', error);
      alert('PDF generation failed. Please try again.\n' + error.message);
      pdfBtn.innerHTML = originalHTML;
      pdfBtn.disabled = false;
    }
  });
});
