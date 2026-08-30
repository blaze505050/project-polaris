import { useRouteError, isRouteErrorResponse } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  let errorMessage = "An unexpected error occurred.";

  if (isRouteErrorResponse(error)) {
    errorMessage = `${error.status} ${error.statusText}`;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="min-h-screen bg-[#050914] text-white flex flex-col items-center justify-center p-6 text-center font-mono">
      <div className="max-w-md w-full p-8 rounded-2xl border border-cyan-500/30 bg-slate-950/80 shadow-2xl backdrop-blur-md">
        <div className="size-12 mx-auto mb-4 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
          !
        </div>
        <h1 className="text-xl font-bold font-sans text-white mb-2">AeroForge Module Notice</h1>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">{errorMessage}</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => (window.location.href = import.meta.env.BASE_URL || "/aeroforge/")}
            className="px-4 py-2 rounded-lg bg-cyan-500 text-black text-xs font-bold hover:bg-cyan-400 transition-colors"
          >
            Return to Workstation
          </button>
        </div>
      </div>
    </div>
  );
}
