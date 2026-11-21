import { PlusIcon } from "@phosphor-icons/react/dist/ssr";
import { FAQ } from "@/lib/site";

export function Faq() {
  return (
    <section id="faq" className="border-t border-line">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-5 py-24 sm:px-8 sm:py-36 lg:grid-cols-12">
        <h2 className="reveal text-4xl font-semibold leading-[1.05] tracking-tighter sm:text-6xl lg:col-span-5">
          Questions, answered.
        </h2>
        <div className="lg:col-span-7">
          {FAQ.map(({ q, a }, i) => (
            <details key={q} open={i === 0} className="group border-b border-line first:border-t">
              <summary className="flex cursor-pointer items-center justify-between gap-6 py-6 text-xl font-medium tracking-tight transition-colors hover:text-accent">
                <h3>{q}</h3>
                <PlusIcon size={20} weight="bold" className="shrink-0 text-muted transition-transform duration-300 group-open:rotate-45" />
              </summary>
              <p className="max-w-[62ch] pb-7 text-lg leading-relaxed text-muted">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
