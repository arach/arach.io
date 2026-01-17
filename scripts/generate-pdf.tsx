import { renderToFile } from '@react-pdf/renderer';
import React from 'react';

// Import the PDF component
// We need to use dynamic import since this runs in Node
async function generatePDFs() {
  const { default: ResumePDF } = await import('../src/components/ResumePDF');

  console.log('Generating PDF resumes...');

  // Generate recruiter mode (default)
  await renderToFile(
    React.createElement(ResumePDF, { mode: 'recruiter' }),
    'public/Arach_Tchoupani_Resume.pdf'
  );
  console.log('✓ Generated public/Arach_Tchoupani_Resume.pdf (recruiter mode)');

  // Generate dev mode
  await renderToFile(
    React.createElement(ResumePDF, { mode: 'dev' }),
    'public/Arach_Tchoupani_Resume_Dev.pdf'
  );
  console.log('✓ Generated public/Arach_Tchoupani_Resume_Dev.pdf (dev mode)');

  console.log('Done!');
}

generatePDFs().catch(console.error);
