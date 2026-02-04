// Simple PDF Generator for ESDU Portfolio
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

    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const filename = `ESDU_Portfolio_${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Force all hidden elements to be visible
      const revealElements = document.querySelectorAll('[data-reveal]');
      revealElements.forEach(el => {
        el.classList.add('visible');
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      
      await new Promise(resolve => setTimeout(resolve, 200));

      // Create content container
      const content = buildPDFContent();
      
      // Generate PDF
      const options = {
        margin: 15,
        filename: filename,
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          logging: false,
          letterRendering: true
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      await html2pdf().set(options).from(content).save();
      
      // Cleanup
      document.body.removeChild(content);
      
      pdfBtn.innerHTML = '✓ PDF Downloaded!';
      setTimeout(() => {
        pdfBtn.innerHTML = originalHTML;
        pdfBtn.disabled = false;
      }, 3000);

    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF: ' + error.message);
      pdfBtn.innerHTML = originalHTML;
      pdfBtn.disabled = false;
    }
  });
});

function buildPDFContent() {
  const container = document.createElement('div');
  container.style.cssText = `
    position: absolute;
    left: -9999px;
    width: 210mm;
    background: white;
    font-family: Arial, sans-serif;
    font-size: 11pt;
    line-height: 1.6;
    color: #333;
  `;

  const get = (parent, selector) => {
    const el = parent ? parent.querySelector(selector) : document.querySelector(selector);
    return el ? el.textContent.trim() : '';
  };

  const getAll = (parent, selector) => {
    const elements = parent ? parent.querySelectorAll(selector) : document.querySelectorAll(selector);
    return Array.from(elements).map(el => el.textContent.trim()).filter(t => t);
  };

  const esc = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  let html = '';

  // Cover Page
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  html += `
    <div style="text-align: center; padding: 100px 20px; page-break-after: always;">
      <h1 style="color: #840132; font-size: 36pt; margin: 0 0 20px; font-weight: 700;">ESDU Portfolio</h1>
      <div style="width: 80px; height: 3px; background: #840132; margin: 0 auto 20px;"></div>
      <h2 style="color: #666; font-size: 20pt; margin: 0 0 80px; font-weight: 400;">25 Years of Sustainable Development</h2>
      <p style="color: #888; font-size: 12pt; margin: 5px 0;">Environment and Sustainable Development Unit</p>
      <p style="color: #888; font-size: 12pt; margin: 5px 0;">American University of Beirut</p>
      <p style="color: #999; font-size: 10pt; margin-top: 40px;">${today}</p>
    </div>
  `;

  // Foreword
  const foreword = document.querySelector('#foreword');
  if (foreword) {
    const title = get(foreword, 'h2') || 'Foreword';
    const paras = getAll(foreword, '.foreword-body p');
    const author = get(foreword, '.author-name');
    const authorTitle = get(foreword, '.author-title');
    
    if (paras.length) {
      html += `<div style="padding: 20px; page-break-after: always;">
        <h2 style="color: #840132; font-size: 22pt; margin: 0 0 25px; border-bottom: 3px solid #840132; padding-bottom: 10px;">${esc(title)}</h2>`;
      
      paras.forEach(p => {
        html += `<p style="margin: 0 0 12px; text-align: justify; line-height: 1.7;">${esc(p)}</p>`;
      });
      
      if (author) {
        html += `<div style="margin-top: 30px; text-align: right;">
          <p style="margin: 3px 0; font-weight: 700; color: #840132;">${esc(author)}</p>
          ${authorTitle ? `<p style="margin: 3px 0; color: #666;">${esc(authorTitle)}</p>` : ''}
        </div>`;
      }
      html += `</div>`;
    }
  }

  // Mission/Vision/Values
  const mission = document.querySelector('#mission');
  if (mission) {
    const title = get(mission, 'h2');
    if (title) {
      html += `<h2 style="color: #840132; font-size: 20pt; margin: 30px 20px 25px; border-bottom: 2px solid #840132; padding-bottom: 8px;">${esc(title)}</h2>`;
      
      const cards = mission.querySelectorAll('.card');
      cards.forEach(card => {
        const h3 = get(card, 'h3');
        const p = get(card, 'p');
        
        if (h3 === 'Core Values') {
          const values = getAll(card, 'li');
          if (values.length) {
            html += `<div style="margin: 20px; padding: 15px; background: #fff5f8; border-left: 4px solid #840132;">
              <h3 style="color: #840132; font-size: 14pt; margin: 0 0 10px;">${esc(h3)}</h3>
              <ul style="margin: 0; padding-left: 20px;">`;
            values.forEach(v => {
              html += `<li style="margin: 5px 0;">${esc(v)}</li>`;
            });
            html += `</ul></div>`;
          }
        } else if (h3 && p) {
          html += `<div style="margin: 20px; padding: 15px; background: #f9f9f9; border-left: 4px solid #840132;">
            <h3 style="color: #840132; font-size: 14pt; margin: 0 0 10px;">${esc(h3)}</h3>
            <p style="margin: 0; line-height: 1.6;">${esc(p)}</p>
          </div>`;
        }
      });
      html += `<div style="page-break-after: always;"></div>`;
    }
  }

  // Our Story
  const story = document.querySelector('#story');
  if (story) {
    const title = get(story, 'h2');
    const paras = getAll(story, '.story-section .prose p');
    
    if (title && paras.length) {
      html += `<h2 style="color: #840132; font-size: 20pt; margin: 30px 20px 20px; border-bottom: 2px solid #840132; padding-bottom: 8px;">${esc(title)}</h2>`;
      paras.forEach(p => {
        html += `<p style="margin: 0 20px 12px; text-align: justify; line-height: 1.7;">${esc(p)}</p>`;
      });
    }
  }

  // Timeline
  const timeline = document.querySelector('#timeline');
  if (timeline) {
    const title = get(timeline, 'h2');
    const slides = timeline.querySelectorAll('.timeline-slide');
    
    if (title && slides.length) {
      html += `<h2 style="color: #840132; font-size: 20pt; margin: 30px 20px 20px; border-bottom: 2px solid #840132; padding-bottom: 8px;">${esc(title)}</h2>`;
      html += `<div style="margin: 20px;">`;
      
      slides.forEach(slide => {
        const year = get(slide, '.timeline-year');
        const t = get(slide, '.timeline-title');
        const desc = get(slide, '.timeline-description');
        
        if (year) {
          html += `<div style="margin: 15px 0; padding: 12px; border-left: 4px solid #D4AF37; background: #fffef8;">
            <div style="font-size: 18pt; font-weight: 700; color: #D4AF37; margin: 0 0 5px;">${esc(year)}</div>
            ${t ? `<div style="font-weight: 600; color: #840132; margin: 0 0 5px;">${esc(t)}</div>` : ''}
            ${desc ? `<div style="color: #666; font-size: 10pt; line-height: 1.5;">${esc(desc)}</div>` : ''}
          </div>`;
        }
      });
      html += `</div><div style="page-break-after: always;"></div>`;
    }
  }

  // ESDU at Work
  const work = document.querySelector('#work');
  if (work) {
    const title = get(work, 'h2');
    const subtitle = get(work, '.section-head p');
    const slides = work.querySelectorAll('.slide');
    
    if (title) {
      html += `<h2 style="color: #840132; font-size: 20pt; margin: 30px 20px 10px; border-bottom: 2px solid #840132; padding-bottom: 8px;">${esc(title)}</h2>`;
      if (subtitle) html += `<p style="margin: 0 20px 20px; color: #666; font-style: italic;">${esc(subtitle)}</p>`;
      
      slides.forEach(slide => {
        const h3 = get(slide, 'h3');
        const p = get(slide, 'p');
        if (h3 && p) {
          html += `<div style="margin: 15px 20px; padding: 15px; background: #f5f5f5; border-left: 4px solid #006666;">
            <h3 style="color: #006666; font-size: 14pt; margin: 0 0 8px;">${esc(h3)}</h3>
            <p style="margin: 0; line-height: 1.6;">${esc(p)}</p>
          </div>`;
        }
      });
      html += `<div style="page-break-after: always;"></div>`;
    }
  }

  // Strategic Goals
  const goals = document.querySelector('#goals');
  if (goals) {
    const title = get(goals, 'h2');
    const subtitle = get(goals, '.section-head p');
    const goalCards = goals.querySelectorAll('.goal-card');
    
    if (title) {
      html += `<h2 style="color: #840132; font-size: 20pt; margin: 30px 20px 10px; border-bottom: 2px solid #840132; padding-bottom: 8px;">${esc(title)}</h2>`;
      if (subtitle) html += `<p style="margin: 0 20px 20px; color: #666; font-style: italic;">${esc(subtitle)}</p>`;
      
      goalCards.forEach(card => {
        const h3 = get(card, 'h3');
        const p = get(card, 'p');
        if (h3 && p) {
          html += `<div style="margin: 15px 20px; padding: 15px; background: #f0f8f0; border-left: 4px solid #2d5a27;">
            <h3 style="color: #2d5a27; font-size: 14pt; margin: 0 0 8px;">${esc(h3)}</h3>
            <p style="margin: 0; line-height: 1.6;">${esc(p)}</p>
          </div>`;
        }
      });
      html += `<div style="page-break-after: always;"></div>`;
    }
  }

  // Keepers of the Land
  const keepers = document.querySelector('#keepers');
  if (keepers) {
    const title = get(keepers, 'h2');
    const paras = getAll(keepers, '.keepers-content p');
    
    if (title && paras.length) {
      html += `<h2 style="color: #840132; font-size: 20pt; margin: 30px 20px 20px; border-bottom: 2px solid #840132; padding-bottom: 8px;">${esc(title)}</h2>`;
      paras.forEach(p => {
        html += `<p style="margin: 0 20px 12px; text-align: justify; line-height: 1.7;">${esc(p)}</p>`;
      });
      
      const pillItems = getAll(keepers, '.pill-list li');
      if (pillItems.length) {
        html += `<div style="margin: 15px 20px; padding: 15px; background: #fffef0; border-left: 4px solid #D4AF37;">
          <strong style="color: #D4AF37;">Focus Areas:</strong>
          <ul style="margin: 5px 0 0; padding-left: 20px;">`;
        pillItems.forEach(item => {
          html += `<li style="margin: 3px 0;">${esc(item)}</li>`;
        });
        html += `</ul></div>`;
      }
      
      const chipItems = getAll(keepers, '.chip-list span');
      if (chipItems.length) {
        html += `<div style="margin: 15px 20px;">
          <strong>Funded Projects:</strong> ${chipItems.map(c => esc(c)).join(', ')}
        </div>`;
      }
      html += `<div style="page-break-after: always;"></div>`;
    }
  }

  // Impact
  const impact = document.querySelector('#impact');
  if (impact) {
    const title = get(impact, 'h2');
    const subtitle = get(impact, '.section-head p');
    
    if (title) {
      html += `<h2 style="color: #840132; font-size: 20pt; margin: 30px 20px 10px; border-bottom: 2px solid #840132; padding-bottom: 8px;">${esc(title)}</h2>`;
      if (subtitle) html += `<p style="margin: 0 20px 20px; color: #666; font-style: italic;">${esc(subtitle)}</p>`;
      
      const kpis = impact.querySelectorAll('.kpi');
      if (kpis.length) {
        html += `<table style="width: calc(100% - 40px); margin: 20px 20px; border-collapse: collapse;">`;
        kpis.forEach((kpi, i) => {
          const valueEl = kpi.querySelector('.kpi-value');
          const num = valueEl ? (valueEl.getAttribute('data-count') || valueEl.textContent.trim()) : '';
          const label = get(kpi, '.kpi-label');
          
          if (num && label) {
            if (i % 2 === 0) html += `<tr>`;
            html += `<td style="width: 50%; padding: 15px; text-align: center; background: #fff5f8; border: 2px solid #840132;">
              <div style="font-size: 28pt; font-weight: 700; color: #840132;">${esc(num)}</div>
              <div style="font-size: 9pt; color: #555; margin-top: 5px;">${esc(label)}</div>
            </td>`;
            if (i % 2 === 1 || i === kpis.length - 1) html += `</tr>`;
          }
        });
        html += `</table>`;
      }
      
      html += `<div style="margin: 25px 20px; padding: 15px; background: #f5f5f5; border-left: 4px solid #D4AF37;">
        <strong style="color: #840132;">Geographical Outreach:</strong>
        <p style="margin: 5px 0 0;">ESDU's work spans local, regional, and global scales - from Lebanese communities to international partnerships across multiple continents.</p>
      </div>`;
      html += `<div style="page-break-after: always;"></div>`;
    }
  }

  // Partners & Donors
  const partners = document.querySelector('#partners');
  if (partners) {
    const title = get(partners, 'h2');
    const cards = partners.querySelectorAll('.donor-card');
    
    if (title && cards.length) {
      html += `<h2 style="color: #840132; font-size: 20pt; margin: 30px 20px 10px; border-bottom: 2px solid #840132; padding-bottom: 8px;">${esc(title)}</h2>`;
      html += `<ul style="margin: 20px; padding-left: 20px; columns: 2; column-gap: 20px;">`;
      
      cards.forEach(card => {
        const link = card.querySelector('a');
        if (link) {
          const text = link.textContent.trim();
          const url = link.getAttribute('href');
          if (text && url) {
            html += `<li style="margin: 5px 0; break-inside: avoid;"><a href="${url}" style="color: #006666; text-decoration: none;">${esc(text)}</a></li>`;
          }
        }
      });
      html += `</ul>`;
    }
  }

  // Projects
  const projects = document.querySelector('#projects');
  if (projects) {
    const title = get(projects, 'h2');
    const cards = projects.querySelectorAll('.donor-card');
    
    if (title && cards.length) {
      html += `<h2 style="color: #840132; font-size: 20pt; margin: 30px 20px 10px; border-bottom: 2px solid #840132; padding-bottom: 8px;">${esc(title)}</h2>`;
      html += `<ul style="margin: 20px; padding-left: 20px; columns: 2; column-gap: 20px;">`;
      
      cards.forEach(card => {
        const link = card.querySelector('a');
        if (link) {
          const text = link.textContent.trim();
          const url = link.getAttribute('href');
          if (text && url) {
            html += `<li style="margin: 5px 0; break-inside: avoid;"><a href="${url}" style="color: #840132; text-decoration: none;">${esc(text)}</a></li>`;
          }
        }
      });
      html += `</ul>`;
      html += `<p style="margin: 15px 20px 0; color: #666; font-size: 9pt; font-style: italic;">Note: Project names are clickable links in PDF viewers that support hyperlinks.</p>`;
    }
  }

  // Footer
  html += `
    <div style="margin-top: 50px; padding: 15px 20px; border-top: 2px solid #ccc; text-align: center;">
      <p style="margin: 5px 0; font-weight: 700; color: #840132;">Environment and Sustainable Development Unit (ESDU)</p>
      <p style="margin: 5px 0; color: #666;">American University of Beirut</p>
      <p style="margin: 5px 0; color: #999; font-size: 9pt;">© ${new Date().getFullYear()} ESDU. All rights reserved.</p>
    </div>
  `;

  container.innerHTML = html;
  document.body.appendChild(container);
  return container;
}
