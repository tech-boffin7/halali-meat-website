
import { MultiStepQuoteForm } from '@/components/forms/multi-step-quote-form';

const GetAQuotePage = () => {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold">Get a Quote</h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
          Let's get started. Tell us about your needs, and we'll provide a custom quote for you.
        </p>
      </div>

      <MultiStepQuoteForm />

    </div>
  );
};

export default GetAQuotePage;
