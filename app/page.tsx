import { ConverterPanel } from '@/components/converter-panel';

export default function HomePage() {
  return (
    <main>
      <section className="mx-auto w-full max-w-4xl px-4 pb-10 pt-4 sm:px-6 sm:pt-8">
        <div className="mb-4 flex items-center justify-between gap-3">
          <a href="/" className="flex min-w-0 items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-field text-lg font-black text-white">FC</span>
            <span className="text-lg font-black text-ink dark:text-white">FieldConvert</span>
          </a>
        </div>
        <h1 className="sr-only">FieldConvert unit converter</h1>
        <ConverterPanel categoryId="length" fromId="meter" toId="centimeter" compact />
      </section>
    </main>
  );
}
