/* ═══════════════════════════════════════════════
   translations.js — bilingual content (fa / en)
   ═══════════════════════════════════════════════ */

const I18N = {
  fa: {
    meta: {
      title: "امیرعلی قربانی | برنامه‌نویس بک‌اند و یادگیری ماشین",
      desc: "رزومه تعاملی امیرعلی قربانی — برنامه‌نویس بک‌اند Python و .NET، یادگیری ماشین و اتوماسیون"
    },
    nav: {
      about: "درباره", skills: "مهارت‌ها", experience: "تجربه‌ها",
      projects: "پروژه‌ها", education: "تحصیلات", contact: "تماس"
    },
    hero: {
      greeting: "سلام دنیا! من",
      name: "امیرعلی قربانی",
      pitch: "بک‌اند را با Python و .NET می‌سازم؛ از تحلیل داده و یادگیری ماشین تا خودکارسازی فرایندها. ایده‌های نو را به محصول واقعی تبدیل می‌کنم.",
      ctaProjects: "مشاهده پروژه‌ها",
      ctaContact: "تماس با من",
      drag: "بکش و بچرخان!",
      scroll: "اسکرول کن",
      roles: ["برنامه‌نویس بک‌اند", "مهندس یادگیری ماشین", "توسعه‌دهنده Python", "توسعه‌دهنده .NET", "اتوماسیون‌ساز"]
    },
    about: {
      title: "درباره من",
      text1: "دانشجوی مهندسی کامپیوتر دانشگاه صنعتی سجاد و توسعه‌دهنده بک‌اند با تمرکز بر Python و .NET. از هنرستان سمپاد امیرکبیر جدی وارد دنیای برنامه‌نویسی شدم و از آن موقع از توسعه سرویس‌های بک‌اند و سامانه‌های ERP تا تحلیل داده و خودکارسازی با n8n را تجربه کرده‌ام.",
      text2: "هدف من ساده است: تبدیل ایده‌های نو به محصول واقعی؛ سریع، مرحله‌ای و با کیفیت.",
      status: "« آماده همکاری و پروژه جدید »",
      aiTitle: "هوش مصنوعی در جریان کار",
      aiText: "از ابزارهای هوش مصنوعی به‌عنوان بخشی از جریان کاری‌ام استفاده می‌کنم؛ از پیاده‌سازی و بازبینی کد تا خودکارسازی کارهای تکراری — برای تحویل مرحله‌ای و سریع‌تر پروژه‌ها.",
      flipHint: "↻ برای برگشتن، هاور کن"
    },
    carousel: {
      hint: "↻ بچرخونش کن!"
    },
    alt: {
      profile: "امیرعلی قربانی"
    },
    info: {
      location: "موقعیت", locationVal: "مشهد، ایران",
      age: "سن", ageVal: "۲۰", years: "سال",
      email: "ایمیل", phone: "تلفن"
    },
    stats: {
      years: "سال کدنویسی", projects: "پروژه واقعی",
      teams: "تیم و شرکت", tech: "تکنولوژی و ابزار"
    },
    skills: {
      title: "مهارت‌ها",
      backend: "بک‌اند", data: "داده و یادگیری ماشین",
      frontend: "فرانت‌اند", tools: "ابزار و دواپس"
    },
    exp: {
      title: "تجربه‌ها",
      1: {
        role: "برنامه‌نویس بک‌اند و یادگیری ماشین",
        period: "مهر ۱۴۰۴ — اکنون",
        company: "دایرکت · زیرمجموعه هلدینگ اثر فرا ارتباط · مشهد",
        desc: "نزدیک به یک سال است که در تیم دایرکت روی چند پروژه محصولی و داخلی کار می‌کنم؛ از توسعه سرویس‌های بک‌اند تا تحلیل داده و خودکارسازی فرایندها."
      },
      2: {
        role: "توسعه‌دهنده وردپرس (دورکاری)",
        period: "حدود ۶ ماه · ریموت",
        company: "ورای ارتباط · دورکاری",
        desc: "روی پروژه‌های وردپرسی از پیاده‌سازی و شخصی‌سازی قالب تا رفع اشکال و بهینه‌سازی کار کردم. دو افزونه اختصاصی هم توسعه دادم: تکثیر پست و برگه، و Lazy Load برای بهبود سرعت صفحات."
      },
      3: {
        role: "برنامه‌نویس",
        period: "خرداد ۱۴۰۳ — آبان ۱۴۰۳",
        company: "مبنا رایانه کیان · مشهد",
        desc: "با دوره کارآموزی شروع کردم و سپس به صورت نیمه‌وقت و فریلنسری روی پروژه‌های مجموعه ادامه دادم؛ شامل سامانه Digital Signage با ارتباط Real-time."
      },
      4: {
        role: "تولید محتوا",
        period: "آبان ۱۴۰۳ — آذر ۱۴۰۳",
        company: "گروه تین تک · مشهد",
        desc: "در یک تیم کوچک با کمک هوش مصنوعی، فرایند تولید محتوا را از صفر تا خروجی نهایی سریع‌تر و منظم‌تر کردیم."
      }
    },
    proj: {
      title: "پروژه‌ها",
      1: { sub: "داده‌کاوی و تحلیل داده", desc: "سامانه تحلیل دیتابیس میلیونی؛ بک‌اند با Python و FastAPI پیاده‌سازی شد." },
      2: { sub: "اتوماسیون فرایندهای سازمانی", desc: "سامانه ERP با .NET برای یکپارچه‌سازی و خودکارسازی فرایندها؛ نسخه اولیه در حدود دو هفته تحویل شد." },
      3: { sub: "طراحی و پیاده‌سازی وب‌سایت", desc: "راه‌اندازی mahancctv.com و pneutoos.com با شخصی‌سازی قالب و بهینه‌سازی عملکرد." },
      4: { sub: "افزونه‌های اختصاصی وردپرس", desc: "دو افزونه با PHP: تکثیر پست و برگه برای تیم محتوا + Lazy Load برای بارگذاری تنبل تصاویر." },
      5: { sub: "ارزیابی خودکار تماس‌ها", desc: "جریان ارزیابی تماس‌ها با n8n و هوش مصنوعی برای بررسی سریع‌تر و منظم‌تر کیفیت مکالمه‌ها." },
      6: { sub: "مدیریت محتوای نمایشگرها", desc: "سامانه مدیریت نمایشگرها با ارتباط Real-time و استریم ویدئو — برج آرمیتاژ و هتل قدس." }
    },
    edu: {
      title: "تحصیلات",
      1: {
        status: "در حال تحصیل", school: "دانشگاه صنعتی سجاد · مشهد",
        degree: "مهندسی کامپیوتر · کارشناسی",
        desc: "چیزهایی که یاد می‌گیرم را هم‌زمان در پروژه‌های واقعی به کار می‌گیرم."
      },
      2: {
        status: "فارغ‌التحصیل", school: "هنرستان سمپاد امیرکبیر · مشهد",
        degree: "شبکه و نرم‌افزار رایانه",
        desc: "از همین‌جا جدی‌تر وارد دنیای برنامه‌نویسی شدم و پایه مهارت‌های فنی‌ام را ساختم."
      }
    },
    contact: {
      title: "تماس",
      lead: "برای پروژه، همکاری یا حتی یک گفت‌وگوی فنی — یک پیام کافی است.",
      email: "ایمیل", telegram: "تلگرام", phone: "تلفن", web: "وب‌سایت"
    },
    footer: {
      rights: "© ۲۰۲۶ امیرعلی قربانی — ساخته‌شده با HTML / CSS / JS خالص"
    }
  },

  en: {
    meta: {
      title: "Amirali Ghorbani | Backend & ML Developer",
      desc: "Interactive resume of Amirali Ghorbani — Python & .NET backend developer, machine learning and automation"
    },
    nav: {
      about: "About", skills: "Skills", experience: "Experience",
      projects: "Projects", education: "Education", contact: "Contact"
    },
    hero: {
      greeting: "Hello, World! I'm",
      name: "Amirali Ghorbani",
      pitch: "I build backends with Python and .NET — from data analysis and machine learning to process automation. Turning fresh ideas into real products.",
      ctaProjects: "View Projects",
      ctaContact: "Contact Me",
      drag: "drag & spin!",
      scroll: "scroll",
      roles: ["Backend Developer", "ML Engineer", "Python Developer", ".NET Developer", "Automation Builder"]
    },
    about: {
      title: "About Me",
      text1: "Computer Engineering student at Sadjad University of Technology and a backend developer focused on Python and .NET. My journey got serious at Sampad Amirkabir technical school — since then I've worked on everything from backend services and ERP systems to data analysis and n8n automation.",
      text2: "My goal is simple: turning fresh ideas into real products — fast, iterative, and with quality.",
      status: '" open to work & new projects "',
      aiTitle: "AI in My Workflow",
      aiText: "I use AI tools as a natural part of my workflow — from implementation and code review to automating repetitive tasks — enabling faster, iterative delivery.",
      flipHint: "↻ hover to flip"
    },
    carousel: {
      hint: "↻ drag to spin"
    },
    alt: {
      profile: "Amirali Ghorbani"
    },
    info: {
      location: "Location", locationVal: "Mashhad, Iran",
      age: "Age", ageVal: "20", years: "years",
      email: "Email", phone: "Phone"
    },
    stats: {
      years: "Years of Coding", projects: "Real Projects",
      teams: "Teams & Companies", tech: "Technologies & Tools"
    },
    skills: {
      title: "Skills",
      backend: "Backend", data: "Data & Machine Learning",
      frontend: "Frontend", tools: "DevOps & Tools"
    },
    exp: {
      title: "Experience",
      1: {
        role: "Backend & ML Developer",
        period: "Oct 2025 — Present",
        company: "Direct · Asar Fara Ertebat Holding · Mashhad",
        desc: "Nearly a year on the Direct team, working on several product and internal projects — from backend services to data analysis and process automation."
      },
      2: {
        role: "WordPress Developer (Remote)",
        period: "≈ 6 months · Remote",
        company: "Varay Ertebat · Remote",
        desc: "Worked remotely on WordPress projects — theme implementation and customization, debugging and optimization. Also built two custom plugins: Post/Page Duplicator and Lazy Load."
      },
      3: {
        role: "Programmer",
        period: "Jun 2024 — Nov 2024",
        company: "Mobna Rayaneh Kian · Mashhad",
        desc: "Started with an internship, then continued part-time and freelance on the company's projects — including a Real-time Digital Signage system."
      },
       4: {
        role: "Content Producer",
        period: "Nov 2024 — Dec 2024",
        company: "Teen Tech Group · Mashhad",
        desc: "In a small team, leveraged AI to make content production faster and more organized — from zero to final output."
      }
    },
    proj: {
      title: "Projects",
      1: { sub: "Data Mining & Analytics", desc: "Analytics system for a million-row database; backend implemented with Python and FastAPI." },
      2: { sub: "Business Process Automation", desc: "A .NET ERP system integrating and automating organizational processes; first usable version delivered in ~2 weeks." },
      3: { sub: "Website Design & Build", desc: "Built mahancctv.com and pneutoos.com with custom themes and performance optimization." },
      4: { sub: "Custom WordPress Plugins", desc: "Two PHP plugins: Post/Page Duplicator for the content team + Lazy Load for faster image loading." },
      5: { sub: "Automated Call Evaluation", desc: "Call-evaluation pipeline built with n8n and AI for faster, more consistent quality review." },
      6: { sub: "Display Content Management", desc: "Real-time display management with video streaming — Armitaj Tower & Qods Hotel." }
    },
    edu: {
      title: "Education",
      1: {
        status: "Currently Studying", school: "Sadjad University of Technology · Mashhad",
        degree: "B.Sc. Computer Engineering",
        desc: "I apply what I learn in real-world projects as I study."
      },
      2: {
        status: "Graduated", school: "Sampad Amirkabir Technical School · Mashhad",
        degree: "Computer Networks & Software",
        desc: "Where I got serious about programming and built my technical foundation."
      }
    },
    contact: {
      title: "Contact",
      lead: "For a project, a collaboration, or just a tech talk — one message is enough.",
      email: "Email", telegram: "Telegram", phone: "Phone", web: "Website"
    },
    footer: {
      rights: "© 2026 Amirali Ghorbani — built with pure HTML / CSS / JS"
    }
  }
};

/* ── language application ─────────────────────────── */
function t(key) {
  return key.split('.').reduce((o, k) => (o || {})[k], I18N[CURRENT_LANG]);
}

let CURRENT_LANG = 'fa';

function applyLanguage(lang) {
  CURRENT_LANG = lang;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const v = t(el.dataset.i18n);
    if (v !== undefined) el.textContent = v;
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const v = t(el.dataset.i18nHtml);
    if (v !== undefined) el.innerHTML = v;
  });
  document.querySelectorAll('[data-i18n-alt]').forEach(el => {
    const v = t(el.dataset.i18nAlt);
    if (v !== undefined) el.setAttribute('alt', v);
  });
  /* glitch layers mirror the visible text */
  document.querySelectorAll('[data-glitch]').forEach(el => {
    el.dataset.text = el.textContent;
  });

  document.title = t('meta.title');
  const md = document.querySelector('meta[name="description"]');
  if (md) md.setAttribute('content', t('meta.desc'));

  /* toggle UI */
  document.querySelectorAll('.lang-opt').forEach(o =>
    o.classList.toggle('active', o.dataset.lang === lang));
  const thumb = document.querySelector('.lang-thumb');
  if (thumb) thumb.classList.toggle('pos-en', lang === 'en'),
               thumb.classList.toggle('pos-fa', lang === 'fa');

  try { localStorage.setItem('resume-lang', lang); } catch (e) {}
  if (typeof window.__onLanguageChange === 'function') window.__onLanguageChange(lang);
}
