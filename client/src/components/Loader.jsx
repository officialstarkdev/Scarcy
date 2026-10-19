export default function Loader({ label = 'Setting the table…' }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-muted">
      <div className="h-12 w-12 animate-spin rounded-full border-2 border-forest/15 border-t-forest" />
      <p className="text-sm tracking-wide">{label}</p>
    </div>
  );
}
