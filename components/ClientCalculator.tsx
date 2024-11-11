'use client';
import { useSearchParams } from 'next/navigation';
import PipelineCalculator from '@/components/PipelineCalculator';

export default function ClientCalculator() {
  const searchParams = useSearchParams();
  const industryParam = searchParams.get('industry');
  return <PipelineCalculator initialIndustry={industryParam} />;
}