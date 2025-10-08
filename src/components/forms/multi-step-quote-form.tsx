'use client';

import { useState } from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Building, Mail, Phone, Package, Inbox, MessageSquare, Send, ArrowRight, ArrowLeft, Check } from 'lucide-react';

// --- ZOD SCHEMA DEFINITION ---
const quoteFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().optional(),
  company: z.string().optional(),
  productInterest: z.string({ required_error: "Please select a product." }).min(1, "Please select a product."),
  quantity: z.string().min(1, "Please specify a quantity (e.g., 1000 kg)."),
  message: z.string().optional(),
});

type QuoteFormValues = z.infer<typeof quoteFormSchema>;

const steps = [
  { id: 1, name: 'Contact Info', fields: ['name', 'email', 'phone', 'company'] },
  { id: 2, name: 'Quote Details', fields: ['productInterest', 'quantity'] },
  { id: 3, name: 'Message & Review', fields: ['message'] },
];

// --- STEP COMPONENTS ---

const Step1_ContactInfo = () => {
  const { register, formState: { errors } } = useFormContext<QuoteFormValues>();
  return (
    <div className="space-y-6">
      <div className="relative">
        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input {...register('name')} placeholder="Your Name" className="pl-10 text-sm sm:text-base" />
      </div>
      {errors.name && <p className="text-destructive text-xs sm:text-sm">{errors.name.message}</p>}

      <div className="relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input type="email" {...register('email')} placeholder="your@email.com" className="pl-10 text-sm sm:text-base" />
      </div>
      {errors.email && <p className="text-destructive text-xs sm:text-sm">{errors.email.message}</p>}

      <div className="relative">
        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input type="tel" {...register('phone')} placeholder="Phone Number (Optional)" className="pl-10 text-sm sm:text-base" />
      </div>

      <div className="relative">
        <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input {...register('company')} placeholder="Company Name (Optional)" className="pl-10 text-sm sm:text-base" />
      </div>
    </div>
  );
};

const Step2_QuoteDetails = () => {
  const { register, setValue, formState: { errors }, watch } = useFormContext<QuoteFormValues>();
  return (
    <div className="space-y-6">
      <div className="relative">
        <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Select name="productInterest" onValueChange={(value) => setValue('productInterest', value)} value={watch('productInterest')}>
          <SelectTrigger className="pl-10 text-sm sm:text-base">
            <SelectValue placeholder="Select a product of interest" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beef">Beef</SelectItem>
            <SelectItem value="goat">Goat</SelectItem>
            <SelectItem value="lamb">Lamb</SelectItem>
            <SelectItem value="mutton">Mutton</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {errors.productInterest && <p className="text-destructive text-xs sm:text-sm">{errors.productInterest.message}</p>}

      <div className="relative">
        <Inbox className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input {...register('quantity')} placeholder="Quantity (e.g., 1000 kg, 50 carcasses)" className="pl-10 text-sm sm:text-base" />
      </div>
      {errors.quantity && <p className="text-destructive text-xs sm:text-sm">{errors.quantity.message}</p>}
    </div>
  );
};

const Step3_Review = () => {
  const { register, getValues, formState: { errors } } = useFormContext<QuoteFormValues>();
  const values = getValues();

  return (
    <div className="space-y-6">
      <Textarea {...register('message')} placeholder="Any specific requirements, questions, or comments? (Optional)" rows={4} className="text-sm sm:text-base" />
      {errors.message && <p className="text-destructive text-xs sm:text-sm">{errors.message.message}</p>}
      
      <div className="space-y-4 rounded-lg border bg-background/50 p-4">
        <h4 className="font-semibold text-base sm:text-lg">Review Your Request</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm sm:text-base">
          <p><strong className="text-muted-foreground">Name:</strong> {values.name}</p>
          <p><strong className="text-muted-foreground">Email:</strong> {values.email}</p>
          {values.phone && <p><strong className="text-muted-foreground">Phone:</strong> {values.phone}</p>}
          {values.company && <p><strong className="text-muted-foreground">Company:</strong> {values.company}</p>}
          <p className="col-span-full"><strong className="text-muted-foreground">Product:</strong> {values.productInterest}</p>
          <p className="col-span-full"><strong className="text-muted-foreground">Quantity:</strong> {values.quantity}</p>
        </div>
      </div>
    </div>
  );
};

// --- MAIN MULTI-STEP FORM COMPONENT ---

export const MultiStepQuoteForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const methods = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      productInterest: '',
      quantity: '',
      message: '',
    },
  });

  const { handleSubmit, trigger, formState: { isSubmitting } } = methods;

  const processForm = async (values: QuoteFormValues) => {
    const toastId = toast.loading('Sending your quote request...');
    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('Server responded with an error');
      
      toast.success('Request sent successfully! We will get back to you shortly.', { id: toastId });
      setCurrentStep(0);
      methods.reset();
    } catch (error) {
      toast.error('Something went wrong. Please try again.', { id: toastId });
    }
  };

  type FieldName = keyof QuoteFormValues;

  const nextStep = async () => {
    const fields = steps[currentStep].fields as FieldName[];
    const output = await trigger(fields, { shouldFocus: true });

    if (!output) return;

    if (currentStep < steps.length - 1) {
      setCurrentStep(step => step + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(step => step - 1);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-border/60">
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <CardTitle className="text-xl sm:text-2xl font-bold">Request a Custom Quote</CardTitle>
          <span className="text-sm font-medium text-muted-foreground">Step {currentStep + 1} of {steps.length}</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2.5">
          <motion.div 
            className="bg-primary h-2.5 rounded-full"
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ ease: "easeInOut", duration: 0.5 }}
          />
        </div>
      </CardHeader>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(processForm)}>
          <CardContent className="min-h-[280px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -30, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 0 && <Step1_ContactInfo />}
                {currentStep === 1 && <Step2_QuoteDetails />}
                {currentStep === 2 && <Step3_Review />}
              </motion.div>
            </AnimatePresence>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 0}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button type="button" onClick={nextStep}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Request'} <Send className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </form>
      </FormProvider>
    </Card>
  );
};
