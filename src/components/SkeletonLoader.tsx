export default function SkeletonLoader() {
  return (
    <div className="flex animate-pulse space-x-4 px-2">
      <div className="flex-1 rounded-md bg-slate-300" />
      <div className="h-12 w-12 rounded-full bg-slate-300 " />
    </div>
  );
}
