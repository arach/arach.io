export interface Experience {
  company: string;
  companyUrl?: string;
  title: string;
  dates: string;
  startDate: string;
  location: string;
  badge?: string;
  scope?: string;
  revenue?: string;
  budget?: string;
  funding?: string;
  exit?: string;
  description: string;
  bullets: string[];
  techStack: string[];
  status: 'active' | 'completed';
  featured?: boolean; // Show in summary/one-pager view
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  year: string;
  location: string;
}

export interface Volunteer {
  organization: string;
  role: string;
  dates: string;
  description: string;
  badge?: string;
  featured?: boolean; // Show in summary/one-pager view
}

export interface SkillCategory {
  name: string;
  level: number;
  items: string[];
}

export interface ResumeData {
  name: string;
  title: string;
  location: string;
  summary: {
    totalYears: number;
    icYears: number;
    managerYears: number;
    executiveYears: number;
  };
  contact: {
    email?: string;
    website: string;
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
  experience: Experience[];
  skills: SkillCategory[];
  education: Education[];
  volunteer: Volunteer[];
}

export const resumeData: ResumeData & { oneLiner: string; locationLine: string } = {
  name: "Arach Tchoupani",
  title: "Engineering Leader & Founder",
  oneLiner: "3x CTO/VP Eng · 1 exit · 15 yrs building teams 0 to 50+",
  locationLine: "Montreal · Open to relocate · TN/O1 eligible",
  location: "Montreal, Canada",
  summary: {
    totalYears: 15,
    icYears: 7,
    managerYears: 10,
    executiveYears: 5,
  },
  contact: {
    email: "arach@tchoupani.com",
    website: "arach.io",
    linkedin: "arach",
    github: "arach",
    twitter: "arach_tchoupani",
  },
  experience: [
    {
      company: "jdi.sh",
      companyUrl: "https://jdi.sh",
      title: "Founder",
      dates: "2024 - Present",
      startDate: "2024-01",
      location: "Remote",
      description: "Technical sabbatical to rebuild hands-on skills after a decade of leadership",
      bullets: [
        "Technical sabbatical after 10+ years of engineering leadership - returned to hands-on building",
        "Building Talkie (usetalkie.com) - native voice-to-action app launching Q1 2026",
        "Deep dive into AI-native development: LLMs, agentic coding workflows, and modern tooling",
      ],
      techStack: ["TypeScript", "React", "Node.js", "Python", "LLMs/AI APIs", "Agentic Development"],
      status: 'active',
      featured: true,
    },
    {
      company: "Meta",
      title: "Engineering Manager",
      dates: "2022 - 2023",
      startDate: "2022-03",
      location: "New York, NY",
      scope: "3 teams, 12 engineers",
      description: "Joined to work on Bulletin, a newsletter and publishing service. Led through a major shift towards Creators on FB.",
      bullets: [
        "Launched Creator Education to 20M+ aspiring creators",
        "Launched Creator Support Hub serving 6M+ creators",
        "Powered Facebook app support experience for Meta Verified launch",
        "Hired 6 engineers across 3 teams during competitive 2022 hiring cycle",
        "Coached ICs to next level - landed multiple promotion packets",
      ],
      techStack: ["React", "Bloks", "Hack", "Ent"],
      status: 'completed',
      featured: true,
    },
    {
      company: "Breathe Life",
      title: "Chief Technology Officer & Co-Founder",
      dates: "2018 - 2021",
      startDate: "2018-01",
      location: "Montreal, Canada",
      badge: "FOUNDED",
      scope: "20+ people: 2 Directors, 2 EMs, 16 Engineers",
      revenue: "$0M/yr to $3M+/yr ARR",
      budget: "$2.25M/yr",
      funding: "$15M from Diagram Ventures, Real Ventures, Desjardins Capital, Clocktower Ventures",
      exit: "Acquired by SE2 LLC (now Zinnia)",
      description: "Co-founded and led engineering from zero to successful acquisition. Onboarded 10+ life insurance carriers, raised $15M+, hired 50+ across US and Canada.",
      bullets: [
        "Led engineering through successful acquisition by SE2 LLC (now Zinnia), an Eldridge Industries business",
        "Scaled from 0 to $3M+ ARR, building platform that modernized life insurance distribution for 10+ carriers",
        "Built 20-person engineering org from scratch: 2 directors, 2 engineering managers, 16 engineers",
        "Provided hands-on technical leadership on large initiatives, system design discussions, and architecture reviews",
        "Partnered closely with senior executives at client technology orgs - CIOs and Directors at major insurance carriers",
        "Ensured compliance and security: SOC2, HIPAA, annual pen tests, CI/CD, GitOps",
      ],
      techStack: ["React", "Redux", "TypeScript", "Node.js", "Golang", "PostgreSQL", "BigQuery", "Kubernetes", "Terraform"],
      status: 'completed',
      featured: true,
    },
    {
      company: "Starbucks (via C3 Technologies)",
      title: "Tech Lead",
      dates: "2016 - 2017",
      startDate: "2016-10",
      location: "Montreal, Canada",
      badge: "FOUNDED C3",
      scope: "3 contract developers",
      revenue: "$80M+/yr",
      budget: "$750k",
      description: "Started the firm (C3) that led the redesign and launch of Starbucks' global packaged goods e-commerce websites.",
      bullets: [
        "Shipped a headless commerce style React app powering the $80M/yr global website",
        "Introduced modern and mobile friendly UX unlocking marketing team's ability to innovate with content + commerce",
        "Reduced turnaround time of marketing site updates from 1 week to minutes",
        "Improved mobile conversion rates by over 40%",
      ],
      techStack: ["React", "Redux", "Demandware/Salesforce Commerce Cloud", "Python", "AWS"],
      status: 'completed',
    },
    {
      company: "PhotoShelter",
      title: "Vice-President, Engineering",
      dates: "2015 - 2016",
      startDate: "2015-10",
      location: "New York, NY",
      scope: "20+: 3 EMs, 3 QA, 15 Engineers, 1 Architect",
      revenue: "$8M/yr to $10M+/yr ARR",
      budget: "$3M/yr",
      funding: "$12M from General Catalyst",
      description: "Joined to improve partnership with product and sales functions and grow the engineering team. PhotoShelter hosts 15 petabytes of data, 800M+ photo/video assets from 80,000 pros and 1,300 organizations.",
      bullets: [
        "Led a hybrid (NY/global) team of 20+, implemented agile process, engineering best practices",
        "Partnered with Marketing, Sales and Product teams to deliver a cohesive multi-year product development roadmap",
      ],
      techStack: ["C++", "PHP", "Web Components", "PostgreSQL", "iOS", "Android"],
      status: 'completed',
    },
    {
      company: "Primary.com",
      title: "CTO",
      dates: "2014 - 2015",
      startDate: "2014-08",
      location: "New York, NY",
      scope: "4 engineers",
      revenue: "$0M to $10M+/yr ARR by 2015, $70M/yr by 2020",
      funding: "$45M from Homebrew, US Venture Partners",
      description: "Joined the NY based team at seed stage, employee #2. Company raised $45M from top VCs and has shipped products to more than 1 million customers since launch.",
      bullets: [
        "Built the technical foundation as employee #2 at seed stage",
        "Scaled platform to support $10M+/yr ARR within first year",
      ],
      techStack: ["Ruby on Rails", "Angular", "AWS (EC2, RDS, S3)", "Imgix", "CloudFront"],
      status: 'completed',
      featured: true,
    },
    {
      company: "Lot18",
      title: "Engineering Manager to Director to CTO",
      dates: "2011 - 2014",
      startDate: "2011-01",
      location: "New York, NY",
      scope: "Team of teams: 15 as CTO, 10 as Director, 6 as EM",
      revenue: "$15M to $30M+/yr GMV by 2014",
      budget: "$2.5M/yr",
      funding: "$50M from Accel, NEA, FirstMark",
      description: "Joined at seed stage as senior engineer. Promoted multiple times from lead to CTO. Launched the first personalized wine club in the US.",
      bullets: [
        "Grew from senior engineer to CTO through multiple promotions",
        "Launched the first personalized wine club in the US",
        "Powered white label wine clubs for publishers such as NYTimes and Forbes",
      ],
      techStack: ["Python", "Tornado", "Flask", "MySQL", "Redis", "AWS", "Nginx", "HAProxy"],
      status: 'completed',
    },
    {
      company: "Outbox Technology",
      title: "Software Engineer",
      dates: "2006 - 2011",
      startDate: "2006-03",
      location: "Montreal, Canada",
      scope: "IC on team of 4 at launch, 15 by 2011",
      revenue: "$0M to $100M+/yr GMV by 2011",
      description: "Joined the company pre-launch white label ticketing platform. By 2011, AEG & Outbox partnered to create AXS.com, rolled out in 100+ venues worldwide. 500M+ tickets sold to date.",
      bullets: [
        "Built core platform from pre-launch through $100M+/yr GMV",
        "Solution rolled out to 100+ venues worldwide via AXS.com partnership with AEG",
        "Platform has sold 500M+ tickets to date",
      ],
      techStack: ["Python", "JavaScript", "XML-RPC", "CentOS", "MS SQL"],
      status: 'completed',
    },
  ],
  skills: [
    {
      name: "Languages",
      level: 95,
      items: ["TypeScript/JS", "Python", "Swift", "Golang", "Ruby"],
    },
    {
      name: "Frontend",
      level: 100,
      items: ["React", "Redux", "Next.js", "SwiftUI", "Tailwind CSS"],
    },
    {
      name: "Backend",
      level: 92,
      items: ["Node.js", "PostgreSQL", "Redis", "Flask", "GraphQL"],
    },
    {
      name: "Infrastructure",
      level: 88,
      items: ["AWS", "Kubernetes", "Terraform", "Docker", "CI/CD"],
    },
    {
      name: "AI/ML",
      level: 85,
      items: ["LLMs", "RAG", "Agentic Workflows", "Fine-tuning", "Embeddings"],
    },
    {
      name: "Leadership",
      level: 94,
      items: ["Team Building", "Technical Strategy", "M&A", "Fundraising"],
    },
  ],
  education: [
    {
      institution: "Ecole Polytechnique de Montréal",
      degree: "Bachelor's Degree",
      field: "Software Engineering",
      year: "2007",
      location: "Montreal, Canada",
    },
  ],
  volunteer: [
    {
      organization: "Montréal Python",
      role: "Founder & Co-Organizer",
      dates: "2007 - 2011",
      description: "Started the group and co-organized activities for the first few years. Now 5,000 members strong and hosted global PyCon in 2014-15.",
      badge: "FOUNDED",
      featured: true,
    },
    {
      organization: "FuturPreneur",
      role: "Mentor",
      dates: "2018 - 2020",
      description: "Mentored a team of young entrepreneurs through their early entrepreneurial milestones.",
    },
    {
      organization: "McGill Dobson Centre",
      role: "X-1 Accelerator Mentor & Dobson Cup Judge",
      dates: "2018 - 2020",
      description: "Mentored founding teams at McGill's X-1 Accelerator program and served as semi-finalist judge for the Dobson Cup startup competition.",
      featured: true,
    },
    {
      organization: "FounderFuel",
      role: "Mentor",
      dates: "2018 - 2020",
      description: "Offered feedback and strategy consulting sessions to teams in various cohorts.",
    },
  ],
};
