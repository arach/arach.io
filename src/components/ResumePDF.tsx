import {
  Document,
  Page,
  View,
  Text,
  Link,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import { resumeData } from '../data/resume';

// Register Space Mono
Font.register({
  family: 'SpaceMono',
  fonts: [
    {
      src: 'https://cdn.jsdelivr.net/fontsource/fonts/space-mono@latest/latin-400-normal.ttf',
      fontWeight: 'normal',
    },
    {
      src: 'https://cdn.jsdelivr.net/fontsource/fonts/space-mono@latest/latin-700-normal.ttf',
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
    fontFamily: 'SpaceMono',
    fontSize: 8,
    color: colors.text,
    backgroundColor: '#ffffff',
  },
  // Header - two column layout
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 9,
    color: colors.textMuted,
    marginBottom: 2,
  },
  location: {
    fontSize: 8,
    color: colors.textMuted,
  },
  contactLink: {
    fontSize: 7.5,
    color: colors.textMuted,
    textDecoration: 'none',
    marginBottom: 3,
  },
  tacticalId: {
    fontSize: 6,
    color: colors.border,
    marginTop: 4,
  },
  // Section
  section: {
    marginBottom: 18,
  },
  sectionHeader: {
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 2,
    color: colors.textMuted,
    marginBottom: 10,
  },
  // Experience - clean cards
  card: {
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 1,
  },
  company: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 6,
    color: colors.accent,
  },
  meta: {
    fontSize: 7.5,
    color: colors.textMuted,
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  detailBadge: {
    fontSize: 6,
    color: colors.textMuted,
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
    marginTop: 2,
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
  // Narrative section for earlier roles
  narrativeSection: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    borderStyle: 'dashed',
  },
  narrativeTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    marginBottom: 4,
    color: colors.textMuted,
  },
  narrativeText: {
    fontSize: 7.5,
    color: colors.text,
    lineHeight: 1.5,
    marginBottom: 6,
  },
  moreLink: {
    fontSize: 7,
    color: colors.accent,
    textDecoration: 'none',
  },
  // Skills
  skillRow: {
    marginBottom: 8,
  },
  skillName: {
    fontSize: 7.5,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  skillItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillItem: {
    fontSize: 7,
    color: colors.textMuted,
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 28,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 6,
    color: colors.border,
  },
  // Tactical decorations
  cornerMark: {
    position: 'absolute',
    fontSize: 8,
    color: colors.border,
  },
});

export default function ResumePDF() {
  const currentYear = new Date().getFullYear();
  const docId = `ID-001-${currentYear}`;

  return (
    <Document>
      {/* Page 1: Header + Experience */}
      <Page size="LETTER" style={styles.page}>
        {/* Corner marks for tactical feel */}
        <Text style={[styles.cornerMark, { top: 20, left: 20 }]}>+</Text>
        <Text style={[styles.cornerMark, { top: 20, right: 20 }]}>+</Text>

        {/* Header - two columns */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.name}>{resumeData.name.toUpperCase()}</Text>
            <Text style={styles.title}>{resumeData.title}</Text>
            <Text style={styles.location}>{resumeData.location}</Text>
            <Text style={styles.tacticalId}>{docId}</Text>
          </View>
          <View style={styles.headerRight}>
            <Link style={styles.contactLink} src={`https://${resumeData.contact.website}`}>
              https://{resumeData.contact.website}
            </Link>
            <Link style={styles.contactLink} src={`https://github.com/${resumeData.contact.github}`}>
              https://github.com/{resumeData.contact.github}
            </Link>
            <Link style={styles.contactLink} src={`https://linkedin.com/in/${resumeData.contact.linkedin}`}>
              https://linkedin.com/in/{resumeData.contact.linkedin}
            </Link>
          </View>
        </View>

        {/* Experience - Full details for first 3, condensed for rest */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>EXPERIENCE</Text>
          {resumeData.experience.slice(0, 3).map((exp, index) => (
            <View key={index} style={styles.card} wrap={false}>
              <View style={styles.cardHeader}>
                <Text style={styles.company}>{exp.company}</Text>
                {exp.status === 'active' && <Text style={styles.status}>CURRENT</Text>}
              </View>
              <Text style={styles.meta}>
                {exp.title} · {exp.dates} · {exp.location}
              </Text>
              {(exp.scope || exp.revenue || exp.funding || exp.exit) && (
                <View style={styles.detailsRow}>
                  {exp.scope && <Text style={styles.detailBadge}>{exp.scope}</Text>}
                  {exp.revenue && <Text style={styles.detailBadge}>· {exp.revenue}</Text>}
                  {exp.funding && <Text style={styles.detailBadge}>· {exp.funding}</Text>}
                  {exp.exit && <Text style={styles.detailBadge}>· {exp.exit}</Text>}
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

          {/* Earlier roles - narrative summary */}
          <View style={styles.narrativeSection}>
            <Text style={styles.narrativeTitle}>Earlier Experience</Text>
            <Text style={styles.narrativeText}>
              Progressively gained responsibility from IC to engineering leadership across
              {' '}{resumeData.experience.slice(3).map(exp => exp.company).join(', ')}.
              {' '}Built products from zero to scale, led teams through growth phases, and
              contributed to multiple successful outcomes including acquisitions and major partnerships.
            </Text>
            <Link style={styles.moreLink} src="https://arach.io/resume/detailed">
              Full history at https://arach.io/resume/detailed
            </Link>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>{docId}</Text>
          <Text>arach.io/resume</Text>
        </View>

        {/* Bottom corner marks */}
        <Text style={[styles.cornerMark, { bottom: 20, left: 20 }]}>+</Text>
        <Text style={[styles.cornerMark, { bottom: 20, right: 20 }]}>+</Text>
      </Page>

      {/* Page 2: Education + Skills */}
      <Page size="LETTER" style={styles.page}>
        <Text style={[styles.cornerMark, { top: 20, left: 20 }]}>+</Text>
        <Text style={[styles.cornerMark, { top: 20, right: 20 }]}>+</Text>

        {/* Education */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>EDUCATION</Text>
          {resumeData.education.map((edu, index) => (
            <View key={index} style={styles.compactCard}>
              <Text style={styles.compactTitle}>{edu.institution}</Text>
              <Text style={styles.compactMeta}>
                {edu.degree} in {edu.field} · {edu.year} · {edu.location}
              </Text>
            </View>
          ))}
        </View>

        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>SKILLS</Text>
          {resumeData.skills.map((skill, index) => (
            <View key={index} style={styles.skillRow}>
              <Text style={styles.skillName}>{skill.name}</Text>
              <View style={styles.skillItems}>
                {skill.items.map((item, i) => (
                  <Text key={i} style={styles.skillItem}>{item}{i < skill.items.length - 1 ? ' ·' : ''}</Text>
                ))}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text>{docId}</Text>
          <Text>arach.io/resume</Text>
        </View>

        <Text style={[styles.cornerMark, { bottom: 20, left: 20 }]}>+</Text>
        <Text style={[styles.cornerMark, { bottom: 20, right: 20 }]}>+</Text>
      </Page>
    </Document>
  );
}
