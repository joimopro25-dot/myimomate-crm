// components/MarketDataBoard.jsx - Real Estate Market Intelligence
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  MapPin, 
  Building, 
  Euro, 
  Calculator,
  BarChart3,
  Clock,
  Users,
  Home,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Target,
  X
} from 'lucide-react';

const MarketDataBoard = ({ location = 'Vila Real', isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      // Simulate loading market data
      setTimeout(() => {
        setMarketData(getMockMarketData(location));
        setLoading(false);
      }, 1000);
    }
  }, [isOpen, location]);

  const tabs = [
    { id: 'overview', label: 'Market Overview', icon: BarChart3 },
    { id: 'prices', label: 'Price Analysis', icon: Euro },
    { id: 'rental', label: 'Rental Market', icon: Home },
    { id: 'trends', label: 'Trends & Forecast', icon: TrendingUp }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6" />
            <div>
              <h3 className="text-lg font-semibold">Market Intelligence Dashboard</h3>
              <p className="text-sm opacity-90">{location} Real Estate Market</p>
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

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading market data...</span>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && <MarketOverview data={marketData} />}
              {activeTab === 'prices' && <PriceAnalysis data={marketData} />}
              {activeTab === 'rental' && <RentalMarket data={marketData} />}
              {activeTab === 'trends' && <TrendsAndForecast data={marketData} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Market Overview Tab
const MarketOverview = ({ data }) => (
  <div className="space-y-6">
    {/* Key Metrics Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Avg Price/m²"
        value={`€${data.avgPricePerSqm.toLocaleString()}`}
        change={data.priceChange}
        trend={data.priceChange > 0 ? 'up' : 'down'}
      />
      <MetricCard
        title="Rental Yield"
        value={`${data.avgRentalYield}%`}
        change={data.yieldChange}
        trend={data.yieldChange > 0 ? 'up' : 'down'}
      />
      <MetricCard
        title="Time to Sell"
        value={`${data.avgTimeToSell} days`}
        change={data.timeToSellChange}
        trend={data.timeToSellChange < 0 ? 'up' : 'down'}
      />
      <MetricCard
        title="Market Activity"
        value={data.marketActivity}
        subtitle="Very Active"
      />
    </div>

    {/* Market Health Indicators */}
    <div className="bg-gray-50 p-6 rounded-lg">
      <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
        Market Health Indicators
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <HealthIndicator
          label="Supply vs Demand"
          status="balanced"
          description="Healthy balance between buyers and sellers"
        />
        <HealthIndicator
          label="Price Stability"
          status="good"
          description="Steady growth without bubble indicators"
        />
        <HealthIndicator
          label="Investment Climate"
          status="excellent"
          description="Strong fundamentals for investors"
        />
      </div>
    </div>

    {/* Recent Market Activity */}
    <div className="bg-white border rounded-lg p-6">
      <h4 className="font-semibold text-gray-800 mb-4">Recent Market Activity (Last 30 Days)</h4>
      <div className="space-y-3">
        {data.recentActivity.map((activity, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="text-sm">{activity.description}</span>
            </div>
            <span className="text-xs text-gray-500">{activity.date}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Price Analysis Tab
const PriceAnalysis = ({ data }) => (
  <div className="space-y-6">
    {/* Price Breakdown by Property Type */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white border rounded-lg p-6">
        <h4 className="font-semibold mb-4">Price by Property Type</h4>
        <div className="space-y-3">
          {data.priceByType.map((type, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{type.name}</span>
              <span className="font-medium">€{type.price.toLocaleString()}/m²</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6">
        <h4 className="font-semibold mb-4">Price by Neighborhood</h4>
        <div className="space-y-3">
          {data.priceByNeighborhood.map((area, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{area.name}</span>
              <div className="text-right">
                <div className="font-medium">€{area.price.toLocaleString()}/m²</div>
                <div className={`text-xs ${area.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {area.change > 0 ? '+' : ''}{area.change}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Price History Chart Simulation */}
    <div className="bg-white border rounded-lg p-6">
      <h4 className="font-semibold mb-4">Price Trend (Last 12 Months)</h4>
      <div className="h-64 bg-gradient-to-t from-blue-50 to-transparent rounded flex items-end justify-between px-4 py-4">
        {data.priceHistory.map((month, index) => (
          <div key={index} className="flex flex-col items-center">
            <div 
              className="bg-blue-600 rounded-t w-8"
              style={{ height: `${(month.price / Math.max(...data.priceHistory.map(m => m.price))) * 200}px` }}
            ></div>
            <span className="text-xs text-gray-500 mt-2 transform -rotate-45">{month.month}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Comparative Analysis */}
    <div className="bg-yellow-50 p-6 rounded-lg">
      <h4 className="font-semibold text-yellow-800 mb-4">💡 Market Insights</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-yellow-700 mb-2">
            <strong>Price Positioning:</strong> Current prices are {data.priceVsNational > 0 ? 'above' : 'below'} 
            national average by {Math.abs(data.priceVsNational)}%
          </p>
          <p className="text-yellow-700">
            <strong>Best Value:</strong> {data.bestValueNeighborhood} offers the best price-to-quality ratio
          </p>
        </div>
        <div>
          <p className="text-yellow-700 mb-2">
            <strong>Growth Potential:</strong> Expected {data.expectedGrowth}% appreciation over next 12 months
          </p>
          <p className="text-yellow-700">
            <strong>Investment Sweet Spot:</strong> €{data.investmentSweetSpot.min.toLocaleString()} - €{data.investmentSweetSpot.max.toLocaleString()}/m²
          </p>
        </div>
      </div>
    </div>
  </div>
);

// Rental Market Tab
const RentalMarket = ({ data }) => (
  <div className="space-y-6">
    {/* Rental Metrics */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <MetricCard
        title="Avg Monthly Rent"
        value={`€${data.rental.avgMonthlyRent}/m²`}
        change={data.rental.rentChange}
        trend={data.rental.rentChange > 0 ? 'up' : 'down'}
      />
      <MetricCard
        title="Vacancy Rate"
        value={`${data.rental.vacancyRate}%`}
        change={data.rental.vacancyChange}
        trend={data.rental.vacancyChange < 0 ? 'up' : 'down'}
      />
      <MetricCard
        title="Time to Rent"
        value={`${data.rental.timeToRent} days`}
        change={data.rental.timeToRentChange}
        trend={data.rental.timeToRentChange < 0 ? 'up' : 'down'}
      />
      <MetricCard
        title="Tenant Demand"
        value={data.rental.tenantDemand}
        subtitle="High"
      />
    </div>

    {/* Rental Yields by Property Type */}
    <div className="bg-white border rounded-lg p-6">
      <h4 className="font-semibold mb-4">Rental Yields by Property Type</h4>
      <div className="space-y-4">
        {data.rental.yieldsByType.map((type, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div className="flex items-center gap-3">
              <Building className="w-5 h-5 text-blue-600" />
              <span className="font-medium">{type.name}</span>
            </div>
            <div className="text-right">
              <div className="font-semibold text-green-600">{type.yield}%</div>
              <div className="text-xs text-gray-500">€{type.avgRent}/month</div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Tenant Profile */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white border rounded-lg p-6">
        <h4 className="font-semibold mb-4">Typical Tenant Profile</h4>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Average Age</span>
            <span className="font-medium">{data.rental.tenantProfile.avgAge} years</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Average Income</span>
            <span className="font-medium">€{data.rental.tenantProfile.avgIncome.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Lease Duration</span>
            <span className="font-medium">{data.rental.tenantProfile.avgLeaseDuration} months</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Most Common</span>
            <span className="font-medium">{data.rental.tenantProfile.mostCommon}</span>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6">
        <h4 className="font-semibold mb-4">Rental Market Hotspots</h4>
        <div className="space-y-3">
          {data.rental.hotspots.map((spot, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <div className="font-medium">{spot.area}</div>
                <div className="text-xs text-gray-500">{spot.reason}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-blue-600">{spot.yield}%</div>
                <div className="text-xs text-gray-500">yield</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Trends and Forecast Tab
const TrendsAndForecast = ({ data }) => (
  <div className="space-y-6">
    {/* Market Forecast */}
    <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg">
      <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
        <Target className="w-5 h-5 text-blue-600 mr-2" />
        12-Month Market Forecast
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ForecastCard
          title="Property Prices"
          current="€1,250/m²"
          forecast="€1,313/m²"
          change="+5.1%"
          confidence="High"
        />
        <ForecastCard
          title="Rental Rates"
          current="€8.50/m²"
          forecast="€8.93/m²"
          change="+5.1%"
          confidence="Medium"
        />
        <ForecastCard
          title="Market Volume"
          current="1,245 sales"
          forecast="1,370 sales"
          change="+10.0%"
          confidence="Medium"
        />
      </div>
    </div>

    {/* Driving Factors */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white border rounded-lg p-6">
        <h4 className="font-semibold mb-4 text-green-600">Positive Factors</h4>
        <div className="space-y-3">
          {data.trends.positiveFactor.map((factor, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-medium text-sm">{factor.title}</div>
                <div className="text-xs text-gray-600">{factor.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6">
        <h4 className="font-semibold mb-4 text-orange-600">Watch Factors</h4>
        <div className="space-y-3">
          {data.trends.watchFactors.map((factor, index) => (
            <div key={index} className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <div className="font-medium text-sm">{factor.title}</div>
                <div className="text-xs text-gray-600">{factor.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Investment Recommendations */}
    <div className="bg-purple-50 p-6 rounded-lg">
      <h4 className="font-semibold text-purple-800 mb-4">🎯 Investment Recommendations</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h5 className="font-medium text-purple-700 mb-2">Best Investment Types</h5>
          <ul className="space-y-1 text-sm text-purple-600">
            {data.trends.recommendations.bestTypes.map((type, index) => (
              <li key={index}>• {type}</li>
            ))}
          </ul>
        </div>
        <div>
          <h5 className="font-medium text-purple-700 mb-2">Optimal Investment Timeline</h5>
          <ul className="space-y-1 text-sm text-purple-600">
            {data.trends.recommendations.timeline.map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
);

// Utility Components
const MetricCard = ({ title, value, change, trend, subtitle }) => (
  <div className="bg-white border rounded-lg p-4">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm text-gray-600">{title}</span>
      {trend && (
        <div className={`flex items-center text-xs ${
          trend === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span className="ml-1">{change > 0 ? '+' : ''}{change}%</span>
        </div>
      )}
    </div>
    <div className="text-2xl font-bold text-gray-900">{value}</div>
    {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
  </div>
);

const HealthIndicator = ({ label, status, description }) => {
  const statusConfig = {
    excellent: { color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle },
    good: { color: 'text-blue-600', bg: 'bg-blue-100', icon: CheckCircle },
    balanced: { color: 'text-yellow-600', bg: 'bg-yellow-100', icon: AlertTriangle },
    concern: { color: 'text-red-600', bg: 'bg-red-100', icon: AlertTriangle }
  };
  
  const config = statusConfig[status] || statusConfig.good;
  const IconComponent = config.icon;
  
  return (
    <div className="flex items-start gap-3">
      <div className={`${config.bg} p-2 rounded-full`}>
        <IconComponent className={`w-4 h-4 ${config.color}`} />
      </div>
      <div>
        <div className="font-medium text-sm">{label}</div>
        <div className="text-xs text-gray-600">{description}</div>
      </div>
    </div>
  );
};

const ForecastCard = ({ title, current, forecast, change, confidence }) => (
  <div className="bg-white border rounded-lg p-4">
    <h5 className="font-medium mb-3">{title}</h5>
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Current</span>
        <span className="font-medium">{current}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Forecast</span>
        <span className="font-medium">{forecast}</span>
      </div>
      <div className="flex justify-between items-center pt-2 border-t">
        <span className={`text-sm font-medium ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </span>
        <span className="text-xs text-gray-500">{confidence} confidence</span>
      </div>
    </div>
  </div>
);

// Mock Data Generator
const getMockMarketData = (location) => ({
  avgPricePerSqm: 1250,
  priceChange: 5.1,
  avgRentalYield: 6.2,
  yieldChange: 0.3,
  avgTimeToSell: 45,
  timeToSellChange: -5,
  marketActivity: 85,
  
  priceVsNational: -12,
  bestValueNeighborhood: "Mateus",
  expectedGrowth: 5.1,
  investmentSweetSpot: { min: 1100, max: 1400 },
  
  recentActivity: [
    { description: "New development project approved in city center", date: "2 days ago" },
    { description: "Interest rates decreased by 0.25%", date: "1 week ago" },
    { description: "Tourism sector showing strong recovery", date: "2 weeks ago" },
    { description: "University enrollment increased by 8%", date: "3 weeks ago" }
  ],
  
  priceByType: [
    { name: "Apartments", price: 1180 },
    { name: "Houses", price: 1320 },
    { name: "Commercial", price: 980 },
    { name: "Land", price: 85 }
  ],
  
  priceByNeighborhood: [
    { name: "City Center", price: 1450, change: 6.2 },
    { name: "Mateus", price: 1180, change: 4.8 },
    { name: "Lordelo", price: 1320, change: 5.5 },
    { name: "Vila Real Sul", price: 1050, change: 3.9 }
  ],
  
  priceHistory: [
    { month: "Jan", price: 1180 },
    { month: "Feb", price: 1195 },
    { month: "Mar", price: 1210 },
    { month: "Apr", price: 1225 },
    { month: "May", price: 1235 },
    { month: "Jun", price: 1250 },
    { month: "Jul", price: 1260 },
    { month: "Aug", price: 1275 },
    { month: "Sep", price: 1285 },
    { month: "Oct", price: 1295 },
    { month: "Nov", price: 1305 },
    { month: "Dec", price: 1320 }
  ],
  
  rental: {
    avgMonthlyRent: 8.5,
    rentChange: 4.2,
    vacancyRate: 3.8,
    vacancyChange: -0.5,
    timeToRent: 22,
    timeToRentChange: -3,
    tenantDemand: 82,
    
    yieldsByType: [
      { name: "T1 Apartments", yield: 7.2, avgRent: 450 },
      { name: "T2 Apartments", yield: 6.8, avgRent: 650 },
      { name: "T3 Houses", yield: 6.0, avgRent: 850 },
      { name: "Commercial Spaces", yield: 5.5, avgRent: 1200 }
    ],
    
    tenantProfile: {
      avgAge: 28,
      avgIncome: 25000,
      avgLeaseDuration: 14,
      mostCommon: "University Students & Young Professionals"
    },
    
    hotspots: [
      { area: "Near University", yield: 7.8, reason: "High student demand" },
      { area: "City Center", yield: 6.5, reason: "Professional workers" },
      { area: "Residential Areas", yield: 5.9, reason: "Family housing" }
    ]
  },
  
  trends: {
    positiveFactor: [
      { title: "University Expansion", description: "New campus bringing 2000+ students" },
      { title: "Infrastructure Investment", description: "€50M transport improvements" },
      { title: "Tourism Growth", description: "15% increase in visitors" },
      { title: "Tech Hub Development", description: "New startups choosing Vila Real" }
    ],
    
    watchFactors: [
      { title: "Interest Rate Changes", description: "ECB policy may affect financing" },
      { title: "Construction Costs", description: "Material prices trending upward" },
      { title: "Regulatory Changes", description: "New rental laws under discussion" }
    ],
    
    recommendations: {
      bestTypes: [
        "Small apartments (T1/T2) for rental",
        "Renovation projects in city center",
        "Buy-to-let near university",
        "Commercial spaces in development areas"
      ],
      timeline: [
        "Q1: Best time to buy (less competition)",
        "Q2-Q3: Peak rental season starts", 
        "Q4: Property values typically appreciate",
        "Consider 3-5 year hold periods"
      ]
    }
  }
});

export default MarketDataBoard;