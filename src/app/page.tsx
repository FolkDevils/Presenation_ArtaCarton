'use client';

import { Presentation } from '../components/presentation/Presentation';
import { PresentationProvider } from '../context/PresentationContext';
import { samplePresentation } from '../data/samplePresentation';

export default function Home() {
  return (
    <PresentationProvider config={samplePresentation}>
      <Presentation />
    </PresentationProvider>
  );
}
