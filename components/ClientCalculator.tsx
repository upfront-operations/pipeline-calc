'use client';
import { useSearchParams } from 'next/navigation';
import PipelineCalculator from '@/components/PipelineCalculator';

export default function ClientCalculator() {
  return <PipelineCalculator />;
}
