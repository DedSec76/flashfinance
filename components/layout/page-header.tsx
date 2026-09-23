type PageHeaderProps = {
  title: string;
  subtitle?: string;
};

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="rounded-2xl border border-sky-100 bg-white/80 p-5 shadow-sm ring-1 ring-slate-200/70">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
      {subtitle ? <p className="mt-2 text-sm text-slate-600">{subtitle}</p> : null}
    </div>
  );
}
