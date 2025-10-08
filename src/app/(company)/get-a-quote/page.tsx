'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Define the schema for the quote form
const quoteFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().optional(),
  company: z.string().optional(),
  productInterest: z.string().min(1, { message: "Please select a product of interest." }),
  quantity: z.string().min(1, { message: "Please specify the quantity." }),
  message: z.string().optional(),
});

type QuoteFormValues = z.infer<typeof quoteFormSchema>;

const GetAQuotePage = () => {
  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      productInterest: "",
      quantity: "",
      message: "",
    },
  });

  const { register, handleSubmit, formState, reset, setValue } = form;
  const { isSubmitting } = formState;

  const onSubmit = async (values: QuoteFormValues) => {
    toast.loading('Sending quote request...');
    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        toast.success('Quote request sent successfully!');
        reset(); // Reset form fields
      } else {
        throw new Error('Failed to send quote request.');
      }
    } catch (error) {
      toast.error('Failed to send quote request. Please try again later.');
    } finally {
      toast.dismiss(); // Dismiss loading toast
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 sm:py-24">
      <div className="text-center mb-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold">Get a Quote</h1>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">Tell us about your needs, and we'll provide a custom quote.</p>
      </div>

      <div className="max-w-3xl mx-auto bg-card p-8 rounded-lg border border-border/50 shadow-sm">
        <h2 className="text-2xl font-bold mb-6">Request a Custom Quote</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-2">Name</label>
            <Input id="name" {...register("name")} placeholder="Your Name" />
            {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-2">Email</label>
            <Input id="email" type="email" {...register("email")} placeholder="your@email.com" />
            {errors.email && <p className="text-destructive text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-muted-foreground mb-2">Phone (Optional)</label>
            <Input id="phone" type="tel" {...register("phone")} placeholder="Your Phone Number" />
            {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone.message}</p>}
          </div>
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-muted-foreground mb-2">Company (Optional)</label>
            <Input id="company" {...register("company")} placeholder="Your Company Name" />
            {errors.company && <p className="text-destructive text-sm mt-1">{errors.company.message}</p>}
          </div>
          <div>
            <label htmlFor="productInterest" className="block text-sm font-medium text-muted-foreground mb-2">Product Interest</label>
            <Select onValueChange={(value) => setValue("productInterest", value, { shouldValidate: true })} value={form.watch("productInterest")}>
              <SelectTrigger className="w-full" id="productInterest">
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beef">Beef</SelectItem>
                <SelectItem value="goat">Goat</SelectItem>
                <SelectItem value="lamb">Lamb</SelectItem>
                <SelectItem value="mutton">Mutton</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.productInterest && <p className="text-destructive text-sm mt-1">{errors.productInterest.message}</p>}
          </div>
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-muted-foreground mb-2">Quantity (e.g., 1000 kg, 50 carcasses)</label>
            <Input id="quantity" {...register("quantity")} placeholder="Specify quantity" />
            {errors.quantity && <p className="text-destructive text-sm mt-1">{errors.quantity.message}</p>}
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-muted-foreground mb-2">Additional Message (Optional)</label>
            <Textarea id="message" {...register("message")} placeholder="Any specific requirements or questions?" rows={5} />
            {errors.message && <p className="text-destructive text-sm mt-1">{errors.message.message}</p>}
          </div>
          <div className="flex items-center justify-between">
            <Button type="submit" disabled={isSubmitting}>
              <Send className="mr-2 h-4 w-4" />
              {isSubmitting ? 'Sending...' : 'Request Quote'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GetAQuotePage;
