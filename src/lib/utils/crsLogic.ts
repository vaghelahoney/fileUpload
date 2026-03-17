import { FormData as CRSFormData, CRSResult } from '../types/crs';

// --- 1. DATA TABLES (Omitted for brevity, assumed unchanged) ---
const AgePoints: Record<string, Record<number, number>> = {
    Single: { 17: 0, 18: 99, 19: 105, 20: 110, 21: 110, 22: 110, 23: 110, 24: 110, 25: 110, 26: 110, 27: 110, 28: 110, 29: 110, 30: 105, 31: 99, 32: 94, 33: 88, 34: 83, 35: 77, 36: 72, 37: 66, 38: 61, 39: 55, 40: 50, 41: 39, 42: 28, 43: 17, 44: 6, 45: 0 },
    WithSpouse: { 17: 0, 18: 90, 19: 95, 20: 100, 21: 100, 22: 100, 23: 100, 24: 100, 25: 100, 26: 100, 27: 100, 28: 100, 29: 100, 30: 95, 31: 90, 32: 85, 33: 80, 34: 75, 35: 70, 36: 65, 37: 60, 38: 55, 39: 50, 40: 45, 41: 35, 42: 25, 43: 15, 44: 5, 45: 0 },
};

const EducationPoints: Record<string, Record<string, number>> = {
    Single: {
        'Less than secondary school': 0, 'Secondary diploma': 30, 'One-year post-secondary program': 90, 'Two-year post-secondary program': 98, "Bachelor's degree": 120, 'Two or more post-secondary programs (one 3+ years)': 128, 'Master\'s / Professional degree': 135, 'Doctoral (PhD)': 150
    },
    WithSpouse: {
        'Less than secondary school': 0, 'Secondary diploma': 28, 'One-year post-secondary program': 84, 'Two-year post-secondary program': 91, "Bachelor's degree": 112, 'Two or more post-secondary programs (one 3+ years)': 119, 'Master\'s / Professional degree': 126, 'Doctoral (PhD)': 140
    }
};

const Language1Points: Record<string, Record<number, number>> = {
    Single: { 10: 34, 9: 31, 8: 23, 7: 17, 6: 9, 5: 6, 4: 6, 0: 0 },
    WithSpouse: { 10: 32, 9: 29, 8: 22, 7: 16, 6: 8, 5: 6, 4: 6, 0: 0 }
};

const Language2Points: Record<string, Record<number, number>> = {
    Points: { 10: 6, 9: 6, 8: 3, 7: 3, 6: 1, 5: 1, 4: 0, 0: 0 }
};

const CdnWorkExpPoints: Record<string, Record<string, number>> = {
    Single: { 'No experience': 0, 'Less than 1 year': 0, '1 year': 40, '2 years': 53, '3 years': 64, '4 years': 72, '5+ years': 80 },
    WithSpouse: { 'No experience': 0, 'Less than 1 year': 0, '1 year': 35, '2 years': 46, '3 years': 56, '4 years': 63, '5+ years': 70 }
};

const TransferEdu = {
    'Doctoral (PhD)': { CLB7: 25, CLB9: 50, CdnExp1: 25, CdnExp2: 50 },
    'Master\'s / Professional degree': { CLB7: 25, CLB9: 50, CdnExp1: 25, CdnExp2: 50 },
    'Two or more post-secondary programs (one 3+ years)': { CLB7: 25, CLB9: 50, CdnExp1: 25, CdnExp2: 50 },
    "Bachelor's degree": { CLB7: 13, CLB9: 25, CdnExp1: 13, CdnExp2: 25 },
    'Three-year or longer post-secondary credential': { CLB7: 13, CLB9: 25, CdnExp1: 13, CdnExp2: 25 },
    'One-year post-secondary program': { CLB7: 13, CLB9: 25, CdnExp1: 13, CdnExp2: 25 },
    'Two-year post-secondary program': { CLB7: 13, CLB9: 25, CdnExp1: 13, CdnExp2: 25 },
};

const TransferForeignExp = {
    '1 or 2 years': { CLB7: 13, CLB9: 25, CdnExp1: 13, CdnExp2: 25 },
    '3 years or more': { CLB7: 25, CLB9: 50, CdnExp1: 25, CdnExp2: 50 },
};

const AdditionalPoints = {
    Sibling: 15,
    PNP: 600,
    CdnEdu: { '1–2 year credential': 15, '3+ year credential': 30, 'No Canadian post-secondary education': 0 },
};

// --- 2. HELPER FUNCTIONS (Omitted for brevity, assumed unchanged) ---
const convertScoreToCLB = (scoreCode: string): number => {
    if (scoreCode === 'H') return 10;
    if (scoreCode === 'G') return 9;
    if (scoreCode === 'F') return 8;
    if (scoreCode === 'E') return 7;
    if (scoreCode === 'D') return 6;
    if (scoreCode === 'C') return 5;
    if (scoreCode === 'B') return 4;
    if (scoreCode === 'A') return 3; 
    return 0;
};

const getWorkExpKey = (exp: string) => {
    if (exp === 'No experience' || exp === 'No foreign experience' || exp === 'Less than 1 year') return 0;
    if (exp === '1 year') return 1;
    if (exp === '2 years') return 2;
    if (exp === '3 years') return 3;
    if (exp === '3+ years') return 3;
    if (exp === '4 years') return 4;
    if (exp === '5+ years') return 5;
    return 0;
};

// --- 3. MAIN CALCULATION ---

// --- 3. MAIN CALCULATION ---

export function calculateCRSScore(formData: CRSFormData): CRSResult {
    const isSingle = (formData.maritalStatus === 'Single / Never married' || 
                      formData.maritalStatus === 'Divorced' || 
                      formData.maritalStatus === 'Widowed');
                      
    const statusKey = isSingle ? 'Single' : 'WithSpouse';
    let totalScore = 0;
    let humanCapital = 0;
    
    // 1. Age
    const age = parseInt(formData.age) || 0;
    const safeAge = age > 45 ? 45 : age;
    const ageScore = AgePoints[statusKey][safeAge] || 0;
    humanCapital += ageScore;

    // 2. Education
    const educationScore = EducationPoints[statusKey][formData.educationLevel] || 0;
    humanCapital += educationScore;

    // 3. First Language
    const scores = formData.ieltsScores || { speaking: '', listening: '', reading: '', writing: '' };
    // Convert First Language scores to CLB
    const clb1 = {
        L: convertScoreToCLB(scores.listening), 
        R: convertScoreToCLB(scores.reading), 
        W: convertScoreToCLB(scores.writing), 
        S: convertScoreToCLB(scores.speaking)
    };
    
    const getLang1Points = (clbVal: number) => {
        const key = clbVal >= 10 ? 10 : clbVal;
        return Language1Points[statusKey][key] || 0;
    };
    const language1Score = getLang1Points(clb1.L) + getLang1Points(clb1.R) + getLang1Points(clb1.W) + getLang1Points(clb1.S);
    humanCapital += language1Score;

    // 4. Second Language
    let language2Score = 0;
    // Calculate CLB for Second Language (We need this for both points AND the French bonus later)
    const clb2 = {
        L: convertScoreToCLB(formData.secondListening || ''), 
        R: convertScoreToCLB(formData.secondReading || ''), 
        W: convertScoreToCLB(formData.secondWriting || ''), 
        S: convertScoreToCLB(formData.secondSpeaking || '')
    };

    if (formData.hasSecondLanguage === 'yes') { 
        const getLang2Points = (clbVal: number) => {
            const key = clbVal >= 10 ? 10 : clbVal;
            return Language2Points.Points[key] || 0;
        };
        language2Score = getLang2Points(clb2.L) + getLang2Points(clb2.R) + getLang2Points(clb2.W) + getLang2Points(clb2.S);
        const maxLang2 = isSingle ? 24 : 22;
        language2Score = Math.min(language2Score, maxLang2);
    }
    humanCapital += language2Score;

    // 5. Canadian Work Experience
    const cdnWorkExpScore = CdnWorkExpPoints[statusKey][formData.canadianWorkExp] || 0;
    humanCapital += cdnWorkExpScore;

    // --- B. Spouse Factors ---
    let spouseFactors = 0;
    const SpouseEduPoints: Record<string, number> = {
        'Less than secondary school': 0, 'Secondary diploma': 2, 'One-year post-secondary program': 6, 
        'Two-year post-secondary program': 7, "Bachelor's degree": 8, 'Two or more post-secondary programs (one 3+ years)': 9, 
        'Master\'s / Professional degree': 10, 'Doctoral (PhD)': 10
    };
    const SpouseLanguagePoints: Record<number, number> = { 10: 5, 9: 5, 8: 3, 7: 3, 6: 1, 5: 1, 4: 0, 3: 0 };
    const SpouseWorkExpPoints: Record<string, number> = { 
        '5+ years': 10, '4 years': 9, '3 years': 8, '2 years': 7, '1 year': 5, 'No experience': 0, 'Less than 1 year': 0
    };

    if (!isSingle) {
        spouseFactors += SpouseEduPoints[formData.spouseeducationLevel || ''] || 0;
        spouseFactors += SpouseWorkExpPoints[formData.spouseCanadianEdu || 'No experience'] || 0;
        
        let spouseLangScore = 0;
        if (formData.spouseLangType && formData.spouseLangType !== 'Not applicable') {
             const spouseScores = formData.spouseieltsScores || { speaking: '', listening: '', reading: '', writing: '' };
             const clb_s = convertScoreToCLB(spouseScores.speaking);
             const clb_l = convertScoreToCLB(spouseScores.listening);
             const clb_r = convertScoreToCLB(spouseScores.reading);
             const clb_w = convertScoreToCLB(spouseScores.writing);

             spouseLangScore = (SpouseLanguagePoints[clb_s] || 0) + (SpouseLanguagePoints[clb_l] || 0) + 
                               (SpouseLanguagePoints[clb_r] || 0) + (SpouseLanguagePoints[clb_w] || 0);

             spouseFactors += Math.min(spouseLangScore, 20);
        }
    }

    // --- C. Skill Transferability (Max 100) ---
    let transferability = 0;
    const cdnExpYears = getWorkExpKey(formData.canadianWorkExp);
    const foreignExpYears = getWorkExpKey(formData.foreignWorkExp);
    
    const hasCLB7 = clb1.L >= 7 && clb1.R >= 7 && clb1.W >= 7 && clb1.S >= 7;
    const hasCLB9 = clb1.L >= 9 && clb1.R >= 9 && clb1.W >= 9 && clb1.S >= 9;

    const eduLevel = formData.educationLevel;
    const eduData = TransferEdu[eduLevel as keyof typeof TransferEdu] || { CLB7: 0, CLB9: 0, CdnExp1: 0, CdnExp2: 0 };

    // 1. Education Combinations
    let eduCombo = 0;
    if (hasCLB9) eduCombo += eduData.CLB9; else if (hasCLB7) eduCombo += eduData.CLB7;
    let eduCdnCombo = 0;
    if (cdnExpYears >= 2) eduCdnCombo += eduData.CdnExp2; else if (cdnExpYears === 1) eduCdnCombo += eduData.CdnExp1;
    const finalEduTransfer = Math.min(50, eduCombo + eduCdnCombo);

    // 2. Foreign Exp Combinations
    let foreignCombo = 0;
    const foreignKey = foreignExpYears >= 3 ? '3 years or more' : (foreignExpYears >= 1 ? '1 or 2 years' : '');
    const foreignData = TransferForeignExp[foreignKey as keyof typeof TransferForeignExp];

    let finalForeignTransfer = 0;
    if (foreignData) {
        if (hasCLB9) foreignCombo += foreignData.CLB9; else if (hasCLB7) foreignCombo += foreignData.CLB7;
        let foreignCdnCombo = 0;
        if (cdnExpYears >= 2) foreignCdnCombo += foreignData.CdnExp2; else if (cdnExpYears === 1) foreignCdnCombo += foreignData.CdnExp1;
        finalForeignTransfer = Math.min(50, foreignCombo + foreignCdnCombo);
    }

    // 3. Certificate
    let certificatePoints = 0;
    if (formData.tradeCertificate === 'Yes') {
        certificatePoints = 25; 
        // Bonus points for Certificate + CLB 5 or CLB 7 often apply here too in real CRS, 
        // but based on your file structure, we keep it simple as 25.
    }

    transferability = Math.min(100, finalEduTransfer + finalForeignTransfer + certificatePoints);

    // --- D. Additional Points ---
    let additional = 0;

    // 1. PNP
    if (formData.provinceCertificate === 'Yes') {
        additional += AdditionalPoints.PNP; 
    }

    // 2. Sibling & Canadian Education
    if (formData.siblingInCanada === 'Yes') additional += AdditionalPoints.Sibling;
    if (formData.canadianEducation !== 'No Canadian post-secondary education') {
        additional += AdditionalPoints.CdnEdu[formData.canadianEducation as keyof typeof AdditionalPoints.CdnEdu] || 0;
    }

    // 3. French Language Bonus (New Logic)
    const frenchTests = ['TEF Canada', 'TCF Canada'];
    const englishTests = ['IELTS GT', 'CELPIP-G', 'PTE Core'];

    // Helper: Check if a CLB object meets a threshold (e.g., 7 or 5)
    const checkScores = (c: typeof clb1, threshold: number) => 
        c.L >= threshold && c.R >= threshold && c.W >= threshold && c.S >= threshold;

    let hasFrenchNCLC7 = false;
    let hasEnglishCLB5 = false;

    // Check First Language
    if (frenchTests.includes(formData.firstLangType)) {
        if (checkScores(clb1, 7)) hasFrenchNCLC7 = true;
    } else if (englishTests.includes(formData.firstLangType)) {
        if (checkScores(clb1, 5)) hasEnglishCLB5 = true;
    }

    // Check Second Language
    if (formData.hasSecondLanguage === 'yes' && formData.secondTestType) {
        if (frenchTests.includes(formData.secondTestType)) {
            if (checkScores(clb2, 7)) hasFrenchNCLC7 = true;
        } else if (englishTests.includes(formData.secondTestType)) {
            if (checkScores(clb2, 5)) hasEnglishCLB5 = true;
        }
    }

    // Apply the 25 or 50 points rule
    if (hasFrenchNCLC7) {
        if (hasEnglishCLB5) {
            additional += 50; // French (7+) + English (5+)
        } else {
            additional += 25; // French (7+) only
        }
    }

    // CAP THE ADDITIONAL POINTS AT 600
    const cappedAdditional = Math.min(600, additional);

    // Final Tally
    totalScore = Math.min(500, humanCapital + spouseFactors) + transferability + cappedAdditional;

    return {
        totalScore,
        humanCapital,
        spouseFactors,
        transferability,
        additional: cappedAdditional, 
        age: ageScore,
        education: educationScore,
        language1: language1Score,
        cdnWorkExp: cdnWorkExpScore,
        eduTransferSubtotal: finalEduTransfer,
        foreignExpTransferSubtotal: finalForeignTransfer
    };
}