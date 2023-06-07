export default function SkeletonLoader() {
  return (
    <div className="flex animate-pulse space-x-4 px-2">
      <div className="flex-1 rounded-md bg-gradient-to-br from-slate-300 to-slate-100" />
      <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-slate-300 to-slate-100 " />
    </div>
  );
}
