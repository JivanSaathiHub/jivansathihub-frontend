// ── Static fallback data ─────────────────────────────────────────
// Used by: FeaturedProfiles (homepage) + SearchPage (default / not logged in)

export const profiles = [
  {
    id: 1, name: "Priya Sharma",   age: 25, job: "Software Engineer",    city: "Mumbai",    state: "Maharashtra",  badge: "New",
    gender: "Bride", height: "5'5\"", motherTongue: "Marathi",
    education: "B.Tech in Computer Science", verified: false,
    photo: `https://randomuser.me/api/portraits/women/44.jpg`,
  },
  {
    id: 2, name: "Rahul Verma",    age: 29, job: "Marketing Manager",    city: "Bangalore", state: "Karnataka",    badge: "Premium",
    gender: "Groom", height: "5'10\"", motherTongue: "Hindi",
    education: "MBA Marketing", verified: true,
    photo: `https://randomuser.me/api/portraits/men/32.jpg`,
  },
  {
    id: 3, name: "Ananya Patel",   age: 25, job: "Doctor (MBBS)",        city: "Pune",      state: "Maharashtra",  badge: "New",
    gender: "Bride", height: "5'4\"", motherTongue: "Gujarati",
    education: "MBBS, MD", verified: true,
    photo: `https://randomuser.me/api/portraits/women/68.jpg`,
  },
  {
    id: 4, name: "Arjun Mehta",    age: 31, job: "Architect",            city: "Delhi",     state: "NCR",          badge: "Groom",
    gender: "Groom", height: "5'11\"", motherTongue: "Hindi",
    education: "B.Arch", verified: false,
    photo: `https://randomuser.me/api/portraits/men/54.jpg`,
  },
  {
    id: 5, name: "Sneha Shetty",   age: 27, job: "Chartered Accountant", city: "Mumbai",    state: "Maharashtra",  badge: "New",
    gender: "Bride", height: "5'3\"", motherTongue: "Kannada",
    education: "CA", verified: true,
    photo: `https://randomuser.me/api/portraits/women/21.jpg`,
  },
  {
    id: 6, name: "Vikram Singh",   age: 28, job: "IT Engineer",          city: "Jaipur",    state: "Rajasthan",    badge: "Groom",
    gender: "Groom", height: "5'9\"", motherTongue: "Hindi",
    education: "B.Tech in IT", verified: false,
    photo: `https://randomuser.me/api/portraits/men/76.jpg`,
  },
];

// ── Local image map (used by FeaturedProfiles on homepage only) ──
export const profileImages = {
  1: "/images/bride1.png",
  2: "/images/groom1.png",
  3: "/images/bride2.png",
  4: "/images/groom2.png",
  5: "/images/bride3.png",
  6: "/images/groom3.png",
};

export const steps = [
  { icon: "👤", title: "Create Profile", desc: "Register for free and create your detailed profile with photos and preferences." },
  { icon: "🔍", title: "Search Matches", desc: "Search through thousands of verified profiles matching your preferences."       },
  { icon: "💬", title: "Connect & Chat", desc: "Express interest and start meaningful conversations with potential matches."     },
];

// ── Plans — features stored per language so no i18n key lookup needed ────────
export const plans = [
  {
    name:    "Free Plan",
    price:   "₹0",
    period:  "Forever",
    icon:    "⭐",
    color:   "free",
    popular: false,
    comingSoon: false,
    cta: "Get Started",
    // features keyed by i18n language code
    featuresByLang: {
      en: [
        "Create basic profile",
        "Search profiles",
        "Send 5 interests per day",
        "View limited profiles",
      ],
      hi: [
        "बेसिक प्रोफ़ाइल बनाएँ",
        "प्रोफ़ाइल खोजें",
        "प्रतिदिन 5 रुचियाँ भेजें",
        "सीमित प्रोफ़ाइल देखें",
      ],
      mr: [
        "मूलभूत प्रोफाइल तयार करा",
        "प्रोफाइल शोधा",
        "दररोज 5 इंटरेस्ट पाठवा",
        "मर्यादित प्रोफाइल पहा",
      ],
    },
    // fallback — used by anything that still reads plan.features
    features: [
      "Create basic profile",
      "Search profiles",
      "Send 5 interests per day",
      "View limited profiles",
    ],
  },
  {
    name:    "Premium Plan",
    price:   "₹2,999",
    period:  "6 months",
    icon:    "⚡",
    color:   "premium",
    popular: true,
    comingSoon: true,
    cta: "Coming Soon",
    featuresByLang: {
      en: [
        "All Free features",
        "Unlimited matches",
        "Send unlimited messages",
        "View all contact details",
        "Priority chat support",
        "Featured profile listing",
        "Advanced matching algorithm",
      ],
      hi: [
        "सभी मुफ़्त सुविधाएँ",
        "असीमित मैचेज़",
        "असीमित मैसेज भेजें",
        "सभी संपर्क विवरण देखें",
        "प्राथमिकता चैट सहायता",
        "फ़ीचर्ड प्रोफ़ाइल लिस्टिंग",
        "उन्नत मैचिंग एल्गोरिदम",
      ],
      mr: [
        "सर्व मोफत सुविधा",
        "अमर्यादित मॅचेस",
        "अमर्यादित संदेश पाठवा",
        "सर्व संपर्क तपशील पहा",
        "प्राधान्य चॅट सहाय्य",
        "फीचर्ड प्रोफाइल लिस्टिंग",
        "प्रगत मॅचिंग अल्गोरिदम",
      ],
    },
    features: [
      "All Free features",
      "Unlimited matches",
      "Send unlimited messages",
      "View all contact details",
      "Priority chat support",
      "Featured profile listing",
      "Advanced matching algorithm",
    ],
  },
  {
    name:    "Elite Plan",
    price:   "₹9,999",
    period:  "12 months",
    icon:    "👑",
    color:   "elite",
    popular: false,
    comingSoon: true,
    cta: "Coming Soon",
    featuresByLang: {
      en: [
        "All Premium features",
        "Dedicated relationship manager",
        "Profile verification badge",
        "Top search results placement",
        "Personal recommendations",
        "Video call feature",
        "Privacy controls",
        "Bio-matching feature",
      ],
      hi: [
        "सभी प्रीमियम सुविधाएँ",
        "समर्पित रिलेशनशिप मैनेजर",
        "प्रोफ़ाइल वेरिफिकेशन बैज",
        "शीर्ष खोज परिणाम स्थान",
        "व्यक्तिगत सिफारिशें",
        "वीडियो कॉल सुविधा",
        "गोपनीयता नियंत्रण",
        "बायो-मैचिंग सुविधा",
      ],
      mr: [
        "सर्व प्रीमियम सुविधा",
        "समर्पित रिलेशनशिप मॅनेजर",
        "प्रोफाइल व्हेरिफिकेशन बॅज",
        "शीर्ष शोध निकालांमध्ये स्थान",
        "वैयक्तिक शिफारशी",
        "व्हिडिओ कॉल सुविधा",
        "गोपनीयता नियंत्रण",
        "बायो-मॅचिंग सुविधा",
      ],
    },
    features: [
      "All Premium features",
      "Dedicated relationship manager",
      "Profile verification badge",
      "Top search results placement",
      "Personal recommendations",
      "Video call feature",
      "Privacy controls",
      "Bio-matching feature",
    ],
  },
];

export const trustPoints = [
  { icon: "/container17.png",  title: "Verified Profiles",    desc: "All profiles go through a rigorous verification process to ensure safety and authenticity." },
  { icon: "/Container18.png",  title: "Privacy Protection",   desc: "Your personal information is completely protected with absolute data security."             },
  { icon: "/Container19.png",  title: "Secure Communication", desc: "Our chat is enabled with privacy controls and a secure messaging system."                   },
  { icon: "/Container20.png",  title: "Profile Screening",    desc: "Our team manually reviews profiles to ensure match quality and authenticity."               },
];

export const profileOptions = ["Self", "Son", "Daughter", "Brother", "Sister", "Friend", "Relative"];
export const genderOptions   = ["Male", "Female", "Other"];