// ESDU Portfolio PDF Generator - Robust Cross-Browser Implementation
ready(() => {
  const pdfBtn = document.getElementById('download-pdf-btn');
  
  if (!pdfBtn) return;
  
  pdfBtn.addEventListener('click', async function(e) {
    e.preventDefault();
    
    // Comprehensive browser and library check
    if (typeof html2pdf === 'undefined') {
      alert('PDF library not loaded. Please refresh the page and try again.');
      return;
    }
    
    const originalHTML = pdfBtn.innerHTML;
    const originalDisabled = pdfBtn.disabled;
    
    pdfBtn.innerHTML = '<span>⏳ Generating PDF...</span>';
    pdfBtn.disabled = true;
    
    // Add delay to ensure UI updates
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0];
      const filename = `ESDU_Portfolio_${dateStr}.pdf`;
      
      console.log('Starting PDF generation...');
      
      // CRITICAL: Scroll through entire page to trigger all lazy-loaded content
      // and IntersectionObserver callbacks
      console.log('Revealing all content by scrolling...');
      const originalScrollPos = window.pageYOffset;
      
      // Scroll to bottom to trigger all IntersectionObservers
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Scroll back to top
      window.scrollTo(0, 0);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Scroll to middle
      window.scrollTo(0, document.body.scrollHeight / 2);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Restore original position
      window.scrollTo(0, originalScrollPos);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      console.log('All content should now be visible');
      
      // Helper functions for safe content extraction
      const safeGetText = (element, selector) => {
        if (!element) return '';
        try {
          const el = element.querySelector(selector);
          return el ? el.textContent.trim().replace(/\s+/g, ' ') : '';
        } catch (e) {
          console.warn('Error extracting text:', selector, e);
          return '';
        }
      };
      
      const safeGetTexts = (element, selector) => {
        if (!element) return [];
        try {
          return Array.from(element.querySelectorAll(selector) || [])
            .map(el => el.textContent.trim().replace(/\s+/g, ' '))
            .filter(t => t && t.length > 0);
        } catch (e) {
          console.warn('Error extracting texts:', selector, e);
          return [];
        }
      };
      
      const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
      };
      
      console.log('Starting content extraction...');
      
      // Create PDF content container
      const container = document.createElement('div');
      container.id = 'pdf-temp-container';
      container.style.cssText = `
        position: absolute;
        left: -9999px;
        top: 0;
        width: 210mm;
        background: white;
        font-family: 'Arial', 'Helvetica', sans-serif;
        font-size: 11pt;
        line-height: 1.6;
        color: #333;
        padding: 0;
        margin: 0;
      `;
      
      // Build HTML content with inline styles
      let htmlContent = '';
      
      // COVER PAGE
      console.log('Building cover page...');
      htmlContent += `
        <div style="text-align: center; padding: 100px 20px 120px; page-break-after: always;">
          <h1 style="color: #840132; font-size: 36pt; margin: 0 0 20px; font-weight: 700; font-family: Arial, sans-serif;">ESDU Portfolio</h1>
          <div style="width: 80px; height: 3px; background: #840132; margin: 0 auto 20px;"></div>
          <h2 style="color: #666; font-size: 20pt; margin: 0 0 80px; font-weight: 400; font-family: Arial, sans-serif;">25 Years of Sustainable Development</h2>
          <p style="color: #888; font-size: 12pt; margin: 5px 0; font-family: Arial, sans-serif;">Environment and Sustainable Development Unit</p>
          <p style="color: #888; font-size: 12pt; margin: 5px 0; font-family: Arial, sans-serif;">American University of Beirut</p>
          <p style="color: #999; font-size: 10pt; margin-top: 40px; font-family: Arial, sans-serif;">${today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      `;
      
      // FOREWORD SECTION
      console.log('Extracting Foreword...');
      try {
        const foreword = document.querySelector('#foreword');
        if (foreword) {
          const title = safeGetText(foreword, '.foreword-header h2') || 'Foreword';
          const subtitle = safeGetText(foreword, '.foreword-subtitle');
          const paragraphs = safeGetTexts(foreword, '.foreword-body p');
          const authorName = safeGetText(foreword, '.author-name');
          const authorTitle = safeGetText(foreword, '.author-title');
          const authorOrg = safeGetText(foreword, '.author-org');
          
          if (paragraphs.length > 0) {
            htmlContent += `
              <div style="padding: 20px; page-break-after: always;">
                <h2 style="color: #840132; font-size: 22pt; margin: 0 0 10px; padding-bottom: 10px; border-bottom: 3px solid #840132; text-align: center; font-family: Arial, sans-serif; font-weight: 700;">${escapeHtml(title)}</h2>
            `;
            
            if (subtitle) {
              htmlContent += `<p style="text-align: center; color: #666; font-style: italic; margin: 0 0 25px; font-size: 11pt; font-family: Arial, sans-serif;">${escapeHtml(subtitle)}</p>`;
            }
            
            paragraphs.forEach((p, i) => {
              const isLast = i === paragraphs.length - 1;
              if (isLast && p.length > 50) {
                htmlContent += `<p style="margin: 15px 0; text-align: justify; font-style: italic; font-weight: 600; color: #5a0123; border-left: 4px solid #840132; padding-left: 15px; line-height: 1.7; font-family: Arial, sans-serif;">${escapeHtml(p)}</p>`;
              } else {
                htmlContent += `<p style="margin: 0 0 12px; text-align: justify; line-height: 1.7; font-family: Arial, sans-serif;">${escapeHtml(p)}</p>`;
              }
            });
            
            if (authorName) {
              htmlContent += `
                <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e6e6e6; text-align: right;">
                  <p style="margin: 3px 0; font-size: 13pt; font-weight: 700; color: #840132; font-family: Arial, sans-serif;">${escapeHtml(authorName)}</p>
                  ${authorTitle ? `<p style="margin: 3px 0; font-size: 11pt; font-weight: 600; color: #a0334d; font-family: Arial, sans-serif;">${escapeHtml(authorTitle)}</p>` : ''}
                  ${authorOrg ? `<p style="margin: 3px 0; font-size: 10pt; color: #808080; font-style: italic; font-family: Arial, sans-serif;">${escapeHtml(authorOrg)}</p>` : ''}
                </div>
              `;
            }
            
            htmlContent += `</div>`;
            console.log('Foreword added successfully');
          }
        }
      } catch (e) {
        console.error('Error extracting Foreword:', e);
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
