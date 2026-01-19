import { useRef } from "react";
import { DownloadIcon, type DownloadIconHandle } from "./DownloadIcon";

interface Props {
  pdfUrl: string;
}

export default function IntroDownloadCTA({ pdfUrl }: Props) {
  const iconRef = useRef<DownloadIconHandle>(null);

  return (
    <a
      href={pdfUrl}
      className="intro-download-cta"
      download
      onMouseEnter={() => iconRef.current?.startAnimation()}
      onMouseLeave={() => iconRef.current?.stopAnimation()}
    >
      <div className="download-cta-icon">
        <DownloadIcon ref={iconRef} size={24} />
      </div>
      <div className="download-cta-text">
        <span className="download-cta-label">DOWNLOAD RESUME</span>
        <span className="download-cta-filename">Arach_Tchoupani_Resume.pdf</span>
      </div>
    </a>
  );
}
