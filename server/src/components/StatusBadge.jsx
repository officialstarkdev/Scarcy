const MAP = {
  pending: { label: 'Pending', cls: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' },
  confirmed: { label: 'Confirmed', cls: 'bg-sky-500/15 text-sky-400 border-sky-500/30' },
  preparing: { label: 'In the kitchen', cls: 'bg-gold/15 text-gold border-gold/30' },
  out_for_delivery: { label: 'On the way', cls: 'bg-violet-500/15 text-violet-400 border-violet-500/30' },
  delivered: { label: 'Delivered', cls: 'bg-leaf/15 text-leaf border-leaf/30' },
  cancelled: { label: 'Cancelled', cls: 'bg-ember/15 text-ember border-ember/30' },
};

export default function StatusBadge({ status }) {
  const s = MAP[status] || MAP.pending;
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${s.cls}`}>
      {s.label}
    </span>
  );
}
