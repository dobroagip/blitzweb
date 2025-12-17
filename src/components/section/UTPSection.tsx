import type { Translation } from '../../types';

export default function UTPSection({ t }: { t: Translation }) {
  if (!t.utp) return null;

  return (
    <section className="bg-slate-950 py-20">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Заголовок */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t.utp.title}
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            {t.utp.subtitle}
          </p>
        </div>

        {/* Карточки */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {t.utp.items.map((item, i) => (
            <div
              key={i}
              className="
                bg-slate-900
                border border-slate-800
                rounded-2xl
                p-6
                hover:border-yellow-400
                transition
                text-center
              "
            >
              <h3 className="text-lg font-semibold text-white mb-3">
                {item.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
