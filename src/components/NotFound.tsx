import { SITE_URL } from "@/lib/constants";

const NotFoundPage = () => (
  <div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white
              absolute inset-x-0 top-16 bottom-0
              flex flex-col items-center justify-center overflow-hidden">
    {/* The content div itself. No vertical padding needed here as centering is handled by the parent flex container. */}
    <div className="text-center px-4">
      <p className="text-base font-semibold text-sky-600 dark:text-sky-400">404</p>
      <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
        Page Not Found
      </h1>
      <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400">
        Sorry, we couldn’t find the page you’re looking for. It might have been moved or deleted.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <a href={SITE_URL} className="bg-sky-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-sky-700 transition-colors duration-300">
          Go back home
        </a>
        <a href="/contact" className="bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold py-3 px-6 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors duration-300">
          Contact support
        </a>
      </div>
    </div>
  </div>
);

export default NotFoundPage;