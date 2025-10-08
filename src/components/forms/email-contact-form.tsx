'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Define the schema for the contact form
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const EmailContactForm = () => {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const { register, handleSubmit, formState, reset } = form;
  const { isSubmitting, errors } = formState;

  const onSubmit = async (values: ContactFormValues) => {
    toast.loading('Sending message...');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(values),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        toast.success('Message sent successfully!');
        reset(); // Reset form fields
      } else {
        throw new Error('Failed to send message.');
      }
    } catch (_error: any) {
      toast.error('Failed to send message. Please try again later.');
    } finally {
      toast.dismiss(); // Dismiss loading toast
    }
  };

  return (
    <div className="bg-secondary/50 p-6 rounded-lg border border-border/50 w-full">
      <h2 className="text-xl font-bold mb-4">Send us an Email</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-xs font-medium text-muted-foreground mb-1">Name</label>
          <Input id="name" {...register("name")} placeholder="Your Name" />
          {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-xs font-medium text-muted-foreground mb-1">Email</label>
          <Input id="email" type="email" {...register("email")} placeholder="your@email.com" />
          {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="message" className="block text-xs font-medium text-muted-foreground mb-1">Message</label>
          <Textarea id="message" {...register("message")} placeholder="How can we help you?" rows={5} />
          {errors.message && <p className="text-destructive text-xs mt-1">{errors.message.message}</p>}
        </div>
        <div className="flex items-center justify-between">
          <Button type="submit" disabled={isSubmitting} size="sm">
            <Send className="mr-2 h-3 w-3" />
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EmailContactForm;
