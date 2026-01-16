import { PDFViewer } from '@react-pdf/renderer';
import ResumePDF from './ResumePDF';

export default function PDFViewerWrapper() {
  return (
    <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
      <ResumePDF />
    </PDFViewer>
  );
}
