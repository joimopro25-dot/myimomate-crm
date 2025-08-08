// utils/InvestmentCalculator.js - Advanced Investment Calculations
export class InvestmentCalculator {
  constructor(dealData) {
    this.data = dealData;
  }

  // Basic Investment Calculations
  getTotalInvestment() {
    return (
      parseFloat(this.data.propertyPrice || 0) +
      parseFloat(this.data.buyTaxes || 0) +
      parseFloat(this.data.legalFees || 0) +
      parseFloat(this.data.renovationBudget || 0) +
      parseFloat(this.data.emergencyFund || 0)
    );
  }

  // Rental Income Calculations
  getGrossAnnualRent() {
    return parseFloat(this.data.monthlyRent || 0) * 12;
  }

  getNetAnnualRent() {
    const gross = this.getGrossAnnualRent();
    const vacancy = gross * (parseFloat(this.data.vacancyRate || 0) / 100);
    return gross - vacancy;
  }

  // Operating Expenses
  getTotalAnnualExpenses() {
    return (
      parseFloat(this.data.propertyTax || 0) +
      parseFloat(this.data.insurance || 0) +
      parseFloat(this.data.maintenance || 0) +
      parseFloat(this.data.management || 0)
    );
  }

  // NEW: Advanced Loan Calculations
  getLoanPayments() {
    const loanAmount = parseFloat(this.data.bankLoan || 0);
    const annualRate = parseFloat(this.data.interestRate || 4.5) / 100; // Default 4.5%
    const years = parseFloat(this.data.loanTerm || 30); // Default 30 years
    
    if (loanAmount === 0 || annualRate === 0) return 0;
    
    const monthlyRate = annualRate / 12;
    const numPayments = years * 12;
    
    // Monthly payment formula
    const monthlyPayment = loanAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
      (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    return {
      monthlyPayment: monthlyPayment,
      annualPayment: monthlyPayment * 12,
      totalInterest: (monthlyPayment * numPayments) - loanAmount,
      totalPayments: monthlyPayment * numPayments
    };
  }

  // NEW: Portuguese Tax Benefits Calculations
  getTaxBenefits() {
    const netRentalIncome = this.getNetAnnualRent() - this.getTotalAnnualExpenses();
    const loanInterest = this.getLoanPayments().annualPayment * 0.8; // Estimate 80% goes to interest
    const depreciation = parseFloat(this.data.propertyPrice || 0) * 0.02; // 2% annual depreciation
    
    // Deductible expenses for Portuguese tax purposes
    const deductibleExpenses = 
      this.getTotalAnnualExpenses() + 
      loanInterest + 
      depreciation;
    
    // Taxable rental income (can be negative = tax benefit)
    const taxableIncome = Math.max(0, netRentalIncome - deductibleExpenses);
    
    // Portuguese rental income tax rates (simplified)
    const taxRate = 0.28; // 28% for rental income
    const taxLiability = taxableIncome * taxRate;
    
    // Tax savings from expenses
    const taxSavings = deductibleExpenses * taxRate;
    
    return {
      taxableIncome,
      taxLiability,
      taxSavings,
      deductibleExpenses,
      effectiveIncome: netRentalIncome - taxLiability
    };
  }

  // NEW: Cash Flow Analysis
  getCashFlowAnalysis() {
    const netRent = this.getNetAnnualRent();
    const expenses = this.getTotalAnnualExpenses();
    const loanPayments = this.getLoanPayments().annualPayment;
    const taxBenefits = this.getTaxBenefits();
    
    // Net Operating Income (NOI)
    const noi = netRent - expenses;
    
    // Cash Flow Before Tax
    const cashFlowBeforeTax = noi - loanPayments;
    
    // Cash Flow After Tax
    const cashFlowAfterTax = cashFlowBeforeTax - taxBenefits.taxLiability;
    
    return {
      grossRent: this.getGrossAnnualRent(),
      netRent,
      expenses,
      noi,
      loanPayments,
      cashFlowBeforeTax,
      cashFlowAfterTax,
      taxImpact: taxBenefits.taxLiability
    };
  }

  // NEW: Return Calculations
  getReturnMetrics() {
    const totalInvestment = this.getTotalInvestment();
    const downPayment = totalInvestment - parseFloat(this.data.bankLoan || 0);
    const cashFlow = this.getCashFlowAnalysis();
    const propertyValue = parseFloat(this.data.propertyPrice || 0);
    
    // Cash-on-Cash Return (cash flow / down payment)
    const cashOnCashReturn = downPayment > 0 ? 
      (cashFlow.cashFlowAfterTax / downPayment) * 100 : 0;
    
    // Cap Rate (NOI / property value)
    const capRate = propertyValue > 0 ? 
      (cashFlow.noi / propertyValue) * 100 : 0;
    
    // Gross Rent Multiplier
    const grm = propertyValue > 0 ? 
      propertyValue / this.getGrossAnnualRent() : 0;
    
    // 1% Rule Check (monthly rent / property price)
    const onePercentRule = propertyValue > 0 ? 
      (parseFloat(this.data.monthlyRent || 0) / propertyValue) * 100 : 0;
    
    return {
      cashOnCashReturn,
      capRate,
      grm,
      onePercentRule,
      totalROI: totalInvestment > 0 ? (cashFlow.cashFlowAfterTax / totalInvestment) * 100 : 0
    };
  }

  // NEW: Break-even Analysis
  getBreakEvenAnalysis() {
    const expenses = this.getTotalAnnualExpenses();
    const loanPayments = this.getLoanPayments().annualPayment;
    const totalMonthlyCosts = (expenses + loanPayments) / 12;
    
    // Minimum rent needed to break even
    const breakEvenRent = totalMonthlyCosts / (1 - parseFloat(this.data.vacancyRate || 5) / 100);
    
    // Current rent cushion
    const currentRent = parseFloat(this.data.monthlyRent || 0);
    const rentCushion = currentRent - breakEvenRent;
    const cushionPercentage = breakEvenRent > 0 ? (rentCushion / breakEvenRent) * 100 : 0;
    
    return {
      breakEvenRent,
      currentRent,
      rentCushion,
      cushionPercentage,
      isPositive: rentCushion > 0
    };
  }

  // NEW: Scenario Analysis
  getScenarioAnalysis() {
    const baseROI = this.getReturnMetrics().cashOnCashReturn;
    
    // Optimistic scenario (+20% rent, -10% expenses)
    const optimisticData = {
      ...this.data,
      monthlyRent: parseFloat(this.data.monthlyRent || 0) * 1.2,
      maintenance: parseFloat(this.data.maintenance || 0) * 0.9
    };
    const optimisticCalc = new InvestmentCalculator(optimisticData);
    const optimisticROI = optimisticCalc.getReturnMetrics().cashOnCashReturn;
    
    // Pessimistic scenario (-10% rent, +20% expenses)
    const pessimisticData = {
      ...this.data,
      monthlyRent: parseFloat(this.data.monthlyRent || 0) * 0.9,
      maintenance: parseFloat(this.data.maintenance || 0) * 1.2
    };
    const pessimisticCalc = new InvestmentCalculator(pessimisticData);
    const pessimisticROI = pessimisticCalc.getReturnMetrics().cashOnCashReturn;
    
    return {
      base: { scenario: 'Base Case', roi: baseROI },
      optimistic: { scenario: 'Optimistic', roi: optimisticROI },
      pessimistic: { scenario: 'Pessimistic', roi: pessimisticROI }
    };
  }

  // NEW: Investment Score (0-100)
  getInvestmentScore() {
    const returns = this.getReturnMetrics();
    const breakEven = this.getBreakEvenAnalysis();
    
    let score = 0;
    
    // Cash-on-Cash Return (40 points max)
    if (returns.cashOnCashReturn >= 15) score += 40;
    else if (returns.cashOnCashReturn >= 10) score += 30;
    else if (returns.cashOnCashReturn >= 6) score += 20;
    else if (returns.cashOnCashReturn >= 3) score += 10;
    
    // Cap Rate (20 points max)
    if (returns.capRate >= 8) score += 20;
    else if (returns.capRate >= 6) score += 15;
    else if (returns.capRate >= 4) score += 10;
    else if (returns.capRate >= 2) score += 5;
    
    // 1% Rule (20 points max)
    if (returns.onePercentRule >= 1) score += 20;
    else if (returns.onePercentRule >= 0.8) score += 15;
    else if (returns.onePercentRule >= 0.6) score += 10;
    else if (returns.onePercentRule >= 0.4) score += 5;
    
    // Break-even cushion (20 points max)
    if (breakEven.cushionPercentage >= 30) score += 20;
    else if (breakEven.cushionPercentage >= 20) score += 15;
    else if (breakEven.cushionPercentage >= 10) score += 10;
    else if (breakEven.cushionPercentage >= 0) score += 5;
    
    return {
      score,
      grade: score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : 'D',
      recommendation: this.getRecommendation(score)
    };
  }

  getRecommendation(score) {
    if (score >= 80) return 'Excellent investment opportunity. Strong fundamentals across all metrics.';
    if (score >= 60) return 'Good investment with solid returns. Consider proceeding with caution on weaker areas.';
    if (score >= 40) return 'Marginal investment. Requires careful analysis and possibly better terms.';
    return 'Poor investment fundamentals. Consider passing or renegotiating significantly.';
  }

  // Complete Analysis Summary
  getCompleteAnalysis() {
    return {
      investment: {
        totalInvestment: this.getTotalInvestment(),
        downPayment: this.getTotalInvestment() - parseFloat(this.data.bankLoan || 0)
      },
      cashFlow: this.getCashFlowAnalysis(),
      returns: this.getReturnMetrics(),
      loan: this.getLoanPayments(),
      taxes: this.getTaxBenefits(),
      breakEven: this.getBreakEvenAnalysis(),
      scenarios: this.getScenarioAnalysis(),
      score: this.getInvestmentScore()
    };
  }
}

// Portuguese Real Estate Helper Functions
export const PortugueseRealEstateUtils = {
  // Calculate IMT (Property Transfer Tax)
  calculateIMT(propertyValue, isResidential = true, isFirstHome = false) {
    if (isFirstHome && propertyValue <= 92407) return 0;
    
    const brackets = isResidential ? [
      { min: 0, max: 92407, rate: 0 },
      { min: 92407, max: 126403, rate: 0.02 },
      { min: 126403, max: 172348, rate: 0.05 },
      { min: 172348, max: 287213, rate: 0.07 },
      { min: 287213, max: 574323, rate: 0.08 },
      { min: 574323, max: Infinity, rate: 0.06 }
    ] : [
      { min: 0, max: Infinity, rate: 0.065 } // Commercial rate
    ];
    
    let tax = 0;
    for (const bracket of brackets) {
      if (propertyValue > bracket.min) {
        const taxableAmount = Math.min(propertyValue, bracket.max) - bracket.min;
        tax += taxableAmount * bracket.rate;
      }
    }
    
    return tax;
  },

  // Calculate Stamp Duty
  calculateStampDuty(propertyValue) {
    return propertyValue * 0.008; // 0.8%
  },

  // Estimate legal and notary fees
  estimateLegalFees(propertyValue) {
    return Math.max(1000, propertyValue * 0.005); // Min €1000 or 0.5%
  },

  // Get typical rental yields by region
  getTypicalYields() {
    return {
      'Lisboa': { min: 3.5, max: 5.5, average: 4.5 },
      'Porto': { min: 4.0, max: 6.0, average: 5.0 },
      'Braga': { min: 4.5, max: 6.5, average: 5.5 },
      'Aveiro': { min: 4.0, max: 6.0, average: 5.0 },
      'Coimbra': { min: 4.5, max: 6.5, average: 5.5 },
      'Vila Real': { min: 5.0, max: 7.0, average: 6.0 },
      'National Average': { min: 4.0, max: 6.0, average: 5.0 }
    };
  }
};