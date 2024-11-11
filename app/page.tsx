'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'; 
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, TrendingUp, DollarSign, Mail } from 'lucide-react';

// Industry configurations remain the same...
const industryConfigs = {
  default: {
    title: "Select Your Industry",
    leads: "Leads",
    meetings: "Meetings",
    proposals: "Proposals",
    negotiations: "Negotiations",
    closed: "Closed",
    avgDealSize: "Average Deal Size",
    salesCycle: "Sales Cycle",
    helperText: {
      leads: "Total number of new leads entering your pipeline each month",
      meetings: "Number of discovery or sales meetings conducted monthly",
      proposals: "Number of proposals or quotes sent to prospects monthly",
      negotiations: "Number of deals in active negotiation/contract review",
      closed: "Number of deals successfully closed per month",
      avgDealSize: "Average revenue per closed deal",
      salesCycle: "Average days from first contact to deal closure",
    }
  },
  coffee_shop: {
    title: "Coffee Shop Calculator",
    leads: "Walk-ins",
    meetings: "Menu Browsers",
    proposals: "Orders Placed",
    negotiations: "Customizations",
    closed: "Completed Sales",
    avgDealSize: "Average Order Value",
    salesCycle: "Service Time (mins)",
    helperText: {
      leads: "Number of customers walking into your shop daily",
      meetings: "Customers who stop to look at menu/products",
      proposals: "Number of orders placed",
      negotiations: "Orders requiring customization or special requests",
      closed: "Successfully completed transactions",
      avgDealSize: "Average spend per customer",
      salesCycle: "Average time from entry to purchase completion",
    }
  },
  bank: {
    title: "Banking Pipeline Calculator",
    leads: "Inquiries",
    meetings: "Consultations",
    proposals: "Applications",
    negotiations: "Underwriting",
    closed: "Accounts Opened",
    avgDealSize: "Average Account Value",
    salesCycle: "Processing Days",
    helperText: {
      leads: "Total number of product inquiries received monthly",
      meetings: "Number of financial consultations conducted",
      proposals: "Applications submitted for processing",
      negotiations: "Applications in underwriting/review",
      closed: "Successfully opened accounts/approved loans",
      avgDealSize: "Average initial deposit or loan value",
      salesCycle: "Average days from inquiry to account opening",
    }
  },
  real_estate: {
    title: "Real Estate Pipeline Calculator",
    leads: "Property Inquiries",
    meetings: "Viewings",
    proposals: "Offers Made",
    negotiations: "Price Negotiations",
    closed: "Properties Sold",
    avgDealSize: "Average Property Value",
    salesCycle: "Days to Close",
    helperText: {
      leads: "Monthly property inquiries received",
      meetings: "Number of property viewings conducted",
      proposals: "Offers submitted to sellers",
      negotiations: "Active price/term negotiations",
      closed: "Successfully closed property deals",
      avgDealSize: "Average property sale price",
      salesCycle: "Average days from listing to closing",
    }
  },
  consulting: {
    title: "Consulting Pipeline Calculator",
    leads: "Prospects",
    meetings: "Discovery Calls",
    proposals: "Statements of Work",
    negotiations: "Contract Reviews",
    closed: "Projects Won",
    avgDealSize: "Average Project Value",
    salesCycle: "Days to Sign",
    helperText: {
      leads: "Monthly new prospect inquiries",
      meetings: "Initial discovery calls conducted",
      proposals: "Statements of work submitted",
      negotiations: "Contracts in review phase",
      closed: "Successfully signed projects",
      avgDealSize: "Average project contract value",
      salesCycle: "Average days from inquiry to contract signing",
    }
  }
};

type PipelineData = {
  leads: string;
  meetings: string;
  proposals: string;
  negotiations: string;
  closed: string;
  avgDealSize: string;
  salesCycle: string;
};

const PipelineCalculator = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [email, setEmail] = useState('');
  
  const [pipelineData, setPipelineData] = useState<PipelineData>({
    leads: '',
    meetings: '',
    proposals: '',
    negotiations: '',
    closed: '',
    avgDealSize: '',
    salesCycle: ''
  });

  interface Results {
    conversionRates: {
      leadToMeeting: string;
      meetingToProposal: string;
      proposalToNegotiation: string;
      negotiationToClose: string;
      overallConversion: string;
    };
    potentialRevenue: number;
    improvedRevenue: number;
    velocityScore: {
      score: string;
      text: string;
      color: string;
    };
    numbers: {
      leads: number;
      meetings: number;
      proposals: number;
      negotiations: number;
      closed: number;
      avgDealSize: number;
      salesCycle: number;
    };
  }

  const [results, setResults] = useState<Results | null>(null);

  const getCurrentConfig = () => {
    return industryConfigs[selectedIndustry as keyof typeof industryConfigs] || industryConfigs.default;
  };

  const calculateMetrics = () => {
    const numbers = {
      leads: Number(pipelineData.leads) || 0,
      meetings: Number(pipelineData.meetings) || 0,
      proposals: Number(pipelineData.proposals) || 0,
      negotiations: Number(pipelineData.negotiations) || 0,
      closed: Number(pipelineData.closed) || 0,
      avgDealSize: Number(pipelineData.avgDealSize) || 0,
      salesCycle: Number(pipelineData.salesCycle) || 0
    };

    const conversionRates = {
      leadToMeeting: ((numbers.meetings / numbers.leads) * 100).toFixed(1),
      meetingToProposal: ((numbers.proposals / numbers.meetings) * 100).toFixed(1),
      proposalToNegotiation: ((numbers.negotiations / numbers.proposals) * 100).toFixed(1),
      negotiationToClose: ((numbers.closed / numbers.negotiations) * 100).toFixed(1),
      overallConversion: ((numbers.closed / numbers.leads) * 100).toFixed(1)
    };

    const potentialRevenue = numbers.closed * numbers.avgDealSize;
    const improvedRevenue = potentialRevenue * 1.25;

    let velocityScore;
    if (numbers.salesCycle <= 30) velocityScore = { score: 'A', text: 'Excellent', color: 'text-green-600' };
    else if (numbers.salesCycle <= 60) velocityScore = { score: 'B', text: 'Good', color: 'text-blue-600' };
    else if (numbers.salesCycle <= 90) velocityScore = { score: 'C', text: 'Fair', color: 'text-yellow-600' };
    else velocityScore = { score: 'D', text: 'Needs Improvement', color: 'text-red-600' };

    return {
      conversionRates,
      potentialRevenue,
      improvedRevenue,
      velocityScore,
      numbers
    };
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const calculatedResults = calculateMetrics();
    setResults(calculatedResults);
  };

  const handleDownload = () => {
    setShowEmailCapture(true);
  };

  const getChartData = () => {
    if (!results) return [];
    
    const config = getCurrentConfig();
    return [
      { name: `${config.leads} → ${config.meetings}`, rate: parseFloat(results.conversionRates.leadToMeeting) },
      { name: `${config.meetings} → ${config.proposals}`, rate: parseFloat(results.conversionRates.meetingToProposal) },
      { name: `${config.proposals} → ${config.negotiations}`, rate: parseFloat(results.conversionRates.proposalToNegotiation) },
      { name: `${config.negotiations} → ${config.closed}`, rate: parseFloat(results.conversionRates.negotiationToClose) }
    ];
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">
            {selectedIndustry ? getCurrentConfig().title : "Select Your Industry"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 relative z-20">
            <Label>Industry</Label>
            <Select 
              value={selectedIndustry} 
              onValueChange={setSelectedIndustry}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="coffee_shop">Coffee Shop</SelectItem>
                <SelectItem value="bank">Banking</SelectItem>
                <SelectItem value="real_estate">Real Estate</SelectItem>
                <SelectItem value="consulting">Consulting</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className={`relative ${!selectedIndustry ? 'select-none' : ''}`}>
            {!selectedIndustry && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-lg z-10 flex items-start justify-center pt-20">
                <div className="text-lg font-semibold text-gray-500">
                  Select your industry above to begin
                </div>
              </div>
            )}
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(Object.keys(pipelineData) as Array<keyof PipelineData>).map((key) => (
                  <div key={key} className="space-y-2">
                    <Label>
                      {getCurrentConfig()[key]}
                    </Label>
                    <Input
                      required
                      type="number"
                      value={pipelineData[key]}
                      onChange={(e) => setPipelineData({...pipelineData, [key]: e.target.value})}
                      placeholder="Enter number"
                      disabled={!selectedIndustry}
                    />
                    <p className="text-sm text-gray-500">
                      {getCurrentConfig().helperText[key]}
                    </p>
                  </div>
                ))}
              </div>
              <Button type="submit" className="w-full mt-6" disabled={!selectedIndustry}>
                Calculate Performance
              </Button>
            </form>

            <div className="space-y-6 mt-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Alert className="bg-blue-50">
                  <Activity className="h-4 w-4" />
                  <AlertTitle>Overall Conversion</AlertTitle>
                  <AlertDescription>
                    <span className="text-2xl font-bold">
                      {results ? `${results.conversionRates.overallConversion}%` : '0%'}
                    </span>
                  </AlertDescription>
                </Alert>
                
                <Alert className="bg-blue-50">
                  <DollarSign className="h-4 w-4" />
                  <AlertTitle>Monthly Revenue</AlertTitle>
                  <AlertDescription>
                    <span className="text-2xl font-bold">
                      ${results ? results.potentialRevenue.toLocaleString() : '0'}
                    </span>
                  </AlertDescription>
                </Alert>
                
                <Alert className="bg-blue-50">
                  <TrendingUp className="h-4 w-4" />
                  <AlertTitle>Velocity Score</AlertTitle>
                  <AlertDescription>
                    <span className={`text-2xl font-bold ${results?.velocityScore.color || 'text-gray-400'}`}>
                      {results ? results.velocityScore.score : 'N/A'}
                    </span>
                    <span className="block text-sm">
                      {results ? results.velocityScore.text : 'Pending'}
                    </span>
                  </AlertDescription>
                </Alert>
              </div>

              {results && (
                <>
                  <div className="h-80 mb-8">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getChartData()} margin={{ bottom: 70, right: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="name" 
                          angle={-45} 
                          textAnchor="end" 
                          height={60}
                          interval={0}
                          tick={{ fontSize: 12 }} 
                        />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="rate" fill="#2563eb" name="Conversion Rate %" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <Alert>
                    <AlertTitle>Key Findings</AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc pl-4 mt-2 space-y-2">
                        {parseFloat(results.conversionRates.leadToMeeting) < 40 && (
                          <li>Your {getCurrentConfig().leads.toLowerCase()}-to-{getCurrentConfig().meetings.toLowerCase()} conversion rate of {results.conversionRates.leadToMeeting}% is below the industry benchmark of 40%.</li>
                        )}
                        {parseFloat(results.conversionRates.meetingToProposal) < 50 && (
                          <li>Your {getCurrentConfig().meetings.toLowerCase()}-to-{getCurrentConfig().proposals.toLowerCase()} rate of {results.conversionRates.meetingToProposal}% suggests room for improvement.</li>
                        )}
                        {parseFloat(results.conversionRates.proposalToNegotiation) < 60 && (
                          <li>Your {getCurrentConfig().proposals.toLowerCase()}-to-{getCurrentConfig().negotiations.toLowerCase()} conversion of {results.conversionRates.proposalToNegotiation}% indicates potential for better processes.</li>
                        )}
                        {results.numbers.salesCycle > 60 && (
                          <li>Your {results.numbers.salesCycle}-day cycle length is above optimal range. Consider streamlining your process.</li>
                        )}
                      </ul>
                    </AlertDescription>
                  </Alert>

                  <Alert className="bg-blue-50">
                    <AlertTitle className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Revenue Opportunity
                    </AlertTitle>
                    <AlertDescription>
                      <p className="mt-2">
                        With optimized operations, you could potentially increase your monthly revenue to: 
                        <span className="font-bold text-blue-600 ml-1">
                          ${results.improvedRevenue.toLocaleString()}
                        </span>
                      </p>
                      <Button onClick={handleDownload} className="mt-4">
                        Get Detailed Analysis Report
                      </Button>
                    </AlertDescription>
                  </Alert>

                  {showEmailCapture && (
                    <Alert>
                      <AlertTitle className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Get Your Detailed Report
                      </AlertTitle>
                      <AlertDescription>
                        <div className="mt-2 space-y-2">
                          <p>Enter your email to receive a comprehensive analysis with actionable recommendations</p>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Input
                              type="email"
                              placeholder="you@company.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                            <Button className="whitespace-nowrap">Send Report</Button>
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PipelineCalculator;