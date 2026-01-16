import {
  Document,
  Page,
  View,
  Text,
  Link,
  StyleSheet,
} from '@react-pdf/renderer';
import { resumeData } from '../data/resume';

// Using built-in Courier for monospace tactical look

const colors = {
  primary: '#0088cc',
  text: '#1e1e1e',
  textMuted: '#646464',
  border: '#c8c8c8',
  background: '#fafafa',
  surface: '#ffffff',
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Courier',
    fontSize: 9,
    color: colors.text,
    backgroundColor: colors.background,
  },
  // Header
  header: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottom: `1px solid ${colors.border}`,
    textAlign: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: 700,
    letterSpacing: 1,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 9,
    color: colors.textMuted,
    letterSpacing: 2,
    marginBottom: 12,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  contactLink: {
    fontSize: 8,
    color: colors.textMuted,
    textDecoration: 'none',
  },
  // Sections
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: 3,
    color: colors.textMuted,
    marginBottom: 12,
    paddingBottom: 4,
    borderBottom: `1px solid ${colors.border}`,
  },
  // Experience cards
  card: {
    marginBottom: 14,
    paddingLeft: 12,
    borderLeft: `2px solid ${colors.primary}`,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  cardCompany: {
    fontSize: 11,
    fontWeight: 700,
  },
  cardStatus: {
    fontSize: 7,
    color: colors.primary,
    padding: '2px 6px',
    border: `1px solid ${colors.primary}`,
  },
  cardMeta: {
    fontSize: 8,
    color: colors.textMuted,
    marginBottom: 6,
  },
  cardDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 6,
  },
  detailBadge: {
    fontSize: 7,
    color: colors.textMuted,
    padding: '2px 6px',
    backgroundColor: '#f0f0f0',
    border: `1px solid ${colors.border}`,
  },
  bulletList: {
    marginBottom: 6,
  },
  bullet: {
    fontSize: 8,
    marginBottom: 3,
    paddingLeft: 10,
  },
  techRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  techBadge: {
    fontSize: 7,
    color: colors.textMuted,
    padding: '1px 4px',
    backgroundColor: '#f5f5f5',
  },
  // Compact cards (education, volunteer)
  compactCard: {
    marginBottom: 10,
    paddingLeft: 12,
    borderLeft: `2px solid ${colors.primary}`,
  },
  compactTitle: {
    fontSize: 10,
    fontWeight: 700,
    marginBottom: 2,
  },
  compactMeta: {
    fontSize: 8,
    color: colors.textMuted,
    marginBottom: 2,
  },
  compactDescription: {
    fontSize: 8,
    color: colors.text,
    lineHeight: 1.4,
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 7,
    color: colors.textMuted,
    borderTop: `1px solid ${colors.border}`,
    paddingTop: 10,
  },
});

export default function ResumePDF() {
  const currentYear = new Date().getFullYear();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{resumeData.name.replace(' ', '_').toUpperCase()}</Text>
          <Text style={styles.subtitle}>
            {resumeData.title.toUpperCase()} | {resumeData.location.toUpperCase().replace(/ /g, '_')}
          </Text>
          <View style={styles.contactRow}>
            {resumeData.contact.github && (
              <Link style={styles.contactLink} src={`https://github.com/${resumeData.contact.github}`}>
                github.com/{resumeData.contact.github}
              </Link>
            )}
            {resumeData.contact.linkedin && (
              <Link style={styles.contactLink} src={`https://linkedin.com/in/${resumeData.contact.linkedin}`}>
                linkedin.com/in/{resumeData.contact.linkedin}
              </Link>
            )}
            {resumeData.contact.website && (
              <Link style={styles.contactLink} src={`https://${resumeData.contact.website}`}>
                {resumeData.contact.website}
              </Link>
            )}
          </View>
        </View>

        {/* Experience */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>OPERATIONAL HISTORY</Text>
          {resumeData.experience.map((exp, index) => (
            <View key={index} style={styles.card} wrap={false}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardCompany}>{exp.company}</Text>
                {exp.status === 'active' && <Text style={styles.cardStatus}>CURRENT</Text>}
              </View>
              <Text style={styles.cardMeta}>
                {exp.title} | {exp.dates} | {exp.location}
              </Text>
              {(exp.scope || exp.revenue || exp.funding || exp.exit) && (
                <View style={styles.cardDetails}>
                  {exp.scope && <Text style={styles.detailBadge}>{exp.scope}</Text>}
                  {exp.revenue && <Text style={styles.detailBadge}>{exp.revenue}</Text>}
                  {exp.funding && <Text style={styles.detailBadge}>{exp.funding}</Text>}
                  {exp.exit && <Text style={styles.detailBadge}>{exp.exit}</Text>}
                </View>
              )}
              <View style={styles.bulletList}>
                {exp.bullets.slice(0, 3).map((bullet, i) => (
                  <Text key={i} style={styles.bullet}>› {bullet}</Text>
                ))}
              </View>
              <View style={styles.techRow}>
                {exp.techStack.map((tech, i) => (
                  <Text key={i} style={styles.techBadge}>{tech}</Text>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          ID-001-{currentYear} | Generated from arach.io/resume
        </Text>
      </Page>

      {/* Page 2: Education & Volunteer */}
      <Page size="A4" style={styles.page}>
        {/* Education */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>TRAINING</Text>
          {resumeData.education.map((edu, index) => (
            <View key={index} style={styles.compactCard}>
              <Text style={styles.compactTitle}>{edu.institution}</Text>
              <Text style={styles.compactMeta}>
                {edu.degree} in {edu.field} | {edu.year} | {edu.location}
              </Text>
            </View>
          ))}
        </View>

        {/* Volunteer */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>ALLIED OPERATIONS</Text>
          {resumeData.volunteer.map((vol, index) => (
            <View key={index} style={styles.compactCard}>
              <Text style={styles.compactTitle}>{vol.organization}</Text>
              <Text style={styles.compactMeta}>{vol.role} | {vol.dates}</Text>
              <Text style={styles.compactDescription}>{vol.description}</Text>
            </View>
          ))}
        </View>

        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>SYSTEMS STATUS</Text>
          {resumeData.skills.map((skill, index) => (
            <View key={index} style={{ marginBottom: 8 }}>
              <Text style={{ fontSize: 9, fontWeight: 700, marginBottom: 3 }}>
                {skill.name.toUpperCase()}
              </Text>
              <View style={styles.techRow}>
                {skill.items.map((item, i) => (
                  <Text key={i} style={styles.techBadge}>{item}</Text>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          ID-001-{currentYear} | Generated from arach.io/resume
        </Text>
      </Page>
    </Document>
  );
}
