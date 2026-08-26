import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-cinema-surfaceLight/60",
        className
      )}
      {...props}
    />
  );
}

export function MovieCardSkeleton() {
  return (
    <div className="relative aspect-[2/3] w-full min-w-[160px] sm:min-w-[200px] md:min-w-[240px] rounded-md overflow-hidden bg-cinema-surface">
      <Skeleton className="w-full h-full" />
    </div>
  );
}

export function MovieRowSkeleton() {
  return (
    <div className="space-y-3 px-4 md:px-12 my-6">
      <Skeleton className="h-6 w-48 rounded" />
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative h-[75vh] w-full bg-cinema-surface flex flex-col justify-end p-8 md:p-16">
      <Skeleton className="h-12 w-96 mb-4 rounded" />
      <Skeleton className="h-20 w-full max-w-xl mb-6 rounded" />
      <div className="flex gap-4">
        <Skeleton className="h-12 w-32 rounded-md" />
        <Skeleton className="h-12 w-36 rounded-md" />
      </div>
    </div>
  );
}
