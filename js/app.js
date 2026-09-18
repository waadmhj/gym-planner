/* ============================================================
   Gym Training Planner — app.js
   All state lives in localStorage. WORKOUT_DATA comes from data/data.js
   and is never modified at runtime.
   ============================================================ */

const STORAGE_KEY = "gymPlanner_v1";

const I18N = {
  ar: {
    onb_title: "مرحبًا بك", onb_sub: "قبل نبدأ، عطينا بعض المعلومات",
    onb_name: "اسمك", onb_age: "العمر", onb_height: "الطول (سم)", onb_weight: "الوزن (كجم)",
    onb_goal: "الهدف (يمكن اختيار أكثر من واحد)", onb_days: "كم يوم بالأسبوع تتمرنين؟",
    onb_start: "ابدأ رحلتي ✨",
    goal_muscle: "بناء عضل", goal_loss: "خسارة وزن", goal_tone: "تنسيق الجسم",
    goal_endurance: "لياقة وتحمل", goal_maintain: "المحافظة على الوزن",
    brand_title: "Gym Training Planner", brand_sub: "جدول النادي الرياضي",
    nav_dashboard: "لوحة التحكم", nav_calendar: "التقويم", nav_workouts: "التمارين",
    nav_weight: "الوزن", nav_measurements: "القياسات", nav_progress: "التقدم",
    dash_title: "أهلاً بعودتك 💜", hero_weight: "الوزن الحالي", hero_goal: "الهدف", hero_streak: "التزام الأسبوع",
    dash_week_title: "جدول الأسبوع", back: "رجوع",
    cal_workout: "يوم تمرين", cal_done: "مكتمل", cal_rest: "راحة", cal_commitment: "نسبة الالتزام",
    add_weight: "+ إضافة وزن", col_date: "التاريخ", col_weight: "الوزن",
    m_chest: "الصدر", m_waist: "الخصر", m_abdomen: "البطن", m_hips: "الأرداف", m_thigh: "الفخذ", m_arm: "الذراع",
    add_measure: "+ حفظ القياسات",
    p_weight: "الوزن", p_current: "الحالي", p_start: "البداية", p_change: "التغيير",
    p_measurements: "القياسات", p_consistency: "الالتزام بالتمارين",
    watch_technique: "مشاهدة الشرح", not_specified: "غير محدد",
    no_data_title: "لم تتم إضافة برنامج تدريبي بعد",
    no_data_body: "أضف جدولك التدريبي في ملف data/data.js لعرضه هنا.",
    sets: "المجموعات", reps: "التكرار", rest: "الراحة", equipment: "الجهاز",
    start_rest: "بدء الراحة", rest_complete: "انتهت الراحة ✅",
    celeb_day: "🔥 أكملتِ اليوم بالكامل!", celeb_ex: "✨ أحسنتِ!",
    exercise: "تمرين", of: "من", completed_label: "تمرين مكتمل",
    workouts_completed: "تمرين مكتمل",
  },
  en: {
    onb_title: "Welcome", onb_sub: "Before we start, tell us a bit about you",
    onb_name: "Your name", onb_age: "Age", onb_height: "Height (cm)", onb_weight: "Weight (kg)",
    onb_goal: "Goal (choose one or more)", onb_days: "How many days a week do you train?",
    onb_start: "Start my journey ✨",
    goal_muscle: "Build muscle", goal_loss: "Lose weight", goal_tone: "Tone up",
    goal_endurance: "Endurance", goal_maintain: "Maintain weight",
    brand_title: "Gym Training Planner", brand_sub: "Club Training Schedule",
    nav_dashboard: "Dashboard", nav_calendar: "Calendar", nav_workouts: "Workouts",
    nav_weight: "Weight", nav_measurements: "Measurements", nav_progress: "Progress",
    dash_title: "Welcome back 💜", hero_weight: "Current weight", hero_goal: "Goal", hero_streak: "Week commitment",
    dash_week_title: "Weekly overview", back: "Back",
    cal_workout: "Workout day", cal_done: "Completed", cal_rest: "Rest", cal_commitment: "Commitment rate",
    add_weight: "+ Add weight", col_date: "Date", col_weight: "Weight",
    m_chest: "Chest", m_waist: "Waist", m_abdomen: "Abdomen", m_hips: "Hips", m_thigh: "Thigh", m_arm: "Upper arm",
    add_measure: "+ Save measurements",
    p_weight: "Weight", p_current: "Current", p_start: "Starting", p_change: "Change",
    p_measurements: "Measurements", p_consistency: "Workout consistency",
    watch_technique: "Watch Technique", not_specified: "Not specified",
    no_data_title: "No training program added yet",
    no_data_body: "Add your training schedule in data/data.js to see it here.",
    sets: "Sets", reps: "Reps", rest: "Rest", equipment: "Equipment",
    start_rest: "Start Rest", rest_complete: "Rest Complete ✅",
    celeb_day: "🔥 Day fully completed!", celeb_ex: "✨ Great job!",
    exercise: "Exercise", of: "of", completed_label: "exercises completed",
    workouts_completed: "workouts completed",
  }
};

/* ---------------- State ---------------- */
let state = loadState();

function defaultState() {
  return {
    lang: "ar",
    theme: "light",
    profile: null, // { name, age, height, weight, goals[], daysPerWeek }
    completedExercises: {}, // { "dayId::exIndex": true }
    calendar: {}, // { "YYYY-MM-DD": "workout" | "done" | "rest" }
    weightHistory: [], // { date, weight }
    measurements: [], // { date, chest, waist, abdomen, hips, thigh, arm }
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    return Object.assign(defaultState(), JSON.parse(raw));
  } catch (e) {
    return defaultState();
  }
}

function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch (e) { console.error("Storage error", e); }
}

function t(key) { return (I18N[state.lang] && I18N[state.lang][key]) || key; }

/* ---------------- i18n / theme apply ---------------- */
function applyLanguage() {
  const isAr = state.lang === "ar";
  document.documentElement.lang = isAr ? "ar" : "en";
  document.documentElement.dir = isAr ? "rtl" : "ltr";
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.textContent = t(key);
  });
  document.getElementById("langToggle").textContent = isAr ? "EN" : "عربي";
}

function applyTheme() {
  document.documentElement.setAttribute("data-theme", state.theme);
  document.getElementById("themeToggle").textContent = state.theme === "light" ? "🌙" : "☀️";
}

/* ---------------- Onboarding ---------------- */
const goalChips = document.querySelectorAll(".chip");
let selectedGoals = [];
goalChips.forEach(chip => {
  chip.addEventListener("click", () => {
    const g = chip.dataset.goal;
    if (selectedGoals.includes(g)) {
      selectedGoals = selectedGoals.filter(x => x !== g);
      chip.classList.remove("selected");
    } else {
      selectedGoals.push(g);
      chip.classList.add("selected");
    }
  });
});

document.getElementById("onboardingForm").addEventListener("submit", (e) => {
  e.preventDefault();
  state.profile = {
    name: document.getElementById("ob_name").value.trim(),
    age: document.getElementById("ob_age").value || null,
    height: document.getElementById("ob_height").value || null,
    weight: document.getElementById("ob_weight").value || null,
    goals: [...selectedGoals],
    daysPerWeek: parseInt(document.getElementById("ob_daysPerWeek").value, 10) || null,
  };
  if (state.profile.weight) {
    state.weightHistory.push({ date: todayISO(), weight: parseFloat(state.profile.weight) });
  }
  saveState();
  showApp();
});

function showApp() {
  document.getElementById("onboarding").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
  renderAll();
}

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
document.querySelectorAll(".nav-item, .bn-item").forEach(btn => {
  btn.addEventListener("click", () => setView(btn.dataset.view));
});

document.getElementById("langToggle").addEventListener("click", () => {
  state.lang = state.lang === "ar" ? "en" : "ar";
  saveState();
  applyLanguage();
  renderAll();
});
document.getElementById("themeToggle").addEventListener("click", () => {
  state.theme = state.theme === "light" ? "dark" : "light";
  saveState();
  applyTheme();
});

/* ---------------- Helpers ---------------- */
function todayISO() { return new Date().toISOString().slice(0, 10); }
function exKey(dayId, idx) { return dayId + "::" + idx; }
function localizedName(obj, base) {
  const key = state.lang === "ar" ? base + "Ar" : base + "En";
  return obj[key] || t("not_specified");
}

function getDays() { return (WORKOUT_DATA && WORKOUT_DATA.days) || []; }

/* ---------------- Dashboard ---------------- */
function renderDashboard() {
  const weight = state.weightHistory.length ? state.weightHistory[state.weightHistory.length - 1].weight : null;
  document.getElementById("heroWeight").textContent = weight ? weight + " kg" : "--";
  const goals = state.profile && state.profile.goals && state.profile.goals.length
    ? state.profile.goals.map(g => t("goal_" + g)).join(" / ")
    : "--";
  document.getElementById("heroGoal").textContent = goals;

  // week commitment: last 7 days
  let doneCount = 0, totalMarked = 0;
  const d = new Date();
  for (let i = 0; i < 7; i++) {
    const iso = new Date(d.getFullYear(), d.getMonth(), d.getDate() - i).toISOString().slice(0, 10);
    const status = state.calendar[iso];
    if (status === "workout" || status === "done") { totalMarked++; if (status === "done") doneCount++; }
  }
  document.getElementById("heroStreak").textContent = totalMarked ? doneCount + "/" + totalMarked : "--";

  renderDayCards("weekOverview", getDays());
}

function dayCompletionRatio(day) {
  const total = day.exercises.length;
  if (!total) return { done: 0, total: 0 };
  let done = 0;
  day.exercises.forEach((ex, idx) => { if (state.completedExercises[exKey(day.id, idx)]) done++; });
  return { done, total };
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
    card.innerHTML = `
      <div class="dc-name">${localizedName(day, "name")}</div>
      <div class="dc-count">${total} ${t("exercise")}</div>
      <div class="dc-bar"><div class="dc-bar-fill" style="width:${pct}%"></div></div>
    `;
    card.addEventListener("click", () => openDayDetail(day.id));
    container.appendChild(card);
  });
}

/* ---------------- Workouts ---------------- */
function renderWorkoutsList() {
  renderDayCards("allDaysList", getDays());
}

function openDayDetail(dayId) {
  const day = getDays().find(d => d.id === dayId);
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
    const key = exKey(day.id, idx);
    const done = !!state.completedExercises[key];
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
    row.querySelector(".ex-checkbox").addEventListener("change", (e) => {
      state.completedExercises[key] = e.target.checked;
      saveState();
      renderExerciseList(day);
      renderAll();
      if (e.target.checked) {
        const { done: d2, total } = dayCompletionRatio(day);
        showCelebration(d2 === total ? t("celeb_day") : t("celeb_ex"));
      }
    });
    row.querySelector(".ex-body").addEventListener("click", () => openExerciseModal(day, ex, idx));
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
function openVideoModal(ex) {
  document.getElementById("videoModalTitle").textContent = localizedName(ex, "name");
  const frame = document.getElementById("videoFrame");
  const note = document.getElementById("videoPlaceholderNote");
  frame.innerHTML = "";
  if (ex.videoUrl) {
    frame.innerHTML = `<iframe src="${ex.videoUrl}" allowfullscreen></iframe>`;
    note.textContent = "";
  } else {
    frame.textContent = "🎥";
    note.textContent = state.lang === "ar"
      ? "لم يتم إضافة رابط فيديو لهذا التمرين بعد."
      : "No video link has been added for this exercise yet.";
  }
  document.getElementById("videoModal").classList.remove("hidden");
}

function openExerciseModal(day, ex, idx) {
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
document.querySelectorAll("[data-close]").forEach(btn => {
  btn.addEventListener("click", () => closeModal(btn.dataset.close));
});
document.querySelectorAll(".modal-overlay").forEach(ov => {
  ov.addEventListener("click", (e) => { if (e.target === ov) ov.classList.add("hidden"); });
});

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
  const monthNames = state.lang === "ar"
    ? ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"]
    : ["January","February","March","April","May","June","July","August","September","October","November","December"];
  document.getElementById("calMonthLabel").textContent = monthNames[month] + " " + year;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.className = "cal-cell empty";
    grid.appendChild(empty);
  }

  let doneTotal = 0, markedTotal = 0;
  for (let day = 1; day <= daysInMonth; day++) {
    const iso = new Date(year, month, day).toISOString().slice(0, 10);
    const status = state.calendar[iso];
    const cell = document.createElement("div");
    cell.className = "cal-cell" + (status ? " " + status : "");
    cell.innerHTML = `<span>${day}</span>`;
    cell.addEventListener("click", () => cycleCalendarDay(iso));
    grid.appendChild(cell);
    if (status === "workout" || status === "done") { markedTotal++; if (status === "done") doneTotal++; }
  }
  document.getElementById("commitmentPct").textContent = markedTotal ? Math.round((doneTotal / markedTotal) * 100) + "%" : "0%";
}

function cycleCalendarDay(iso) {
  const order = [undefined, "workout", "done", "rest"];
  const current = state.calendar[iso];
  const idx = order.indexOf(current);
  const next = order[(idx + 1) % order.length];
  if (next === undefined) delete state.calendar[iso];
  else state.calendar[iso] = next;
  saveState();
  renderCalendar();
  renderDashboard();
}

document.getElementById("calPrev").addEventListener("click", () => {
  calCursor.setMonth(calCursor.getMonth() - 1);
  renderCalendar();
});
document.getElementById("calNext").addEventListener("click", () => {
  calCursor.setMonth(calCursor.getMonth() + 1);
  renderCalendar();
});

/* ---------------- Weight tracker ---------------- */
document.getElementById("weightForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const date = document.getElementById("weightDate").value;
  const weight = parseFloat(document.getElementById("weightValue").value);
  if (!date || isNaN(weight)) return;
  state.weightHistory.push({ date, weight });
  state.weightHistory.sort((a, b) => a.date.localeCompare(b.date));
  saveState();
  document.getElementById("weightForm").reset();
  renderWeight();
  renderDashboard();
  renderProgress();
});

function renderWeight() {
  const tbody = document.querySelector("#weightTable tbody");
  tbody.innerHTML = "";
  state.weightHistory.slice().reverse().forEach((entry, revIdx) => {
    const realIdx = state.weightHistory.length - 1 - revIdx;
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${entry.date}</td><td>${entry.weight} kg</td>
      <td><button data-idx="${realIdx}">✕</button></td>`;
    tr.querySelector("button").addEventListener("click", () => {
      state.weightHistory.splice(realIdx, 1);
      saveState();
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
  const data = state.weightHistory;
  if (data.length < 2) {
    ctx.fillStyle = "#B89AB4";
    ctx.font = "13px sans-serif";
    ctx.fillText(state.lang === "ar" ? "أضيفي وزنين على الأقل لعرض الرسم" : "Add at least two entries to see the chart", 16, 110);
    return;
  }
  const weights = data.map(d => d.weight);
  const min = Math.min(...weights) - 1, max = Math.max(...weights) + 1;
  const padding = 30;
  const stepX = (w - padding * 2) / (data.length - 1);
  ctx.strokeStyle = "#B89AB4";
  ctx.lineWidth = 3;
  ctx.beginPath();
  data.forEach((d, i) => {
    const x = padding + i * stepX;
    const y = 220 - padding - ((d.weight - min) / (max - min)) * (220 - padding * 2);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.fillStyle = "#F8C8DC";
  data.forEach((d, i) => {
    const x = padding + i * stepX;
    const y = 220 - padding - ((d.weight - min) / (max - min)) * (220 - padding * 2);
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });
}

/* ---------------- Measurements ---------------- */
document.getElementById("measureForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const date = document.getElementById("measureDate").value;
  if (!date) return;
  const entry = {
    date,
    chest: parseFloat(document.getElementById("m_chest").value) || null,
    waist: parseFloat(document.getElementById("m_waist").value) || null,
    abdomen: parseFloat(document.getElementById("m_abdomen").value) || null,
    hips: parseFloat(document.getElementById("m_hips").value) || null,
    thigh: parseFloat(document.getElementById("m_thigh").value) || null,
    arm: parseFloat(document.getElementById("m_arm").value) || null,
  };
  state.measurements.push(entry);
  state.measurements.sort((a, b) => a.date.localeCompare(b.date));
  saveState();
  document.getElementById("measureForm").reset();
  renderMeasurements();
  renderProgress();
});

const MEASURE_FIELDS = ["chest", "waist", "abdomen", "hips", "thigh", "arm"];
function renderMeasurements() {
  const container = document.getElementById("measureSummary");
  container.innerHTML = "";
  const list = state.measurements;
  if (!list.length) {
    container.innerHTML = `<div class="empty-note">${state.lang === "ar" ? "لا توجد قياسات مسجلة بعد" : "No measurements logged yet"}</div>`;
    return;
  }
  const current = list[list.length - 1];
  const previous = list.length > 1 ? list[list.length - 2] : null;
  MEASURE_FIELDS.forEach(f => {
    const cur = current[f], prev = previous ? previous[f] : null;
    const change = (cur != null && prev != null) ? (cur - prev).toFixed(1) : "--";
    const card = document.createElement("div");
    card.className = "measure-stat-card";
    card.innerHTML = `
      <div class="ms-label">${t("m_" + (f === "arm" ? "arm" : f))}</div>
      <div class="ms-row"><span>${t("p_current")}</span><strong>${cur != null ? cur + " cm" : "--"}</strong></div>
      <div class="ms-row"><span>${t("p_start") === "البداية" ? "السابق" : "Previous"}</span><span>${prev != null ? prev + " cm" : "--"}</span></div>
      <div class="ms-row"><span>${t("p_change")}</span><span>${change}</span></div>
    `;
    container.appendChild(card);
  });
}

/* ---------------- Progress ---------------- */
function renderProgress() {
  const wh = state.weightHistory;
  document.getElementById("pgWeightCurrent").textContent = wh.length ? wh[wh.length - 1].weight + " kg" : "--";
  document.getElementById("pgWeightStart").textContent = wh.length ? wh[0].weight + " kg" : "--";
  document.getElementById("pgWeightChange").textContent = wh.length > 1 ? (wh[wh.length - 1].weight - wh[0].weight).toFixed(1) + " kg" : "--";

  const ml = state.measurements;
  const measureList = document.getElementById("pgMeasureList");
  measureList.innerHTML = "";
  if (ml.length) {
    const current = ml[ml.length - 1];
    const previous = ml.length > 1 ? ml[ml.length - 2] : null;
    MEASURE_FIELDS.forEach(f => {
      const cur = current[f], prev = previous ? previous[f] : null;
      const diff = (cur != null && prev != null) ? (cur - prev).toFixed(1) : "--";
      const row = document.createElement("div");
      row.className = "pm-row";
      row.innerHTML = `<span>${t("m_" + f)}</span><strong>${diff}</strong>`;
      measureList.appendChild(row);
    });
  } else {
    measureList.innerHTML = `<div class="pm-row">${state.lang === "ar" ? "لا توجد بيانات" : "No data yet"}</div>`;
  }

  // consistency
  let done = 0, total = 0;
  Object.values(state.calendar).forEach(status => {
    if (status === "workout" || status === "done") { total++; if (status === "done") done++; }
  });
  document.getElementById("pcLabel").textContent = `${done}/${total}`;
  const circumference = 327;
  const ratio = total ? done / total : 0;
  document.getElementById("pcFill").style.strokeDashoffset = circumference - circumference * ratio;
}

/* ---------------- Render all ---------------- */
function renderAll() {
  renderDashboard();
  renderWorkoutsList();
  renderCalendar();
  renderWeight();
  renderMeasurements();
  renderProgress();
}

/* ---------------- Init ---------------- */
(function init() {
  document.getElementById("weightDate").value = todayISO();
  document.getElementById("measureDate").value = todayISO();
  applyLanguage();
  applyTheme();
  if (state.profile) {
    showApp();
  } else {
    document.getElementById("onboarding").classList.remove("hidden");
    document.getElementById("app").classList.add("hidden");
  }
})();
