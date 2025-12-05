import { BreakdownRow, CalculationResult, SubsidyStatus } from '../types';

/**
 * Helper to add years to a date string (YYYY-MM-DD)
 */
const addYears = (dateStr: string, years: number): string => {
  const date = new Date(dateStr);
  date.setFullYear(date.getFullYear() + years);
  return date.toISOString().split('T')[0];
};

/**
 * Helper to check if a date is within a range (inclusive)
 */
const isDateBetween = (date: string, start: string, end: string): boolean => {
  if (!start || !end) return false;
  return date >= start && date <= end;
};

/**
 * Helper to determine subsidy amount based on seniority (years of service)
 */
const getSubsidyAmount = (seniority: number): number => {
  if (seniority < 1) return 0;
  if (seniority < 2) return 10000;
  if (seniority < 3) return 14000;
  return 18000;
};

export const calculateSubsidy = (
  hireDate: string,
  calcDate: string,
  suspendStart: string,
  suspendEnd: string,
  projectUsageDate: string
): CalculationResult => {
  const breakdown: BreakdownRow[] = [];
  let totalAmount = 0;

  // Validate inputs
  if (!hireDate || !calcDate) {
    return { totalAmount: 0, currentYearCount: 0, breakdown: [] };
  }

  // --- Step 1: Generate all anniversaries up to calcDate ---
  // We iterate starting from year 1 anniversary
  let yearCounter = 1;
  
  // Temporary storage to mark deduction years later
  interface TempRow {
    year: number;
    anniversaryDate: string;
    seniority: number;
    theoreticalAmount: number;
    status: SubsidyStatus;
    actualAmount: number;
  }
  
  const tempRows: TempRow[] = [];

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const anniversaryDate = addYears(hireDate, yearCounter);
    
    // Stop if anniversary is in the future relative to calculation date
    if (anniversaryDate > calcDate) {
      break;
    }

    const seniority = yearCounter;
    const theoreticalAmount = getSubsidyAmount(seniority);

    tempRows.push({
      year: yearCounter,
      anniversaryDate,
      seniority,
      theoreticalAmount,
      status: 'ELIGIBLE', // Default, will refine below
      actualAmount: 0,    // Will calculate below
    });

    yearCounter++;
  }

  // --- Step 2: Determine Project Usage Deduction Target ---
  // Rule: If projectUsageDate exists AND is within suspension period,
  // find the NEXT anniversary after projectUsageDate and mark it as DEDUCTED.
  let deductionYearIndex = -1;

  if (projectUsageDate && suspendStart && suspendEnd) {
    const isUsageInSuspension = isDateBetween(projectUsageDate, suspendStart, suspendEnd);
    
    if (isUsageInSuspension) {
      // Find the first anniversary strictly greater than projectUsageDate
      deductionYearIndex = tempRows.findIndex(row => row.anniversaryDate > projectUsageDate);
    }
  }

  // --- Step 3: Finalize Status and Amounts ---
  tempRows.forEach((row, index) => {
    let status: SubsidyStatus = 'ELIGIBLE';
    let actualAmount = row.theoreticalAmount;

    // 1. Priority: Project Deduction
    if (index === deductionYearIndex) {
      status = 'DEDUCTED';
      actualAmount = 0;
    } 
    // 2. Priority: Standard Suspension
    // If anniversary falls within suspension range
    else if (isDateBetween(row.anniversaryDate, suspendStart, suspendEnd)) {
      status = 'SUSPENDED';
      actualAmount = 0;
    }
    // 3. Normal Eligibility
    else {
      // If theoretical is 0 (seniority < 1), mark not eligible
      if (row.theoreticalAmount === 0) {
        status = 'NOT_ELIGIBLE';
      } else {
        status = 'ELIGIBLE';
      }
    }

    row.status = status;
    row.actualAmount = actualAmount;
    
    breakdown.push(row);
    totalAmount += actualAmount;
  });

  // --- Step 4: Calculate "Count in Calculation Year" ---
  // Logic: Check if the anniversary in the *calendar year* of calcDate 
  // has happened on or before calcDate and is VALID (ELIGIBLE).
  
  let currentYearCount = 0;
  const calcYear = parseInt(calcDate.split('-')[0], 10);
  
  // Find the row corresponding to the calcYear
  // We can just search in our generated breakdown
  const thisYearRow = breakdown.find(row => row.anniversaryDate.startsWith(String(calcYear)));

  if (thisYearRow) {
    // Check 1: Did the anniversary happen yet? (Already guaranteed by our generation loop which stops at calcDate)
    const hasOccurred = thisYearRow.anniversaryDate <= calcDate;
    
    // Check 2: Is it eligible?
    if (hasOccurred && thisYearRow.status === 'ELIGIBLE') {
      currentYearCount = 1;
    }
  }

  return {
    totalAmount,
    currentYearCount,
    breakdown,
  };
};
