// types/crs.ts

export type RawLanguageScores = {
    speaking: string;
    listening: string;
    reading: string;
    writing: string;
};

export type CLBScores = {
    L: number;
    R: number;
    W: number;
    S: number;
};

export type EducationLevel = 'Less than secondary school' | 'Secondary diploma' | 'One-year post-secondary program' | 'Two-year post-secondary program' | 'Bachelor’s degree' | 'Two or more post-secondary programs (one 3+ years)' | 'Master’s / Professional degree' | 'Doctoral (PhD)';
export type WorkExp = 'No experience' | 'Less than 1 year' | '1 year' | '2 years' | '3 years' | '4 years' | '5+ years';
export type ForeignExp = 'No foreign experience' | 'Less than 1 year' | '1 year' | '2 years' | '3+ years';
export type MaritalStatus = 'Single / Never married' | 'Married / Common-law' | 'Divorced' | 'Widowed' | '';
export type contactMethod = 'Email'|'Phone'|'Both' | '';

export interface FormData {
    // STEP 1 & 2
    fullName: string;
    age: string;
    country: string;
    calculatorType: 'CRS' | 'WorkVisa' | 'Both';
    secondLangType:any;

    // STEP 3 - CRS ELIGIBILITY
    educationLevel: EducationLevel;
    canadianEducation: string;
    appliedBefore: 'yes' | 'no' | '';
    validPassport: 'yes' | 'no' | '';

    // STEP 4 - LANGUAGE PROFICIENCY
    testResultsRecent: 'yes' | 'no' | '';
    firstLangType: string;
    ieltsScores: RawLanguageScores; // Stores First Language Scores
    
    // Second Language
    hasSecondLanguage: 'yes' | 'no';
    secondTestType?: string; // Stores 'TEF Canada', 'IELTS GT', etc.
    secondSpeaking?: string; // Stores 'H', 'G', '7.5', etc.
    secondListening?: string;
    secondReading?: string;
    secondWriting?: string;

    // STEP 5 - WORK EXPERIENCE (CRS)
    currentOccupation: string;
    canadianWorkExp: WorkExp;
    foreignWorkExp: ForeignExp;
    tradeCertificate: 'Yes' | 'No' | '';
    provinceCertificate:'Yes' | 'No' | '';

    // STEP 6 - SPOUSE/PARTNER INFORMATION
    maritalStatus: MaritalStatus;
    spouseeducationLevel: EducationLevel;
    spouseCanadianEdu:string;
    spouseCanadianPR?: 'Yes' | 'No';
    spouseAccompany?: 'Yes' | 'No';
    siblingInCanada: 'Yes' | 'No' | '';
    spouseLangType:string;
    spouseieltsScores: RawLanguageScores; // Stores First Language Scores
    spouseResultsRecent: 'yes' | 'no' | '';

    resumeData?: '';
    // STEP 2B - WORK VISA CHECK
    jobOffer: 'Yes' | 'No' | '';
    lmiaStatus?: string;
    teerLevel?: string;
    experienceYears?: string;
    languageLevel?: string;

    // STEP 7 - CONTACT
    email: string;
    phoneNumber: string;
    preferredContact: contactMethod;
    agreeToReview: 'yes' | 'no';
    messageNotes: string;
    pastWorkInCanada:'Yes' | 'No' | '';
    pastStudyInCanada:'Yes' | 'No' | '';
    password?: string;  
}

export interface CRSResult {
    totalScore: number;
    humanCapital: number;
    spouseFactors: number;
    transferability: number;
    additional: number;
    age: number;
    education: number;
    language1: number;
    cdnWorkExp: number;
    eduTransferSubtotal: number;
    foreignExpTransferSubtotal: number;
}

export interface WorkVisaResult {
    score: number;
    eligible: boolean;
    breakdown: {
        age: number;
        education: number;
        experience: number;
        language: number;
        jobOffer: number;
        adaptability: number;
    };
}
