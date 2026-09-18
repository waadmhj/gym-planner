/**
 * WORKOUT_DATA — the single source of truth for the training program.
 *
 * RULE: this file must contain ONLY what the user's real program specifies.
 * Do not add, remove, reorder, or reinterpret exercises, sets, reps, rest,
 * or equipment. If a value isn't specified, use "Not specified / غير محدد".
 *
 * Shape (copy this per day / per exercise):
 *
 * {
 *   id: "day1",                          // unique id, no spaces
 *   nameAr: "اليوم 1 — اسم اليوم",
 *   nameEn: "Day 1 — Day name",
 *   exercises: [
 *     {
 *       nameAr: "اسم التمرين بالعربي",
 *       nameEn: "Exercise name in English",
 *       equipmentAr: "الجهاز / المعدات",
 *       equipmentEn: "Equipment",
 *       sets: "4",
 *       reps: "10",                       // or duration, as specified
 *       rest: "1 minute",
 *       videoUrl: ""                      // fill in later, per exercise
 *     }
 *   ]
 * }
 */

const WORKOUT_DATA = {
  days: [
    // Paste your real training days & exercises here, following the shape above.
  ]
};
