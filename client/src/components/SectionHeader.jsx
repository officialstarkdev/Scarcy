import Reveal from './Reveal';

export default function SectionHeader({ script, title, sub, light = false, className = '' }) {
  return (
    <Reveal className={`text-center ${className}`}>
      {script && (
        <p className={`font-display text-lg italic leading-none sm:text-xl ${light ? 'text-sage' : 'text-forestsoft'}`}>
          {script}
        </p>
      )}
      <h2 className={`h-display mt-2 text-3xl sm:text-4xl lg:text-[42px] ${light ? 'text-cream' : ''}`}>{title}</h2>
      {sub && (
        <p className={`mx-auto mt-3 max-w-xl text-sm leading-relaxed ${light ? 'text-cream/65' : 'text-muted'}`}>
          {sub}
        </p>
      )}
    </Reveal>
  );
}
