import type { Experience } from "../data/resume";

interface Props {
  experience: Experience;
  index: number;
}

// Parse company name to extract "(via ...)" suffix
function parseCompanyName(company: string): { main: string; via?: string } {
  const match = company.match(/^(.+?)\s*(\(via .+\))$/);
  if (match) {
    return { main: match[1], via: match[2] };
  }
  return { main: company };
}

// Parse ==text== for highlights and [text](url) for links
function parseHighlights(text: string): React.ReactNode {
  // First split by links [text](url), then by highlights ==text==
  const linkRegex = /(\[.+?\]\(.+?\))/g;
  const highlightRegex = /(==.+?==)/g;

  const parts = text.split(linkRegex);

  return parts.map((part, i) => {
    // Check if it's a link
    const linkMatch = part.match(/^\[(.+?)\]\((.+?)\)$/);
    if (linkMatch) {
      return (
        <a key={i} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="bullet-link">
          {linkMatch[1]}
        </a>
      );
    }

    // Split remaining text by highlights
    const subParts = part.split(highlightRegex);
    return subParts.map((subPart, j) => {
      if (subPart.startsWith('==') && subPart.endsWith('==')) {
        return <span key={`${i}-${j}`} className="bullet-highlight">{subPart.slice(2, -2)}</span>;
      }
      return subPart;
    });
  });
}

export default function TacticalResumeCard({ experience, index }: Props) {
  const { main: companyName, via: companyVia } = parseCompanyName(experience.company);

  return (
    <div
      className="experience-card"
      style={{ animationDelay: `${0.1 + index * 0.05}s` }}
      data-featured={experience.featured ? "true" : "false"}
    >
      <div className="card-header">
        <span className="card-company">
          {companyName}
          {companyVia && <span className="card-company-via"> {companyVia}</span>}
        </span>
        {experience.status === 'active' && (
          <span className="card-status">CURRENT</span>
        )}
      </div>

      <div className="card-meta">
        <span>{experience.title}</span>
        <span>{experience.dates}</span>
        <span>{experience.location}</span>
      </div>

      {/* Details row: scope, revenue, budget, funding, exit */}
      {(experience.scope || experience.revenue || experience.funding || experience.exit) && (
        <div className="card-details">
          {experience.scope && <span className="detail-badge">{experience.scope}</span>}
          {experience.revenue && <span className="detail-badge">{experience.revenue}</span>}
          {experience.budget && <span className="detail-badge">Budget: {experience.budget}</span>}
          {experience.funding && <span className="detail-badge">{experience.funding}</span>}
          {experience.exit && <span className="detail-badge">{experience.exit}</span>}
        </div>
      )}

      <ul className="card-bullets">
        {experience.bullets.map((bullet, i) => (
          <li key={i}>{parseHighlights(bullet)}</li>
        ))}
      </ul>

      <div className="card-tech">
        {experience.techStack.map((tech, i) => (
          <span key={i} className="tech-badge">{tech}</span>
        ))}
      </div>
    </div>
  );
}
