const MAP = {
  pending: { label: 'Pending', cls: 'bg-gold/15 text-gold border-gold/30' },
  confirmed: { label: 'Confirmed', cls: 'bg-sky-500/15 text-sky-700 border-sky-600/30' },
  preparing: { label: 'In the kitchen', cls: 'bg-forest/10 text-forest border-forest/25' },
  out_for_delivery: { label: 'On the way', cls: 'bg-violet-500/15 text-violet-700 border-violet-500/30' },
  delivered: { label: 'Delivered', cls: 'bg-leaf/15 text-leaf border-leaf/30' },
  cancelled: { label: 'Cancelled', cls: 'bg-ember/15 text-ember border-ember/30' },
};

export default function StatusBadge({ status }) {
  const s = MAP[status] || MAP.pending;
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium ${s.cls}`}>
      {s.label}
    </span>
  );
}
