export interface CalculationInputs {
  hireDate: string;
  calcDate: string;
  suspendStart: string;
  suspendEnd: string;
  projectUsageDate: string; // New field for Project Usage Date
}

export type SubsidyStatus = 'ELIGIBLE' | 'SUSPENDED' | 'DEDUCTED' | 'NOT_ELIGIBLE';

export interface BreakdownRow {
  year: number; // 1, 2, 3...
  anniversaryDate: string; // YYYY-MM-DD
  seniority: number; // Years of service
  theoreticalAmount: number;
  status: SubsidyStatus; // Replaces boolean isSuspended
  actualAmount: number;
}

export interface CalculationResult {
  totalAmount: number;
  currentYearCount: number; // 0 or 1
  breakdown: BreakdownRow[];
}
