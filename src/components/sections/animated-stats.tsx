
'use client';

import { motion, useInView } from 'framer-motion';
import { memo, useRef } from 'react';
import CountUp from 'react-countup';

const stats = [
  { value: 10, suffix: '+', label: 'Years of Experience' },
  { value: 5, suffix: '+', label: 'Export Countries' },
  { value: 99, suffix: '%', label: 'Customer Satisfaction' },
  { value: 100, suffix: '%', label: 'Halal Certified' },
];

const AnimatedStats = memo(function AnimatedStats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <section ref={ref} className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              {isInView && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-primary"
                >
                  <CountUp end={stat.value} duration={3} suffix={stat.suffix} />
                </motion.div>
              )}
              <p className="mt-2 text-sm sm:text-base text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default AnimatedStats;
