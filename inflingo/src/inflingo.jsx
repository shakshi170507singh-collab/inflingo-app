import { useState } from "react";

const COURSES = ["BCA", "MCA", "MBA", "B.Sc", "B.A", "BBA", "B.Com", "M.Com", "M.A", "M.Sc"];
const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

const NOTICES = [
  {
    id: 1, title: "Library extended hours during exams",
    body: "The central library will extend its operating hours from 8 AM to midnight, starting next Monday and continuing through the end of exams. Students are requested to carry their ID cards.",
    category: "Academics", author: "Library", date: "Jun 17",
    targetCourses: ["B.Tech", "BCA", "MCA", "MBA", "B.Sc", "M.Tech", "BBA", "B.Com"],
    targetYears: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
  },
  {
    id: 2, title: "End Semester Exam Schedule Released",
    body: "The end semester exam schedule for B.Sc 3rd year has been released. Students can download their hall tickets from the student portal.",
    category: "Exams", author: "Exam Cell", date: "Jun 18",
    targetCourses: ["B.Tech"], targetYears: ["3rd Year"],
  },
  {
    id: 3, title: "Campus Placement Drive – TCS",
    body: "TCS will be conducting a placement drive for final year students. Eligible branches: CSE, IT, ECE. Register before June 25.",
    category: "Placements", author: "Placement Cell", date: "Jun 19",
    targetCourses: ["B.Sc", "M.Sc"], targetYears: ["4th Year"],
  },
  {
    id: 4, title: "Cultural Fest Registrations Open",
    body: "Registrations for the annual cultural fest are now open. All students are welcome to participate. Last date: July 5.",
    category: "Events", author: "Student Council", date: "Jun 20",
    targetCourses: ["BCA", "MCA", "MBA", "B.Sc", "M.Tech", "BBA", "B.Com"],
    targetYears: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
  },
  {
    id: 5, title: "MCA Semester 2 Results Declared",
    body: "Results for MCA Semester 2 have been declared. Students can check their results on the university portal.",
    category: "Academics", author: "Academics Office", date: "Jun 21",
    targetCourses: ["MCA"], targetYears: ["1st Year"],
  },
];

const CATEGORY_COLORS = {
  Academics: { bg: "#EEF2FF", text: "#4338CA", dot: "#6366F1" },
  Exams: { bg: "#FEF3C7", text: "#92400E", dot: "#F59E0B" },
  Placements: { bg: "#DCFCE7", text: "#166534", dot: "#22C55E" },
  Events: { bg: "#FCE7F3", text: "#9D174D", dot: "#EC4899" },
};

const CATEGORY_ICONS = {
  Academics: "🎓", Exams: "📋", Placements: "💼", Events: "🎉",
};

export default function Inflingo() {
  const [screen, setScreen] = useState("role"); // role | setup | home | category | notice | post
  const [role, setRole] = useState(null);
  const [profile, setProfile] = useState({ name: "", course: "", year: "" });
  const [setupStep, setSetupStep] = useState(0); // 0=name, 1=course, 2=year
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [saved, setSaved] = useState([]);
  const [postForm, setPostForm] = useState({ title: "", body: "", category: "Academics", targetCourses: [], targetYears: [] });
  const [adminNotices, setAdminNotices] = useState([]);
  const [navTab, setNavTab] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [postedSuccess, setPostedSuccess] = useState(false);

  const allNotices = [...NOTICES, ...adminNotices];

  const filteredNotices = allNotices.filter(n => {
    const matchCat = activeCategory === "All" || n.category === activeCategory;
    const matchSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.body.toLowerCase().includes(searchQuery.toLowerCase());
    if (role === "student") {
      const matchCourse = n.targetCourses.includes(profile.course);
      const matchYear = n.targetYears.includes(profile.year);
      return matchCat && matchSearch && matchCourse && matchYear;
    }
    return matchCat && matchSearch;
  });

  const savedNotices = allNotices.filter(n => saved.includes(n.id));

  const toggleSave = (id) => {
    setSaved(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  };

  const handlePost = () => {
    if (!postForm.title || !postForm.body) return;
    const newNotice = {
      id: Date.now(), ...postForm,
      author: "Admin", date: "Jun 26",
      targetCourses: postForm.targetCourses.length ? postForm.targetCourses : COURSES,
      targetYears: postForm.targetYears.length ? postForm.targetYears : YEARS,
    };
    setAdminNotices(prev => [newNotice, ...prev]);
    setPostForm({ title: "", body: "", category: "Academics", targetCourses: [], targetYears: [] });
    setPostedSuccess(true);
    setTimeout(() => { setPostedSuccess(false); setNavTab("home"); }, 1800);
  };

  const toggleArr = (arr, val, setter) => {
    setter(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);
  };

  // ─── SCREENS ────────────────────────────────────────────────────

  if (screen === "role") return (
    <div style={styles.page}>
      <div style={styles.roleCard}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>📋</span>
          <span style={styles.logoText}>Inflingo</span>
        </div>
        <p style={styles.tagline}>Never miss an update</p>
        <p style={{ color: "#64748B", fontSize: 14, marginBottom: 32, textAlign: "center" }}>
          Tell us how you'll use Inflingo
        </p>

        <div style={styles.roleOptions}>
          <button style={styles.roleBtn} onClick={() => { setRole("student"); setScreen("setup"); }}>
            <span style={styles.roleEmoji}>🎓</span>
            <div>
              <div style={styles.roleName}>I'm a Student</div>
              <div style={styles.roleDesc}>Receive notices filtered for your course & year</div>
            </div>
            <span style={styles.arrow}>›</span>
          </button>
          <button style={styles.roleBtn} onClick={() => { setRole("admin"); setScreen("home"); }}>
            <span style={styles.roleEmoji}>📢</span>
            <div>
              <div style={styles.roleName}>I'm an Admin</div>
              <div style={styles.roleDesc}>Post and manage notices for students</div>
            </div>
            <span style={styles.arrow}>›</span>
          </button>
        </div>
      </div>
    </div>
  );

  if (screen === "setup") return (
    <div style={styles.page}>
      <div style={styles.setupCard}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
          <button onClick={() => setupStep === 0 ? setScreen("role") : setSetupStep(s => s - 1)} style={styles.backBtn}>‹</button>
          <div style={styles.progressBar}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ ...styles.progressDot, background: i <= setupStep ? "#4F46E5" : "#E2E8F0" }} />
            ))}
          </div>
        </div>

        {setupStep === 0 && (
          <>
            <h2 style={styles.setupTitle}>What's your name?</h2>
            <p style={styles.setupSub}>We'll personalise your experience</p>
            <input
              style={styles.input}
              placeholder="Enter your name"
              value={profile.name}
              onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
            />
            <button
              style={{ ...styles.primaryBtn, opacity: profile.name ? 1 : 0.4 }}
              disabled={!profile.name}
              onClick={() => setSetupStep(1)}
            >Continue</button>
          </>
        )}

        {setupStep === 1 && (
          <>
            <h2 style={styles.setupTitle}>Your Course</h2>
            <p style={styles.setupSub}>Select the course you're enrolled in</p>
            <div style={styles.chipGrid}>
              {COURSES.map(c => (
                <button
                  key={c}
                  style={{ ...styles.chip, ...(profile.course === c ? styles.chipActive : {}) }}
                  onClick={() => setProfile(p => ({ ...p, course: c }))}
                >{c}</button>
              ))}
            </div>
            <button
              style={{ ...styles.primaryBtn, marginTop: 24, opacity: profile.course ? 1 : 0.4 }}
              disabled={!profile.course}
              onClick={() => setSetupStep(2)}
            >Continue</button>
          </>
        )}

        {setupStep === 2 && (
          <>
            <h2 style={styles.setupTitle}>Your Year</h2>
            <p style={styles.setupSub}>We'll show notices relevant to you</p>
            <div style={styles.chipGrid}>
              {YEARS.map(y => (
                <button
                  key={y}
                  style={{ ...styles.chip, ...(profile.year === y ? styles.chipActive : {}) }}
                  onClick={() => setProfile(p => ({ ...p, year: y }))}
                >{y}</button>
              ))}
            </div>
            <button
              style={{ ...styles.primaryBtn, marginTop: 24, opacity: profile.year ? 1 : 0.4 }}
              disabled={!profile.year}
              onClick={() => setScreen("home")}
            >Get Started 🎉</button>
          </>
        )}
      </div>
    </div>
  );

  if (screen === "notice" && selectedNotice) {
    const n = selectedNotice;
    const c = CATEGORY_COLORS[n.category] || CATEGORY_COLORS.Academics;
    return (
      <div style={styles.app}>
        <div style={styles.noticeHeader}>
          <button onClick={() => setScreen("home")} style={styles.backBtnWhite}>‹ Back</button>
          <button onClick={() => toggleSave(n.id)} style={styles.saveIconBtn}>
            {saved.includes(n.id) ? "🔖" : "🔖"}
            <span style={{ fontSize: 11, color: saved.includes(n.id) ? "#4F46E5" : "#94A3B8" }}>
              {saved.includes(n.id) ? "Saved" : "Save"}
            </span>
          </button>
        </div>
        <div style={{ padding: "20px 20px 100px" }}>
          <span style={{ ...styles.categoryBadge, background: c.bg, color: c.text }}>{CATEGORY_ICONS[n.category]} {n.category}</span>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", marginTop: 12, lineHeight: 1.3 }}>{n.title}</h1>
          <div style={styles.noticeMeta}>
            <span>Posted by <b>{n.author}</b></span>
            <span>·</span>
            <span>{n.date}</span>
          </div>
          <div style={styles.divider} />
          <p style={{ color: "#334155", lineHeight: 1.8, fontSize: 15 }}>{n.body}</p>
          <div style={styles.targetTags}>
            <span style={styles.targetTag}>👥 {n.targetCourses.length === COURSES.length ? "All Courses" : n.targetCourses.join(", ")}</span>
            <span style={styles.targetTag}>📅 {n.targetYears.length === YEARS.length ? "All Years" : n.targetYears.join(", ")}</span>
          </div>
        </div>
      </div>
    );
  }

  // Main app
  const categoryCounts = { All: allNotices.length };
  ["Academics", "Exams", "Events", "Placements"].forEach(cat => {
    categoryCounts[cat] = allNotices.filter(n => n.category === cat).length;
  });

  return (
    <div style={styles.app}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.logoText}>Inflingo</span>
          {role === "student" && (
            <span style={styles.profilePill}>{profile.course} · {profile.year}</span>
          )}
          {role === "admin" && <span style={styles.adminBadge}>Admin</span>}
        </div>
        <button onClick={() => setScreen("role")} style={styles.logoutBtn}>Log out</button>
      </div>

      {/* Content */}
      {navTab === "home" && (
        <div style={styles.scroll}>
          <div style={{ padding: "20px 20px 0" }}>
            {role === "student" && (
              <div style={styles.greetCard}>
                <div>
                  <div style={{ fontSize: 13, color: "#94A3B8" }}>Welcome back 👋</div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: "#0F172A" }}>{profile.name || "Student"}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#4F46E5" }}>{filteredNotices.length}</div>
                  <div style={{ fontSize: 11, color: "#64748B" }}>notices for you</div>
                </div>
              </div>
            )}

            <input
              style={styles.searchBar}
              placeholder="🔍  Search notices..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />

            {/* Categories */}
            <div style={styles.catScroll}>
              {["All", "Academics", "Exams", "Events", "Placements"].map(cat => (
                <button
                  key={cat}
                  style={{ ...styles.catChip, ...(activeCategory === cat ? styles.catChipActive : {}) }}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat !== "All" && CATEGORY_ICONS[cat] + " "}{cat}
                  <span style={{ ...styles.catCount, ...(activeCategory === cat ? { color: "#fff", background: "rgba(255,255,255,0.25)" } : {}) }}>
                    {categoryCounts[cat] || 0}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Notices */}
          <div style={{ padding: "12px 20px 100px" }}>
            {filteredNotices.length === 0 ? (
              <div style={styles.empty}>
                <div style={{ fontSize: 40 }}>📭</div>
                <div style={{ fontWeight: 600, color: "#334155", marginTop: 8 }}>No notices found</div>
                <div style={{ color: "#94A3B8", fontSize: 13, marginTop: 4 }}>Try a different filter or check back later</div>
              </div>
            ) : filteredNotices.map(n => {
              const c = CATEGORY_COLORS[n.category] || CATEGORY_COLORS.Academics;
              return (
                <div key={n.id} style={styles.noticeCard} onClick={() => { setSelectedNotice(n); setScreen("notice"); }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <span style={{ ...styles.categoryBadge, background: c.bg, color: c.text, fontSize: 11 }}>
                      {CATEGORY_ICONS[n.category]} {n.category}
                    </span>
                    <button style={styles.saveSmall} onClick={e => { e.stopPropagation(); toggleSave(n.id); }}>
                      {saved.includes(n.id) ? "🔖" : "🔖"}
                    </button>
                  </div>
                  <h3 style={styles.noticeTitle}>{n.title}</h3>
                  <p style={styles.noticePreview}>{n.body.slice(0, 90)}...</p>
                  <div style={styles.noticeFoot}>
                    <span style={styles.authorChip}>{n.author}</span>
                    <span style={{ color: "#94A3B8", fontSize: 12 }}>{n.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {navTab === "saved" && (
        <div style={styles.scroll}>
          <div style={{ padding: "20px 20px 100px" }}>
            <h2 style={styles.pageTitle}>Saved Notices</h2>
            {savedNotices.length === 0 ? (
              <div style={styles.empty}>
                <div style={{ fontSize: 40 }}>🔖</div>
                <div style={{ fontWeight: 600, color: "#334155", marginTop: 8 }}>Nothing saved yet</div>
                <div style={{ color: "#94A3B8", fontSize: 13, marginTop: 4 }}>Bookmark notices to find them here</div>
              </div>
            ) : savedNotices.map(n => {
              const c = CATEGORY_COLORS[n.category] || CATEGORY_COLORS.Academics;
              return (
                <div key={n.id} style={styles.noticeCard} onClick={() => { setSelectedNotice(n); setScreen("notice"); }}>
                  <span style={{ ...styles.categoryBadge, background: c.bg, color: c.text, fontSize: 11 }}>
                    {CATEGORY_ICONS[n.category]} {n.category}
                  </span>
                  <h3 style={styles.noticeTitle}>{n.title}</h3>
                  <p style={styles.noticePreview}>{n.body.slice(0, 90)}...</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {navTab === "post" && role === "admin" && (
        <div style={styles.scroll}>
          <div style={{ padding: "20px 20px 100px" }}>
            <h2 style={styles.pageTitle}>Post a Notice</h2>

            {postedSuccess && (
              <div style={styles.successBanner}>✅ Notice posted successfully!</div>
            )}

            <label style={styles.label}>Title</label>
            <input style={styles.input} placeholder="Notice title" value={postForm.title}
              onChange={e => setPostForm(p => ({ ...p, title: e.target.value }))} />

            <label style={styles.label}>Message</label>
            <textarea style={{ ...styles.input, height: 100, resize: "none" }}
              placeholder="Write the notice content..."
              value={postForm.body}
              onChange={e => setPostForm(p => ({ ...p, body: e.target.value }))} />

            <label style={styles.label}>Category</label>
            <div style={styles.chipGrid}>
              {["Academics", "Exams", "Events", "Placements"].map(c => (
                <button key={c} style={{ ...styles.chip, ...(postForm.category === c ? styles.chipActive : {}) }}
                  onClick={() => setPostForm(p => ({ ...p, category: c }))}>
                  {CATEGORY_ICONS[c]} {c}
                </button>
              ))}
            </div>

            <label style={styles.label}>Target Courses <span style={{ color: "#94A3B8", fontWeight: 400 }}>(leave blank = all)</span></label>
            <div style={styles.chipGrid}>
              {COURSES.map(c => (
                <button key={c}
                  style={{ ...styles.chip, ...(postForm.targetCourses.includes(c) ? styles.chipActive : {}) }}
                  onClick={() => toggleArr(postForm.targetCourses, c, arr => setPostForm(p => ({ ...p, targetCourses: arr })))}>
                  {c}
                </button>
              ))}
            </div>

            <label style={styles.label}>Target Years <span style={{ color: "#94A3B8", fontWeight: 400 }}>(leave blank = all)</span></label>
            <div style={styles.chipGrid}>
              {YEARS.map(y => (
                <button key={y}
                  style={{ ...styles.chip, ...(postForm.targetYears.includes(y) ? styles.chipActive : {}) }}
                  onClick={() => toggleArr(postForm.targetYears, y, arr => setPostForm(p => ({ ...p, targetYears: arr })))}>
                  {y}
                </button>
              ))}
            </div>

            <button style={{ ...styles.primaryBtn, marginTop: 24, opacity: (postForm.title && postForm.body) ? 1 : 0.4 }}
              disabled={!postForm.title || !postForm.body}
              onClick={handlePost}>
              📢 Post Notice
            </button>
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <div style={styles.bottomNav}>
        <button style={styles.navBtn} onClick={() => setNavTab("home")}>
          <span style={{ fontSize: 20 }}>🏠</span>
          <span style={{ ...styles.navLabel, color: navTab === "home" ? "#4F46E5" : "#94A3B8" }}>Home</span>
        </button>
        <button style={styles.navBtn} onClick={() => setNavTab("saved")}>
          <span style={{ fontSize: 20 }}>🔖</span>
          <span style={{ ...styles.navLabel, color: navTab === "saved" ? "#4F46E5" : "#94A3B8" }}>Saved</span>
        </button>
        {role === "admin" && (
          <button style={styles.navBtn} onClick={() => setNavTab("post")}>
            <span style={{ fontSize: 20 }}>✏️</span>
            <span style={{ ...styles.navLabel, color: navTab === "post" ? "#4F46E5" : "#94A3B8" }}>Post</span>
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "linear-gradient(135deg, #EEF2FF 0%, #F8FAFF 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', system-ui, sans-serif", padding: 20 },
  app: { maxWidth: 420, margin: "0 auto", height: "100vh", display: "flex", flexDirection: "column", background: "#F8FAFF", fontFamily: "'Inter', system-ui, sans-serif", position: "relative", overflow: "hidden" },
  scroll: { flex: 1, overflowY: "auto" },
  roleCard: { background: "#fff", borderRadius: 24, padding: "40px 28px", maxWidth: 380, width: "100%", boxShadow: "0 20px 60px rgba(79,70,229,0.12)" },
  logo: { display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginBottom: 8 },
  logoIcon: { fontSize: 28 },
  logoText: { fontSize: 24, fontWeight: 800, color: "#4F46E5" },
  tagline: { textAlign: "center", color: "#64748B", fontSize: 15, marginBottom: 8 },
  roleOptions: { display: "flex", flexDirection: "column", gap: 12 },
  roleBtn: { display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", border: "2px solid #E2E8F0", borderRadius: 16, background: "#fff", cursor: "pointer", textAlign: "left", transition: "all 0.2s" },
  roleEmoji: { fontSize: 28 },
  roleName: { fontWeight: 700, color: "#0F172A", fontSize: 15 },
  roleDesc: { color: "#64748B", fontSize: 12, marginTop: 2 },
  arrow: { marginLeft: "auto", fontSize: 22, color: "#4F46E5" },
  setupCard: { background: "#fff", borderRadius: 24, padding: "32px 28px", maxWidth: 380, width: "100%", boxShadow: "0 20px 60px rgba(79,70,229,0.12)" },
  setupTitle: { fontSize: 22, fontWeight: 800, color: "#0F172A", marginBottom: 4 },
  setupSub: { color: "#64748B", fontSize: 14, marginBottom: 20 },
  progressBar: { display: "flex", gap: 8 },
  progressDot: { width: 32, height: 4, borderRadius: 99 },
  backBtn: { background: "none", border: "1px solid #E2E8F0", borderRadius: 10, width: 36, height: 36, cursor: "pointer", fontSize: 20, color: "#4F46E5" },
  backBtnWhite: { background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#4F46E5", fontWeight: 600, padding: 0 },
  input: { width: "100%", padding: "12px 14px", border: "1.5px solid #E2E8F0", borderRadius: 12, fontSize: 15, outline: "none", boxSizing: "border-box", background: "#F8FAFF", marginBottom: 12, fontFamily: "inherit" },
  primaryBtn: { width: "100%", padding: "14px", background: "linear-gradient(135deg, #4F46E5, #6366F1)", color: "#fff", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: "pointer" },
  chipGrid: { display: "flex", flexWrap: "wrap", gap: 8 },
  chip: { padding: "8px 14px", border: "1.5px solid #E2E8F0", borderRadius: 99, background: "#fff", cursor: "pointer", fontSize: 13, color: "#334155", fontFamily: "inherit" },
  chipActive: { background: "#4F46E5", borderColor: "#4F46E5", color: "#fff" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "#fff", borderBottom: "1px solid #F1F5F9" },
  headerLeft: { display: "flex", alignItems: "center", gap: 8 },
  profilePill: { background: "#EEF2FF", color: "#4F46E5", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99 },
  adminBadge: { background: "#FEF3C7", color: "#92400E", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99 },
  logoutBtn: { background: "none", border: "none", color: "#94A3B8", fontSize: 13, cursor: "pointer" },
  greetCard: { background: "linear-gradient(135deg, #4F46E5, #6366F1)", borderRadius: 16, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  searchBar: { width: "100%", padding: "11px 16px", border: "none", borderRadius: 12, background: "#F1F5F9", fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 14, fontFamily: "inherit" },
  catScroll: { display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" },
  catChip: { padding: "7px 14px", border: "1.5px solid #E2E8F0", borderRadius: 99, background: "#fff", cursor: "pointer", fontSize: 13, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 4, fontFamily: "inherit", color: "#334155" },
  catChipActive: { background: "#4F46E5", borderColor: "#4F46E5", color: "#fff" },
  catCount: { background: "#EEF2FF", color: "#4F46E5", fontSize: 11, padding: "1px 6px", borderRadius: 99, fontWeight: 700 },
  noticeCard: { background: "#fff", borderRadius: 16, padding: "16px", marginBottom: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", cursor: "pointer", border: "1px solid #F1F5F9" },
  categoryBadge: { display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 99, fontSize: 12, fontWeight: 600 },
  noticeTitle: { fontSize: 15, fontWeight: 700, color: "#0F172A", marginTop: 8, marginBottom: 4, lineHeight: 1.4 },
  noticePreview: { fontSize: 13, color: "#64748B", lineHeight: 1.6, marginBottom: 10 },
  noticeFoot: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  authorChip: { fontSize: 12, color: "#4F46E5", fontWeight: 600 },
  saveSmall: { background: "none", border: "none", cursor: "pointer", fontSize: 16, padding: 0 },
  bottomNav: { position: "absolute", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid #F1F5F9", display: "flex", justifyContent: "space-around", padding: "10px 0 16px" },
  navBtn: { display: "flex", flexDirection: "column", alignItems: "center", background: "none", border: "none", cursor: "pointer", gap: 2 },
  navLabel: { fontSize: 11, fontWeight: 600 },
  noticeHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", background: "#fff", borderBottom: "1px solid #F1F5F9" },
  saveIconBtn: { display: "flex", flexDirection: "column", alignItems: "center", background: "none", border: "none", cursor: "pointer", fontSize: 20 },
  noticeMeta: { display: "flex", gap: 8, color: "#64748B", fontSize: 13, marginTop: 6 },
  divider: { height: 1, background: "#F1F5F9", margin: "16px 0" },
  targetTags: { display: "flex", flexDirection: "column", gap: 6, marginTop: 20 },
  targetTag: { background: "#F1F5F9", color: "#334155", fontSize: 13, padding: "8px 12px", borderRadius: 10 },
  empty: { textAlign: "center", padding: "60px 20px", display: "flex", flexDirection: "column", alignItems: "center" },
  pageTitle: { fontSize: 20, fontWeight: 800, color: "#0F172A", marginBottom: 20 },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 8, marginTop: 16 },
  successBanner: { background: "#DCFCE7", color: "#166534", borderRadius: 12, padding: "12px 16px", marginBottom: 16, fontWeight: 600 },
};
