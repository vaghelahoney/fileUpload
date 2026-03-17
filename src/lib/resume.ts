
export function extractSkills(text: string): string[] {
  console.log("🔍 Extracting skills...");

  // Normalize text
  const clean = text
    .replace(/\r/g, "")
    .replace(/\t/g, " ")
    .replace(/[ ]{2,}/g, " ")
    .trim();

  // Case-insensitive search
  const lower = clean.toLowerCase();

  const skillsStart = lower.indexOf("skills");
  if (skillsStart === -1) {
    console.log("❌ Skills section not found");
    return [];
  }

  // Stop at Education (very common in resumes)
  const stopWords = ["education", "experience", "projects"];
  let skillsEnd = clean.length;

  for (const word of stopWords) {
    const idx = lower.indexOf(word, skillsStart + 6);
    if (idx !== -1 && idx < skillsEnd) {
      skillsEnd = idx;
    }
  }

  // Extract raw skills block
  const rawSkillsBlock = clean
    .substring(skillsStart + 6, skillsEnd)
    .replace(/[:\-]/g, "")
    .trim();

  console.log("🧠 Raw skills block:\n", rawSkillsBlock);

  // Split skills safely
  const skills = rawSkillsBlock
    .split(/,|\n|•|·|\|/)
    .map((s) => s.trim())
    .filter(
      (s) =>
        s.length > 1 &&
        s.length < 40 && // avoid long sentences
        !/degree|college|university/i.test(s)
    );

  console.log("✅ Parsed skills:", skills);
  return skills;
}

export function extractEducation(text: string): string[] {
  const lower = text.toLowerCase();
  const start = lower.indexOf("education");
  if (start === -1) return [];

  const block = text.substring(start + 9);

  return block
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 5);
}

export function extractExperience(text: string): string[] {
  const lower = text.toLowerCase();
  const start = lower.indexOf("experience");
  if (start === -1) return [];

  const end = lower.indexOf("skills", start);
  const block = text.substring(start + 10, end === -1 ? text.length : end);

  return block
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 10);
}
