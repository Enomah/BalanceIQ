import Link from 'next/link';
import React from 'react';

const CTA = () => {
  return (
    <section className="py-20 bg-[var(--bg-secondary)] px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <div className="bg-gradient-to-r from-[var(--primary-500)] to-[var(--primary-700)] rounded-3xl p-10 md:p-16 text-white animate-on-scroll opacity-0">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Financial Life?</h2>
          <p className="text-xl opacity-90 mb-8">Join thousands of users who are already taking control of their finances with BalanceIQ.</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href={"/signup"} className="px-8 py-4 bg-white text-[var(--primary-500)] rounded-lg font-semibold hover:bg-[var(--neutral-200)] transition-colors">
              Create Free Account
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;