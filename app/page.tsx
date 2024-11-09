'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'; 
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, TrendingUp, DollarSign, Mail } from 'lucide-react';

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
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [showResults, setShowResults] = useState(false);
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

  const helperTextMap: Record<keyof PipelineData, string> = {
    leads: "Total number of new leads entering your pipeline each month",
    meetings: "Number of discovery or sales meetings conducted monthly",
    proposals: "Number of proposals or quotes sent to prospects monthly",
    negotiations: "Number of deals in active negotiation/contract review",
    closed: "Number of deals successfully closed per month",
    avgDealSize: "Average revenue per closed deal",
    salesCycle: "Average days from first contact to deal closure",
  };

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
    setShowResults(true);
  };

  const handleDownload = () => {
    setShowEmailCapture(true);
  };

  const getChartData = () => {
    if (!results) return [];
    return [
      { name: 'Lead → Meeting', rate: parseFloat(results.conversionRates.leadToMeeting) },
      { name: 'Meeting → Proposal', rate: parseFloat(results.conversionRates.meetingToProposal) },
      { name: 'Proposal → Negotiation', rate: parseFloat(results.conversionRates.proposalToNegotiation) },
      { name: 'Negotiation → Close', rate: parseFloat(results.conversionRates.negotiationToClose) }
    ];
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Upfront Ops Sales Pipeline Health Calculator</CardTitle>
          <p className="text-gray-500">Use this free calculator to Analyze your sales pipeline performance and identify optimization opportunities. Your results are shown immediately and you have the opportunity to have your results sent to you via email.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(Object.keys(pipelineData) as Array<keyof PipelineData>).map((key) => (
                <div key={key} className="space-y-2">
                  <Label>
                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                  </Label>
                  <Input
                    required
                    type="number"
                    value={pipelineData[key]}
                    onChange={(e) => setPipelineData({...pipelineData, [key]: e.target.value})}
                    placeholder="Enter number"
                  />
                  <p className="text-sm text-gray-500">
                    {helperTextMap[key]}
                  </p>
                </div>
              ))}
            </div>
            <Button type="submit" className="w-full mt-6">Calculate Pipeline Health</Button>
          </form>

          {showResults && results && (
            <div className="space-y-6 mt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Alert className="bg-blue-50">
                  <Activity className="h-4 w-4" />
                  <AlertTitle>Overall Conversion</AlertTitle>
                  <AlertDescription>
                    <span className="text-2xl font-bold">{results.conversionRates.overallConversion}%</span>
                  </AlertDescription>
                </Alert>
                
                <Alert className="bg-blue-50">
                  <DollarSign className="h-4 w-4" />
                  <AlertTitle>Monthly Revenue</AlertTitle>
                  <AlertDescription>
                    <span className="text-2xl font-bold">${results.potentialRevenue.toLocaleString()}</span>
                  </AlertDescription>
                </Alert>
                
                <Alert className="bg-blue-50">
                  <TrendingUp className="h-4 w-4" />
                  <AlertTitle>Velocity Score</AlertTitle>
                  <AlertDescription>
                    <span className={`text-2xl font-bold ${results.velocityScore.color}`}>
                      {results.velocityScore.score}
                    </span>
                    <span className="block text-sm">{results.velocityScore.text}</span>
                  </AlertDescription>
                </Alert>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Conversion Rates by Stage</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="rate" fill="#2563eb" name="Conversion Rate %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <Alert>
                <AlertTitle>Key Findings</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-4 mt-2 space-y-2">
                    {parseFloat(results.conversionRates.leadToMeeting) < 40 && (
                      <li>Your lead-to-meeting conversion rate of {results.conversionRates.leadToMeeting}% is below the industry benchmark of 40%. Consider implementing improved lead qualification processes.</li>
                    )}
                    {parseFloat(results.conversionRates.meetingToProposal) < 50 && (
                      <li>Your meeting-to-proposal rate of {results.conversionRates.meetingToProposal}% suggests opportunity for improved discovery call processes.</li>
                    )}
                    {parseFloat(results.conversionRates.proposalToNegotiation) < 60 && (
                      <li>Proposal-to-negotiation conversion of {results.conversionRates.proposalToNegotiation}% indicates potential for better proposal automation and tracking.</li>
                    )}
                    {results.numbers.salesCycle > 60 && (
                      <li>Your {results.numbers.salesCycle}-day sales cycle is above optimal range. Process automation could help reduce this significantly.</li>
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
                    With optimized sales operations, you could potentially increase your monthly revenue to: 
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
                      <div className="flex gap-2">
                        <Input
                          type="email"
                          placeholder="you@company.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button>Send Report</Button>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PipelineCalculator;
//hi test comment