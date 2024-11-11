//Welcome to the Upfront Ops Pipeline Calculator! This tool is designed to help you analyze and optimize your sales pipeline.

//If you're here, you're probably interested in the sources I used while making this. 
//Note they are only estimates based on available data at the time of development. Here they are:


/* SOURCES:

- **Sales Funnel Conversion Rates: 5 Metrics to Know**  
  URL: https://www.mosaic.tech/financial-metrics/sales-funnel-conversion-rate

- **Updated 2023: Average Conversion Rate by Industry and Marketing Source**  
  URL: https://www.ruleranalytics.com/blog/insight/conversion-rate-by-industry/

- **Understanding Your Sales Funnel Conversion Rate (and How to Use It)**  
  URL: https://www.close.com/blog/sales-funnel-conversion-rate

- **7 Types of Consulting Sales Funnel That You Must Build in 2024!**  
  URL: https://www.salesmate.io/blog/consulting-sales-funnel/

- **Improving Sales Funnel Conversion**  
  URL: https://sbrconsulting.com/improving-sales-funnel-conversion/

- **Sales Funnels 101: Optimizing Conversions for Business Growth**  
  URL: https://www.strategicadvisorboard.com/blog-posts/sales-funnels-101-optimizing-conversions-for-business-growth

- **How to Conduct a Sales Funnel Analysis to Improve Conversions**  
  URL: https://www.leadgenius.com/resources/how-to-conduct-a-sales-funnel-analysis-to-improve-conversions

- **What’s a Good Funnel Conversion Rate? (& Tips for Improvement)**  
  URL: https://databox.com/improve-your-funnel-conversion-rate

- **How to Improve Your Sales Funnel Conversion Rates**  
  URL: https://www.copper.com/resources/sales-funnel-conversion-rate

- **Sales Funnel Conversion Rate: A Simple Formula**  
  URL: https://www.kluster.com/blog/metrics-funnel-conversion-rate

- **20 Real Estate Lead Conversion Statistics To Close More Leads**  
  URL: https://www.soocial.com/real-estate-lead-conversion-statistics/

- **The Basics of Sales Funnel Conversion Analysis**  
  URL: https://www.insightsquared.com/blog/the-basics-of-sales-funnel-conversion-analysis/  */

'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'; 
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, TrendingUp, DollarSign, Mail } from 'lucide-react';

  const industryConfigs = {
    coffee_shop: {
      title: "Coffee Shop",
      leads: "Walk-Ins",
      meetings: "Menu Browsers", 
      proposals: "Register Line",
      negotiations: "Orders Placed",
      closed: "Completed Sales",
      avgDealSize: "Average Order Value",
      salesCycle: "Service Time (mins)",
      helperText: {
        leads: "Total number of people entering your shop daily",
        meetings: "Customers who stop to look at menu/products",
        proposals: "Customers who get in line to order",
        negotiations: "Orders being processed/customized",
        closed: "Successfully completed transactions",
        avgDealSize: "Average spend per transaction ($5-$15 typical)",
        salesCycle: "Average minutes from entry to transaction completion",
      },
      benchmarks: {
        leadToMeeting: 75, // 75% of walk-ins look at menu
        meetingToProposal: 80, // 80% of menu browsers get in line
        proposalToNegotiation: 95, // 95% of people in line place an order
        negotiationToClose: 98, // 98% of orders complete successfully
        targetCycle: 8 // target 8 minutes from door to completed order
      }
    },
  
  
    bank: {
      title: "Banking",
      leads: "Service Inquiries",
      meetings: "Consultations",
      proposals: "Applications",
      negotiations: "Under Review",
      closed: "Accounts Opened",
      avgDealSize: "Average Account/Loan Value",
      salesCycle: "Processing Days",
      helperText: {
        leads: "Number of individuals expressing interest in services",
        meetings: "Number of financial consultations conducted",
        proposals: "Number of account/loan applications submitted",
        negotiations: "Applications under review/processing",
        closed: "Successfully opened accounts/approved loans",
        avgDealSize: "Average initial deposit or loan value ($5k-$50k typical)",
        salesCycle: "Days from inquiry to account opening",
      },
      benchmarks: {
        leadToMeeting: 25,
        meetingToProposal: 55,
        proposalToNegotiation: 45,
        negotiationToClose: 45,
        targetCycle: 14
      }
    },
    real_estate: {
      title: "Real Estate",
      leads: "Property Inquiries",
      meetings: "Property Showings",
      proposals: "Offers Made",
      negotiations: "Price Negotiations",
      closed: "Properties Sold",
      avgDealSize: "Property Value",
      salesCycle: "Days to Close",
      helperText: {
        leads: "Number of property inquiries received",
        meetings: "Number of property showings conducted",
        proposals: "Number of offers submitted",
        negotiations: "Active price/term negotiations",
        closed: "Successfully closed property deals",
        avgDealSize: "Average property sale price ($200k-$500k typical)",
        salesCycle: "Days from listing to closing",
      },
      benchmarks: {
        leadToMeeting: 7.5,
        meetingToProposal: 22.5,
        proposalToNegotiation: 45,
        negotiationToClose: 45,
        targetCycle: 120
      }
    },
    consulting: {
      title: "Consulting",
      leads: "Prospects",
      meetings: "Discovery Calls",
      proposals: "Service Proposals",
      negotiations: "Contract Reviews",
      closed: "Projects Won",
      avgDealSize: "Project Value",
      salesCycle: "Days to Sign",
      helperText: {
        leads: "Number of potential clients identified",
        meetings: "Number of initial consultations conducted",
        proposals: "Number of proposals submitted",
        negotiations: "Contracts under review",
        closed: "Successfully signed projects",
        avgDealSize: "Average project value ($10k-$50k typical)",
        salesCycle: "Days from first contact to contract signing",
      },
      benchmarks: {
        leadToMeeting: 12.5,
        meetingToProposal: 55,
        proposalToNegotiation: 35,
        negotiationToClose: 35,
        targetCycle: 60
      }
    },

      franchise_consulting: {
        title: "Franchise Referral Consulting",
        leads: "Franchise Inquiries",
        meetings: "Consultations",
        proposals: "Franchise Plans",
        negotiations: "Terms Discussion",
        closed: "Agreements Signed",
        avgDealSize: "Referral Fee",
        salesCycle: "Days to Close",
        helperText: {
          leads: "Number of individuals interested in franchising opportunities",
          meetings: "Initial meetings to assess client needs",
          proposals: "Detailed franchising plans presented",
          negotiations: "Discussions to finalize terms",
          closed: "Successfully signed franchise agreements",
          avgDealSize: "Average referral fee ($20k-$100k typical)",
          salesCycle: "Days from inquiry to agreement signing (90-180 typical)",
        },
        benchmarks: {
          leadToMeeting: 12.5, // 10-15%
          meetingToProposal: 55, // 50-60%
          proposalToNegotiation: 40, // ~40%
          negotiationToClose: 35, // 30-40%
          targetCycle: 120 // 3-6 months
        }
      },
    
      lawn_care: {
        title: "Lawn Care Services",
        leads: "Service Inquiries",
        meetings: "On-site Estimates",
        proposals: "Service Quotes",
        negotiations: "Agreement Terms",
        closed: "Contracts Signed",
        avgDealSize: "Annual Contract Value",
        salesCycle: "Days to Sign",
        helperText: {
          leads: "Number of homeowners/businesses seeking lawn care",
          meetings: "On-site evaluations conducted",
          proposals: "Service quotes provided",
          negotiations: "Service agreement discussions",
          closed: "Signed service agreements",
          avgDealSize: "Average annual contract value ($500-$2,000 typical)",
          salesCycle: "Days from inquiry to agreement (7-14 typical)",
        },
        benchmarks: {
          leadToMeeting: 25, // 20-30%
          meetingToProposal: 45, // 40-50%
          proposalToNegotiation: 70, // 60-70%
          negotiationToClose: 65, // ~65%
          targetCycle: 10 // 1-2 weeks
        }
      },
    
      general_contractor: {
        title: "General Contracting",
        leads: "Project Inquiries",
        meetings: "Site Consultations",
        proposals: "Project Bids",
        negotiations: "Contract Terms",
        closed: "Projects Signed",
        avgDealSize: "Project Value",
        salesCycle: "Days to Contract",
        helperText: {
          leads: "Number of property owners seeking construction services",
          meetings: "Initial meetings to discuss project scope",
          proposals: "Detailed project plans and estimates submitted",
          negotiations: "Contract term discussions",
          closed: "Signed construction contracts",
          avgDealSize: "Average project value ($50k-$500k typical)",
          salesCycle: "Days from inquiry to contract (30-90 typical)",
        },
        benchmarks: {
          leadToMeeting: 17.5, // 15-20%
          meetingToProposal: 55, // 50-60%
          proposalToNegotiation: 35, // 25-35%
          negotiationToClose: 30, // ~30%
          targetCycle: 60 // 1-3 months
        }
      },
    
      media_production: {
        title: "Media Production",
        leads: "Project Inquiries",
        meetings: "Creative Consultations",
        proposals: "Production Plans",
        negotiations: "Project Terms",
        closed: "Projects Started",
        avgDealSize: "Project Budget",
        salesCycle: "Days to Start",
        helperText: {
          leads: "Number of businesses/individuals seeking media services",
          meetings: "Initial creative consultations held",
          proposals: "Detailed production plans presented",
          negotiations: "Project scope and budget discussions",
          closed: "Production projects commenced",
          avgDealSize: "Average project budget ($5k-$50k typical)",
          salesCycle: "Days from inquiry to project start (30-60 typical)",
        },
        benchmarks: {
          leadToMeeting: 12.5, // 10-15%
          meetingToProposal: 65, // 60-70%
          proposalToNegotiation: 45, // 40-50%
          negotiationToClose: 45, // ~45%
          targetCycle: 45 // 1-2 months
        }
      },
    
      podcast_producer: {
        title: "Podcast Production",
        leads: "Production Inquiries",
        meetings: "Goal Consultations",
        proposals: "Production Plans",
        negotiations: "Service Terms",
        closed: "Shows Started",
        avgDealSize: "Production Budget",
        salesCycle: "Days to Launch",
        helperText: {
          leads: "Number of podcast production inquiries",
          meetings: "Initial discussions about client goals",
          proposals: "Production plans and pricing presented",
          negotiations: "Service term discussions",
          closed: "Podcast productions commenced",
          avgDealSize: "Average production budget ($2k-$10k per episode typical)",
          salesCycle: "Days from inquiry to production start (14-28 typical)",
        },
        benchmarks: {
          leadToMeeting: 17.5, // 15-20%
          meetingToProposal: 55, // 50-60%
          proposalToNegotiation: 35, // 30-40%
          negotiationToClose: 35, // ~35%
          targetCycle: 21 // 2-4 weeks
        }
      },
    
      influencer_coach: {
        title: "Coach/Mentor",
        leads: "Program Inquiries",
        meetings: "Discovery Calls",
        proposals: "Program Offers",
        negotiations: "Enrollment Discussion",
        closed: "Programs Enrolled",
        avgDealSize: "Program Fee",
        salesCycle: "Days to Enroll",
        helperText: {
          leads: "Number of individuals seeking coaching services",
          meetings: "Initial discovery calls conducted",
          proposals: "Program offerings presented",
          negotiations: "Enrollment and terms discussion",
          closed: "Successfully enrolled clients",
          avgDealSize: "Average program fee ($1k-$10k typical)",
          salesCycle: "Days from inquiry to enrollment (7-21 typical)",
        },
        benchmarks: {
          leadToMeeting: 22.5, // 20-25%
          meetingToProposal: 55, // 50-60%
          proposalToNegotiation: 45, // 40-50%
          negotiationToClose: 45, // ~45%
          targetCycle: 14 // 1-3 weeks
        }
      }
    }
  
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
    const [mounted, setMounted] = useState(false);
    // Add useEffect to handle client-side mounting
    const searchParams = useSearchParams();
    const industryUrlMap: Record<string, string[]> = {
        'coffee_shop': ['coffee', 'cafe', 'coffeeshop', 'coffee-shop'],
        'bank': ['banking', 'finance', 'financial', 'bank'],
        'real_estate': ['realestate', 'real-estate', 'property', 'realtor'],
        'consulting': ['consultant', 'consultancy', 'advisor', 'consulting'],
        'franchise_consulting': ['franchise', 'franchise-consulting', 'franchise-advisor', 'franchise-consultant'],
        'lawn_care': ['lawncare', 'lawn-care', 'landscaping', 'landscape-services'],
        'general_contractor': ['generalcontractor', 'general-contractor', 'construction', 'builder'],
        'media_production': ['media', 'media-production', 'production-company', 'video-production'],
        'podcast_producer': ['podcast', 'podcasting', 'podcast-producer', 'audio-production'],
        'influencer_coach': ['influencer', 'coach', 'mentorship', 'coaching', 'social-coach']
    };
    
    useEffect(() => {
      setMounted(true);
    }, []);
    
    const [selectedIndustry, setSelectedIndustry] = useState<string>(() => {
      const param = searchParams.get('industry');
      if (!param) return "";
      
      // Check for direct match
      if (param in industryConfigs) {
        return param;
      }
    
      // Check mapped values
      for (const [industry, variations] of Object.entries(industryUrlMap)) {
        if (variations.includes(param.toLowerCase())) {
          return industry;
        }
      }
    
      // Default return if no match found
      return "";
    });
  
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
        // Always return a valid config object to prevent undefined access
        if (!selectedIndustry || !mounted) {
          return {
            title: "Select Your Industry",
            leads: "Leads",
            meetings: "Meetings",
            proposals: "Proposals",
            negotiations: "Negotiations",
            closed: "Closed",
            avgDealSize: "Average Deal Size",
            salesCycle: "Sales Cycle",
            helperText: {
              leads: "",
              meetings: "",
              proposals: "",
              negotiations: "",
              closed: "",
              avgDealSize: "",
              salesCycle: "",
            },
            benchmarks: {
              leadToMeeting: 0,
              meetingToProposal: 0,
              proposalToNegotiation: 0,
              negotiationToClose: 0,
              targetCycle: 0
            }
          };
        }
        
        return industryConfigs[selectedIndustry as keyof typeof industryConfigs];
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
    
        const config = getCurrentConfig();
        const benchmarks = config.benchmarks;
    
        // Calculate potential deals based on benchmark rates
        const potentialDeals = numbers.leads *
            (benchmarks.leadToMeeting / 100) *
            (benchmarks.meetingToProposal / 100) *
            (benchmarks.proposalToNegotiation / 100) *
            (benchmarks.negotiationToClose / 100);
    
        // Corrected: Use potentialDeals to calculate potentialRevenue
        const potentialRevenue = potentialDeals * numbers.avgDealSize;
    
        // Calculate improvement potential for each stage
        const improvements = {
            leadToMeeting: Math.max(0, (benchmarks.leadToMeeting / 100) - (numbers.meetings / numbers.leads)),
            meetingToProposal: Math.max(0, (benchmarks.meetingToProposal / 100) - (numbers.proposals / numbers.meetings)),
            proposalToNegotiation: Math.max(0, (benchmarks.proposalToNegotiation / 100) - (numbers.negotiations / numbers.proposals)),
            negotiationToClose: Math.max(0, (benchmarks.negotiationToClose / 100) - (numbers.closed / numbers.negotiations))
        };
    
        // Corrected: Calculate improved conversion rates
        const improvedConversionRates = {
            leadToMeeting: Math.min((numbers.meetings / numbers.leads) + improvements.leadToMeeting, 1),
            meetingToProposal: Math.min((numbers.proposals / numbers.meetings) + improvements.meetingToProposal, 1),
            proposalToNegotiation: Math.min((numbers.negotiations / numbers.proposals) + improvements.proposalToNegotiation, 1),
            negotiationToClose: Math.min((numbers.closed / numbers.negotiations) + improvements.negotiationToClose, 1)
        };
    
        // Corrected: Calculate improved deals using improved conversion rates
        const improvedDeals = numbers.leads *
            improvedConversionRates.leadToMeeting *
            improvedConversionRates.meetingToProposal *
            improvedConversionRates.proposalToNegotiation *
            improvedConversionRates.negotiationToClose;
    
        // Corrected: Calculate improved revenue using improved deals
        const improvedRevenue = improvedDeals * numbers.avgDealSize;
    
        // Calculate velocity score
        let velocityScore;
        const targetCycle = benchmarks?.targetCycle || 30;
    
        if (numbers.salesCycle <= targetCycle * 0.5) {
            velocityScore = { score: 'A', text: 'Excellent', color: 'text-green-600' };
        } else if (numbers.salesCycle <= targetCycle) {
            velocityScore = { score: 'B', text: 'Good', color: 'text-blue-600' };
        } else if (numbers.salesCycle <= targetCycle * 1.5) {
            velocityScore = { score: 'C', text: 'Fair', color: 'text-yellow-600' };
        } else {
            velocityScore = { score: 'D', text: 'Needs Improvement', color: 'text-red-600' };
        }
    
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
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">
              {mounted && selectedIndustry ? `${getCurrentConfig().title} Pipeline Health Calculator` : "Select Your Industry"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mounted ? (
              <>
                {!searchParams.get('industry') && (
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
                                <SelectItem value="franchise_consulting">Franchise Consulting</SelectItem>
                                <SelectItem value="lawn_care">Lawn Care</SelectItem>
                                <SelectItem value="general_contractor">General Contractor</SelectItem>
                                <SelectItem value="media_production">Media Production Company</SelectItem>
                                <SelectItem value="podcast_producer">Podcast Producer</SelectItem>
                                <SelectItem value="influencer_coach">Influencer/Coach</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}

      
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
                      {getCurrentConfig()?.[key] || key}
                    </Label>
                    <Input
                      required
                      type="number"
                      value={pipelineData[key]}
                      onChange={(e) => setPipelineData({...pipelineData, [key]: e.target.value})}
                      placeholder={`Qty of ${getCurrentConfig()?.[key]?.toLowerCase() || key}`}
                      disabled={!selectedIndustry}
                    />
                    <p className="text-sm text-gray-500">
                      {getCurrentConfig()?.helperText?.[key] || ''}
                    </p>
                  </div>
                ))}
              </div>
              <Button 
                type="submit" 
                className="w-full mt-6" 
                disabled={!selectedIndustry}
              >
                Calculate {getCurrentConfig().title || 'Pipeline'} Pipeline Health Score
              </Button>
            </form>

            {results && (
              <div className="space-y-6 mt-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Alert className="bg-blue-50">
                    <Activity className="h-4 w-4" />
                    <AlertTitle>Overall Conversion</AlertTitle>
                    <AlertDescription>
                      <span className="text-2xl font-bold">
                        {`${results.conversionRates.overallConversion}%`}
                      </span>
                    </AlertDescription>
                  </Alert>
                  
                  <Alert className="bg-blue-50">
                    <DollarSign className="h-4 w-4" />
                    <AlertTitle>Monthly Revenue</AlertTitle>
                    <AlertDescription>
                      <span className="text-2xl font-bold">
                        ${results.potentialRevenue.toLocaleString()}
                      </span>
                    </AlertDescription>
                  </Alert>
                  
                  <Alert className="bg-blue-50">
                    <TrendingUp className="h-4 w-4" />
                    <AlertTitle>Velocity Score</AlertTitle>
                    <AlertDescription>
                      <span className={`text-2xl font-bold ${results.velocityScore.color}`}>
                        {results.velocityScore.score}
                      </span>
                      <span className="block text-sm">
                        {results.velocityScore.text}
                      </span>
                    </AlertDescription>
                  </Alert>
                </div>

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
                  <AlertTitle>Upfront Ops Key Findings</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc pl-4 mt-2 space-y-2">
                      {parseFloat(results.conversionRates.leadToMeeting) < getCurrentConfig().benchmarks.leadToMeeting && (
                        <li>Your {getCurrentConfig().leads.toLowerCase()}-to-{getCurrentConfig().meetings.toLowerCase()} conversion rate of {results.conversionRates.leadToMeeting}% is below the industry benchmark of {getCurrentConfig().benchmarks.leadToMeeting}%.</li>
                      )}
                      {parseFloat(results.conversionRates.meetingToProposal) < getCurrentConfig().benchmarks.meetingToProposal && (
                        <li>Your {getCurrentConfig().meetings.toLowerCase()}-to-{getCurrentConfig().proposals.toLowerCase()} rate of {results.conversionRates.meetingToProposal}% is below the target of {getCurrentConfig().benchmarks.meetingToProposal}%.</li>
                      )}
                      {parseFloat(results.conversionRates.proposalToNegotiation) < getCurrentConfig().benchmarks.proposalToNegotiation && (
                        <li>Your {getCurrentConfig().proposals.toLowerCase()}-to-{getCurrentConfig().negotiations.toLowerCase()} conversion of {results.conversionRates.proposalToNegotiation}% is below average of {getCurrentConfig().benchmarks.proposalToNegotiation}%.</li>
                      )}
                      {results.numbers.salesCycle > getCurrentConfig().benchmarks.targetCycle && (
                        <li>Your {results.numbers.salesCycle}-day cycle length is above the industry standard of {getCurrentConfig().benchmarks.targetCycle} days.</li>
                      )}
                    </ul>
                  </AlertDescription>
                </Alert>

                <Alert className="bg-blue-50">
                  <AlertTitle className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Additional Revenue Opportunity
                  </AlertTitle>
                  <AlertDescription>
                    <p className="mt-2">
                      With optimized RevOps (revenue operations), you could potentially increase your monthly revenue to: 
                      <span className="font-bold text-blue-600 ml-1">
                        ${results.improvedRevenue.toLocaleString()}
                      </span>
                    </p>
                    <Button onClick={handleDownload} className="mt-4">
                      Get Your Detailed Upfront Ops Analysis Report
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
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-lg text-gray-500">Loading calculator...</div>
        </div>
      )}
    </CardContent>
  </Card>
);
  };

    export default PipelineCalculator;