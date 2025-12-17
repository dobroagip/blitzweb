import type { Translation } from '../../types';

export default function ProcessSection({ t }: { t: Translation }) {
  if (!t.process) return null;

  return (
    <section className="bg-slate-900 py-24">
      <div className="max-w-7xl mx-auto px-4">

        <h2 className="text-3xl md:text-4xl font-bold text-white mb-16 text-center">
          {t.process.title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {t.process.steps.map((step, i) => (
            <div key={i} className="relative text-center">
              
              {/* номер */}
              <div className="text-yellow-400 text-5xl font-bold mb-4">
                0{i + 1}
              </div>

              <h3 className="text-xl font-semibold text-white mb-3">
                {step.title}
              </h3>

              <p className="text-slate-400 leading-relaxed">
                {step.desc}
              </p>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
