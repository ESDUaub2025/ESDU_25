// ESDU Portfolio PDF Generator - ROBUST VERSION
// Generates a comprehensive PDF with all content and clickable links

ready(() => {
  const pdfBtn = document.getElementById('download-pdf-btn');
  
  if (!pdfBtn) {
    console.warn('PDF download button not found');
    return;
  }
  
  pdfBtn.addEventListener('click', async function(e) {
    e.preventDefault();
    
    // Library check
    if (typeof html2pdf === 'undefined') {
      alert('PDF library not loaded. Please refresh the page and try again.');
      return;
    }
    
    const originalHTML = pdfBtn.innerHTML;
    pdfBtn.innerHTML = '<span>⏳ Generating PDF...</span>';
    pdfBtn.disabled = true;
    
    try {
      // Generate filename with date
      const dateStr = new Date().toISOString().split('T')[0];
      const filename = `ESDU_Portfolio_${dateStr}.pdf`;
      
      console.log('=== STARTING PDF GENERATION ===');
      
      // Helper to safely extract text
      const getText = (parent, selector) => {
        try {
          const el = selector ? parent.querySelector(selector) : parent;
          if (!el) return '';
          return el.textContent.trim().replace(/\s+/g, ' ');
        } catch (e) {
          return '';
        }
      };
      
      // Helper to safely extract multiple elements
      const getTexts = (parent, selector) => {
        try {
          const elements = parent.querySelectorAll(selector);
          return Array.from(elements).map(el => el.textContent.trim()).filter(Boolean);
        } catch (e) {
          return [];
        }
      };
      
      // Escape HTML for safety
      const esc = (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
      };
      
      // Build PDF HTML content
      let html = '';
      
      // ====================
      // COVER PAGE
      // ====================
      console.log('Building cover page...');
      html += `
        <div style="text-align: center; padding: 100px 20px;">
          <h1 style="font-size: 32pt; color: #840132; margin: 0 0 20px; font-weight: 700;">ESDU Portfolio</h1>
          <div style="width: 100px; height: 4px; background: #840132; margin: 0 auto 30px;"></div>
          <p style="font-size: 18pt; color: #666; margin: 0 0 80px;">25 Years of Sustainable Development</p>
          <p style="font-size: 12pt; color: #888; margin: 10px 0;">Environment and Sustainable Development Unit</p>
          <p style="font-size: 12pt; color: #888; margin: 10px 0;">American University of Beirut</p>
          <p style="font-size: 10pt; color: #999; margin-top: 60px;">${new Date().getFullYear()}</p>
        </div>
        <div style="page-break-after: always;"></div>
      `;
      
      // ====================
      // FOREWORD
      // ====================
      console.log('Extracting foreword...');
      const foreword = document.querySelector('#foreword');
      if (foreword) {
        const title = getText(foreword, 'h2');
        const bodyParas = getTexts(foreword, '.foreword-body p');
        const author = getText(foreword, '.author-name');
        const authorTitle = getText(foreword, '.author-title');
        const authorOrg = getText(foreword, '.author-org');
        
        console.log('Foreword found:', {title, paras: bodyParas.length, author});
        
        if (title) {
          html += `<h2 style="color: #840132; font-size: 20pt; margin: 30px 0 20px; padding-bottom: 8px; border-bottom: 2px solid #840132;">${esc(title)}</h2>`;
          
          if (bodyParas.length > 0) {
            bodyParas.forEach(para => {
              html += `<p style="margin: 0 0 12px; text-align: justify; line-height: 1.6;">${esc(para)}</p>`;
            });
          }
          
          if (author) {
            html += `
              <div style="margin: 30px 0 0; text-align: right; padding: 15px; background: #fff5f8; border-left: 4px solid #840132;">
                <p style="margin: 5px 0; font-weight: 700; color: #840132; font-size: 11pt;">${esc(author)}</p>
                ${authorTitle ? `<p style="margin: 5px 0; color: #666; font-size: 10pt;">${esc(authorTitle)}</p>` : ''}
                ${authorOrg ? `<p style="margin: 5px 0; color: #666; font-size: 10pt;">${esc(authorOrg)}</p>` : ''}
              </div>
            `;
          }
          
          html += `<div style="page-break-after: always;"></div>`;
        }
      }
      
      // ====================
      // MISSION, VISION & VALUES
      // ====================
      console.log('Extracting mission...');
      const mission = document.querySelector('#mission');
      if (mission) {
        const title = getText(mission, 'h2');
        
        console.log('Mission found:', {title});
        
        if (title) {
          html += `<h2 style="color: #840132; font-size: 20pt; margin: 30px 0 20px; padding-bottom: 8px; border-bottom: 2px solid #840132;">${esc(title)}</h2>`;
          
          // Get Mission and Vision cards from card-slider
          const cards = mission.querySelectorAll('.card-slider .card');
          console.log('Mission cards found:', cards.length);
          cards.forEach((card, idx) => {
            const cardTitle = getText(card, 'h3');
            const cardText = getText(card, 'p');
            
            console.log(`Card ${idx}:`, {cardTitle, hasText: !!cardText});
            
            if (cardTitle) {
              html += `
                <div style="margin: 20px 0; padding: 15px; background: #fff5f8; border-left: 4px solid #840132;">
                  <h3 style="color: #840132; font-size: 14pt; margin: 0 0 10px; font-weight: 600;">${esc(cardTitle)}</h3>
                  ${cardText ? `<p style="margin: 0; line-height: 1.6;">${esc(cardText)}</p>` : ''}
                </div>
              `;
            }
          });
          
          // Core Values - these are in .pill-list
          const values = getTexts(mission, '.pill-list li');
          console.log('Core values found:', values.length);
          if (values.length > 0) {
            html += `
              <div style="margin: 20px 0; padding: 15px; background: #f0f8f0; border-left: 4px solid #2d5a27;">
                <h3 style="color: #2d5a27; font-size: 13pt; margin: 0 0 10px; font-weight: 600;">Core Values</h3>
                <ul style="margin: 0; padding-left: 20px;">
            `;
            values.forEach(val => {
              html += `<li style="margin: 5px 0;">${esc(val)}</li>`;
            });
            html += `</ul></div>`;
          }
          
          html += `<div style="page-break-after: always;"></div>`;
        }
      }
      
      // ====================
      // ESDU AT WORK
      // ====================
      console.log('Extracting work section...');
      const work = document.querySelector('#work');
      if (work) {
        const title = getText(work, 'h2');
        const subtitle = getText(work, '.section-head p');
        
        console.log('Work found:', {title});
        
        if (title) {
          html += `<h2 style="color: #840132; font-size: 20pt; margin: 30px 0 10px; padding-bottom: 8px; border-bottom: 2px solid #840132;">${esc(title)}</h2>`;
          if (subtitle) {
            html += `<p style="color: #666; font-style: italic; margin: 0 0 20px;">${esc(subtitle)}</p>`;
          }
          
          const slides = work.querySelectorAll('.slide');
          console.log('Work slides found:', slides.length);
          slides.forEach((slide, idx) => {
            const slideTitle = getText(slide, 'h3');
            const slideText = getText(slide, 'p');
            
            console.log(`Slide ${idx}:`, {slideTitle, hasText: !!slideText});
            
            if (slideTitle) {
              html += `
                <div style="margin: 20px 0; padding: 15px; background: #fffef9; border-left: 4px solid #D4AF37;">
                  <h3 style="color: #840132; font-size: 13pt; margin: 0 0 8px; font-weight: 600;">${esc(slideTitle)}</h3>
                  ${slideText ? `<p style="margin: 0;">${esc(slideText)}</p>` : ''}
                </div>
              `;
            }
          });
          
          html += `<div style="page-break-after: always;"></div>`;
        }
      }
      
      // ====================
      // STRATEGIC GOALS
      // ====================
      console.log('Extracting goals...');
      const goals = document.querySelector('#goals');
      if (goals) {
        const title = getText(goals, 'h2');
        const subtitle = getText(goals, '.section-head p');
        
        console.log('Goals found:', {title});
        
        if (title) {
          html += `<h2 style="color: #840132; font-size: 20pt; margin: 30px 0 10px; padding-bottom: 8px; border-bottom: 2px solid #840132;">${esc(title)}</h2>`;
          if (subtitle) {
            html += `<p style="color: #666; font-style: italic; margin: 0 0 20px;">${esc(subtitle)}</p>`;
          }
          
          const goalCards = goals.querySelectorAll('.goal-card');
          goalCards.forEach((card, i) => {
            const goalTitle = getText(card, 'h3');
            const goalText = getText(card, 'p');
            
            if (goalTitle) {
              const bgColors = ['#fff5f8', '#f0f8f0', '#fffef9'];
              const borders = ['#840132', '#2d5a27', '#D4AF37'];
              const bg = bgColors[i % 3];
              const border = borders[i % 3];
              
              html += `
                <div style="margin: 15px 0; padding: 15px; background: ${bg}; border-left: 4px solid ${border};">
                  <h3 style="color: #840132; font-size: 12pt; margin: 0 0 8px; font-weight: 600;">${esc(goalTitle)}</h3>
                  ${goalText ? `<p style="margin: 0; font-size: 10pt;">${esc(goalText)}</p>` : ''}
                </div>
              `;
            }
          });
          
          html += `<div style="page-break-after: always;"></div>`;
        }
      }
      
      // ====================
      // KEEPERS OF THE LAND
      // ====================
      console.log('Extracting keepers...');
      const keepers = document.querySelector('#keepers');
      if (keepers) {
        const title = getText(keepers, 'h2');
        const paras = getTexts(keepers, '.kotl-card p');
        const topics = getTexts(keepers, '.chip-list span');
        const link = keepers.querySelector('.kotl-card a.btn');
        const url = link ? link.getAttribute('href') : null;
        
        console.log('Keepers found:', {title, paras: paras.length, topics: topics.length, hasUrl: !!url});
        
        if (title && paras.length > 0) {
          html += `<h2 style="color: #840132; font-size: 20pt; margin: 30px 0 20px; padding-bottom: 8px; border-bottom: 2px solid #840132;">${esc(title)}</h2>`;
          
          paras.forEach(p => {
            html += `<p style="margin: 0 0 12px; text-align: justify;">${esc(p)}</p>`;
          });
          
          if (url) {
            html += `
              <div style="margin: 20px 0; padding: 15px; background: #f0f8f0; border-left: 4px solid #2d5a27; text-align: center;">
                <a href="${url}" style="display: inline-block; padding: 12px 24px; background: #840132; color: white; text-decoration: none; font-weight: 600; border-radius: 4px;">Explore the Initiative Online →</a>
              </div>
            `;
          }
          
          if (topics.length > 0) {
            html += `
              <div style="margin: 20px 0; padding: 15px; background: #f0f8f0; border-left: 4px solid #2d5a27;">
                <h3 style="color: #2d5a27; font-size: 13pt; margin: 0 0 10px; font-weight: 600;">Key Topics</h3>
                <p style="margin: 0;">${topics.map(t => esc(t)).join(' • ')}</p>
              </div>
            `;
          }
          
          html += `<div style="page-break-after: always;"></div>`;
        }
      }
      
      // ====================
      // IMPACT & OUTREACH
      // ====================
      console.log('Extracting impact...');
      const impact = document.querySelector('#impact');
      if (impact) {
        const title = getText(impact, 'h2');
        const subtitle = getText(impact, '.section-head p');
        
        console.log('Impact found:', {title});
        
        if (title) {
          html += `<h2 style="color: #840132; font-size: 20pt; margin: 30px 0 10px; padding-bottom: 8px; border-bottom: 2px solid #840132;">${esc(title)}</h2>`;
          if (subtitle) {
            html += `<p style="color: #666; font-style: italic; margin: 0 0 20px;">${esc(subtitle)}</p>`;
          }
          
          // KPIs - use data-count attribute for values
          const kpis = impact.querySelectorAll('.kpi');
          console.log('KPIs found:', kpis.length);
          if (kpis.length > 0) {
            html += `<div style="display: table; width: 100%; border-collapse: collapse; margin: 20px 0;">`;
            
            kpis.forEach((kpi, i) => {
              const valueEl = kpi.querySelector('.kpi-value');
              const value = valueEl ? (valueEl.getAttribute('data-count') || valueEl.textContent.trim()) : '';
              const label = getText(kpi, '.kpi-label');
              
              if (value && label) {
                if (i % 2 === 0) html += `<div style="display: table-row;">`;
                
                html += `
                  <div style="display: table-cell; width: 50%; padding: 20px; text-align: center; background: #fff5f8; border: 2px solid #840132;">
                    <div style="font-size: 32pt; font-weight: 700; color: #840132; margin-bottom: 5px;">${esc(value)}</div>
                    <div style="font-size: 10pt; color: #555;">${esc(label)}</div>
                  </div>
                `;
                
                if (i % 2 === 1 || i === kpis.length - 1) html += `</div>`;
              }
            });
            
            html += `</div>`;
          }
          
          // Geographical reach
          const outreachHead = getText(impact, '.outreach-head h3');
          if (outreachHead) {
            html += `
              <div style="margin: 25px 0; padding: 15px; background: #f5f5f5; border-left: 4px solid #D4AF37;">
                <h3 style="color: #840132; font-size: 14pt; margin: 0 0 8px; font-weight: 600;">${esc(outreachHead)}</h3>
                <p style="margin: 0; color: #666;">ESDU's work spans local, regional, and global scales - from Lebanese communities to international partnerships across multiple continents.</p>
              </div>
            `;
          }
          
          html += `<div style="page-break-after: always;"></div>`;
        }
      }
      
      // ====================
      // PARTNERS & DONORS
      // ====================
      console.log('Extracting partners...');
      const partners = document.querySelector('#partners');
      if (partners) {
        const title = getText(partners, 'h2');
        const subtitle = getText(partners, '.section-head p');
        
        const cards = partners.querySelectorAll('.donor-card');
        console.log('Partner cards found:', cards.length);
        const donors = [];
        cards.forEach(card => {
          const link = card.querySelector('a');
          if (link) {
            donors.push({ text: link.textContent.trim(), url: link.getAttribute('href') });
          } else {
            const span = card.querySelector('span');
            if (span) {
              donors.push({ text: span.textContent.trim(), url: null });
            }
          }
        });
        
        if (title && donors.length > 0) {
          html += `<h2 style="color: #840132; font-size: 20pt; margin: 30px 0 10px; padding-bottom: 8px; border-bottom: 2px solid #840132;">${esc(title)}</h2>`;
          if (subtitle) {
            html += `<p style="color: #666; font-style: italic; margin: 0 0 20px;">${esc(subtitle)}</p>`;
          }
          
          html += `<div style="margin: 20px 0;">`;
          donors.forEach(donor => {
            if (donor.url) {
              html += `
                <div style="padding: 10px; margin: 8px 0; background: #fff5f8; border-left: 4px solid #840132;">
                  <a href="${donor.url}" style="color: #840132; text-decoration: none; border-bottom: 1px solid #840132;">${esc(donor.text)}</a>
                </div>
              `;
            } else {
              html += `
                <div style="padding: 10px; margin: 8px 0; background: #fff5f8; border-left: 4px solid #840132;">
                  ${esc(donor.text)}
                </div>
              `;
            }
          });
          html += `</div>`;
        }
      }
      
      // ====================
      // PROJECTS
      // ====================
      console.log('Extracting projects...');
      const projects = document.querySelector('#projects');
      if (projects) {
        const title = getText(projects, 'h2');
        const subtitle = getText(projects, '.section-head p');
        
        const cards = projects.querySelectorAll('.donor-card');
        console.log('Project cards found:', cards.length);
        const projectList = [];
        cards.forEach(card => {
          const link = card.querySelector('a');
          if (link) {
            projectList.push({ text: link.textContent.trim(), url: link.getAttribute('href') });
          }
        });
        
        if (title && projectList.length > 0) {
          html += `
            <div style="page-break-before: always;"></div>
            <h2 style="color: #840132; font-size: 20pt; margin: 30px 0 10px; padding-bottom: 8px; border-bottom: 2px solid #840132;">${esc(title)}</h2>
          `;
          if (subtitle) {
            html += `<p style="color: #666; font-style: italic; margin: 0 0 20px;">${esc(subtitle)}</p>`;
          }
          
          html += `<div style="margin: 20px 0;">`;
          projectList.forEach(proj => {
            html += `
              <div style="padding: 10px; margin: 8px 0; background: #fffef9; border-left: 4px solid #D4AF37;">
                <a href="${proj.url}" style="color: #840132; text-decoration: none; border-bottom: 1px solid #840132;">${esc(proj.text)}</a>
              </div>
            `;
          });
          html += `</div>`;
          html += `<p style="margin: 15px 0 0; color: #666; font-size: 9pt; font-style: italic;">Note: All project names are clickable links in PDF viewers that support hyperlinks.</p>`;
        }
      }
      
      // ====================
      // FOOTER
      // ====================
      html += `
        <div style="margin-top: 50px; padding-top: 15px; border-top: 2px solid #ccc; text-align: center;">
          <p style="margin: 5px 0; font-weight: 700; color: #840132; font-size: 11pt;">Environment and Sustainable Development Unit (ESDU)</p>
          <p style="margin: 5px 0; color: #666;">American University of Beirut</p>
          <p style="margin: 5px 0; color: #999; font-size: 9pt;">© ${new Date().getFullYear()} ESDU. All rights reserved.</p>
        </div>
      `;
      
      console.log('=== Content extraction complete ===');
      console.log('HTML length:', html.length);
      
      // Create temp container
      const container = document.createElement('div');
      container.style.cssText = `
        position: absolute;
        left: -9999px;
        top: 0;
        width: 210mm;
        background: white;
        padding: 20px;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 10pt;
        line-height: 1.6;
        color: #333;
      `;
      container.innerHTML = html;
      document.body.appendChild(container);
      
      console.log('Container added to DOM, generating PDF...');
      
      // PDF generation options
      const options = {
        margin: 15,
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          logging: false,
          letterRendering: true,
          allowTaint: false,
          removeContainer: true
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true
        },
        pagebreak: { 
          mode: ['css', 'legacy'],
          avoid: ['tr', 'td']
        },
        enableLinks: true
      };
      
      // Generate PDF
      await html2pdf().set(options).from(container).save();
      
      console.log('=== PDF GENERATION COMPLETE ===');
      
      // Cleanup
      if (container && container.parentNode) {
        document.body.removeChild(container);
      }
      
      // Reset button after delay
      setTimeout(() => {
        pdfBtn.innerHTML = originalHTML;
        pdfBtn.disabled = false;
      }, 2000);
      
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again or contact support.');
      pdfBtn.innerHTML = originalHTML;
      pdfBtn.disabled = false;
    }
  });
});
