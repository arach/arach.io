import {
  Document,
  Page,
  View,
  Text,
  Link,
  Image,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import { resumeData } from '../data/resume';

// Register JetBrains Mono (body text)
Font.register({
  family: 'JetBrainsMono',
  fonts: [
    {
      src: 'https://cdn.jsdelivr.net/fontsource/fonts/jetbrains-mono@latest/latin-400-normal.ttf',
      fontWeight: 'normal',
    },
    {
      src: 'https://cdn.jsdelivr.net/fontsource/fonts/jetbrains-mono@latest/latin-700-normal.ttf',
      fontWeight: 'bold',
    },
  ],
});

// Register Geist Mono (headings)
Font.register({
  family: 'GeistMono',
  fonts: [
    {
      src: 'https://cdn.jsdelivr.net/fontsource/fonts/geist-mono@latest/latin-400-normal.ttf',
      fontWeight: 'normal',
    },
    {
      src: 'https://cdn.jsdelivr.net/fontsource/fonts/geist-mono@latest/latin-700-normal.ttf',
      fontWeight: 'bold',
    },
  ],
});

const colors = {
  text: '#111111',
  textMuted: '#666666',
  border: '#cccccc',
  accent: '#0088cc',
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    paddingBottom: 50,
    fontFamily: 'JetBrainsMono',
    fontSize: 8,
    color: colors.text,
    backgroundColor: '#ffffff',
  },
  // Header - tactical framed style
  headerFrame: {
    marginBottom: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
  },
  headerClean: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerContent: {
    alignItems: 'center',
  },
  linksRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    gap: 16,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Corner marks - uniform L-shapes
  cornerTopLeft: {
    position: 'absolute',
    top: -1,
    left: -1,
    width: 14,
    height: 14,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: '#000000',
  },
  cornerTopRight: {
    position: 'absolute',
    top: -1,
    right: -1,
    width: 14,
    height: 14,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: '#000000',
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: -1,
    left: -1,
    width: 14,
    height: 14,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderColor: '#000000',
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 14,
    height: 14,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: '#000000',
  },
  name: {
    fontFamily: 'GeistMono',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 4,
    textAlign: 'center',
  },
  title: {
    fontFamily: 'GeistMono',
    fontSize: 9,
    color: colors.textMuted,
    letterSpacing: 1,
    textAlign: 'center',
  },
  oneLiner: {
    fontSize: 7.5,
    color: colors.text,
    textAlign: 'center',
    marginTop: 6,
  },
  locationLine: {
    fontSize: 7.5,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 2,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  contactIcon: {
    width: 10,
    height: 10,
    marginRight: 4,
  },
  contactLink: {
    fontSize: 7.5,
    color: colors.textMuted,
    textDecoration: 'none',
  },
  tacticalId: {
    fontSize: 6,
    color: colors.border,
    marginTop: 8,
  },
  // Section
  section: {
    marginBottom: 6,
  },
  sectionHeader: {
    fontFamily: 'GeistMono',
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 2,
    color: colors.textMuted,
    marginBottom: 4,
  },
  // Experience - clean cards
  card: {
    marginBottom: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 1,
  },
  company: {
    fontFamily: 'GeistMono',
    fontSize: 10,
    fontWeight: 'bold',
  },
  companyLink: {
    fontFamily: 'GeistMono',
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.text,
    textDecoration: 'none',
  },
  status: {
    fontSize: 6,
    color: colors.accent,
  },
  exitBadge: {
    fontSize: 6,
    color: '#22863a',
    fontWeight: 'bold',
  },
  meta: {
    fontSize: 7.5,
    color: colors.textMuted,
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 3,
  },
  detailBadge: {
    fontSize: 7,
    color: colors.text,
  },
  bulletList: {
    marginBottom: 4,
  },
  bullet: {
    fontSize: 7.5,
    marginBottom: 2,
    lineHeight: 1.5,
    color: colors.text,
  },
  techRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 1,
    marginBottom: 6,
  },
  techBadge: {
    fontSize: 6,
    color: colors.textMuted,
  },
  // Compact cards
  compactCard: {
    marginBottom: 10,
  },
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 1,
  },
  compactTitle: {
    fontFamily: 'GeistMono',
    fontSize: 9,
    fontWeight: 'bold',
  },
  compactBadge: {
    fontSize: 6,
    color: colors.accent,
    marginLeft: 8,
  },
  compactMeta: {
    fontSize: 7,
    color: colors.textMuted,
    marginBottom: 2,
  },
  compactDescription: {
    fontSize: 7,
    color: colors.text,
    lineHeight: 1.5,
  },
  // Earlier Experience section
  earlierSection: {
    marginBottom: 10,
    marginTop: -4,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderLeftWidth: 2,
    borderLeftColor: colors.border,
  },
  earlierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  earlierLink: {
    fontSize: 7,
    color: colors.accent,
    textDecoration: 'none',
  },
  earlierHighlight: {
    fontSize: 7.5,
    fontWeight: 'bold',
    color: colors.text,
    lineHeight: 1.6,
    marginBottom: 4,
  },
  earlierText: {
    fontSize: 7.5,
    color: colors.textMuted,
    lineHeight: 1.6,
  },
  earlierTech: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
  },
  earlierTechLabel: {
    fontSize: 7,
    fontWeight: 'bold',
    color: colors.textMuted,
  },
  earlierTechList: {
    fontSize: 7,
    color: colors.textMuted,
    flex: 1,
  },
  skillsGrid: {
    flexDirection: 'column',
    gap: 2,
  },
  skillInlineItem: {
    fontSize: 7,
    color: colors.text,
    lineHeight: 1.4,
  },
  // Two column layout for Skills + Community
  twoColumnRow: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 12,
    gap: 20,
  },
  columnLeft: {
    flex: 1,
  },
  columnRight: {
    flex: 1,
  },
  // Community
  communityLine: {
    fontSize: 7,
    color: colors.text,
    marginBottom: 2,
    lineHeight: 1.4,
  },
  // Education - bottom
  educationBottom: {
    marginTop: 4,
    marginBottom: 0,
  },
  educationLine: {
    fontSize: 7.5,
    color: colors.text,
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 16,
    left: 40,
    right: 40,
    alignItems: 'center',
    fontSize: 6,
    color: colors.border,
  },
  qrCode: {
    width: 36,
    height: 36,
    marginBottom: 4,
  },
  footerEmail: {
    fontSize: 7,
    color: colors.textMuted,
  },
  footerId: {
    fontSize: 5,
    color: colors.border,
    marginTop: 2,
  },
  // Tactical decorations
  cornerMark: {
    position: 'absolute',
    fontSize: 8,
    color: colors.border,
  },
});

type ResumeMode = 'dev' | 'recruiter';

interface ResumePDFProps {
  mode?: ResumeMode;
}

export default function ResumePDF({ mode = 'dev' }: ResumePDFProps) {
  // ARTCH = Architect + Arach | 7EA = 2026 in hex | 01 = revision
  const docId = `ARTCH // 0x7EA // R01`;
  const isDev = mode === 'dev';

  return (
    <Document>
      {/* Page 1: Header + Experience */}
      <Page size="LETTER" style={styles.page}>
        {/* Header - tactical framed style (dev) or clean (recruiter) */}
        <View style={isDev ? styles.headerFrame : styles.headerClean}>
          {/* Corner marks - only in dev mode */}
          {isDev && (
            <>
              <View style={styles.cornerTopLeft} />
              <View style={styles.cornerTopRight} />
              <View style={styles.cornerBottomLeft} />
              <View style={styles.cornerBottomRight} />
            </>
          )}

          <View style={styles.headerContent}>
            {/* Centered name and title */}
            <Text style={styles.name}>{isDev ? resumeData.name.replace(' ', '_').toUpperCase() : resumeData.name.toUpperCase()}</Text>
            <Text style={styles.title}>{resumeData.title}</Text>
            <Text style={styles.oneLiner}>{resumeData.oneLiner}</Text>
            <Text style={styles.locationLine}>{(resumeData as any).locationLine}</Text>

            {/* Three links in a row: GitHub | arach.io | LinkedIn */}
            <View style={styles.linksRow}>
              <View style={styles.linkItem}>
                <Image
                  style={styles.contactIcon}
                  src="https://cdn.simpleicons.org/github/666666"
                />
                <Link style={styles.contactLink} src={`https://github.com/${resumeData.contact.github}`}>
                  https://github.com/{resumeData.contact.github}
                </Link>
              </View>
              <View style={styles.linkItem}>
                <Image
                  style={styles.contactIcon}
                  src="https://cdn.simpleicons.org/safari/666666"
                />
                <Link style={styles.contactLink} src={`https://${resumeData.contact.website}`}>
                  https://{resumeData.contact.website}
                </Link>
              </View>
              <View style={styles.linkItem}>
                <Image
                  style={styles.contactIcon}
                  src="https://cdn.simpleicons.org/linkedin/666666"
                />
                <Link style={styles.contactLink} src={`https://linkedin.com/in/${resumeData.contact.linkedin}`}>
                  https://linkedin.com/in/{resumeData.contact.linkedin}
                </Link>
              </View>
            </View>
          </View>
        </View>

        {/* Experience - Full details for first 3, condensed for rest */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>EXPERIENCE</Text>
          {resumeData.experience.slice(0, 3).map((exp, index) => (
            <View key={index} style={styles.card} wrap={false}>
              <View style={styles.cardHeader}>
                {exp.companyUrl ? (
                  <Link style={styles.companyLink} src={exp.companyUrl}>{exp.company}</Link>
                ) : (
                  <Text style={styles.company}>{exp.company}</Text>
                )}
                {exp.exit && <Text style={styles.exitBadge}>EXIT</Text>}
              </View>
              <Text style={styles.meta}>
                {exp.title} · {exp.dates} · {exp.location}
              </Text>
              {(exp.scope || exp.revenue || exp.funding || exp.exit) && (
                <View style={styles.detailsRow}>
                  {exp.scope && <Text style={styles.detailBadge}>{exp.scope}</Text>}
                  {exp.revenue && <Text style={styles.detailBadge}>– {exp.revenue}</Text>}
                  {exp.funding && <Text style={styles.detailBadge}>– {exp.funding}</Text>}
                  {exp.exit && <Text style={styles.detailBadge}>– {exp.exit}</Text>}
                </View>
              )}
              <View style={styles.bulletList}>
                {exp.bullets.slice(0, 3).map((bullet, i) => (
                  <Text key={i} style={styles.bullet}>– {bullet}</Text>
                ))}
              </View>
              <View style={styles.techRow}>
                {exp.techStack.map((tech, i) => (
                  <Text key={i} style={styles.techBadge}>{tech}{i < exp.techStack.length - 1 ? ' ·' : ''}</Text>
                ))}
              </View>
            </View>
          ))}

        </View>

        {/* Earlier Experience - peer section */}
        <View style={styles.earlierSection}>
          <Text style={styles.sectionHeader}>EARLIER EXPERIENCE</Text>
          <Text style={styles.earlierHighlight}>
            CTO at Primary.com ($45M raised, $70M/yr by 2020) · CTO at Lot18 ($50M raised, EM to CTO)
          </Text>
          <Text style={styles.earlierHighlight}>
            VP Engineering at PhotoShelter (20+ team, $10M ARR)
          </Text>
          <Text style={styles.earlierText}>
            IC foundation: Outbox (pre-launch to $100M GMV, AXS.com partnership) · Lot18 (1 yr IC before promotion track)
          </Text>
        </View>

        {/* Skills + Community - two column layout */}
        <View style={styles.twoColumnRow}>
          {/* Skills - left column */}
          <View style={styles.columnLeft}>
            <Text style={styles.sectionHeader}>SKILLS</Text>
            <View style={styles.skillsGrid}>
              {resumeData.skills.filter(s => s.name !== 'Leadership').map((skill, index) => (
                <Text key={index} style={styles.skillInlineItem}>
                  <Text style={{ fontWeight: 'bold' }}>{skill.name}:</Text> {skill.items.join(' · ')}
                </Text>
              ))}
            </View>
          </View>

          {/* Community - right column */}
          <View style={styles.columnRight}>
            <Text style={styles.sectionHeader}>COMMUNITY</Text>
            <Text style={styles.communityLine}>
              <Text style={{ fontWeight: 'bold' }}>Montréal Python</Text> – Founder · 5,000+ members · Hosted PyCon
            </Text>
            <Text style={styles.communityLine}>
              <Text style={{ fontWeight: 'bold' }}>Startup Mentor</Text> – FounderFuel · FuturPreneur · McGill X-1
            </Text>
          </View>
        </View>

        {/* Education - at bottom */}
        <View style={styles.educationBottom}>
          <Text style={styles.sectionHeader}>EDUCATION</Text>
          {resumeData.education.map((edu, index) => (
            <Text key={index} style={styles.educationLine}>
              {edu.institution} – {edu.degree} in {edu.field}
            </Text>
          ))}
        </View>

        {/* Footer - fixed at page bottom */}
        <View style={styles.footer} fixed>
          <Image
            style={styles.qrCode}
            src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&margin=0&data=https://arach.io/resume"
          />
          <Text style={styles.footerEmail}>{resumeData.contact.email}</Text>
          {isDev && <Text style={styles.footerId}>{docId}</Text>}
        </View>
      </Page>
    </Document>
  );
}
