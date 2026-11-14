import { SectionTitle } from "@/components/shell/section-title";

const block = "animate-pulse bg-fill motion-reduce:animate-none";

// One line of text, as tall as the line it stands in for.
function TextLine({ className }: { className: string }) {
  return (
    <span className={`relative block ${className}`}>
      {" "}
      <span className={`absolute inset-x-0 top-1/2 h-[0.7em] -translate-y-1/2 rounded ${block}`} />
    </span>
  );
}

// The title and meta lines under a cover, as tall as the star beside them.
function CardText({ title }: { title: string }) {
  return (
    <div className="min-h-11 pt-2 pr-12 box-content">
      <TextLine className={title} />
      <TextLine className="w-1/3 text-[13px]" />
    </div>
  );
}

// Home before the list arrives, the same shape as the screen that replaces it.
export function HomeSkeleton() {
  return (
    <div aria-hidden="true">
      <section className="skeleton-resume pb-5">
        <SectionTitle>Continue listening</SectionTitle>
        <div className="px-4">
          <div className={`h-14 w-[48vw] max-w-[240px] rounded-xl ${block}`} />
        </div>
      </section>
      <div className="skeleton-grid grid grid-cols-2 gap-x-4 gap-y-5 px-4">
        {["a", "b", "c", "d"].map((key) => (
          <div key={key}>
            <div className={`aspect-square ${block}`} />
            <CardText title="w-3/4 text-[13px]" />
          </div>
        ))}
      </div>
      <div className="skeleton-list">
        {["a", "b", "c", "d", "e"].map((key) => (
          <div key={key} className="flex items-center gap-3 pl-4">
            <div className={`size-12 shrink-0 ${block}`} />
            <div className="min-h-11 min-w-0 flex-1 border-b border-separator py-2.5 pr-2 box-content">
              <TextLine className="w-2/3 text-[15px]" />
              <TextLine className="w-1/4 text-[13px]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
