import React from 'react';
import { DollarSign, Twitter, Facebook, Linkedin, Instagram } from 'lucide-react';
import Logo from '../ui/Logo';

const Footer = () => {
  return (
    <footer className="bg-[var(--neutral-900)] text-white py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
             <Logo />
            <p className="text-[var(--neutral-300)] mb-4">Take control of your financial future with our intuitive personal finance platform.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-[var(--neutral-300)] hover:text-white"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="text-[var(--neutral-300)] hover:text-white"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-[var(--neutral-300)] hover:text-white"><Linkedin className="h-5 w-5" /></a>
              <a href="#" className="text-[var(--neutral-300)] hover:text-white"><Instagram className="h-5 w-5" /></a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-[var(--neutral-300)] hover:text-white">Features</a></li>
              <li><a href="#" className="text-[var(--neutral-300)] hover:text-white">Pricing</a></li>
              <li><a href="#" className="text-[var(--neutral-300)] hover:text-white">Roadmap</a></li>
              <li><a href="#" className="text-[var(--neutral-300)] hover:text-white">Updates</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-[var(--neutral-300)] hover:text-white">Documentation</a></li>
              <li><a href="#" className="text-[var(--neutral-300)] hover:text-white">Blog</a></li>
              <li><a href="#" className="text-[var(--neutral-300)] hover:text-white">Tutorials</a></li>
              <li><a href="#" className="text-[var(--neutral-300)] hover:text-white">Support</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-[var(--neutral-300)] hover:text-white">About</a></li>
              <li><a href="#" className="text-[var(--neutral-300)] hover:text-white">Careers</a></li>
              <li><a href="#" className="text-[var(--neutral-300)] hover:text-white">Contact</a></li>
              <li><a href="#" className="text-[var(--neutral-300)] hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[var(--neutral-700)] mt-12 pt-8 text-center text-[var(--neutral-400)]">
          <p>© {new Date().getFullYear()} BalanceIQ. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;