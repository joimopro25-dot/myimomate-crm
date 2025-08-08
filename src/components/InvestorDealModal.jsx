// components/InvestorDealModal.jsx
import React, { useState } from 'react';
import { 
  X, 
  Calculator, 
  TrendingUp, 
  Home, 
  Euro,
  Target,
  Clock,
  PieChart,
  MapPin,
  BarChart3
} from 'lucide-react';
// import { InvestmentCalculator } from '../utils/InvestmentCalculator';
import MarketDataBoard from './MarketDataBoard';

const InvestorDealModal = ({ 
  isOpen, 
  onClose, 
  client, 
  onSaveDeal 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showMarketData, setShowMarketData] = useState(false);
  const [dealData, setDealData] = useState({
    // Basic Info
    propertyAddress: '',
    investmentType: 'buy-to-rent',
    
    // Investment Details
    propertyPrice: '',
    propertyVPT: '',
    buyTaxesIMT: '',
    buyTaxesIS: '',
    legalFees: '',
    renovationBudget: '',
    emergencyFund: '',
    
    // Financing
    bankLoan: '',
    ownCapital: '',
    interestRate: '4.5', // Default Portuguese rate
    loanTerm: '30', // Default 30 years
    
    // Rental Income (for buy-to-rent)
    monthlyRent: '',
    vacancyRate: '5',
    
    // Annual Expenses
    propertyTax: '',
    insurance: '',
    maintenance: '',
    management: '',
    
    // Goals
    targetAnnualReturn: '',
    holdingPeriod: '10'
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'investment', label: 'Investment', icon: Euro },
    { id: 'financing', label: 'Financing', icon: Calculator },
    { id: 'returns', label: 'Returns', icon: TrendingUp }
  ];

  // SIMPLE CALCULATIONS with safe fallbacks
  const safeNumber = (value) => parseFloat(value || 0);
  
  // Calculate basic values first
  const totalInvestment = (
    safeNumber(dealData.propertyPrice) +
    safeNumber(dealData.buyTaxesIMT) +
    safeNumber(dealData.buyTaxesIS) +
    safeNumber(dealData.legalFees) +
    safeNumber(dealData.renovationBudget) +
    safeNumber(dealData.emergencyFund)
  );
  
  const monthlyRent = safeNumber(dealData.monthlyRent);
  const annualRent = monthlyRent * 12;
  const vacancy = annualRent * (safeNumber(dealData.vacancyRate) / 100);
  const netRent = annualRent - vacancy;
  const totalExpenses = safeNumber(dealData.propertyTax) + safeNumber(dealData.insurance) + safeNumber(dealData.maintenance) + safeNumber(dealData.management);
  const noi = netRent - totalExpenses;
  
  // Loan calculations
  const loanAmount = safeNumber(dealData.bankLoan);
  const annualRate = safeNumber(dealData.interestRate) / 100;
  const years = safeNumber(dealData.loanTerm);
  let annualLoanPayments = 0;
  
  if (loanAmount > 0 && annualRate > 0 && years > 0) {
    const monthlyRate = annualRate / 12;
    const numPayments = years * 12;
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    annualLoanPayments = monthlyPayment * 12;
  }
  
  const cashFlowAfterTax = noi - annualLoanPayments;
  const ownCapital = safeNumber(dealData.ownCapital);
  const propertyPrice = safeNumber(dealData.propertyPrice);
  
  // Break-even calculations
  const totalMonthlyCosts = (totalExpenses + annualLoanPayments) / 12;
  const vacancyRate = safeNumber(dealData.vacancyRate) / 100;
  const breakEvenRent = vacancyRate < 1 ? totalMonthlyCosts / (1 - vacancyRate) : totalMonthlyCosts;
  const rentCushion = monthlyRent - breakEvenRent;
  const cushionPercentage = breakEvenRent > 0 ? (rentCushion / breakEvenRent) * 100 : 0;
  
  // Return calculations
  const cashOnCashReturn = ownCapital > 0 ? (cashFlowAfterTax / ownCapital) * 100 : 0;
  const capRate = propertyPrice > 0 ? (noi / propertyPrice) * 100 : 0;
  const onePercentRule = propertyPrice > 0 ? (monthlyRent / propertyPrice) * 100 : 0;
  
  // Investment score
  let score = 0;
  if (cashOnCashReturn >= 15) score += 40;
  else if (cashOnCashReturn >= 10) score += 30;
  else if (cashOnCashReturn >= 6) score += 20;
  else if (cashOnCashReturn >= 3) score += 10;
  
  if (capRate >= 8) score += 20;
  else if (capRate >= 6) score += 15;
  else if (capRate >= 4) score += 10;
  else if (capRate >= 2) score += 5;
  
  if (onePercentRule >= 1) score += 20;
  else if (onePercentRule >= 0.8) score += 15;
  else if (onePercentRule >= 0.6) score += 10;
  else if (onePercentRule >= 0.4) score += 5;
  
  if (cushionPercentage >= 30) score += 20;
  else if (cushionPercentage >= 20) score += 15;
  else if (cushionPercentage >= 10) score += 10;
  else if (cushionPercentage >= 0) score += 5;
  
  const grade = score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : 'D';
  
  const calculations = {
    investment: {
      totalInvestment,
      downPayment: ownCapital
    },
    returns: {
      cashOnCashReturn,
      capRate,
      onePercentRule,
      totalROI: cashOnCashReturn
    },
    cashFlow: {
      grossRent: annualRent,
      netRent,
      noi,
      loanPayments: annualLoanPayments,
      cashFlowAfterTax,
      taxImpact: 0
    },
    breakEven: {
      breakEvenRent,
      currentRent: monthlyRent,
      cushionPercentage
    },
    score: {
      score,
      grade,
      recommendation: score >= 80 ? 'Excellent investment opportunity' : score >= 60 ? 'Good investment with solid returns' : score >= 40 ? 'Marginal investment' : 'Poor investment fundamentals'
    }
  };

  const handleSave = () => {
    const investorDeal = {
      ...dealData,
      // Don't assign an ID for new deals - let Firebase generate it
      type: 'investor',
      calculations: calculations.investment,
      returns: calculations.returns,
      score: calculations.score,
      createdAt: new Date().toISOString()
    };
    
    onSaveDeal(client.id, 'investor', investorDeal);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <Target className="w-6 h-6" />
            <div>
              <h3 className="text-lg font-semibold">Investor Deal Analysis</h3>
              <p className="text-sm opacity-90">{client.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="border-b bg-gray-50">
          <div className="flex overflow-x-auto">
            {tabs.map(tab => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 bg-white'
                      : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && <OverviewTab dealData={dealData} setDealData={setDealData} />}
          {activeTab === 'investment' && <InvestmentTab dealData={dealData} setDealData={setDealData} />}
          {activeTab === 'financing' && <FinancingTab dealData={dealData} setDealData={setDealData} />}
          {activeTab === 'returns' && <ReturnsTab dealData={dealData} setDealData={setDealData} calculations={calculations} />}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-between items-center rounded-b-lg">
          <div className="flex items-center gap-4 text-sm">
            <div>Expected ROI: <span className="font-semibold text-green-600">{calculations.returns.cashOnCashReturn.toFixed(1)}%</span></div>
            <div>Investment Score: <span className={`font-semibold ${
              calculations.score.grade === 'A' ? 'text-green-600' :
              calculations.score.grade === 'B' ? 'text-blue-600' :
              calculations.score.grade === 'C' ? 'text-yellow-600' : 'text-red-600'
            }`}>{calculations.score.grade}</span></div>
            <button
              onClick={() => setShowMarketData(true)}
              className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-xs"
            >
              <BarChart3 className="w-4 h-4" />
              Market Data
            </button>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Save Investment Deal
            </button>
          </div>
        </div>
      </div>

      {/* Market Data Modal */}
      <MarketDataBoard
        location={dealData.propertyAddress || 'Vila Real'}
        isOpen={showMarketData}
        onClose={() => setShowMarketData(false)}
      />
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ dealData, setDealData }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium mb-2">Property Address</label>
        <input
          type="text"
          value={dealData.propertyAddress}
          onChange={(e) => setDealData({...dealData, propertyAddress: e.target.value})}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Rua das Flores, 123, Vila Real"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Investment Strategy</label>
        <select
          value={dealData.investmentType}
          onChange={(e) => setDealData({...dealData, investmentType: e.target.value})}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="buy-to-rent">Buy-to-Rent</option>
          <option value="buy-to-hold">Buy-to-Hold</option>
          <option value="fix-and-flip">Fix-and-Flip</option>
          <option value="mixed">Mixed Strategy</option>
        </select>
      </div>
    </div>

    <div className="bg-blue-50 p-4 rounded-lg">
      <h4 className="font-medium text-blue-800 mb-2">💡 Investment Strategy Guide</h4>
      <div className="text-sm text-blue-700 space-y-1">
        <p><strong>Buy-to-Rent:</strong> Generate monthly rental income</p>
        <p><strong>Buy-to-Hold:</strong> Long-term property appreciation</p>
        <p><strong>Fix-and-Flip:</strong> Renovate and sell quickly</p>
        <p><strong>Mixed:</strong> Rent first, then sell later</p>
      </div>
    </div>
  </div>
);

// Investment Tab Component
const InvestmentTab = ({ dealData, setDealData }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium mb-2">Property Price (€)</label>
        <input
          type="number"
          value={dealData.propertyPrice}
          onChange={(e) => setDealData({...dealData, propertyPrice: e.target.value})}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="250000"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Property VPT (€)</label>
        <input
          type="number"
          value={dealData.propertyVPT}
          onChange={(e) => setDealData({...dealData, propertyVPT: e.target.value})}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="220000"
        />
        <p className="text-xs text-gray-500 mt-1">Valor Patrimonial Tributário</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
          Buy Taxes - IMT (€)
          <a 
            href="https://apemip.pt/simulador-de-imt-e-is/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
            title="IMT Calculator"
          >
            <Calculator className="w-4 h-4" />
          </a>
        </label>
        <input
          type="number"
          value={dealData.buyTaxesIMT}
          onChange={(e) => setDealData({...dealData, buyTaxesIMT: e.target.value})}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="5000"
        />
        <p className="text-xs text-gray-500 mt-1">Imposto Municipal sobre Transmissões</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
          Buy Taxes - IS (€)
          <a 
            href="https://apemip.pt/simulador-de-imt-e-is/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
            title="IS Calculator"
          >
            <Calculator className="w-4 h-4" />
          </a>
        </label>
        <input
          type="number"
          value={dealData.buyTaxesIS}
          onChange={(e) => setDealData({...dealData, buyTaxesIS: e.target.value})}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="2000"
        />
        <p className="text-xs text-gray-500 mt-1">Imposto do Selo</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Legal/Notary Fees (€)</label>
        <input
          type="number"
          value={dealData.legalFees}
          onChange={(e) => setDealData({...dealData, legalFees: e.target.value})}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="3000"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Renovation Budget (€)</label>
        <input
          type="number"
          value={dealData.renovationBudget}
          onChange={(e) => setDealData({...dealData, renovationBudget: e.target.value})}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="25000"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Emergency Fund (€)</label>
        <input
          type="number"
          value={dealData.emergencyFund}
          onChange={(e) => setDealData({...dealData, emergencyFund: e.target.value})}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="5000"
        />
      </div>
    </div>

    {/* Portuguese Tax Information */}
    <div className="bg-blue-50 p-4 rounded-lg">
      <h4 className="font-medium text-blue-800 mb-2 flex items-center">
        🏛️ Portuguese Property Taxes
      </h4>
      <div className="text-sm text-blue-700 space-y-2">
        <div className="flex items-center justify-between">
          <span><strong>IMT</strong> - Based on property value and type</span>
          <a 
            href="https://apemip.pt/simulador-de-imt-e-is/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs"
          >
            <Calculator className="w-3 h-3" />
            Calculate
          </a>
        </div>
        <div className="flex items-center justify-between">
          <span><strong>IS</strong> - Usually 0.8% of property value</span>
          <a 
            href="https://apemip.pt/simulador-de-imt-e-is/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs"
          >
            <Calculator className="w-3 h-3" />
            Calculate
          </a>
        </div>
        <p className="text-xs">💡 Use the APEMIP calculators for accurate tax calculations</p>
      </div>
    </div>
  </div>
);

// Financing Tab Component
const FinancingTab = ({ dealData, setDealData }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium mb-2">Bank Loan (€)</label>
        <input
          type="number"
          value={dealData.bankLoan}
          onChange={(e) => setDealData({...dealData, bankLoan: e.target.value})}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="120000"
        />
        <p className="text-xs text-gray-500 mt-1">Maximum 80% for investment properties</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Own Capital (€)</label>
        <input
          type="number"
          value={dealData.ownCapital}
          onChange={(e) => setDealData({...dealData, ownCapital: e.target.value})}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="50000"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Interest Rate (%)</label>
        <input
          type="number"
          step="0.1"
          value={dealData.interestRate}
          onChange={(e) => setDealData({...dealData, interestRate: e.target.value})}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="4.5"
        />
        <p className="text-xs text-gray-500 mt-1">Current Portuguese investment rates</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Loan Term (years)</label>
        <select
          value={dealData.loanTerm}
          onChange={(e) => setDealData({...dealData, loanTerm: e.target.value})}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="15">15 years</option>
          <option value="20">20 years</option>
          <option value="25">25 years</option>
          <option value="30">30 years</option>
          <option value="35">35 years</option>
        </select>
      </div>
    </div>

    <div className="bg-yellow-50 p-4 rounded-lg">
      <h4 className="font-medium text-yellow-800 mb-2">🏦 Financing Tips</h4>
      <div className="text-sm text-yellow-700 space-y-1">
        <p>• Portuguese banks typically lend up to 80% for investment properties</p>
        <p>• Interest rates for investment properties are usually 0.5-1% higher</p>
        <p>• Consider stress testing with higher interest rates</p>
      </div>
    </div>
  </div>
);

// Returns Tab Component
const ReturnsTab = ({ dealData, setDealData, calculations }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium mb-2">Monthly Rent (€)</label>
        <input
          type="number"
          value={dealData.monthlyRent}
          onChange={(e) => setDealData({...dealData, monthlyRent: e.target.value})}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="850"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Vacancy Rate (%)</label>
        <input
          type="number"
          value={dealData.vacancyRate}
          onChange={(e) => setDealData({...dealData, vacancyRate: e.target.value})}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="5"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
          Property Tax - IMI (€/year)
          <a 
            href="https://www.pordata.pt/pt/simuladores/simulador-de-imi" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
            title="IMI Calculator"
          >
            <Calculator className="w-4 h-4" />
          </a>
        </label>
        <input
          type="number"
          value={dealData.propertyTax}
          onChange={(e) => setDealData({...dealData, propertyTax: e.target.value})}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="450"
        />
        <p className="text-xs text-gray-500 mt-1">Imposto Municipal sobre Imóveis</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Insurance (€/year)</label>
        <input
          type="number"
          value={dealData.insurance}
          onChange={(e) => setDealData({...dealData, insurance: e.target.value})}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="300"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Maintenance (€/year)</label>
        <input
          type="number"
          value={dealData.maintenance}
          onChange={(e) => setDealData({...dealData, maintenance: e.target.value})}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="1200"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Management (€/year)</label>
        <input
          type="number"
          value={dealData.management}
          onChange={(e) => setDealData({...dealData, management: e.target.value})}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="600"
        />
      </div>
    </div>

    {/* ENHANCED: Live Advanced Analysis */}
    <div className="bg-green-50 p-6 rounded-lg">
      <h4 className="font-medium text-green-800 mb-4 flex items-center">
        <Calculator className="w-5 h-5 mr-2" />
        📊 Advanced Investment Analysis
      </h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="text-center">
          <div className="font-semibold text-green-600">€{calculations.investment.totalInvestment.toLocaleString()}</div>
          <div className="text-green-700">Total Investment</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-blue-600">{calculations.returns.cashOnCashReturn.toFixed(1)}%</div>
          <div className="text-blue-700">Cash-on-Cash ROI</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-orange-600">{calculations.returns.capRate.toFixed(1)}%</div>
          <div className="text-orange-700">Cap Rate</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-purple-600">{calculations.returns.onePercentRule.toFixed(2)}%</div>
          <div className="text-purple-700">1% Rule</div>
        </div>
      </div>

      {/* Investment Score */}
      <div className="mt-4 pt-4 border-t border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-green-700 font-medium">Investment Score: </span>
            <span className={`text-lg font-bold ${
              calculations.score.grade === 'A' ? 'text-green-600' :
              calculations.score.grade === 'B' ? 'text-blue-600' :
              calculations.score.grade === 'C' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {calculations.score.score}/100 ({calculations.score.grade})
            </span>
          </div>
          <div className="text-xs text-green-600 max-w-xs text-right">
            {calculations.score.recommendation}
          </div>
        </div>
      </div>

      {/* Cash Flow Breakdown */}
      <div className="mt-4 pt-4 border-t border-green-200">
        <h5 className="font-medium text-green-800 mb-2">Cash Flow Analysis</h5>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <div className="flex justify-between">
              <span>Gross Rent:</span>
              <span>€{calculations.cashFlow.grossRent.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Net Rent:</span>
              <span>€{calculations.cashFlow.netRent.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>NOI:</span>
              <span>€{calculations.cashFlow.noi.toLocaleString()}</span>
            </div>
          </div>
          <div>
            <div className="flex justify-between">
              <span>Loan Payments:</span>
              <span>€{calculations.cashFlow.loanPayments.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax Impact:</span>
              <span>€{calculations.cashFlow.taxImpact.toLocaleString()}</span>
            </div>
          </div>
          <div>
            <div className="flex justify-between font-medium text-green-700">
              <span>Cash Flow (After Tax):</span>
              <span>€{calculations.cashFlow.cashFlowAfterTax.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Break-even Analysis */}
      <div className="mt-4 pt-4 border-t border-green-200">
        <div className="flex items-center justify-between text-xs">
          <span className="text-green-700">Break-even Rent: €{calculations.breakEven.breakEvenRent.toFixed(0)}/month</span>
          <span className={`font-medium ${calculations.breakEven.cushionPercentage > 0 ? 'text-green-600' : 'text-red-600'}`}>
            Cushion: {calculations.breakEven.cushionPercentage.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  </div>
);

export default InvestorDealModal;