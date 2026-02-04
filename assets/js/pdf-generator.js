// ESDU Portfolio PDF Generator - Full Working Version
ready(() => {
  const pdfBtn = document.getElementById('download-pdf-btn');
  if (!pdfBtn) return;

  pdfBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    if (typeof html2pdf === 'undefined') {
      alert('PDF library not loaded. Please refresh and try again.');
      return;
    }

    const originalHTML = pdfBtn.innerHTML;
    pdfBtn.innerHTML = '<span>⏳ Generating PDF...</span>';
    pdfBtn.disabled = true;

    try {
      // Force all hidden elements visible
      document.querySelectorAll('[data-reveal]').forEach(el => {
        el.classList.add('visible');
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      await new Promise(r => setTimeout(r, 200));

      // Helper functions
      const $ = (sel, ctx) => (ctx || document).querySelector(sel);
      const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
      const txt = el => el ? el.textContent.trim() : '';
      const esc = t => { const d = document.createElement('div'); d.textContent = t; return d.innerHTML; };

      const brand = '#840132';
      const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

      // Build HTML content
      let html = '';

      // COVER PAGE
      html += `
        <div style="text-align:center;padding:80px 20px;page-break-after:always;">
          <h1 style="color:${brand};font-size:32pt;margin:0 0 20px;">ESDU Portfolio</h1>
          <div style="width:60px;height:3px;background:${brand};margin:0 auto 20px;"></div>
          <h2 style="color:#666;font-size:18pt;margin:0 0 60px;">25 Years of Sustainable Development</h2>
          <p style="color:#888;font-size:11pt;margin:5px 0;">Environment and Sustainable Development Unit</p>
          <p style="color:#888;font-size:11pt;margin:5px 0;">American University of Beirut</p>
          <p style="color:#999;font-size:10pt;margin-top:40px;">${today}</p>
        </div>
      `;

      // FOREWORD
      const foreword = $('#foreword');
      if (foreword) {
        const title = txt($('h2', foreword)) || 'Foreword';
        const subtitle = txt($('.foreword-subtitle', foreword));
        const paras = $$('.foreword-body p', foreword).map(p => txt(p)).filter(t => t);
        const author = txt($('.author-name', foreword));
        const authorTitle = txt($('.author-title', foreword));
        const authorOrg = txt($('.author-org', foreword));

        if (paras.length) {
          html += `<div style="padding:15px;page-break-after:always;">`;
          html += `<h2 style="color:${brand};font-size:18pt;margin:0 0 10px;padding-bottom:8px;border-bottom:2px solid ${brand};text-align:center;">${esc(title)}</h2>`;
          if (subtitle) html += `<p style="text-align:center;color:#666;font-style:italic;margin:0 0 20px;font-size:10pt;">${esc(subtitle)}</p>`;
          paras.forEach(p => {
            html += `<p style="margin:0 0 10px;text-align:justify;line-height:1.5;font-size:10pt;">${esc(p)}</p>`;
          });
          if (author) {
            html += `<div style="margin-top:25px;text-align:right;">`;
            html += `<p style="margin:2px 0;font-weight:bold;color:${brand};font-size:11pt;">${esc(author)}</p>`;
            if (authorTitle) html += `<p style="margin:2px 0;color:#666;font-size:10pt;">${esc(authorTitle)}</p>`;
            if (authorOrg) html += `<p style="margin:2px 0;color:#888;font-style:italic;font-size:9pt;">${esc(authorOrg)}</p>`;
            html += `</div>`;
          }
          html += `</div>`;
        }
      }

      // MISSION/VISION/VALUES
      const mission = $('#mission');
      if (mission) {
        const title = txt($('h2', mission));
        const subtitle = txt($('.section-head p', mission));
        
        if (title) {
          html += `<h2 style="color:${brand};font-size:16pt;margin:20px 0 10px;padding-bottom:6px;border-bottom:2px solid ${brand};">${esc(title)}</h2>`;
          if (subtitle) html += `<p style="margin:0 0 15px;color:#666;font-style:italic;font-size:10pt;">${esc(subtitle)}</p>`;
          
          $$('.card-slider .card', mission).forEach(card => {
            const h3 = txt($('h3', card));
            const p = txt($('p', card));
            if (h3 && p) {
              html += `<div style="margin:10px 0;padding:10px;background:#fff5f8;border-left:3px solid ${brand};">`;
              html += `<h3 style="color:${brand};font-size:12pt;margin:0 0 5px;">${esc(h3)}</h3>`;
              html += `<p style="margin:0;font-size:10pt;line-height:1.4;">${esc(p)}</p>`;
              html += `</div>`;
            }
          });
          
          const valuesCard = $('.card-values', mission);
          if (valuesCard) {
            const values = $$('.pill-list li', valuesCard).map(li => txt(li)).filter(t => t);
            if (values.length) {
              html += `<div style="margin:10px 0;padding:10px;background:#fff5f8;border-left:3px solid ${brand};">`;
              html += `<h3 style="color:${brand};font-size:12pt;margin:0 0 8px;">Core Values</h3>`;
              html += `<ul style="margin:0;padding-left:20px;font-size:10pt;">`;
              values.forEach(v => html += `<li style="margin:3px 0;">${esc(v)}</li>`);
              html += `</ul></div>`;
            }
          }
          html += `<div style="page-break-after:always;"></div>`;
        }
      }

      // OUR STORY / TIMELINE
      const story = $('#story');
      if (story) {
        const title = txt($('h2', story));
        const subtitle = txt($('.section-head p', story));
        
        if (title) {
          html += `<h2 style="color:${brand};font-size:16pt;margin:20px 0 10px;padding-bottom:6px;border-bottom:2px solid ${brand};">${esc(title)}</h2>`;
          if (subtitle) html += `<p style="margin:0 0 15px;color:#666;font-style:italic;font-size:10pt;">${esc(subtitle)}</p>`;
          
          $$('.year', story).forEach(item => {
            const year = txt($('h4', item));
            const desc = txt($('p', item));
            if (year) {
              html += `<div style="margin:8px 0;padding:8px;border-left:3px solid #D4AF37;background:#fffef8;">`;
              html += `<span style="font-size:12pt;font-weight:bold;color:#D4AF37;">${esc(year)}</span>`;
              if (desc) html += `<span style="margin-left:10px;font-size:9pt;color:#555;">${esc(desc)}</span>`;
              html += `</div>`;
            }
          });
          html += `<div style="page-break-after:always;"></div>`;
        }
      }

      // ESDU AT WORK
      const work = $('#work');
      if (work) {
        const title = txt($('h2', work));
        const subtitle = txt($('.section-head p', work));
        
        if (title) {
          html += `<h2 style="color:${brand};font-size:16pt;margin:20px 0 10px;padding-bottom:6px;border-bottom:2px solid ${brand};">${esc(title)}</h2>`;
          if (subtitle) html += `<p style="margin:0 0 15px;color:#666;font-style:italic;font-size:10pt;">${esc(subtitle)}</p>`;
          
          $$('.slide', work).forEach(slide => {
            const h3 = txt($('h3', slide));
            const p = txt($('p', slide));
            if (h3 && p) {
              html += `<div style="margin:10px 0;padding:10px;background:#f5f5f5;border-left:3px solid #006666;">`;
              html += `<h3 style="color:#006666;font-size:11pt;margin:0 0 5px;">${esc(h3)}</h3>`;
              html += `<p style="margin:0;font-size:10pt;line-height:1.4;">${esc(p)}</p>`;
              html += `</div>`;
            }
          });
          html += `<div style="page-break-after:always;"></div>`;
        }
      }

      // STRATEGIC GOALS
      const goals = $('#goals');
      if (goals) {
        const title = txt($('h2', goals));
        const subtitle = txt($('.section-head p', goals));
        
        if (title) {
          html += `<h2 style="color:${brand};font-size:16pt;margin:20px 0 10px;padding-bottom:6px;border-bottom:2px solid ${brand};">${esc(title)}</h2>`;
          if (subtitle) html += `<p style="margin:0 0 15px;color:#666;font-style:italic;font-size:10pt;">${esc(subtitle)}</p>`;
          
          $$('.goal-card', goals).forEach(card => {
            const h3 = txt($('h3', card));
            const p = txt($('p', card));
            if (h3 && p) {
              html += `<div style="margin:10px 0;padding:10px;background:#f0f8f0;border-left:3px solid #2d5a27;">`;
              html += `<h3 style="color:#2d5a27;font-size:11pt;margin:0 0 5px;">${esc(h3)}</h3>`;
              html += `<p style="margin:0;font-size:10pt;line-height:1.4;">${esc(p)}</p>`;
              html += `</div>`;
            }
          });
          html += `<div style="page-break-after:always;"></div>`;
        }
      }

      // KEEPERS OF THE LAND
      const keepers = $('#keepers');
      if (keepers) {
        const title = txt($('.kotl-card h2', keepers)) || txt($('h2', keepers));
        const paras = $$('.kotl-card > p', keepers).map(p => txt(p)).filter(t => t);
        const chips = $$('.chip-list span', keepers).map(s => txt(s)).filter(t => t);
        
        if (title) {
          html += `<h2 style="color:${brand};font-size:16pt;margin:20px 0 10px;padding-bottom:6px;border-bottom:2px solid ${brand};">${esc(title)}</h2>`;
          paras.forEach(p => {
            html += `<p style="margin:0 0 10px;text-align:justify;font-size:10pt;line-height:1.5;">${esc(p)}</p>`;
          });
          if (chips.length) {
            html += `<div style="margin:15px 0;padding:10px;background:#fffef0;border-left:3px solid #D4AF37;">`;
            html += `<strong style="color:#D4AF37;font-size:10pt;">Key Topics:</strong> `;
            html += `<span style="font-size:9pt;">${chips.map(c => esc(c)).join(' • ')}</span>`;
            html += `</div>`;
          }
        }
      }

      // IMPACT
      const impact = $('#impact');
      if (impact) {
        const title = txt($('h2', impact));
        const subtitle = txt($('.section-head p', impact));
        
        if (title) {
          html += `<h2 style="color:${brand};font-size:16pt;margin:20px 0 10px;padding-bottom:6px;border-bottom:2px solid ${brand};">${esc(title)}</h2>`;
          if (subtitle) html += `<p style="margin:0 0 15px;color:#666;font-style:italic;font-size:10pt;">${esc(subtitle)}</p>`;
          
          const kpis = $$('.kpi', impact);
          if (kpis.length) {
            html += `<table style="width:100%;border-collapse:collapse;margin:10px 0;">`;
            kpis.forEach((kpi, i) => {
              const valueEl = $('.kpi-value', kpi);
              const num = valueEl ? (valueEl.getAttribute('data-count') || txt(valueEl)) : '';
              const label = txt($('.kpi-label', kpi));
              if (num && label) {
                if (i % 3 === 0) html += `<tr>`;
                html += `<td style="width:33%;padding:10px;text-align:center;background:#fff5f8;border:1px solid ${brand};">`;
                html += `<div style="font-size:18pt;font-weight:bold;color:${brand};">${esc(num)}</div>`;
                html += `<div style="font-size:8pt;color:#555;">${esc(label)}</div>`;
                html += `</td>`;
                if (i % 3 === 2 || i === kpis.length - 1) html += `</tr>`;
              }
            });
            html += `</table>`;
          }
          html += `<div style="page-break-after:always;"></div>`;
        }
      }

      // PROJECTS
      const projects = $('#projects');
      if (projects) {
        const title = txt($('h2', projects));
        const cards = $$('.donor-card a', projects);
        
        if (title && cards.length) {
          html += `<h2 style="color:${brand};font-size:16pt;margin:20px 0 10px;padding-bottom:6px;border-bottom:2px solid ${brand};">${esc(title)}</h2>`;
          html += `<p style="margin:0 0 10px;color:#666;font-size:9pt;font-style:italic;">Click on project names to visit their webpages</p>`;
          html += `<ul style="margin:10px 0;padding-left:20px;columns:2;column-gap:30px;font-size:10pt;list-style:none;">`;
          cards.forEach(link => {
            const text = txt(link);
            const url = link.getAttribute('href');
            if (text && url) {
              html += `<li style="margin:6px 0;break-inside:avoid;"><a href="${url}" style="color:${brand};text-decoration:underline;" target="_blank">→ ${esc(text)}</a></li>`;
            }
          });
          html += `</ul>`;
        }
      }

      // PARTNERS
      const partners = $('#partners');
      if (partners) {
        const title = txt($('h2', partners));
        const cards = $$('.donor-card a', partners);
        
        if (title && cards.length) {
          html += `<h2 style="color:${brand};font-size:16pt;margin:20px 0 10px;padding-bottom:6px;border-bottom:2px solid ${brand};">${esc(title)}</h2>`;
          html += `<ul style="margin:10px 0;padding-left:20px;columns:2;column-gap:30px;font-size:10pt;list-style:none;">`;
          cards.forEach(link => {
            const text = txt(link);
            const url = link.getAttribute('href');
            if (text && url) {
              html += `<li style="margin:6px 0;break-inside:avoid;"><a href="${url}" style="color:#006666;text-decoration:underline;" target="_blank">→ ${esc(text)}</a></li>`;
            }
          });
          html += `</ul>`;
        }
      }

      // FOOTER
      html += `
        <div style="margin-top:40px;padding:15px;border-top:2px solid #ccc;text-align:center;">
          <p style="margin:3px 0;font-weight:bold;color:${brand};font-size:10pt;">Environment and Sustainable Development Unit (ESDU)</p>
          <p style="margin:3px 0;color:#666;font-size:9pt;">American University of Beirut</p>
          <p style="margin:3px 0;color:#999;font-size:8pt;">© ${new Date().getFullYear()} ESDU. All rights reserved.</p>
        </div>
      `;

      // Create container and generate PDF
      const container = document.createElement('div');
      container.id = 'pdf-content';
      container.style.cssText = 'width:180mm;margin:0 auto;padding:10mm 15mm;background:white;font-family:Arial,sans-serif;';
      container.innerHTML = html;
      document.body.appendChild(container);

      await new Promise(r => setTimeout(r, 100));

      const filename = `ESDU_Portfolio_${new Date().toISOString().split('T')[0]}.pdf`;
      const opt = {
        margin: 10,
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(container).save();
      document.body.removeChild(container);

      pdfBtn.innerHTML = '✓ PDF Downloaded!';
      setTimeout(() => {
        pdfBtn.innerHTML = originalHTML;
        pdfBtn.disabled = false;
      }, 2000);

    } catch (error) {
      console.error('PDF error:', error);
      alert('PDF failed: ' + error.message);
      pdfBtn.innerHTML = originalHTML;
      pdfBtn.disabled = false;
    }
  });
});
