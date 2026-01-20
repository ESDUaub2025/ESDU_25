// ESDU Portfolio PDF Generator
ready(() => {
  const pdfBtn = document.getElementById('download-pdf-btn');
  
  if (!pdfBtn) return;
  if (typeof html2pdf === 'undefined') return;
  
  pdfBtn.addEventListener('click', function(e) {
    e.preventDefault();
    
    const originalHTML = pdfBtn.innerHTML;
    pdfBtn.innerHTML = '<span>⏳ Generating...</span>';
    pdfBtn.disabled = true;
    
    try {
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0];
      const filename = `ESDU_Portfolio_${dateStr}.pdf`;
      
      // Helper to safely extract text
      const getText = (element, selector) => {
        const el = element?.querySelector(selector);
        return el ? el.textContent.trim() : '';
      };
      
      const getTexts = (element, selector) => {
        return Array.from(element?.querySelectorAll(selector) || [])
          .map(el => el.textContent.trim())
          .filter(t => t);
      };
      
      // A4 = 210mm x 297mm, with 15mm margins = 180mm usable width
      const container = document.createElement('div');
      container.style.cssText = `
        max-width: 180mm;
        margin: 0 auto;
        padding: 20px;
        background: white;
        font-family: Arial, sans-serif;
        font-size: 11pt;
        line-height: 1.6;
        color: #333;
      `.replace(/\s+/g, ' ').trim();
      
      let html = '';
      
      // COVER PAGE
      html += `
        <div style="text-align: center; padding: 100px 0 120px;">
          <h1 style="color: #840132; font-size: 36pt; margin: 0 0 20px; font-weight: 700;">ESDU Portfolio</h1>
          <div style="width: 80px; height: 3px; background: #840132; margin: 0 auto 20px;"></div>
          <h2 style="color: #666; font-size: 20pt; margin: 0 0 100px; font-weight: 400;">25 Years of Sustainable Development</h2>
          <p style="color: #888; font-size: 12pt; margin: 5px 0;">Environment and Sustainable Development Unit</p>
          <p style="color: #888; font-size: 12pt; margin: 5px 0;">American University of Beirut</p>
          <p style="color: #999; font-size: 10pt; margin-top: 30px;">${today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div style="page-break-after: always;"></div>
      `;
      
      // MISSION SECTION
      const mission = document.querySelector('#mission');
      if (mission) {
        const title = getText(mission, 'h2');
        if (title) {
          html += `<h2 style="color: #840132; font-size: 20pt; margin: 30px 0 25px; padding-bottom: 8px; border-bottom: 2px solid #840132;">${title}</h2>`;
          
          const cards = mission.querySelectorAll('.card');
          cards.forEach(card => {
            const h3 = getText(card, 'h3');
            const p = getText(card, 'p');
            
            if (h3 === 'Core Values') {
              const values = getTexts(card, 'li');
              if (values.length) {
                html += `
                  <div style="margin: 20px 0; padding: 15px; background: #fff5f8; border-left: 4px solid #840132;">
                    <h3 style="color: #840132; font-size: 14pt; margin: 0 0 10px; font-weight: 600;">${h3}</h3>
                    <ul style="margin: 0; padding-left: 20px;">
                      ${values.map(v => `<li style="margin: 5px 0;">${v}</li>`).join('')}
                    </ul>
                  </div>
                `;
              }
            } else if (h3 && p) {
              html += `
                <div style="margin: 20px 0; padding: 15px; background: #fff5f8; border-left: 4px solid #840132;">
                  <h3 style="color: #840132; font-size: 14pt; margin: 0 0 10px; font-weight: 600;">${h3}</h3>
                  <p style="margin: 0; text-align: justify;">${p}</p>
                </div>
              `;
            }
          });
          
          html += `<div style="page-break-after: always;"></div>`;
        }
      }
      
      // WORK SECTION
      const work = document.querySelector('#work');
      if (work) {
        const title = getText(work, 'h2');
        const subtitle = getText(work, '.section-head p');
        
        if (title) {
          html += `<h2 style="color: #840132; font-size: 20pt; margin: 30px 0 10px; padding-bottom: 8px; border-bottom: 2px solid #840132;">${title}</h2>`;
          if (subtitle) {
            html += `<p style="color: #666; font-style: italic; margin: 0 0 20px;">${subtitle}</p>`;
          }
          
          const slides = work.querySelectorAll('.slide');
          slides.forEach(slide => {
            const h3 = getText(slide, 'h3');
            const p = getText(slide, 'p');
            if (h3 && p) {
              html += `
                <div style="margin: 15px 0; padding: 12px; background: #fffef9; border-left: 4px solid #D4AF37;">
                  <h4 style="color: #840132; font-size: 12pt; margin: 0 0 6px; font-weight: 600;">${h3}</h4>
                  <p style="margin: 0; font-size: 10pt; text-align: justify;">${p}</p>
                </div>
              `;
            }
          });
          
          html += `<div style="page-break-after: always;"></div>`;
        }
      }
      
      // GOALS SECTION
      const goals = document.querySelector('#goals');
      if (goals) {
        const title = getText(goals, 'h2');
        const subtitle = getText(goals, '.section-head p');
        
        if (title) {
          html += `<h2 style="color: #840132; font-size: 20pt; margin: 30px 0 10px; padding-bottom: 8px; border-bottom: 2px solid #840132;">${title}</h2>`;
          if (subtitle) {
            html += `<p style="color: #666; font-style: italic; margin: 0 0 20px;">${subtitle}</p>`;
          }
          
          const goalCards = goals.querySelectorAll('.goal-card');
          goalCards.forEach(card => {
            const h3 = getText(card, 'h3');
            const p = getText(card, 'p');
            if (h3 && p) {
              html += `
                <div style="margin: 15px 0; padding: 14px; background: #fffef9; border-left: 4px solid #840132;">
                  <h4 style="color: #840132; font-size: 12pt; margin: 0 0 8px; font-weight: 600;">${h3}</h4>
                  <p style="margin: 0; text-align: justify;">${p}</p>
                </div>
              `;
            }
          });
          
          html += `<div style="page-break-after: always;"></div>`;
        }
      }
      
      // KEEPERS SECTION
      const keepers = document.querySelector('#keepers');
      if (keepers) {
        const title = getText(keepers, 'h2');
        const paragraphs = getTexts(keepers, '.kotl-card p');
        const topics = getTexts(keepers, '.chip-list li span');
        
        if (title && paragraphs.length) {
          html += `<h2 style="color: #840132; font-size: 20pt; margin: 30px 0 20px; padding-bottom: 8px; border-bottom: 2px solid #840132;">${title}</h2>`;
          
          paragraphs.forEach(p => {
            html += `<p style="margin: 0 0 12px; text-align: justify;">${p}</p>`;
          });
          
          if (topics.length) {
            html += `
              <div style="margin: 20px 0; padding: 15px; background: #f0f8f0; border-left: 4px solid #2d5f2d;">
                <h3 style="color: #2d5f2d; font-size: 13pt; margin: 0 0 10px; font-weight: 600;">Key Topics</h3>
                <p style="margin: 0;">${topics.join(' • ')}</p>
              </div>
            `;
          }
          
          html += `<div style="page-break-after: always;"></div>`;
        }
      }
      
      // IMPACT SECTION
      const impact = document.querySelector('#impact');
      if (impact) {
        const title = getText(impact, 'h2');
        const subtitle = getText(impact, '.section-head p');
        
        if (title) {
          html += `<h2 style="color: #840132; font-size: 20pt; margin: 30px 0 10px; padding-bottom: 8px; border-bottom: 2px solid #840132;">${title}</h2>`;
          if (subtitle) {
            html += `<p style="color: #666; font-style: italic; margin: 0 0 20px;">${subtitle}</p>`;
          }
          
          const kpis = impact.querySelectorAll('.kpi');
          if (kpis.length) {
            html += `<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">`;
            kpis.forEach((kpi, i) => {
              // Get the data-count attribute value instead of text content
              const valueEl = kpi.querySelector('.kpi-value');
              const num = valueEl ? valueEl.getAttribute('data-count') || valueEl.textContent.trim() : '';
              const label = getText(kpi, '.kpi-label');
              
              if (num && label) {
                if (i % 2 === 0) html += `<tr>`;
                html += `
                  <td style="width: 50%; padding: 15px; text-align: center; background: #fff5f8; border: 2px solid #840132;">
                    <div style="font-size: 28pt; font-weight: 700; color: #840132;">${num}</div>
                    <div style="font-size: 9pt; color: #555; margin-top: 5px;">${label}</div>
                  </td>
                `;
                if (i % 2 === 1 || i === kpis.length - 1) html += `</tr>`;
              }
            });
            html += `</table>`;
          }
          
          // Geographical Outreach section
          const outreachHead = getText(impact, '.outreach-head h3');
          if (outreachHead) {
            html += `
              <div style="margin: 25px 0; padding: 15px; background: #f5f5f5; border-left: 4px solid #D4AF37;">
                <h3 style="color: #840132; font-size: 14pt; margin: 0; font-weight: 600;">${outreachHead}</h3>
                <p style="margin: 8px 0 0; color: #666;">ESDU's work spans local, regional, and global scales - from Lebanese communities to international partnerships across multiple continents.</p>
              </div>
            `;
          }
          
          html += `<div style="page-break-after: always;"></div>`;
        }
      }
      
      // PARTNERS SECTION
      const partners = document.querySelector('#partners');
      if (partners) {
        const title = getText(partners, 'h2');
        const subtitle = getText(partners, '.section-head p');
        const donors = getTexts(partners, '.donor-card span');
        
        if (title && donors.length) {
          html += `<h2 style="color: #840132; font-size: 20pt; margin: 30px 0 10px; padding-bottom: 8px; border-bottom: 2px solid #840132;">${title}</h2>`;
          if (subtitle) {
            html += `<p style="color: #666; font-style: italic; margin: 0 0 20px;">${subtitle}</p>`;
          }
          
          html += `<ul style="list-style: none; padding: 0; margin: 0;">`;
          donors.forEach(donor => {
            html += `
              <li style="padding: 10px; margin: 8px 0; background: #fff5f8; border-left: 4px solid #840132;">
                ${donor}
              </li>
            `;
          });
          html += `</ul>`;
        }
      }
      
      // FOOTER
      html += `
        <div style="margin-top: 50px; padding-top: 15px; border-top: 2px solid #ccc; text-align: center;">
          <p style="margin: 5px 0; font-weight: 700; color: #840132;">Environment and Sustainable Development Unit (ESDU)</p>
          <p style="margin: 5px 0; color: #666;">American University of Beirut</p>
          <p style="margin: 5px 0; color: #999; font-size: 9pt;">© ${new Date().getFullYear()} ESDU. All rights reserved.</p>
        </div>
      `;
      
      container.innerHTML = html;
      document.body.appendChild(container);
      
      // Generate PDF
      const opt = {
        margin: 15,
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          logging: false
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait'
        },
        pagebreak: { mode: ['css', 'legacy'] }
      };
      
      html2pdf().set(opt).from(container).save().then(() => {
        document.body.removeChild(container);
        pdfBtn.innerHTML = originalHTML;
        pdfBtn.disabled = false;
      }).catch(err => {
        console.error('PDF error:', err);
        if (container.parentNode) document.body.removeChild(container);
        pdfBtn.innerHTML = originalHTML;
        pdfBtn.disabled = false;
      });
        
    } catch (error) {
      console.error('Exception:', error);
      pdfBtn.innerHTML = originalHTML;
      pdfBtn.disabled = false;
    }
  });
});
