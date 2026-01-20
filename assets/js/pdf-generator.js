// ========================================
// PDF Download Functionality - Robust Implementation
// ========================================

ready(() => {
  const pdfBtn = document.getElementById('download-pdf-btn');
  
  if (!pdfBtn) {
    console.error('PDF button not found');
    return;
  }
  
  if (typeof html2pdf === 'undefined') {
    console.error('html2pdf library not loaded');
    pdfBtn.style.display = 'none';
    return;
  }
  
  console.log('✅ PDF functionality initialized');
  
  pdfBtn.addEventListener('click', async function(e) {
    e.preventDefault();
    console.log('🚀 PDF generation started');
    
    // Show loading state
    const originalHTML = pdfBtn.innerHTML;
    pdfBtn.innerHTML = '<span>⏳ Generating PDF...</span>';
    pdfBtn.disabled = true;
    
    try {
      // Get current date for filename
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0];
      const filename = `ESDU portfolio ${dateStr}.pdf`;
      console.log('📄 Filename:', filename);
      
      // Create PDF content container
      const pdfContent = await createPDFContent();
      console.log('✅ PDF content created');
      console.log('📏 Container size:', pdfContent.offsetWidth, 'x', pdfContent.offsetHeight);
      console.log('📝 Content length:', pdfContent.innerHTML.length, 'characters');
      
      if (!pdfContent || pdfContent.innerHTML.length < 100) {
        throw new Error('PDF content is empty or too small');
      }
      
      // PDF configuration
      const opt = {
        margin: 10,
        filename: filename,
        image: { 
          type: 'jpeg', 
          quality: 0.98 
        },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          logging: true,
          letterRendering: true,
          backgroundColor: '#ffffff',
          windowWidth: 800
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait' 
        },
        pagebreak: { 
          mode: ['avoid-all', 'css', 'legacy'],
          before: '.pdf-section-break'
        }
      };
      
      console.log('⚙️  Starting PDF generation...');
      
      // Generate PDF
      await html2pdf()
        .set(opt)
        .from(pdfContent)
        .save();
      
      console.log('✅ PDF generated and downloaded successfully!');
      
      // Cleanup
      if (pdfContent && pdfContent.parentNode) {
        document.body.removeChild(pdfContent);
        console.log('🧹 Cleanup complete');
      }
      
      pdfBtn.innerHTML = originalHTML;
      pdfBtn.disabled = false;
      
    } catch (error) {
      console.error('❌ PDF generation error:', error);
      console.error('Stack trace:', error.stack);
      
      pdfBtn.innerHTML = '<span>❌ Error - Check Console (F12)</span>';
      pdfBtn.disabled = false;
      
      setTimeout(() => {
        pdfBtn.innerHTML = originalHTML;
      }, 5000);
    }
  });
  
  // Function to create PDF-optimized content
  async function createPDFContent() {
    console.log('📦 Creating PDF content structure...');
    
    const container = document.createElement('div');
    container.id = 'pdf-generator-content';
    container.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 800px;
      background: white;
      padding: 40px;
      font-family: 'Montserrat', Arial, sans-serif;
      color: #000;
      box-sizing: border-box;
      z-index: 999999;
      overflow: visible;
    `;
    
    // Build content string
    let content = '';
    let sectionCount = 0;
    
    // 1. Cover Page
    console.log('  ├─ Adding cover page...');
    content += `
      <div class="pdf-section-break" style="text-align: center; padding: 100px 20px; background: white; min-height: 900px;">
        <img src="./assets/images/ESDU 25th Anniversary _ Logo _ Final-02.png" 
             style="max-width: 300px; width: 100%; height: auto; margin-bottom: 50px; display: block; margin-left: auto; margin-right: auto;" 
             alt="ESDU Logo"/>
        <h1 style="color: #840132; font-size: 48px; font-weight: 700; margin: 30px 0; line-height: 1.2;">
          Exploring Solutions,<br/>Defying Uncertainties
        </h1>
        <h2 style="color: #4d4d4d; font-size: 32px; font-weight: 400; margin: 25px 0; line-height: 1.3;">
          25 Years of Sustainable<br/>Community Development
        </h2>
        <p style="color: #4d4d4d; font-size: 17px; line-height: 1.9; max-width: 600px; margin: 40px auto; text-align: center;">
          The Environmental Sustainability Development Unit (ESDU) at the American University of Beirut (AUB) 
          champions community-led development, resilient food systems, and inclusive growth—bridging academia and the field.
        </p>
        <p style="color: #808080; font-size: 15px; margin-top: 80px;">
          Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
      <div style="page-break-after: always; height: 1px;"></div>
    `;
    sectionCount++;
    
    // 2. Mission, Vision, Core Values
    console.log('  ├─ Extracting Mission, Vision, Core Values...');
    const missionSection = document.querySelector('#mission');
    if (missionSection) {
      const title = missionSection.querySelector('.section-head h2')?.textContent || 'Mission, Vision, Core Values';
      const desc = missionSection.querySelector('.section-head p')?.textContent || '';
      
      content += `
        <div class="pdf-section-break" style="padding: 30px 0;">
          <h2 style="color: #840132; font-size: 36px; font-weight: 700; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 4px solid #840132;">
            ${title}
          </h2>
          <p style="color: #4d4d4d; font-size: 16px; line-height: 1.8; margin-bottom: 35px;">${desc}</p>
      `;
      
      // Extract Mission and Vision cards
      const cards = missionSection.querySelectorAll('.card');
      cards.forEach((card, index) => {
        const cardTitle = card.querySelector('h3')?.textContent.trim() || '';
        const cardText = card.querySelector('p')?.textContent.trim() || '';
        
        if (cardTitle === 'Mission' || cardTitle === 'Vision') {
          content += `
            <div style="margin-bottom: 30px; padding: 25px; background: linear-gradient(135deg, #fff5f8 0%, #ffffff 100%); border-left: 6px solid #840132; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h3 style="color: #840132; font-size: 24px; font-weight: 600; margin: 0 0 15px 0;">${cardTitle}</h3>
              <p style="color: #4d4d4d; font-size: 16px; line-height: 1.8; margin: 0;">${cardText}</p>
            </div>
          `;
        } else if (cardTitle === 'Core Values') {
          const values = Array.from(card.querySelectorAll('.pill-list li')).map(li => li.textContent.trim());
          content += `
            <div style="margin-top: 35px; padding: 25px; background: #f9f9f9; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h3 style="color: #840132; font-size: 24px; font-weight: 600; margin: 0 0 20px 0;">Core Values</h3>
              <ul style="list-style: none; padding: 0; margin: 0;">
          `;
          values.forEach(value => {
            content += `
              <li style="color: #4d4d4d; font-size: 15px; line-height: 1.7; margin-bottom: 12px; padding-left: 25px; position: relative;">
                <span style="position: absolute; left: 0; color: #840132; font-weight: 700; font-size: 20px;">•</span>
                ${value}
              </li>
            `;
          });
          content += `</ul></div>`;
        }
      });
      
      content += `</div><div style="page-break-after: always; height: 1px;"></div>`;
      sectionCount++;
    }
    
    // 3. ESDU at Work
    console.log('  ├─ Extracting ESDU at Work...');
    const workSection = document.querySelector('#work');
    if (workSection) {
      const title = workSection.querySelector('.section-head h2')?.textContent || 'ESDU at Work';
      const desc = workSection.querySelector('.section-head p')?.textContent || '';
      
      content += `
        <div class="pdf-section-break" style="padding: 30px 0;">
          <h2 style="color: #840132; font-size: 36px; font-weight: 700; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 4px solid #840132;">
            ${title}
          </h2>
          <p style="color: #4d4d4d; font-size: 16px; line-height: 1.8; margin-bottom: 35px;">${desc}</p>
      `;
      
      const slides = workSection.querySelectorAll('.slide');
      slides.forEach(slide => {
        const slideTitle = slide.querySelector('h3')?.textContent.trim() || '';
        const slideText = slide.querySelector('p')?.textContent.trim() || '';
        
        content += `
          <div style="margin-bottom: 25px; padding: 20px; background: #f9f9f9; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
            <h3 style="color: #840132; font-size: 20px; font-weight: 600; margin: 0 0 12px 0;">${slideTitle}</h3>
            <p style="color: #4d4d4d; font-size: 15px; line-height: 1.8; margin: 0;">${slideText}</p>
          </div>
        `;
      });
      
      content += `</div><div style="page-break-after: always; height: 1px;"></div>`;
      sectionCount++;
    }
    
    // 4. Strategic Goals
    console.log('  ├─ Extracting Strategic Goals...');
    const goalsSection = document.querySelector('#goals');
    if (goalsSection) {
      const title = goalsSection.querySelector('.section-head h2')?.textContent || 'Strategic Goals';
      const desc = goalsSection.querySelector('.section-head p')?.textContent || '';
      
      content += `
        <div class="pdf-section-break" style="padding: 30px 0;">
          <h2 style="color: #840132; font-size: 36px; font-weight: 700; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 4px solid #840132;">
            ${title}
          </h2>
          <p style="color: #4d4d4d; font-size: 16px; line-height: 1.8; margin-bottom: 35px;">${desc}</p>
      `;
      
      const goals = goalsSection.querySelectorAll('.goal-card');
      goals.forEach(goal => {
        const goalTitle = goal.querySelector('h3')?.textContent.trim() || '';
        const goalText = goal.querySelector('p')?.textContent.trim() || '';
        
        content += `
          <div style="margin-bottom: 25px; padding: 20px; background: #f9f9f9; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
            <h3 style="color: #840132; font-size: 20px; font-weight: 600; margin: 0 0 12px 0;">${goalTitle}</h3>
            <p style="color: #4d4d4d; font-size: 15px; line-height: 1.8; margin: 0;">${goalText}</p>
          </div>
        `;
      });
      
      content += `</div><div style="page-break-after: always; height: 1px;"></div>`;
      sectionCount++;
    }
    
    // 5. Keepers of the Land
    console.log('  ├─ Extracting Keepers of the Land...');
    const keepersSection = document.querySelector('#keepers');
    if (keepersSection) {
      const title = keepersSection.querySelector('.section-head h2')?.textContent || 'Keepers of the Land';
      const desc = keepersSection.querySelector('.section-head p')?.textContent || '';
      
      content += `
        <div class="pdf-section-break" style="padding: 30px 0;">
          <h2 style="color: #840132; font-size: 36px; font-weight: 700; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 4px solid #840132;">
            ${title}
          </h2>
          <p style="color: #4d4d4d; font-size: 16px; line-height: 1.8; margin-bottom: 35px;">${desc}</p>
      `;
      
      const topicsCard = keepersSection.querySelector('.card');
      if (topicsCard) {
        const topics = Array.from(topicsCard.querySelectorAll('.pill-list li')).map(li => li.textContent.trim());
        if (topics.length > 0) {
          content += `
            <div style="padding: 20px; background: #f9f9f9; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
              <h3 style="color: #840132; font-size: 20px; font-weight: 600; margin: 0 0 18px 0;">Key Topics</h3>
              <ul style="list-style: none; padding: 0; margin: 0; column-count: 2; column-gap: 30px;">
          `;
          topics.forEach(topic => {
            content += `
              <li style="color: #4d4d4d; font-size: 14px; line-height: 1.7; margin-bottom: 10px; padding-left: 22px; position: relative; break-inside: avoid;">
                <span style="position: absolute; left: 0; color: #840132; font-weight: 700; font-size: 16px;">•</span>
                ${topic}
              </li>
            `;
          });
          content += `</ul></div>`;
        }
      }
      
      content += `</div><div style="page-break-after: always; height: 1px;"></div>`;
      sectionCount++;
    }
    
    // 6. Impact Section
    console.log('  ├─ Extracting Impact section...');
    const impactSection = document.querySelector('#impact');
    if (impactSection) {
      const title = impactSection.querySelector('.section-head h2')?.textContent || 'Impact';
      const desc = impactSection.querySelector('.section-head p')?.textContent || '';
      
      content += `
        <div class="pdf-section-break" style="padding: 30px 0;">
          <h2 style="color: #840132; font-size: 36px; font-weight: 700; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 4px solid #840132;">
            ${title}
          </h2>
          <p style="color: #4d4d4d; font-size: 16px; line-height: 1.8; margin-bottom: 35px;">${desc}</p>
      `;
      
      const kpis = impactSection.querySelectorAll('.kpi');
      if (kpis.length > 0) {
        content += `<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 35px;">`;
        kpis.forEach(kpi => {
          const num = kpi.querySelector('.kpi-num')?.textContent.trim() || '';
          const label = kpi.querySelector('.kpi-label')?.textContent.trim() || '';
          content += `
            <div style="text-align: center; padding: 30px 20px; background: linear-gradient(135deg, #fff5f8 0%, #ffe6ed 100%); border: 3px solid #840132; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <div style="font-size: 52px; font-weight: 700; color: #840132; margin-bottom: 12px; line-height: 1;">${num}</div>
              <div style="font-size: 14px; color: #4d4d4d; line-height: 1.5; font-weight: 500;">${label}</div>
            </div>
          `;
        });
        content += `</div>`;
      }
      
      content += `</div><div style="page-break-after: always; height: 1px;"></div>`;
      sectionCount++;
    }
    
    // 7. Partners Section
    console.log('  ├─ Extracting Partners section...');
    const partnersSection = document.querySelector('#partners');
    if (partnersSection) {
      const title = partnersSection.querySelector('.section-head h2')?.textContent || 'Partners and Donors';
      const desc = partnersSection.querySelector('.section-head p')?.textContent || '';
      
      content += `
        <div class="pdf-section-break" style="padding: 30px 0;">
          <h2 style="color: #840132; font-size: 36px; font-weight: 700; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 4px solid #840132;">
            ${title}
          </h2>
          <p style="color: #4d4d4d; font-size: 16px; line-height: 1.8; margin-bottom: 35px;">${desc}</p>
          <p style="color: #4d4d4d; font-size: 15px; line-height: 1.7; font-style: italic; padding: 20px; background: #f9f9f9; border-radius: 6px;">
            ESDU collaborates with numerous partners and donors to advance sustainable development across the MENA region, 
            including international organizations, research institutions, governments, and NGOs.
          </p>
        </div>
      `;
      sectionCount++;
    }
    
    // Footer
    content += `
      <div style="margin-top: 80px; padding-top: 35px; border-top: 4px solid #840132; text-align: center;">
        <p style="color: #840132; font-size: 18px; font-weight: 700; margin: 12px 0;">
          Environment and Sustainable Development Unit (ESDU)
        </p>
        <p style="color: #4d4d4d; font-size: 16px; margin: 10px 0; font-weight: 500;">
          American University of Beirut (AUB)
        </p>
        <p style="color: #808080; font-size: 13px; margin: 10px 0;">
          © ${new Date().getFullYear()} ESDU. All rights reserved.
        </p>
      </div>
    `;
    
    // Set innerHTML
    container.innerHTML = content;
    
    // Append to body
    document.body.appendChild(container);
    console.log(`  └─ ✅ Added ${sectionCount} sections to PDF content`);
    console.log('📐 Container dimensions:', container.offsetWidth, 'x', container.offsetHeight);
    console.log('📝 Total content length:', container.innerHTML.length, 'characters');
    
    // Wait for rendering
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Wait for any images to load
    const images = container.querySelectorAll('img');
    if (images.length > 0) {
      console.log(`🖼️  Waiting for ${images.length} image(s) to load...`);
      const imagePromises = Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = () => {
            console.log('  ✅ Image loaded:', img.src.substring(img.src.lastIndexOf('/') + 1));
            resolve();
          };
          img.onerror = () => {
            console.warn('  ⚠️  Image failed to load:', img.src.substring(img.src.lastIndexOf('/') + 1));
            resolve();
          };
          setTimeout(resolve, 3000); // Timeout
        });
      });
      await Promise.all(imagePromises);
    }
    
    console.log('✅ PDF content ready for generation');
    return container;
  }
});
