/* ============================================================
   Gym Training Planner — frontend app.js
   Talks to the Express/Postgres backend via fetch(). No localStorage
   for app data (only UI language/theme prefs are kept client-side).
   ============================================================ */

const API = "/api";
let lang = localStorage.getItem("gp_lang") || "ar";
let theme = localStorage.getItem("gp_theme") || "light";

const I18N = {
  ar: {
    app_title: "Gym Training Planner", app_sub: "جدول النادي الرياضي",
    tab_login: "تسجيل الدخول", tab_register: "إنشاء حساب",
    email: "البريد الإلكتروني", password: "كلمة المرور", name: "الاسم",
    login_btn: "دخول", register_btn: "إنشاء الحساب ✨",
    onb_title: "أخبرينا عن نفسك", onb_age: "العمر", onb_height: "الطول (سم)", onb_weight: "الوزن (كجم)",
    onb_goal: "الهدف (يمكن اختيار أكثر من واحد)", onb_days: "كم يوم بالأسبوع تتمرنين؟",
    onb_continue: "التالي: بناء الجدول ⬅",
    goal_muscle: "بناء عضل", goal_loss: "خسارة وزن", goal_tone: "تنسيق الجسم",
    goal_endurance: "لياقة وتحمل", goal_maintain: "المحافظة على الوزن",
    wiz_title: "لنبني جدولك التدريبي",
    wiz_day_name_ar: "اسم اليوم (عربي)", wiz_day_name_en: "اسم اليوم (English)",
    wiz_save_day: "حفظ اسم اليوم", wiz_exercises_title: "تمارين هذا اليوم",
    wiz_ex_name_ar: "اسم التمرين (عربي)", wiz_ex_name_en: "Exercise name (English)",
    wiz_ex_equipment_ar: "الجهاز (عربي)", wiz_ex_equipment_en: "Equipment (English)",
    wiz_add_exercise: "+ إضافة تمرين", wiz_next_day: "اليوم التالي ⬅", wiz_finish: "إنهاء وابدئي 🎉",
    sets: "المجموعات", reps: "التكرار", rest: "الراحة", equipment: "الجهاز",
    brand_title: "Gym Training Planner", brand_sub: "جدول النادي الرياضي",
    nav_dashboard: "لوحة التحكم", nav_calendar: "التقويم", nav_workouts: "التمارين",
    nav_weight: "الوزن", nav_measurements: "القياسات", nav_progress: "التقدم",
    dash_title: "أهلاً بعودتك 💜", hero_weight: "الوزن الحالي", hero_goal: "الهدف", hero_streak: "التزام الأسبوع",
    dash_week_title: "جدول الأسبوع", back: "رجوع", edit_schedule: "✏️ تعديل الجدول",
    cal_workout: "يوم تمرين", cal_done: "مكتمل", cal_rest: "راحة", cal_commitment: "نسبة الالتزام",
    add_weight: "+ إضافة وزن", col_date: "التاريخ", col_weight: "الوزن",
    m_chest: "الصدر", m_waist: "الخصر", m_abdomen: "البطن", m_hips: "الأرداف", m_thigh: "الفخذ", m_arm: "الذراع",
    add_measure: "+ حفظ القياسات",
    p_weight: "الوزن", p_current: "الحالي", p_start: "البداية", p_change: "التغيير",
    p_measurements: "القياسات", p_consistency: "الالتزام بالتمارين",
    watch_technique: "مشاهدة الشرح", save_link: "حفظ الرابط", not_specified: "غير محدد",
    no_data_title: "لم يتم بناء جدول تدريبي بعد",
    no_data_body: "استخدمي زر تعديل الجدول لإضافة أيامك وتمارينك.",
    exercise: "تمرين", start_rest: "بدء الراحة", rest_complete: "انتهت الراحة ✅",
    celeb_day: "🔥 أكملتِ اليوم بالكامل!", celeb_ex: "✨ أحسنتِ!",
    err_login: "بيانات الدخول غير صحيحة", err_register: "تعذر إنشاء الحساب",
    err_email_taken: "هذا البريد الإلكتروني مستخدم بالفعل",
  },
  en: {
    app_title: "Gym Training Planner", app_sub: "Club Training Schedule",
    tab_login: "Log in", tab_register: "Create account",
    email: "Email", password: "Password", name: "Name",
    login_btn: "Log in", register_btn: "Create account ✨",
    onb_title: "Tell us about you", onb_age: "Age", onb_height: "Height (cm)", onb_weight: "Weight (kg)",
    onb_goal: "Goal (choose one or more)", onb_days: "How many days a week do you train?",
    onb_continue: "Next: build schedule ⬅",
    goal_muscle: "Build muscle", goal_loss: "Lose weight", goal_tone: "Tone up",
    goal_endurance: "Endurance", goal_maintain: "Maintain weight",
    wiz_title: "Let's build your training schedule",
    wiz_day_name_ar: "Day name (Arabic)", wiz_day_name_en: "Day name (English)",
    wiz_save_day: "Save day name", wiz_exercises_title: "Exercises for this day",
    wiz_ex_name_ar: "Exercise name (Arabic)", wiz_ex_name_en: "Exercise name (English)",
    wiz_ex_equipment_ar: "Equipment (Arabic)", wiz_ex_equipment_en: "Equipment (English)",
    wiz_add_exercise: "+ Add exercise", wiz_next_day: "Next day ⬅", wiz_finish: "Finish & start 🎉",
    sets: "Sets", reps: "Reps", rest: "Rest", equipment: "Equipment",
    brand_title: "Gym Training Planner", brand_sub: "Club Training Schedule",
    nav_dashboard: "Dashboard", nav_calendar: "Calendar", nav_workouts: "Workouts",
    nav_weight: "Weight", nav_measurements: "Measurements", nav_progress: "Progress",
    dash_title: "Welcome back 💜", hero_weight: "Current weight", hero_goal: "Goal", hero_streak: "Week commitment",
    dash_week_title: "Weekly overview", back: "Back", edit_schedule: "✏️ Edit schedule",
    cal_workout: "Workout day", cal_done: "Completed", cal_rest: "Rest", cal_commitment: "Commitment rate",
    add_weight: "+ Add weight", col_date: "Date", col_weight: "Weight",
    m_chest: "Chest", m_waist: "Waist", m_abdomen: "Abdomen", m_hips: "Hips", m_thigh: "Thigh", m_arm: "Upper arm",
    add_measure: "+ Save measurements",
    p_weight: "Weight", p_current: "Current", p_start: "Starting", p_change: "Change",
    p_measurements: "Measurements", p_consistency: "Workout consistency",
    watch_technique: "Watch Technique", save_link: "Save link", not_specified: "Not specified",
    no_data_title: "No training schedule built yet",
    no_data_body: "Use Edit schedule to add your days and exercises.",
    exercise: "exercises", start_rest: "Start Rest", rest_complete: "Rest Complete ✅",
    celeb_day: "🔥 Day fully completed!", celeb_ex: "✨ Great job!",
    err_login: "Invalid email or password", err_register: "Could not create account",
    err_email_taken: "That email is already registered",
  },
};
function t(key) { return (I18N[lang] && I18N[lang][key]) || key; }

/* ---------------- Fetch helper ---------------- */
async function api(path, opts = {}) {
  const res = await fetch(API + path, {
    method: opts.method || "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  let data = {};
  try { data = await res.json(); } catch (e) {}
  if (!res.ok) throw Object.assign(new Error(data.error || "request_failed"), { data, status: res.status });
  return data;
}

/* ---------------- App state (fetched, not stored) ---------------- */
let appState = {
  user: null,
  profile: null,
  days: [],
  weight: [],
  measurements: [],
  calendar: {},
};

function localizedName(obj, base) {
  const key = lang === "ar" ? base + "Ar" : base + "En";
  const val = obj[key] ?? obj[base + (lang === "ar" ? "_ar" : "_en")];
  return val || t("not_specified");
}
function todayISO() { return new Date().toISOString().slice(0, 10); }

/* ---------------- i18n / theme ---------------- */
function applyLanguage() {
  const isAr = lang === "ar";
  document.documentElement.lang = isAr ? "ar" : "en";
  document.documentElement.dir = isAr ? "rtl" : "ltr";
  document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.getAttribute("data-i18n")); });
  const lt = document.getElementById("langToggle"); if (lt) lt.textContent = isAr ? "EN" : "عربي";
  const alt = document.getElementById("authLangToggle"); if (alt) alt.textContent = isAr ? "EN" : "عربي";
}
function applyTheme() {
  document.documentElement.setAttribute("data-theme", theme);
  const tt = document.getElementById("themeToggle"); if (tt) tt.textContent = theme === "light" ? "🌙" : "☀️";
}

document.getElementById("authLangToggle").addEventListener("click", () => {
  lang = lang === "ar" ? "en" : "ar"; localStorage.setItem("gp_lang", lang); applyLanguage();
});

/* ---------------- Screen switching ---------------- */
function showScreen(id) {
  ["authScreen", "profileScreen", "wizardScreen", "app"].forEach(s => {
    document.getElementById(s).classList.toggle("hidden", s !== id);
  });
}

/* ---------------- Auth ---------------- */
document.querySelectorAll(".auth-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".auth-tab").forEach(x => x.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById("loginForm").classList.toggle("hidden", tab.dataset.tab !== "login");
    document.getElementById("registerForm").classList.toggle("hidden", tab.dataset.tab !== "register");
  });
});

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const errEl = document.getElementById("loginError");
  errEl.textContent = "";
  try {
    await api("/auth/login", { method: "POST", body: {
      email: document.getElementById("li_email").value,
      password: document.getElementById("li_password").value,
    }});
    await boot();
  } catch (err) { errEl.textContent = t("err_login"); }
});

document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const errEl = document.getElementById("registerError");
  errEl.textContent = "";
  try {
    await api("/auth/register", { method: "POST", body: {
      name: document.getElementById("re_name").value,
      email: document.getElementById("re_email").value,
      password: document.getElementById("re_password").value,
    }});
    await boot();
  } catch (err) {
    errEl.textContent = err.data && err.data.error === "email_taken" ? t("err_email_taken") : t("err_register");
  }
});

document.getElementById("logoutBtn").addEventListener("click", async () => {
  await api("/auth/logout", { method: "POST" });
  location.reload();
});

/* ---------------- Profile onboarding ---------------- */
let selectedGoals = [];
document.querySelectorAll("#goalChips .chip").forEach(chip => {
  chip.addEventListener("click", () => {
    const g = chip.dataset.goal;
    if (selectedGoals.includes(g)) { selectedGoals = selectedGoals.filter(x => x !== g); chip.classList.remove("selected"); }
    else { selectedGoals.push(g); chip.classList.add("selected"); }
  });
});

document.getElementById("profileForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const daysPerWeek = parseInt(document.getElementById("ob_daysPerWeek").value, 10) || 1;
  await api("/profile", { method: "POST", body: {
    age: document.getElementById("ob_age").value || null,
    height: document.getElementById("ob_height").value || null,
    weight: document.getElementById("ob_weight").value || null,
    goals: selectedGoals,
    daysPerWeek,
  }});
  startWizard(daysPerWeek);
});

/* ---------------- Day-by-day schedule wizard ---------------- */
let wizard = { totalDays: 1, currentIndex: 0, currentDay: null, exercises: [] };

function startWizard(totalDays) {
  wizard = { totalDays, currentIndex: 0, currentDay: null, exercises: [] };
  showScreen("wizardScreen");
  renderWizardStep();
}

function renderWizardStep() {
  document.getElementById("wizDayLabel").textContent =
    (lang === "ar" ? "اليوم " : "Day ") + (wizard.currentIndex + 1) + " / " + wizard.totalDays;
  document.getElementById("wiz_dayNameAr").value = "";
  document.getElementById("wiz_dayNameEn").value = "";
  document.getElementById("wizExerciseList").innerHTML = "";
  wizard.currentDay = null;
  wizard.exercises = [];
  document.getElementById("wizFinishBtn").classList.toggle("hidden", wizard.currentIndex < wizard.totalDays - 1);
  document.getElementById("wizNextDayBtn").classList.toggle("hidden", wizard.currentIndex >= wizard.totalDays - 1);
}

document.getElementById("wizSaveDayBtn").addEventListener("click", async () => {
  const nameAr = document.getElementById("wiz_dayNameAr").value.trim();
  const nameEn = document.getElementById("wiz_dayNameEn").value.trim();
  if (!nameAr && !nameEn) return;
  const { day } = await api("/schedule/days", { method: "POST", body: {
    nameAr, nameEn, dayOrder: wizard.currentIndex + 1,
  }});
  wizard.currentDay = day;
  document.getElementById("wizSaveDayBtn").textContent = "✓ " + (lang === "ar" ? "تم الحفظ" : "Saved");
});

document.getElementById("wizAddExerciseBtn").addEventListener("click", async () => {
  if (!wizard.currentDay) {
    alert(lang === "ar" ? "احفظي اسم اليوم أولاً" : "Please save the day name first");
    return;
  }
  const payload = {
    nameAr: document.getElementById("wex_nameAr").value.trim(),
    nameEn: document.getElementById("wex_nameEn").value.trim(),
    equipmentAr: document.getElementById("wex_equipAr").value.trim(),
    equipmentEn: document.getElementById("wex_equipEn").value.trim(),
    sets: document.getElementById("wex_sets").value.trim(),
    reps: document.getElementById("wex_reps").value.trim(),
    rest: document.getElementById("wex_rest").value.trim(),
    exOrder: wizard.exercises.length + 1,
  };
  if (!payload.nameAr && !payload.nameEn) return;
  const { exercise } = await api(`/schedule/days/${wizard.currentDay.id}/exercises`, { method: "POST", body: payload });
  wizard.exercises.push(exercise);
  renderWizardExerciseList();
  ["wex_nameAr","wex_nameEn","wex_equipAr","wex_equipEn","wex_sets","wex_reps","wex_rest"].forEach(id => document.getElementById(id).value = "");
});

function renderWizardExerciseList() {
  const list = document.getElementById("wizExerciseList");
  list.innerHTML = "";
  wizard.exercises.forEach((ex) => {
    const row = document.createElement("div");
    row.className = "wizard-exercise-item";
    row.innerHTML = `<span>${localizedName(ex, "name")} — ${ex.sets || "-"}×${ex.reps || "-"}</span><button>✕</button>`;
    row.querySelector("button").addEventListener("click", async () => {
      await api(`/exercises/${ex.id}`, { method: "DELETE" });
      wizard.exercises = wizard.exercises.filter(e => e.id !== ex.id);
      renderWizardExerciseList();
    });
    list.appendChild(row);
  });
}

document.getElementById("wizNextDayBtn").addEventListener("click", () => {
  wizard.currentIndex++;
  document.getElementById("wizSaveDayBtn").textContent = t("wiz_save_day");
  renderWizardStep();
});

document.getElementById("wizFinishBtn").addEventListener("click", async () => {
  await loadAppData();
  showScreen("app");
  renderAll();
});

document.getElementById("editScheduleBtn").addEventListener("click", () => {
  const daysPerWeek = (appState.profile && appState.profile.days_per_week) || 1;
  startWizard(daysPerWeek);
});

/* ---------------- Navigation ---------------- */
function setView(viewName) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.getElementById("view-" + viewName).classList.add("active");
  document.querySelectorAll(".nav-item").forEach(n => n.classList.toggle("active", n.dataset.view === viewName));
  document.querySelectorAll(".bn-item").forEach(n => n.classList.toggle("active", n.dataset.view === viewName));
  if (viewName === "workouts") {
    document.getElementById("workoutsList").classList.remove("hidden");
    document.getElementById("workoutDetail").classList.add("hidden");
  }
}
document.querySelectorAll(".nav-item, .bn-item").forEach(btn => btn.addEventListener("click", () => setView(btn.dataset.view)));

document.getElementById("langToggle").addEventListener("click", () => {
  lang = lang === "ar" ? "en" : "ar"; localStorage.setItem("gp_lang", lang);
  applyLanguage(); renderAll();
});
document.getElementById("themeToggle").addEventListener("click", () => {
  theme = theme === "light" ? "dark" : "light"; localStorage.setItem("gp_theme", theme); applyTheme();
});

/* ---------------- Data loading ---------------- */
async function loadAppData() {
  const [{ user, profile }, { days }, { entries: weight }, { entries: measurements }, { entries: calendarEntries }] = await Promise.all([
    api("/auth/me"), api("/schedule"), api("/weight"), api("/measurements"), api("/calendar"),
  ]);
  appState.user = user; appState.profile = profile; appState.days = days;
  appState.weight = weight; appState.measurements = measurements;
  appState.calendar = {};
  calendarEntries.forEach(c => { appState.calendar[c.entry_date.slice(0, 10)] = c.status; });
}

/* ---------------- Dashboard ---------------- */
function exerciseKey(ex) { return ex.id; }
function dayCompletionRatio(day) {
  const total = day.exercises.length;
  if (!total) return { done: 0, total: 0 };
  const done = day.exercises.filter(ex => ex.completed).length;
  return { done, total };
}

function renderDashboard() {
  const wh = appState.weight;
  document.getElementById("heroWeight").textContent = wh.length ? wh[wh.length - 1].weight_kg + " kg" : "--";
  const goals = appState.profile && appState.profile.goals && appState.profile.goals.length
    ? appState.profile.goals.map(g => t("goal_" + g)).join(" / ") : "--";
  document.getElementById("heroGoal").textContent = goals;

  let doneCount = 0, totalMarked = 0;
  const d = new Date();
  for (let i = 0; i < 7; i++) {
    const iso = new Date(d.getFullYear(), d.getMonth(), d.getDate() - i).toISOString().slice(0, 10);
    const status = appState.calendar[iso];
    if (status === "workout" || status === "done") { totalMarked++; if (status === "done") doneCount++; }
  }
  document.getElementById("heroStreak").textContent = totalMarked ? doneCount + "/" + totalMarked : "--";
  renderDayCards("weekOverview", appState.days);
}

function renderDayCards(containerId, days) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  if (!days.length) {
    container.innerHTML = `<div class="empty-note">💌 ${t("no_data_title")}<br>${t("no_data_body")}</div>`;
    return;
  }
  days.forEach(day => {
    const { done, total } = dayCompletionRatio(day);
    const pct = total ? Math.round((done / total) * 100) : 0;
    const card = document.createElement("div");
    card.className = "day-card";
    card.innerHTML = `<div class="dc-name">${localizedName(day, "name")}</div>
      <div class="dc-count">${total} ${t("exercise")}</div>
      <div class="dc-bar"><div class="dc-bar-fill" style="width:${pct}%"></div></div>`;
    card.addEventListener("click", () => openDayDetail(day.id));
    container.appendChild(card);
  });
}

function renderWorkoutsList() { renderDayCards("allDaysList", appState.days); }

function openDayDetail(dayId) {
  const day = appState.days.find(d => d.id === dayId);
  if (!day) return;
  document.getElementById("workoutsList").classList.add("hidden");
  document.getElementById("workoutDetail").classList.remove("hidden");
  document.getElementById("dayDetailTitle").textContent = localizedName(day, "name");
  renderExerciseList(day);
  setView("workouts");
}
document.getElementById("backToWorkouts").addEventListener("click", () => {
  document.getElementById("workoutsList").classList.remove("hidden");
  document.getElementById("workoutDetail").classList.add("hidden");
});

function renderExerciseList(day) {
  const list = document.getElementById("exerciseList");
  list.innerHTML = "";
  day.exercises.forEach((ex, idx) => {
    const done = !!ex.completed;
    const row = document.createElement("div");
    row.className = "exercise-row" + (done ? " completed" : "");
    row.innerHTML = `
      <input type="checkbox" class="ex-checkbox" ${done ? "checked" : ""}>
      <span class="ex-num">${idx + 1}</span>
      <div class="ex-body">
        <div class="ex-name">${localizedName(ex, "name")}</div>
        <div class="ex-meta">
          <span>${t("sets")}: ${ex.sets || t("not_specified")}</span>
          <span>${t("reps")}: ${ex.reps || t("not_specified")}</span>
          <span>${t("rest")}: ${ex.rest || t("not_specified")}</span>
        </div>
      </div>
      <button class="rest-timer-btn" data-rest="${ex.rest || ""}">⏱</button>
      <button class="ex-video-btn">🎥 ${t("watch_technique")}</button>
    `;
    row.querySelector(".ex-checkbox").addEventListener("change", async (e) => {
      await api(`/exercises/${ex.id}/toggle`, { method: "PUT", body: { completed: e.target.checked } });
      ex.completed = e.target.checked;
      renderExerciseList(day);
      renderDashboard();
      renderProgress();
      if (e.target.checked) {
        const { done: d2, total } = dayCompletionRatio(day);
        showCelebration(d2 === total ? t("celeb_day") : t("celeb_ex"));
      }
    });
    row.querySelector(".ex-body").addEventListener("click", () => openExerciseModal(day, ex));
    row.querySelector(".ex-video-btn").addEventListener("click", () => openVideoModal(ex));
    row.querySelector(".rest-timer-btn").addEventListener("click", () => startRestTimer(row.querySelector(".rest-timer-btn")));
    list.appendChild(row);
  });
  const { done, total } = dayCompletionRatio(day);
  document.getElementById("dayProgressFill").style.width = (total ? (done / total) * 100 : 0) + "%";
  document.getElementById("dayProgressLabel").textContent = `${done} / ${total}`;
}

function startRestTimer(btn) {
  let seconds = 60;
  const original = btn.textContent;
  btn.disabled = true;
  const iv = setInterval(() => {
    seconds--;
    btn.textContent = "⏱ " + seconds + "s";
    if (seconds <= 0) {
      clearInterval(iv);
      btn.textContent = "✅";
      showCelebration(t("rest_complete"));
      setTimeout(() => { btn.textContent = original; btn.disabled = false; }, 1500);
    }
  }, 1000);
}

/* ---------------- Modals ---------------- */
let currentVideoExercise = null;
function openVideoModal(ex) {
  currentVideoExercise = ex;
  document.getElementById("videoModalTitle").textContent = localizedName(ex, "name");
  const frame = document.getElementById("videoFrame");
  frame.innerHTML = ex.video_url ? `<iframe src="${ex.video_url}" allowfullscreen></iframe>` : "🎥";
  document.getElementById("videoUrlInput").value = ex.video_url || "";
  document.getElementById("videoModal").classList.remove("hidden");
}
document.getElementById("saveVideoUrlBtn").addEventListener("click", async () => {
  if (!currentVideoExercise) return;
  const url = document.getElementById("videoUrlInput").value.trim();
  await api(`/exercises/${currentVideoExercise.id}/video`, { method: "PUT", body: { videoUrl: url } });
  currentVideoExercise.video_url = url;
  openVideoModal(currentVideoExercise);
});

function openExerciseModal(day, ex) {
  document.getElementById("exModalName").textContent = localizedName(ex, "name");
  const grid = document.getElementById("exModalGrid");
  const rows = [
    [t("nav_workouts"), localizedName(day, "name")],
    [t("equipment"), localizedName(ex, "equipment")],
    [t("sets"), ex.sets || t("not_specified")],
    [t("reps"), ex.reps || t("not_specified")],
    [t("rest"), ex.rest || t("not_specified")],
  ];
  grid.innerHTML = rows.map(r => `<div class="exm-item"><div class="exm-label">${r[0]}</div><div>${r[1]}</div></div>`).join("");
  document.getElementById("exModalVideoBtn").onclick = () => { closeModal("exerciseModal"); openVideoModal(ex); };
  document.getElementById("exerciseModal").classList.remove("hidden");
}
function closeModal(id) { document.getElementById(id).classList.add("hidden"); }
document.querySelectorAll("[data-close]").forEach(btn => btn.addEventListener("click", () => closeModal(btn.dataset.close)));
document.querySelectorAll(".modal-overlay").forEach(ov => ov.addEventListener("click", (e) => { if (e.target === ov) ov.classList.add("hidden"); }));

function showCelebration(msg) {
  const toast = document.getElementById("celebrationToast");
  toast.textContent = msg;
  toast.classList.remove("hidden");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.add("hidden"), 2200);
}

/* ---------------- Calendar ---------------- */
let calCursor = new Date();
function renderCalendar() {
  const grid = document.getElementById("calendarGrid");
  grid.innerHTML = "";
  const year = calCursor.getFullYear(), month = calCursor.getMonth();
  const monthNames = lang === "ar"
    ? ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"]
    : ["January","February","March","April","May","June","July","August","September","October","November","December"];
  document.getElementById("calMonthLabel").textContent = monthNames[month] + " " + year;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div"); empty.className = "cal-cell empty"; grid.appendChild(empty);
  }
  let doneTotal = 0, markedTotal = 0;
  for (let day = 1; day <= daysInMonth; day++) {
    const iso = new Date(year, month, day).toISOString().slice(0, 10);
    const status = appState.calendar[iso];
    const cell = document.createElement("div");
    cell.className = "cal-cell" + (status ? " " + status : "");
    cell.innerHTML = `<span>${day}</span>`;
    cell.addEventListener("click", () => cycleCalendarDay(iso));
    grid.appendChild(cell);
    if (status === "workout" || status === "done") { markedTotal++; if (status === "done") doneTotal++; }
  }
  document.getElementById("commitmentPct").textContent = markedTotal ? Math.round((doneTotal / markedTotal) * 100) + "%" : "0%";
}

async function cycleCalendarDay(iso) {
  const order = [undefined, "workout", "done", "rest"];
  const current = appState.calendar[iso];
  const next = order[(order.indexOf(current) + 1) % order.length];
  await api(`/calendar/${iso}`, { method: "PUT", body: { status: next || null } });
  if (!next) delete appState.calendar[iso]; else appState.calendar[iso] = next;
  renderCalendar();
  renderDashboard();
  renderProgress();
}
document.getElementById("calPrev").addEventListener("click", () => { calCursor.setMonth(calCursor.getMonth() - 1); renderCalendar(); });
document.getElementById("calNext").addEventListener("click", () => { calCursor.setMonth(calCursor.getMonth() + 1); renderCalendar(); });

/* ---------------- Weight ---------------- */
document.getElementById("weightForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const date = document.getElementById("weightDate").value;
  const weight = parseFloat(document.getElementById("weightValue").value);
  if (!date || isNaN(weight)) return;
  const { entry } = await api("/weight", { method: "POST", body: { date, weight } });
  appState.weight.push(entry);
  appState.weight.sort((a, b) => a.entry_date.localeCompare(b.entry_date));
  document.getElementById("weightForm").reset();
  document.getElementById("weightDate").value = todayISO();
  renderWeight(); renderDashboard(); renderProgress();
});

function renderWeight() {
  const tbody = document.querySelector("#weightTable tbody");
  tbody.innerHTML = "";
  appState.weight.slice().reverse().forEach((entry) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${entry.entry_date.slice(0,10)}</td><td>${entry.weight_kg} kg</td><td><button>✕</button></td>`;
    tr.querySelector("button").addEventListener("click", async () => {
      await api(`/weight/${entry.id}`, { method: "DELETE" });
      appState.weight = appState.weight.filter(w => w.id !== entry.id);
      renderWeight(); renderDashboard(); renderProgress();
    });
    tbody.appendChild(tr);
  });
  drawWeightChart();
}

function drawWeightChart() {
  const canvas = document.getElementById("weightChart");
  const ctx = canvas.getContext("2d");
  const w = canvas.clientWidth || 600;
  canvas.width = w; canvas.height = 220;
  ctx.clearRect(0, 0, w, 220);
  const data = appState.weight;
  if (data.length < 2) {
    ctx.fillStyle = "#B89AB4"; ctx.font = "13px sans-serif";
    ctx.fillText(lang === "ar" ? "أضيفي وزنين على الأقل لعرض الرسم" : "Add at least two entries to see the chart", 16, 110);
    return;
  }
  const weights = data.map(d => parseFloat(d.weight_kg));
  const min = Math.min(...weights) - 1, max = Math.max(...weights) + 1;
  const padding = 30;
  const stepX = (w - padding * 2) / (data.length - 1);
  ctx.strokeStyle = "#B89AB4"; ctx.lineWidth = 3; ctx.beginPath();
  data.forEach((d, i) => {
    const x = padding + i * stepX;
    const y = 220 - padding - ((parseFloat(d.weight_kg) - min) / (max - min)) * (220 - padding * 2);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.fillStyle = "#F8C8DC";
  data.forEach((d, i) => {
    const x = padding + i * stepX;
    const y = 220 - padding - ((parseFloat(d.weight_kg) - min) / (max - min)) * (220 - padding * 2);
    ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
  });
}

/* ---------------- Measurements ---------------- */
document.getElementById("measureForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const date = document.getElementById("measureDate").value;
  if (!date) return;
  const body = {
    date,
    chest: document.getElementById("m_chest").value || null,
    waist: document.getElementById("m_waist").value || null,
    abdomen: document.getElementById("m_abdomen").value || null,
    hips: document.getElementById("m_hips").value || null,
    thigh: document.getElementById("m_thigh").value || null,
    arm: document.getElementById("m_arm").value || null,
  };
  const { entry } = await api("/measurements", { method: "POST", body });
  appState.measurements.push(entry);
  appState.measurements.sort((a, b) => a.entry_date.localeCompare(b.entry_date));
  document.getElementById("measureForm").reset();
  document.getElementById("measureDate").value = todayISO();
  renderMeasurements(); renderProgress();
});

const MEASURE_FIELDS = ["chest", "waist", "abdomen", "hips", "thigh", "arm"];
function renderMeasurements() {
  const container = document.getElementById("measureSummary");
  container.innerHTML = "";
  const list = appState.measurements;
  if (!list.length) {
    container.innerHTML = `<div class="empty-note">${lang === "ar" ? "لا توجد قياسات مسجلة بعد" : "No measurements logged yet"}</div>`;
    return;
  }
  const current = list[list.length - 1];
  const previous = list.length > 1 ? list[list.length - 2] : null;
  MEASURE_FIELDS.forEach(f => {
    const cur = current[f], prev = previous ? previous[f] : null;
    const change = (cur != null && prev != null) ? (parseFloat(cur) - parseFloat(prev)).toFixed(1) : "--";
    const card = document.createElement("div");
    card.className = "measure-stat-card";
    card.innerHTML = `<div class="ms-label">${t("m_" + f)}</div>
      <div class="ms-row"><span>${t("p_current")}</span><strong>${cur != null ? cur + " cm" : "--"}</strong></div>
      <div class="ms-row"><span>${lang === "ar" ? "السابق" : "Previous"}</span><span>${prev != null ? prev + " cm" : "--"}</span></div>
      <div class="ms-row"><span>${t("p_change")}</span><span>${change}</span></div>`;
    container.appendChild(card);
  });
}

/* ---------------- Progress ---------------- */
function renderProgress() {
  const wh = appState.weight;
  document.getElementById("pgWeightCurrent").textContent = wh.length ? wh[wh.length - 1].weight_kg + " kg" : "--";
  document.getElementById("pgWeightStart").textContent = wh.length ? wh[0].weight_kg + " kg" : "--";
  document.getElementById("pgWeightChange").textContent = wh.length > 1 ? (parseFloat(wh[wh.length - 1].weight_kg) - parseFloat(wh[0].weight_kg)).toFixed(1) + " kg" : "--";

  const ml = appState.measurements;
  const measureList = document.getElementById("pgMeasureList");
  measureList.innerHTML = "";
  if (ml.length) {
    const current = ml[ml.length - 1];
    const previous = ml.length > 1 ? ml[ml.length - 2] : null;
    MEASURE_FIELDS.forEach(f => {
      const cur = current[f], prev = previous ? previous[f] : null;
      const diff = (cur != null && prev != null) ? (parseFloat(cur) - parseFloat(prev)).toFixed(1) : "--";
      const row = document.createElement("div");
      row.className = "pm-row";
      row.innerHTML = `<span>${t("m_" + f)}</span><strong>${diff}</strong>`;
      measureList.appendChild(row);
    });
  } else {
    measureList.innerHTML = `<div class="pm-row">${lang === "ar" ? "لا توجد بيانات" : "No data yet"}</div>`;
  }

  let done = 0, total = 0;
  Object.values(appState.calendar).forEach(status => { if (status === "workout" || status === "done") { total++; if (status === "done") done++; } });
  document.getElementById("pcLabel").textContent = `${done}/${total}`;
  const circumference = 327;
  const ratio = total ? done / total : 0;
  document.getElementById("pcFill").style.strokeDashoffset = circumference - circumference * ratio;
}

/* ---------------- Render all ---------------- */
function renderAll() {
  renderDashboard(); renderWorkoutsList(); renderCalendar(); renderWeight(); renderMeasurements(); renderProgress();
}

/* ---------------- Boot ---------------- */
async function boot() {
  document.getElementById("weightDate").value = todayISO();
  document.getElementById("measureDate").value = todayISO();
  applyLanguage();
  applyTheme();
  try {
    const { user, profile } = await api("/auth/me");
    if (!user) { showScreen("authScreen"); return; }
    if (!profile) { showScreen("profileScreen"); return; }
    await loadAppData();
    if (!appState.days.length) {
      startWizard(profile.days_per_week || 1);
      return;
    }
    showScreen("app");
    renderAll();
  } catch (err) {
    showScreen("authScreen");
  }
}

boot();
