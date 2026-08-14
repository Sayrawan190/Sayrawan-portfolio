// Seed content mirrors the site's original hard-coded profile/skills/projects
// content (formerly src/data/defaultData.js, now owned by the database).
// This only runs once via `npm run db:seed`; dashboard edits from then on
// live in Postgres, not here.

export const SEED_PROFILE = {
  photo: "myPhoto2.jpg",
  name: { en: "Abdullah Mohammed Alserawan", ar: "عبدالله محمد السيروان" },
  title: { en: "Student", ar: "طالب" },
  tagline: {
    en: "Computer Science student focused on AI, problem-solving, and clean front-end fundamentals.",
    ar: "طالب علوم حاسب مهتم بالذكاء الاصطناعي، حلّ المشاكل، وتطبيق أساسيات فرونت-إند بشكل نظيف.",
  },
  about: {
    en: "Abdullah Mohammed Alserawan is a Computer Science student at King Abdulaziz University. He learns quickly, communicates technical ideas clearly, and keeps improving through hands-on practice. He has supported students by explaining university-level courses in a simplified way, and he has delivered guidance during IBM SkillsBuild learning sessions. His main interest is Artificial Intelligence, and he also has solid front-end foundations using HTML, CSS, and JavaScript. He brings a calm, organized work style, takes ownership, and focuses on producing clean results that are easy to review and trust.",
    ar: "عبدالله محمد السيروان طالب علوم حاسب في جامعة الملك عبدالعزيز. يتميّز بسرعة التعلّم ووضوح الشرح، ويطوّر نفسه بشكل مستمر عبر التطبيق العملي. قدّم دعمًا لطلاب عبر شرح مواد جامعية بطريقة مبسطة، وشارك في تقديم إرشاد وشرح ضمن جلسات IBM SkillsBuild. اهتمامه الأساسي هو الذكاء الاصطناعي، ومعه أساسيات قوية في تطوير الواجهات باستخدام HTML وCSS وJavaScript. أسلوبه في العمل هادئ ومنظم، ويتحمّل المسؤولية، ويركّز على نتائج واضحة وسهلة المراجعة.",
  },
  cvLink: "Abdullah Al-Sayrawan CV.pdf",
  linkedin: "https://www.linkedin.com/in/abdullah-al-serawan-390158348",
  x: "https://x.com/sayrawan2?s=21",
  phone: "+966 535856530",
  focus: { en: "AI • CS Fundamentals • Front-End", ar: "ذكاء اصطناعي • أساسيات CS • فرونت-إند" },
  location: { en: "Saudi Arabia", ar: "السعودية" },
  summary: [
    { en: "Fast learner with consistent self-development", ar: "سرعة تعلّم مع تطوير مستمر" },
    { en: "Clear technical explanations and teaching experience", ar: "شرح واضح للمفاهيم التقنية وخبرة تعليمية" },
    { en: "Strong fundamentals and professional presentation", ar: "أساسيات قوية وعرض احترافي" },
  ],
  roleWords: [
    { en: "AI Enthusiast", ar: "شغوف بالذكاء الاصطناعي" },
    { en: "Front-End Learner", ar: "متعلّم فرونت-إند" },
    { en: "Fast Learner", ar: "سريع التعلّم" },
    { en: "Clear Communicator", ar: "شرح واضح" },
  ],
};

export const SEED_SKILL_CATEGORIES = [
  {
    icon: "🧩",
    name: { en: "Productivity Skills", ar: "مهارات إنتاجية" },
    skills: [
      { name: { en: "Microsoft Office", ar: "Microsoft Office" }, level: "" },
      { name: { en: "Fast learning", ar: "سرعة التعلّم" }, level: "" },
      { name: { en: "ChatGPT", ar: "ChatGPT" }, level: "" },
    ],
  },
  {
    icon: "🤝",
    name: { en: "Soft Skills", ar: "مهارات شخصية" },
    skills: [
      { name: { en: "Teamwork", ar: "العمل الجماعي" }, level: "" },
      { name: { en: "Problem Solving", ar: "حلّ المشاكل" }, level: "" },
      { name: { en: "Leadership", ar: "القيادة" }, level: "" },
      { name: { en: "Flexibility", ar: "المرونة" }, level: "" },
      { name: { en: "Communication", ar: "التواصل" }, level: "" },
    ],
  },
  {
    icon: "💻",
    name: { en: "Programming Languages", ar: "لغات البرمجة" },
    skills: [
      { name: { en: "Python", ar: "Python" }, level: "" },
      { name: { en: "Java", ar: "Java" }, level: "" },
      { name: { en: "HTML", ar: "HTML" }, level: "" },
      { name: { en: "CSS", ar: "CSS" }, level: "" },
      { name: { en: "JavaScript", ar: "JavaScript" }, level: "" },
    ],
  },
  {
    icon: "🌍",
    name: { en: "Languages", ar: "اللغات" },
    skills: [
      { name: { en: "Arabic", ar: "العربية" }, level: "" },
      { name: { en: "English", ar: "الإنجليزية" }, level: "" },
    ],
  },
];

export const SEED_PROJECTS = [
  {
    name: { en: "Personal Home Server", ar: "سيرفر منزلي شخصي" },
    description: {
      en: "A self-hosted home server for personal use and experimentation.",
      ar: "سيرفر منزلي للاستضافة والتجربة والتعلّم.",
    },
    badge: { en: "Personal", ar: "شخصي" },
    technologies: ["Linux", "Networking", "Self-hosting"],
    images: [],
    link: "",
  },
  {
    name: { en: "Daily Calories Calculator Web Page", ar: "صفحة حساب السعرات اليومية" },
    description: {
      en: "A simple front-end-only page that calculates daily calories (no backend).",
      ar: "صفحة فرونت-إند فقط لحساب السعرات اليومية (بدون باك-إند).",
    },
    badge: { en: "Front-end", ar: "فرونت-إند" },
    technologies: ["HTML", "CSS", "JavaScript"],
    images: [],
    link: "",
  },
  {
    name: { en: "Financial Management Using Excel", ar: "إدارة مالية باستخدام Excel" },
    description: {
      en: "Organized financial data and management records for a personal business project.",
      ar: "تنظيم بيانات مالية وسجلات إدارة لمشروع شخصي.",
    },
    badge: { en: "Tools", ar: "أدوات" },
    technologies: ["Excel", "Reporting", "Tracking"],
    images: [],
    link: "",
  },
];

export const SEED_EXPERIENCE = [
  {
    title: { en: "Academic Teaching Experience", ar: "خبرة تعليمية أكاديمية" },
    organization: { en: "", ar: "" },
    start: "",
    end: "",
    endIsPresent: false,
    description: {
      en: "Explained three university courses to students in a simplified, friendly way.",
      ar: "شرح ثلاث مواد جامعية للطلاب بطريقة مبسطة ولطيفة.",
    },
    technologies: [],
  },
  {
    title: { en: "IBM SkillsBuild Instructor", ar: "مقدّم شرح في IBM SkillsBuild" },
    organization: { en: "IBM SkillsBuild", ar: "IBM SkillsBuild" },
    start: "",
    end: "",
    endIsPresent: false,
    description: {
      en: "Delivered explanations and guidance during IBM SkillsBuild sessions.",
      ar: "تقديم شرح وإرشاد خلال جلسات IBM SkillsBuild.",
    },
    technologies: [],
  },
  {
    title: { en: "Personal Project Management", ar: "إدارة مشاريع شخصية" },
    organization: { en: "", ar: "" },
    start: "",
    end: "",
    endIsPresent: false,
    description: {
      en: "Managed personal projects using Excel for tracking and organization.",
      ar: "إدارة مشاريع شخصية باستخدام Excel للتتبع والتنظيم.",
    },
    technologies: ["Excel"],
  },
];

export const SEED_CERTIFICATES = [
  {
    name: { en: "IBM SkillsBuild — Certificate", ar: "IBM SkillsBuild — شهادة" },
    issuer: { en: "IBM SkillsBuild", ar: "IBM SkillsBuild" },
    date: "2026/1/22",
    image: "certificateOfAttendance/IBMSkillsBuild.jpg",
    link: "https://x.com/ProggClub_KAU/status/2014033060086374662?s=20",
  },
];
