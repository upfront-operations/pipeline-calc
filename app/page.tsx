"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ROICalculator = () => {
  type RevenueImportance = 'low' | 'medium' | 'high';
  type CurrentImpact = 'low' | 'medium' | 'high';

  const [inputs, setInputs] = useState<{
    websiteRedesignCost: number;
    currentPlacements: number;
    averageValue: number;
    revenueImportance: RevenueImportance;
    currentImpact: CurrentImpact;
  }>({
    websiteRedesignCost: 25000,
    currentPlacements: 10,
    averageValue: 20000,
    revenueImportance: 'medium',
    currentImpact: 'medium'
  });

  const [results, setResults] = useState({
    additionalRevenue: 0,
    timeToValue: 0,
    monthlyROI: 0,
    dailyOpportunityCost: 0
  });

  const calculateResults = () => {
    // Calculate impact multiplier matrix based on both questions
    const impactMatrix = {
      // [revenueImportance][currentImpact]
      low: {
        low: 0.05,     // Minimal impact: 5% improvement potential
        medium: 0.15,  // Some friction: 15% improvement potential
        high: 0.25     // Major friction but low importance: 25% improvement
      },
      medium: {
        low: 0.20,     // Important but working OK: 20% improvement
        medium: 0.35,  // Important with some issues: 35% improvement
        high: 0.50     // Important with major issues: 50% improvement
      },
      high: {
        low: 0.35,     // Critical but working OK: 35% improvement
        medium: 0.60,  // Critical with friction: 60% improvement
        high: 0.85     // Critical system failing: 85% improvement
      }
    };

    // Daily opportunity cost matrix based on same factors
    const opportunityCostMatrix = {
      // [revenueImportance][currentImpact]
      low: {
        low: 0.001,    // Almost no daily impact
        medium: 0.005, // Minor inefficiencies
        high: 0.01     // Notable but not critical losses
      },
      medium: {
        low: 0.01,     // Some opportunities missed
        medium: 0.025, // Regular friction points
        high: 0.05     // Significant daily losses
      },
      high: {
        low: 0.025,    // Critical system with minor issues
        medium: 0.075, // Critical system with regular issues
        high: 0.15     // Critical system failing daily
      }
    };

    // Get combined improvement factor from matrix
    const improvement = impactMatrix[inputs.revenueImportance][inputs.currentImpact];
    
    // Calculate revenue improvements
    const currentMonthlyRevenue = inputs.currentPlacements * inputs.averageValue;
    const monthlyRevenue = currentMonthlyRevenue * improvement;
    
    // Calculate ROI and break-even
    const timeToValue = monthlyRevenue > 0 
      ? (inputs.websiteRedesignCost / monthlyRevenue).toFixed(1)
      : '24';

    const ROIFactor = (monthlyRevenue * 24 - inputs.websiteRedesignCost) / inputs.websiteRedesignCost * 100;
    const monthlyROI = parseFloat((ROIFactor / 24).toFixed(1));

    // Only calculate daily opportunity cost if break-even is realistic
    let dailyOpportunityCost = 0;
    if (Number(timeToValue) < 24) {
      const dailyBaseRevenue = currentMonthlyRevenue / 20;
      const opportunityFactor = opportunityCostMatrix[inputs.revenueImportance][inputs.currentImpact];
      dailyOpportunityCost = (dailyBaseRevenue * opportunityFactor) + 
        (inputs.averageValue * opportunityFactor / 2);
    }

    setResults({
      additionalRevenue: parseFloat(monthlyRevenue.toFixed(0)),
      timeToValue: parseFloat(timeToValue as string),
      monthlyROI,
      dailyOpportunityCost: parseFloat(dailyOpportunityCost.toFixed(0))
    });
  };

  useEffect(() => {
    calculateResults();
  }, [inputs]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleSliderChange = (name: string, value: number[]) => {
    setInputs(prev => ({
      ...prev,
      [name]: value[0]
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Website ROI Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-6">
          <div>
            <Label className="text-lg mb-4">How important is your website for directly generating revenue?</Label>
            <Tabs
              defaultValue="medium"
              className="w-full"
              value={inputs.revenueImportance}
              onValueChange={(value) => setInputs(prev => ({ ...prev, revenueImportance: value as RevenueImportance }))}
            >
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="low">
                  Not Very Important
                </TabsTrigger>
                <TabsTrigger value="medium">
                  Somewhat Important
                </TabsTrigger>
                <TabsTrigger value="high">
                  Very Important
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div>
            <Label className="text-lg mb-4">How much does your current website slow down your sales process?</Label>
            <Tabs
              defaultValue="medium"
              className="w-full"
              value={inputs.currentImpact}
              onValueChange={(value) => setInputs(prev => ({ ...prev, currentImpact: value as CurrentImpact }))}
            >
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="low">
                  Rarely
                </TabsTrigger>
                <TabsTrigger value="medium">
                  Sometimes
                </TabsTrigger>
                <TabsTrigger value="high">
                  Frequently
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div>
            <Label className="text-lg">How many placements do you make per month now?</Label>
            <div className="mt-2">
              <Slider
                value={[inputs.currentPlacements]}
                min={1}
                max={50}
                step={1}
                onValueChange={(value) => handleSliderChange('currentPlacements', value)}
                className="py-4"
              />
              <p className="text-right font-medium">{inputs.currentPlacements} placements</p>
            </div>
          </div>

          <div>
            <Label className="text-lg">What&apos;s your average placement value?</Label>
            <div className="mt-2">
              <Slider
                value={[inputs.averageValue]}
                min={5000}
                max={100000}
                step={5000}
                onValueChange={(value) => handleSliderChange('averageValue', value)}
                className="py-4"
              />
              <p className="text-right font-medium">{formatCurrency(inputs.averageValue)}</p>
            </div>
          </div>

          <div>
            <Label className="text-lg">Website redesign investment</Label>
            <div className="mt-2">
              <Slider
                value={[inputs.websiteRedesignCost]}
                min={5000}
                max={100000}
                step={5000}
                onValueChange={(value) => handleSliderChange('websiteRedesignCost', value)}
                className="py-4"
              />
              <p className="text-right font-medium">{formatCurrency(inputs.websiteRedesignCost)}</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Your Results</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Additional Monthly Revenue</span>
              <span className="text-xl font-bold text-green-600">{formatCurrency(results.additionalRevenue)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Months to Break Even</span>
              <span className="text-xl font-bold">{results.timeToValue} months</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Monthly ROI</span>
              <span className="text-xl font-bold">{results.monthlyROI}%</span>
            </div>
            <div className="pt-4 mt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Daily Lost Opportunity Cost</span>
                <span className="text-xl font-bold text-red-600">{formatCurrency(results.dailyOpportunityCost)}</span>
              </div>
              <p className="text-sm text-red-600 mt-1">Daily value of inefficiencies and missed opportunities</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ROICalculator;