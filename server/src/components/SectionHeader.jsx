import { Wheat } from 'lucide-react';
import Reveal from './Reveal';

export default function SectionHeader({ script, title, sub }) {
  return (
    <Reveal className="text-center">
      <p className="eyebrow">{script}</p>
      <h2 className="h-display mt-1 text-3xl sm:text-4xl lg:text-5xl">{title}</h2>
      <div className="divider-wheat">
        <Wheat size={18} strokeWidth={1.5} />
      </div>
      {sub && <p className="mx-auto max-w-xl text-muted">{sub}</p>}
    </Reveal>
  );
}
