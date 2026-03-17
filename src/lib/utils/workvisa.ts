import { FormData as CRSFormData, WorkVisaResult } from '../types/crs';


export const calculateWorkVisaScore = (data: CRSFormData): WorkVisaResult => {
    let breakdown = { age: 0, education: 0, experience: 0, language: 0, jobOffer: 0, adaptability: 0 };
    // 1. AGE (Max 12)
    const age = parseInt(data.age) || 0;
    if (age >= 18 && age <= 35) breakdown.age = 12;
    else if (age === 36) breakdown.age = 11;
    else if (age === 37) breakdown.age = 10;
    else if (age === 38) breakdown.age = 9;
    else if (age === 39) breakdown.age = 8;
    else if (age === 40) breakdown.age = 7;
    else if (age === 41) breakdown.age = 6;
    else if (age === 42) breakdown.age = 5;
    else if (age === 43) breakdown.age = 4;
    else if (age === 44) breakdown.age = 3;
    else if (age === 45) breakdown.age = 2;
    else if (age === 46) breakdown.age = 1;
    else breakdown.age = 0;

    // 2. EDUCATION (Max 25) - Matches Step 1 Dropdown
    const edu = data.educationLevel || '';
    if (edu.includes('PhD')) breakdown.education = 25;
    else if (edu.includes('Master') || edu.includes('Professional')) breakdown.education = 23;
    else if (edu.includes('Two or more')) breakdown.education = 22;
    else if (edu.includes('Bachelor') || edu.includes('Three-year')) breakdown.education = 21;
    else if (edu.includes('Two-year')) breakdown.education = 19;
    else if (edu.includes('One-year')) breakdown.education = 15;
    else if (edu.includes('Secondary')) breakdown.education = 5;

    // 3. WORK EXPERIENCE (Max 15)
    // Matches your specific strings in indexwork.tsx
    if (data.experienceYears === '6+ years') breakdown.experience = 15;
    else if (data.experienceYears === '3–5 years') breakdown.experience = 11;
    else if (data.experienceYears === '1–2 years') breakdown.experience = 9;
    else breakdown.experience = 0; // Less than 1 year

    // 4. LANGUAGE (Max 28)(Max-24) 4 points is langugae 2 points
    // Matches your specific strings in indexwork.tsx
    if (data.languageLevel === 'CLB 9–10') breakdown.language = 26;
    else if (data.languageLevel === 'CLB 7–8') breakdown.language = 18;
    else breakdown.language = 0;
    // CLB 5-6 is 0 points for FSW (Minimum CLB 7 required)

    // 5. JOB OFFER (Max 10)
    // You receive 10 points for a valid job offer with LMIA
    const hasJob = data.jobOffer === 'Yes'; // Case sensitive check

    // Valid LMIA statuses based on your dropdown
    const validLMIA = ['Approved', 'LMIA Exempt'].includes(data.lmiaStatus || '');

    // Valid TEER (0,1,2,3 are eligible. 4 and 5 are usually not for FSW)
    const isTeerEligible = ['TEER 0', 'TEER 1', 'TEER 2', 'TEER 3'].includes(data.teerLevel || '');

    if (hasJob && validLMIA && isTeerEligible) {
        breakdown.jobOffer = 10;
    }

    // 6. ADAPTABILITY (Max 10)
    // Since we removed the questions, we only calculate "Arranged Employment" points here.
    // Rule: If you have a valid job offer (10 pts), you get +5 Adaptability points automatically.
    if (breakdown.jobOffer === 10) {
        breakdown.adaptability = 10;
    }

    // TOTAL
    const total = Object.values(breakdown).reduce((a, b) => a + b, 0);

    // ELIGIBILITY CHECK
    // Rule: Must have 67 Points AND Minimum CLB 7 Language
    const meetsLanguageReq = ['CLB 7–8', 'CLB 9–10'].includes(data.languageLevel || '');

    return {
        score: total,
        eligible: total >= 67 && meetsLanguageReq,
        breakdown
    };
};