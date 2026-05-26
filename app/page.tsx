import { ConverterPanel } from '@/components/converter-panel';
import { Header } from '@/components/header';

export default function HomePage() {
  return (
    <main>
      <Header />
      <section className="mx-auto w-full max-w-4xl px-4 pb-10 pt-4 sm:px-6 sm:pt-8">
        <h1 className="sr-only">FieldConvert unit converter</h1>
        <ConverterPanel categoryId="length" fromId="meter" toId="centimeter" compact />
      </section>
    </main>
  );
}
