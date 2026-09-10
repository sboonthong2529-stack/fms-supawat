import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { seedCore, seedUser } from "./lib/seed-core";
import { requireDatabaseUrl } from "./lib/require-database-url";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: requireDatabaseUrl() }) });

/** รหัสผ่านทุกบัญชีตัวอย่าง */
export const DEV_PASSWORD = "Passw0rd!vibe";

async function main() {
  if (process.env.NODE_ENV === "production" && process.env.SEED_ALLOW_PROD !== "1") {
    console.error("[seed] ปฏิเสธ: NODE_ENV=production — ใช้ npm run db:bootstrap แทน");
    process.exit(1);
  }
  const core = await seedCore(prisma, { tenantCode: "DEMO", nameTh: "องค์กรตัวอย่าง", nameEn: "Sample Organization" });
  const hash = await bcrypt.hash(DEV_PASSWORD, 12);
  const users = [
    { email: "admin@app.local", name: "ผู้ดูแลสูงสุด", roles: ["SUPER_ADMIN"] },
    { email: "staff@app.local", name: "เจ้าหน้าที่", roles: ["STAFF"] },
    { email: "viewer@app.local", name: "ผู้ดู", roles: ["VIEWER"] },
    { email: "lockme@app.local", name: "บัญชีทดสอบล็อก", roles: ["VIEWER"] },
    { email: "forced@app.local", name: "บัญชีบังคับเปลี่ยนรหัส", roles: ["VIEWER"], mustChangePassword: true },
  ];
  for (const u of users) {
    await seedUser(prisma, core.tenantId, { ...u, passwordHash: hash, roleIds: u.roles.map((c) => core.roleIds[c]) });
  }

  // Seed sample news articles
  const adminUser = await prisma.user.findUnique({ where: { email: "admin@app.local" } });
  const sampleNews = [
    {
      slug: "scholarship-awards-2026",
      titleTh: "พิธีมอบทุนการศึกษาและเกียรติบัตรเรียนดี ประจำปีการศึกษา 2568",
      titleEn: "Annual Academic Scholarship & Excellence Awards 2026",
      summaryTh: "คณะจัดพิธีมอบทุนการศึกษาสำหรับนักศึกษาที่มีผลการเรียนยอดเยี่ยมและสร้างชื่อเสียงให้กับมหาวิทยาลัย รวมกว่า 50 ทุน",
      summaryEn: "Faculty hosted the annual scholarship ceremony awarding more than 50 outstanding students.",
      contentTh: "เมื่อวันที่ 5 กันยายน 2569 คณะเทคโนโลยีและนวัตกรรมได้จัดพิธีมอบทุนการศึกษาแก่นักศึกษาที่มีผลการเรียนยอดเยี่ยม และนักศึกษาที่มีความประพฤติดีเด่น\n\nโดยมีท่านคณบดีเป็นประธานในพิธี พร้อมด้วยคณาจารย์และผู้แทนจากหน่วยงานพันธมิตรร่วมมอบทุนกว่า 50 ทุน รวมมูลค่ากว่า 1,500,000 บาท เพื่อสนับสนุนและส่งเสริมศักยภาพการเรียนรู้ของเยาวชนรุ่นใหม่",
      contentEn: "On September 5, 2026, the Faculty of Technology & Innovation held its annual scholarship ceremony to recognize outstanding academic achievements and leadership qualities among undergraduate students.\n\nThe Dean presided over the event alongside faculty members and industry partners, presenting over 50 scholarships worth 1.5 million baht.",
      coverImageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80",
      category: "ACADEMIC" as const,
      status: "PUBLISHED" as const,
      isPinned: true,
      publishedAt: new Date(),
    },
    {
      slug: "digital-innovation-conference-2026",
      titleTh: "ขอเชิญร่วมงานประชุมวิชาการระดับชาติด้านนวัตกรรมดิจิทัล NCIT 2026",
      titleEn: "Call for Papers: National Conference on Digital Innovation (NCIT 2026)",
      summaryTh: "เปิดรับบทความวิจัยด้านปัญญาประดิษฐ์ วิทยาการข้อมูล และซอฟต์แวร์วิศวกรรม ถึงวันที่ 30 ตุลาคมนี้",
      summaryEn: "Submissions open for original research papers in AI, Data Science, and Software Engineering.",
      contentTh: "คณะฯ ขอเชิญชวนนักวิจัย คณาจารย์ และนักศึกษาระดับบัณฑิตศึกษา ร่วมส่งผลงานวิจัยเพื่อนำเสนอในการประชุมวิชาการระดับชาติ ด้านเทคโนโลยีและนวัตกรรมดิจิทัล ครั้งที่ 18\n\nหัวข้อหลักในปีนี้เน้นด้าน Generative AI, Cloud-Native Architecture และ Smart Cities โดยบทความที่ได้รับการคัดเลือกจะได้รับการตีพิมพ์ในรายงานการประชุมระดับชาติ",
      contentEn: "The Faculty invites researchers, academics, and graduate students to submit original research papers for the 18th National Conference on Information Technology.\n\nKey themes include Generative AI, Cloud Architectures, and Smart Urban Systems.",
      coverImageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80",
      category: "ACTIVITY" as const,
      status: "PUBLISHED" as const,
      isPinned: true,
      publishedAt: new Date(),
    },
    {
      slug: "faculty-recruitment-computer-science",
      titleTh: "ประกาศรับสมัครคัดเลือกบุคคลเพื่อบรรจุเป็นอาจารย์ประจำ สาขาวิชาวิทยาการคอมพิวเตอร์",
      titleEn: "Lecturer Position Vacancy in Computer Science Department",
      summaryTh: "รับสมัครผู้สำเร็จการศึกษาระดับปริญญาโท-เอก ด้าน Computer Science, Software Engineering หรือสาขาที่เกี่ยวข้อง",
      summaryEn: "Applications are invited for full-time faculty positions in Computer Science.",
      contentTh: "คณะเทคโนโลยีและนวัตกรรม มีความประสงค์จะรับสมัครบุคคลเพื่อสอบคัดเลือกเป็นพนักงานมหาวิทยาลัย ตำแหน่งอาจารย์ สังกัดสาขาวิชาวิทยาการคอมพิวเตอร์ จำนวน 2 อัตรา\n\nผู้สนใจสามารถดาวน์โหลดใบสมัครและยื่นเอกสารได้ที่งานการเจ้าหน้าที่ หรือสมัครผ่านระบบออนไลน์ตั้งแต่บัดนี้เป็นต้นไป",
      contentEn: "The Faculty invites qualified candidates holding a Master's or Ph.D. in Computer Science or related fields to apply for full-time lecturer positions.",
      category: "GENERAL" as const,
      status: "PUBLISHED" as const,
      isPinned: false,
      publishedAt: new Date(),
    },
  ];

  for (const n of sampleNews) {
    await prisma.newsArticle.upsert({
      where: { tenantId_slug: { tenantId: core.tenantId, slug: n.slug } },
      update: { ...n },
      create: { ...n, tenantId: core.tenantId, authorId: adminUser?.id },
    });
  }

  // Seed sample academic departments
  const sampleDepts = [
    { code: "CPE", nameTh: "สาขาวิชาวิศวกรรมคอมพิวเตอร์", nameEn: "Department of Computer Engineering", orderIndex: 1 },
    { code: "IT", nameTh: "สาขาวิชาเทคโนโลยีสารสนเทศ", nameEn: "Department of Information Technology", orderIndex: 2 },
    { code: "DSI", nameTh: "สาขาวิชาวิทยาการข้อมูลและนวัตกรรมดิจิทัล", nameEn: "Department of Data Science and Digital Innovation", orderIndex: 3 },
  ];

  const deptMap = new Map<string, string>();
  for (const d of sampleDepts) {
    const dept = await prisma.academicDepartment.upsert({
      where: { tenantId_code: { tenantId: core.tenantId, code: d.code } },
      update: { ...d },
      create: { ...d, tenantId: core.tenantId },
    });
    deptMap.set(d.code, dept.id);
  }

  // Seed sample personnel profiles
  const samplePersonnel = [
    {
      academicTitle: "ศ.ดร.",
      firstNameTh: "สมชาย",
      lastNameTh: "เจริญสุข",
      firstNameEn: "Somchai",
      lastNameEn: "Charoensuk",
      positionType: "ACADEMIC",
      isExecutive: true,
      executivePositionTh: "คณบดี",
      executivePositionEn: "Dean",
      email: "dean@app.local",
      phone: "02-123-4567 ต่อ 101",
      officeRoom: "อาคาร 1 ห้อง 301",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      bioTh: "ผู้เชี่ยวชาญด้านปัญญาประดิษฐ์และการเรียนรู้ของเครื่อง มีประสบการณ์บริหารการศึกษาและการวิจัยกว่า 20 ปี",
      bioEn: "Expert in Artificial Intelligence and Machine Learning with over 20 years of academic administration and research experience.",
      researchInterests: "Artificial Intelligence, Deep Learning, Computer Vision",
      orderIndex: 1,
      departmentCode: "CPE",
    },
    {
      academicTitle: "รศ.ดร.",
      firstNameTh: "วิภาดา",
      lastNameTh: "สิริวัฒนา",
      firstNameEn: "Wiphada",
      lastNameEn: "Siriwattana",
      positionType: "ACADEMIC",
      isExecutive: true,
      executivePositionTh: "รองคณบดีฝ่ายวิชาการและวิจัย",
      executivePositionEn: "Associate Dean for Academic & Research Affairs",
      email: "wiphada@app.local",
      phone: "02-123-4567 ต่อ 102",
      officeRoom: "อาคาร 1 ห้อง 302",
      avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
      bioTh: "วิจัยด้านความปลอดภัยไซเบอร์และการจัดการข้อมูลขนาดใหญ่",
      bioEn: "Researcher in Cybersecurity and Big Data Management.",
      researchInterests: "Cybersecurity, Distributed Systems, Cloud Computing",
      orderIndex: 2,
      departmentCode: "IT",
    },
    {
      academicTitle: "ผศ.ดร.",
      firstNameTh: "กิตติศักดิ์",
      lastNameTh: "ปัญญาวงศ์",
      firstNameEn: "Kittisak",
      lastNameEn: "Panyawong",
      positionType: "ACADEMIC",
      isExecutive: false,
      email: "kittisak@app.local",
      phone: "02-123-4567 ต่อ 201",
      officeRoom: "อาคาร 2 ห้อง 405",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
      bioTh: "หัวหน้าสาขาวิชาวิศวกรรมคอมพิวเตอร์ วิจัยด้าน IoT และระบบสมองกลฝังตัว",
      bioEn: "Head of Computer Engineering, researching IoT and Embedded Systems.",
      researchInterests: "IoT, Embedded Systems, Edge Computing",
      orderIndex: 1,
      departmentCode: "CPE",
    },
    {
      academicTitle: "ดร.",
      firstNameTh: "นภัสสร",
      lastNameTh: "เกียรติไพบูลย์",
      firstNameEn: "Napassorn",
      lastNameEn: "Kiatpaiboon",
      positionType: "ACADEMIC",
      isExecutive: false,
      email: "napassorn@app.local",
      phone: "02-123-4567 ต่อ 301",
      officeRoom: "อาคาร 3 ห้อง 204",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
      bioTh: "อาจารย์ประจำสาขาเทคโนโลยีสารสนเทศ วิจัยด้าน Human-Computer Interaction และ UX/UI",
      bioEn: "Lecturer in IT Department, research focused on Human-Computer Interaction and UX/UI design.",
      researchInterests: "Human-Computer Interaction, UI/UX, Web Technologies",
      orderIndex: 2,
      departmentCode: "IT",
    },
    {
      academicTitle: "นางสาว",
      firstNameTh: "สุดารัตน์",
      lastNameTh: "มั่นคง",
      firstNameEn: "Sudarat",
      lastNameEn: "Mankhong",
      positionType: "SUPPORT",
      isExecutive: false,
      email: "sudarat@app.local",
      phone: "02-123-4567 ต่อ 110",
      officeRoom: "สำนักงานคณบดี อาคาร 1 ชั้น 1",
      avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
      bioTh: "เจ้าหน้าที่บริหารงานทั่วไป ประจำสำนักงานคณบดี",
      bioEn: "Administrative Officer, Dean's Office.",
      orderIndex: 1,
      departmentCode: undefined,
    },
  ];

  for (const p of samplePersonnel) {
    const { departmentCode, ...rest } = p;
    const departmentId = departmentCode ? deptMap.get(departmentCode) : undefined;
    const existing = await prisma.personnelProfile.findFirst({
      where: {
        tenantId: core.tenantId,
        firstNameTh: rest.firstNameTh,
        lastNameTh: rest.lastNameTh,
      },
    });

    if (existing) {
      await prisma.personnelProfile.update({
        where: { id: existing.id },
        data: { ...rest, departmentId },
      });
    } else {
      await prisma.personnelProfile.create({
        data: {
          ...rest,
          tenantId: core.tenantId,
          departmentId,
        },
      });
    }
  }

  // Seed sample academic programs and courses
  const samplePrograms = [
    {
      code: "B.Eng.-CPE",
      degreeLevel: "BACHELOR",
      departmentCode: "CPE",
      nameTh: "วิศวกรรมศาสตรบัณฑิต สาขาวิชาวิศวกรรมคอมพิวเตอร์",
      nameEn: "Bachelor of Engineering in Computer Engineering",
      degreeNameTh: "วศ.บ. (วิศวกรรมคอมพิวเตอร์)",
      degreeNameEn: "B.Eng. (Computer Engineering)",
      totalCredits: 128,
      durationYears: 4,
      tuitionFeePerTerm: 25000,
      descriptionTh: "มุ่งผลิตวิศวกรคอมพิวเตอร์ที่มีทักษะขั้นสูงทั้งทางด้านฮาร์ดแวร์ ซอฟต์แวร์ และระบบเครือข่ายอัจฉริยะ พร้อมรับมือกับยุค AI และ IoT เน้นการลงมือปฏิบัติจริงในห้องปฏิบัติการทันสมัย",
      descriptionEn: "A comprehensive engineering program cultivating expert computer engineers with hardware-software co-design, distributed systems, AI edge computing, and intelligent networks.",
      careerPathsTh: "วิศวกรซอฟต์แวร์ (Software Engineer), วิศวกรสมองกลฝังตัว (Embedded Systems Engineer), สถาปนิกคลาวด์ (Cloud Architect), ผู้เชี่ยวชาญความมั่นคงปลอดภัยไซเบอร์ (Cybersecurity Specialist)",
      careerPathsEn: "Software Engineer, Embedded Systems Engineer, Cloud Architect, Cybersecurity Specialist, IoT Solutions Engineer",
      orderIndex: 1,
      courses: [
        { courseCode: "CPE101", nameTh: "การโปรแกรมคอมพิวเตอร์ 1", nameEn: "Computer Programming I", credits: 3, lectureHours: 2, labHours: 2, selfStudyHours: 5, courseCategory: "CORE", year: 1, semester: 1 },
        { courseCode: "CPE102", nameTh: "คณิตศาสตร์ดิสครีต", nameEn: "Discrete Mathematics", credits: 3, lectureHours: 3, labHours: 0, selfStudyHours: 6, courseCategory: "GENERAL", year: 1, semester: 1 },
        { courseCode: "CPE201", nameTh: "โครงสร้างข้อมูลและขั้นตอนวิธี", nameEn: "Data Structures and Algorithms", credits: 3, lectureHours: 2, labHours: 2, selfStudyHours: 5, courseCategory: "CORE", year: 1, semester: 2 },
        { courseCode: "CPE301", nameTh: "สถาปัตยกรรมคอมพิวเตอร์และระบบปฏิบัติการ", nameEn: "Computer Architecture & Operating Systems", credits: 3, lectureHours: 3, labHours: 0, selfStudyHours: 6, courseCategory: "CORE", year: 2, semester: 1 },
        { courseCode: "CPE401", nameTh: "ระบบสมองกลฝังตัวและอินเทอร์เน็ตของสรรพสิ่ง", nameEn: "Embedded Systems & IoT", credits: 3, lectureHours: 2, labHours: 2, selfStudyHours: 5, courseCategory: "MAJOR_ELECTIVE", year: 3, semester: 1 },
      ],
    },
    {
      code: "B.Sc.-IT",
      degreeLevel: "BACHELOR",
      departmentCode: "IT",
      nameTh: "วิทยาศาสตรบัณฑิต สาขาวิชาเทคโนโลยีสารสนเทศ",
      nameEn: "Bachelor of Science in Information Technology",
      degreeNameTh: "วท.บ. (เทคโนโลยีสารสนเทศ)",
      degreeNameEn: "B.Sc. (Information Technology)",
      totalCredits: 126,
      durationYears: 4,
      tuitionFeePerTerm: 22000,
      descriptionTh: "หลักสูตรมุ่งเน้นการพัฒนา Full-Stack Web, โมบายแอปพลิเคชัน และระบบคลาวด์ ผสมผสานกับการออกแบบประสบการณ์ผู้ใช้ (UX/UI) ที่ตอบโจทย์ภาคธุรกิจดิจิทัล",
      descriptionEn: "Focused on modern full-stack web and mobile development, cloud architectures, and user experience (UX/UI) design tailored for the fast-growing tech industry.",
      careerPathsTh: "นักพัฒนาเว็บ/โมบาย (Full-stack Developer), นักออกแบบ UX/UI (UX/UI Designer), วิศวกรระบบและคลาวด์ (DevOps & Cloud Engineer)",
      careerPathsEn: "Full-Stack Developer, Frontend/Mobile Engineer, UX/UI Designer, Cloud Infrastructure Specialist",
      orderIndex: 2,
      courses: [
        { courseCode: "IT101", nameTh: "พื้นฐานเทคโนโลยีสารสนเทศและการเขียนโปรแกรม", nameEn: "IT Fundamentals & Programming", credits: 3, lectureHours: 2, labHours: 2, selfStudyHours: 5, courseCategory: "CORE", year: 1, semester: 1 },
        { courseCode: "IT201", nameTh: "การพัฒนาเว็บแอปพลิเคชันสมัยใหม่", nameEn: "Modern Web Application Development", credits: 3, lectureHours: 2, labHours: 2, selfStudyHours: 5, courseCategory: "CORE", year: 1, semester: 2 },
        { courseCode: "IT301", nameTh: "การออกแบบปฏิสัมพันธ์และประสบการณ์ผู้ใช้", nameEn: "Interaction & UX Design", credits: 3, lectureHours: 2, labHours: 2, selfStudyHours: 5, courseCategory: "CORE", year: 2, semester: 1 },
        { courseCode: "IT401", nameTh: "การบริหารจัดการคลาวด์และ DevOps", nameEn: "Cloud Computing & DevOps", credits: 3, lectureHours: 2, labHours: 2, selfStudyHours: 5, courseCategory: "MAJOR_ELECTIVE", year: 3, semester: 1 },
      ],
    },
    {
      code: "M.Sc.-AI",
      degreeLevel: "MASTER",
      departmentCode: "DSI",
      nameTh: "วิทยาศาสตรมหาบัณฑิต สาขาวิชาปัญญาประดิษฐ์และวิทยาการข้อมูล",
      nameEn: "Master of Science in Artificial Intelligence and Data Science",
      degreeNameTh: "วท.ม. (ปัญญาประดิษฐ์และวิทยาการข้อมูล)",
      degreeNameEn: "M.Sc. (Artificial Intelligence and Data Science)",
      totalCredits: 36,
      durationYears: 2,
      tuitionFeePerTerm: 45000,
      descriptionTh: "หลักสูตรระดับบัณฑิตศึกษาเพื่อผลิตผู้นำด้านวิจัยและประยุกต์ใช้ Generative AI, Machine Learning, Deep Learning และ Big Data Analytics เพื่อขับเคลื่อนอุตสาหกรรมแห่งอนาคต",
      descriptionEn: "Graduate program designed for researchers and advanced practitioners in Deep Learning, Generative AI, Natural Language Processing, and Big Data Engineering.",
      careerPathsTh: "นักวิทยาศาสตร์ข้อมูล (Data Scientist), วิศวกรปัญญาประดิษฐ์ (AI Engineer), นักวิจัยด้านการเรียนรู้เชิงลึก (Deep Learning Researcher), สถาปนิกข้อมูลขนาดใหญ่ (Big Data Architect)",
      careerPathsEn: "Data Scientist, Machine Learning / AI Engineer, GenAI Specialist, Data Science Lead",
      orderIndex: 3,
      courses: [
        { courseCode: "AI601", nameTh: "การเรียนรู้ของเครื่องขั้นสูง", nameEn: "Advanced Machine Learning", credits: 3, lectureHours: 3, labHours: 0, selfStudyHours: 6, courseCategory: "CORE", year: 1, semester: 1 },
        { courseCode: "AI602", nameTh: "การประมวลผลภาษาธรรมชาติและ GenAI", nameEn: "Natural Language Processing & GenAI", credits: 3, lectureHours: 2, labHours: 2, selfStudyHours: 5, courseCategory: "CORE", year: 1, semester: 2 },
        { courseCode: "AI701", nameTh: "วิทยานิพนธ์มหาบัณฑิต", nameEn: "Master's Thesis", credits: 12, lectureHours: 0, labHours: 0, selfStudyHours: 24, courseCategory: "CORE", year: 2, semester: 1 },
      ],
    },
  ];

  for (const progData of samplePrograms) {
    const { departmentCode, courses, ...rest } = progData;
    const departmentId = departmentCode ? deptMap.get(departmentCode) : undefined;

    const program = await prisma.curriculumProgram.upsert({
      where: {
        tenantId_code: {
          tenantId: core.tenantId,
          code: rest.code,
        },
      },
      update: {
        ...rest,
        departmentId,
      },
      create: {
        ...rest,
        tenantId: core.tenantId,
        departmentId,
      },
    });

    // Seed courses for this program
    for (const c of courses) {
      const existingCourse = await prisma.curriculumCourse.findFirst({
        where: {
          programId: program.id,
          courseCode: c.courseCode,
        },
      });

      if (existingCourse) {
        await prisma.curriculumCourse.update({
          where: { id: existingCourse.id },
          data: { ...c },
        });
      } else {
        await prisma.curriculumCourse.create({
          data: {
            ...c,
            tenantId: core.tenantId,
            programId: program.id,
          },
        });
      }
    }
  }

  // Seed sample edoc templates
  const sampleEdocTemplates = [
    {
      code: "REQ-GEN",
      nameTh: "คำร้องทั่วไป",
      nameEn: "General Petition / Request",
      category: "GENERAL",
      description: "แบบฟอร์มคำร้องทั่วไปสำหรับการติดต่อราชการและแจ้งความประสงค์ต่อคณะ",
      orderIndex: 1,
    },
    {
      code: "REQ-COURSE",
      nameTh: "คำร้องขอเปิดรายวิชาเพิ่มเติมหรือเพิ่มที่นั่ง",
      nameEn: "Course Section Open / Seat Increase Request",
      category: "ACADEMIC",
      description: "สำหรับนักศึกษาที่มีความประสงค์ขอเปิดกลุ่มเรียนเพิ่มหรือขอเพิ่มโควตาที่นั่งในรายวิชา",
      orderIndex: 2,
    },
    {
      code: "REQ-FEE",
      nameTh: "คำร้องขอผ่อนผันการชำระค่าธรรมเนียมการศึกษา",
      nameEn: "Tuition Fee Payment Deferral Request",
      category: "FINANCE",
      description: "คำร้องขอขยายเวลาชำระเงินค่าลงทะเบียนเรียนประจำภาคการศึกษา",
      orderIndex: 3,
    },
  ];

  let sampleTemplateId = "";
  for (const t of sampleEdocTemplates) {
    const tpl = await prisma.edocTemplate.upsert({
      where: { tenantId_code: { tenantId: core.tenantId, code: t.code } },
      update: { ...t },
      create: { ...t, tenantId: core.tenantId },
    });
    if (!sampleTemplateId) sampleTemplateId = tpl.id;
  }

  // Seed sample edoc request
  const existingReq = await prisma.edocRequest.findFirst({
    where: { tenantId: core.tenantId, trackingCode: "REQ-2026-DEMO" },
  });
  if (!existingReq) {
    await prisma.edocRequest.create({
      data: {
        tenantId: core.tenantId,
        templateId: sampleTemplateId,
        trackingCode: "REQ-2026-DEMO",
        requesterName: "นายวัชระ พัฒนาดี",
        requesterEmail: "watchara.p@mail.kmutt.ac.th",
        requesterPhone: "089-111-2233",
        requesterType: "STUDENT",
        studentOrStaffId: "66070501234",
        title: "ขอเปิดกลุ่มเรียนรายวิชา CPE301 สถาปัตยกรรมคอมพิวเตอร์ เพิ่มเติม",
        details: "เนื่องจากมีนักศึกษาชั้นปีที่ 3 จำนวน 15 คน ยังไม่สามารถลงทะเบียนได้เนื่องจากที่นั่งเต็ม และเป็นวิชาบังคับก่อนของภาคการศึกษาหน้า",
        status: "APPROVED",
        reviewerRemarks: "อนุมัติเปิดกลุ่มเรียน Sec 2 รับเพิ่ม 30 ที่นั่ง โดยประสานงานกับอาจารย์ผู้สอนเรียบร้อยแล้ว",
        reviewedById: adminUser?.id,
        reviewedAt: new Date(),
      },
    });
  }

  // Seed sample facilities
  const sampleFacilities = [
    {
      code: "CR-101",
      nameTh: "ห้องประชุมสุรนารี 1",
      nameEn: "Suranaree Meeting Room 1",
      type: "MEETING_ROOM",
      capacity: 25,
      location: "อาคาร 1 ชั้น 3",
      amenities: "Projector 4K, Video Conference Zoom Rooms, ไมโครโฟนไร้สาย, Whiteboard",
      orderIndex: 1,
    },
    {
      code: "LAB-201",
      nameTh: "ห้องปฏิบัติการปัญญาประดิษฐ์และระบบคลาวด์",
      nameEn: "AI & Cloud Computing Lab",
      type: "LAB",
      capacity: 40,
      location: "อาคาร 2 ชั้น 2",
      amenities: "40 เครื่องคอมพิวเตอร์ระดับสูง, GPU Server Access, จอภาพคู่, Wi-Fi 6E",
      orderIndex: 2,
    },
    {
      code: "AUD-01",
      nameTh: "หอประชุมนวัตกรรมดิจิทัล",
      nameEn: "Digital Innovation Auditorium",
      type: "AUDITORIUM",
      capacity: 200,
      location: "อาคารเรียนรวม ชั้น 1",
      amenities: "เวทีขนาดใหญ่, ไฟพาร์เวที, เครื่องเสียงคอนเสิร์ต, จอ LED Wall ขนาด 8x4 เมตร",
      orderIndex: 3,
    },
    {
      code: "VAN-01",
      nameTh: "รถตู้ส่วนกลางคณะ (Toyota Commuter)",
      nameEn: "Faculty Commuter Van #1",
      type: "VEHICLE",
      capacity: 12,
      location: "ทะเบียน 1นข-9999 กรุงเทพมหานคร",
      amenities: "เบาะ VIP 12 ที่นั่ง, ประกันภัยชั้น 1, GPS Tracking, กล้องหน้ารถ",
      orderIndex: 4,
    },
  ];

  for (const f of sampleFacilities) {
    await prisma.facilityItem.upsert({
      where: { tenantId_code: { tenantId: core.tenantId, code: f.code } },
      update: { ...f },
      create: { ...f, tenantId: core.tenantId },
    });
  }

  console.log(`[seed] เสร็จ — login: admin@app.local / ${DEV_PASSWORD}`);
}

main().finally(() => prisma.$disconnect());
