import { PDFViewer } from '@react-pdf/renderer';
import { useMemo } from 'react';
import ResumePDF from './ResumePDF';

type ResumeMode = 'dev' | 'recruiter';

export default function PDFViewerWrapper() {
  const mode = useMemo<ResumeMode>(() => {
    if (typeof window === 'undefined') return 'dev';
    const params = new URLSearchParams(window.location.search);
    const modeParam = params.get('mode');
    return modeParam === 'dev' ? 'dev' : 'recruiter';
  }, []);

  return (
    <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
      <ResumePDF mode={mode} />
    </PDFViewer>
  );
}
