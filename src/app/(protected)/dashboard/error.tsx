"use client";

type DashboardErrorProps = {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function DashboardError({
    reset
}: DashboardErrorProps) {
    

    return (
        <section role="alert" className="flex min-h-[40vh] flex-col items-center justify-center gap-4 rounded-xl border border-red-200 bg-white p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                <span className="text-2xl font-bold">!</span>
            </div>

            <div className="space-y-2">
                <h2 className="text-xl font-semibold text-[#0c2340]">
                    Something went wrong
                </h2>

                <p className="max-w-md text-sm text-gray-600">
                    We could not load your dashboard. Please try again.
                </p>
            </div>

            <button type="button" onClick={reset} className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2">
                Try again
            </button>
        </section>
    )
}