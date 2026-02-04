// ESDU Portfolio PDF Generator
ready(() => {
  const pdfBtn = document.getElementById('download-pdf-btn');
  
  if (!pdfBtn) return;
  if (typeof html2pdf === 'undefined') return;
  
  pdfBtn.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Check browser support
    const isSupported = typeof html2pdf !== 'undefined' && 
                       typeof Promise !== 'undefined' &&
                       typeof document.createElement === 'function';
    
    if (!isSupported) {
      alert('Your browser does not support PDF generation. Please try using a modern browser like Chrome, Firefox, Safari, or Edge.');
      return;
    }
    
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
      
      // FOREWORD SECTION
      const foreword = document.querySelector('#foreword');
      if (foreword) {
        const title = getText(foreword, '.foreword-header h2');
        const subtitle = getText(foreword, '.foreword-subtitle');
        const paragraphs = getTexts(foreword, '.foreword-body p');
        const authorName = getText(foreword, '.author-name');
        const authorTitle = getText(foreword, '.author-title');
        const authorOrg = getText(foreword, '.author-org');
        
        if (title && paragraphs.length) {
          html += `
            <h2 style="color: #840132; font-size: 22pt; margin: 30px 0 10px; padding-bottom: 10px; border-bottom: 3px solid #840132; text-align: center;">${title}</h2>
          `;
          if (subtitle) {
            html += `<p style="text-align: center; color: #666; font-style: italic; margin: 0 0 30px; font-size: 12pt;">${subtitle}</p>`;
          }
          
          paragraphs.forEach((p, index) => {
            // Special styling for closing paragraph
            const isClosing = index === paragraphs.length - 1 && p.length > 50;
            if (isClosing) {
              html += `<p style="margin: 20px 0 12px; text-align: justify; font-style: italic; font-weight: 600; color: #5a0123; border-left: 4px solid #840132; padding-left: 15px;">${p}</p>`;
            } else {
              html += `<p style="margin: 0 0 12px; text-align: justify; line-height: 1.7;">${p}</p>`;
            }
          });
          
          // Author attribution
          if (authorName) {
            html += `
              <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e6e6e6; text-align: right;">
                <p style="margin: 5px 0; font-size: 13pt; font-weight: 700; color: #840132;">${authorName}</p>
                ${authorTitle ? `<p style="margin: 5px 0; font-size: 11pt; font-weight: 600; color: #a0334d;">${authorTitle}</p>` : ''}
                ${authorOrg ? `<p style="margin: 5px 0; font-size: 10pt; color: #808080; font-style: italic;">${authorOrg}</p>` : ''}
              </div>
            `;
          }
          
          html += `<div style="page-break-after: always;"></div>`;
        }
      }
      
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
      
      // KEEPERS SECTION (with clickable link)
      const keepers = document.querySelector('#keepers');
      if (keepers) {
        const title = getText(keepers, 'h2');
        const paragraphs = getTexts(keepers, '.kotl-card p');
        const topics = getTexts(keepers, '.chip-list li span');
        const keepersLink = keepers.querySelector('.kotl-card a.btn');
        const keepersUrl = keepersLink ? keepersLink.getAttribute('href') : null;
        
        if (title && paragraphs.length) {
          html += `<h2 style="color: #840132; font-size: 20pt; margin: 30px 0 20px; padding-bottom: 8px; border-bottom: 2px solid #840132;">${title}</h2>`;
          
          paragraphs.forEach(p => {
            html += `<p style="margin: 0 0 12px; text-align: justify;">${p}</p>`;
          });
          
          // Add clickable link to explore the initiative
          if (keepersUrl) {
            html += `
              <div style="margin: 20px 0; padding: 15px; background: #f0f8f0; border-left: 4px solid #2d5f2d; text-align: center;">
                <a href="${keepersUrl}" style="display: inline-block; padding: 10px 20px; background: #840132; color: white; text-decoration: none; font-weight: 600; border-radius: 4px;">Explore the Initiative Online →</a>
              </div>
            `;
          }
          
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
      
      // PARTNERS SECTION (with clickable donor links if available)
      const partners = document.querySelector('#partners');
      if (partners) {
        const title = getText(partners, 'h2');
        const subtitle = getText(partners, '.section-head p');
        
        // Extract donor cards - some may have links
        const donorCards = partners.querySelectorAll('.donor-card');
        const donorData = Array.from(donorCards).map(card => {
          const link = card.querySelector('a');
          if (link) {
            return {
              text: link.textContent.trim(),
              url: link.getAttribute('href')
            };
          } else {
            const span = card.querySelector('span');
            return {
              text: span ? span.textContent.trim() : card.textContent.trim(),
              url: null
            };
          }
        }).filter(d => d.text);
        
        if (title && donorData.length) {
          html += `<h2 style="color: #840132; font-size: 20pt; margin: 30px 0 10px; padding-bottom: 8px; border-bottom: 2px solid #840132;">${title}</h2>`;
          if (subtitle) {
            html += `<p style="color: #666; font-style: italic; margin: 0 0 20px;">${subtitle}</p>`;
          }
          
          html += `<ul style="list-style: none; padding: 0; margin: 0;">`;
          donorData.forEach(donor => {
            if (donor.url) {
              html += `
                <li style="padding: 10px; margin: 8px 0; background: #fff5f8; border-left: 4px solid #840132;">
                  <a href="${donor.url}" style="color: #840132; text-decoration: none; border-bottom: 1px solid #840132;">${donor.text}</a>
                </li>
              `;
            } else {
              html += `
                <li style="padding: 10px; margin: 8px 0; background: #fff5f8; border-left: 4px solid #840132;">
                  ${donor.text}
                </li>
              `;
            }
          });
          html += `</ul>`;
        }
      }
      
      // PROJECTS SECTION (with clickable URLs)
      const projects = document.querySelector('#projects');
      if (projects) {
        const title = getText(projects, 'h2');
        const subtitle = getText(projects, '.section-head p');
        
        // Extract project cards with their links
        const projectCards = projects.querySelectorAll('.donor-card');
        const projectData = Array.from(projectCards).map(card => {
          const link = card.querySelector('a');
          if (!link) return null;
          return {
            text: link.textContent.trim(),
            url: link.getAttribute('href')
          };
        }).filter(Boolean);
        
        if (title && projectData.length) {
          html += `
            <div style="page-break-before: always;"></div>
            <h2 style="color: #840132; font-size: 20pt; margin: 30px 0 10px; padding-bottom: 8px; border-bottom: 2px solid #840132;">${title}</h2>
          `;
          if (subtitle) {
            html += `<p style="color: #666; font-style: italic; margin: 0 0 20px;">${subtitle}</p>`;
          }
          
          html += `<ul style="list-style: none; padding: 0; margin: 0;">`;
          projectData.forEach(project => {
            // Create clickable link in PDF with underline and color
            html += `
              <li style="padding: 10px; margin: 8px 0; background: #fffef9; border-left: 4px solid #D4AF37;">
                <a href="${project.url}" style="color: #840132; text-decoration: none; border-bottom: 1px solid #840132;">${project.text}</a>
              </li>
            `;
          });
          html += `</ul>`;
          html += `<p style="margin: 15px 0 0; color: #666; font-size: 9pt; font-style: italic;">Note: All project names are clickable links in PDF viewers that support hyperlinks.</p>`;
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
      
      // Generate PDF with cross-browser compatible settings
      const opt = {
        margin: 15,
        filename: filename,
        image: { 
          type: 'jpeg', 
          quality: 0.98 
        },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          logging: false,
          letterRendering: true,
          allowTaint: false,
          removeContainer: true,
          imageTimeout: 15000,
          // Cross-browser font rendering
          foreignObjectRendering: false
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true,
          // Enable hyperlinks in PDF
          putOnlyUsedFonts: true,
          floatPrecision: 16
        },
        pagebreak: { 
          mode: ['css', 'legacy'],
          before: '.page-break-before',
          after: '.page-break-after',
          avoid: ['tr', 'td', 'th']
        },
        // Enable link detection for clickable URLs
        enableLinks: true
      };
      
      html2pdf().set(opt).from(container).save().then(() => {
        // Cleanup
        if (container && container.parentNode) {
          document.body.removeChild(container);
        }
        pdfBtn.innerHTML = originalHTML;
        pdfBtn.disabled = false;
        
        // Success feedback (optional)
        const successMsg = document.createElement('div');
        successMsg.textContent = '✓ PDF downloaded successfully';
        successMsg.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #2d5a27; color: white; padding: 15px 20px; border-radius: 4px; z-index: 10000; font-family: Arial, sans-serif; box-shadow: 0 4px 12px rgba(0,0,0,0.15);';
        document.body.appendChild(successMsg);
        setTimeout(() => {
          if (successMsg.parentNode) {
            document.body.removeChild(successMsg);
          }
        }, 3000);
      }).catch(err => {
        console.error('PDF generation error:', err);
        if (container && container.parentNode) {
          document.body.removeChild(container);
        }
        pdfBtn.innerHTML = originalHTML;
        pdfBtn.disabled = false;
        
        // Error feedback
        alert('Failed to generate PDF. Please try again or use a different browser. Error: ' + (err.message || 'Unknown error'));
      });
        
    } catch (error) {
      console.error('PDF exception:', error);
      pdfBtn.innerHTML = originalHTML;
      pdfBtn.disabled = false;
      alert('An error occurred while generating the PDF. Please try again.');
    }
  });
});
