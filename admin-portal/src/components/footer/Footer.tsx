import React from "react";
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiYoutube } from "react-icons/fi";

interface FooterLinkProps {
  text: string;
  href: string;
}

const FooterLink: React.FC<FooterLinkProps> = ({ text, href }) => {
  return (
    <a
      href={href}
      className="text-slate-300 hover:text-white transition-colors duration-200 text-sm font-medium block mb-3"
    >
      {text}
    </a>
  );
};

interface SocialIconProps {
  icon: React.ReactNode;
  href: string;
  label: string;
}

const SocialIcon: React.FC<SocialIconProps> = ({ icon, href, label }) => {
  return (
    <a
      href={href}
      aria-label={label}
      className="bg-slate-700 hover:bg-emerald-600 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
    >
      {icon}
    </a>
  );
};

interface ContactItemProps {
  icon: React.ReactNode;
  text: string;
  href?: string;
}

const ContactItem: React.FC<ContactItemProps> = ({ icon, text, href }) => {
  const content = (
    <div className="flex items-start space-x-3 mb-4">
      <div className="bg-emerald-600 rounded-lg p-2 mt-0.5">
        {icon}
      </div>
      <p className="text-slate-300 text-sm font-medium leading-relaxed">{text}</p>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="hover:text-white transition-colors duration-200">
        {content}
      </a>
    );
  }

  return content;
};

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-2xl">C</span>
              </div>
              <div>
                <h3 className="font-black text-xl">CIBF</h3>
                <p className="text-xs text-slate-400 font-medium">Admin Portal</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Comprehensive management system for the Colombo International Book Fair. Streamline your stall reservations and vendor operations.
            </p>
            <div className="flex space-x-3">
              <SocialIcon
                icon={<FiFacebook className="w-5 h-5 text-white" />}
                href="https://facebook.com"
                label="Facebook"
              />
              <SocialIcon
                icon={<FiTwitter className="w-5 h-5 text-white" />}
                href="https://twitter.com"
                label="Twitter"
              />
              <SocialIcon
                icon={<FiInstagram className="w-5 h-5 text-white" />}
                href="https://instagram.com"
                label="Instagram"
              />
              <SocialIcon
                icon={<FiLinkedin className="w-5 h-5 text-white" />}
                href="https://linkedin.com"
                label="LinkedIn"
              />
              <SocialIcon
                icon={<FiYoutube className="w-5 h-5 text-white" />}
                href="https://youtube.com"
                label="YouTube"
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-black mb-6 text-white">Quick Links</h3>
            <FooterLink text="Dashboard" href="/dashboard" />
            <FooterLink text="Stall Management" href="/stalls" />
            <FooterLink text="Vendor Directory" href="/vendors" />
            <FooterLink text="Reservations" href="/reservations" />
            <FooterLink text="Map View" href="/map" />
            <FooterLink text="Reports" href="/reports" />
          </div>

          <div>
            <h3 className="text-lg font-black mb-6 text-white">Resources</h3>
            <FooterLink text="Documentation" href="/docs" />
            <FooterLink text="API Reference" href="/api" />
            <FooterLink text="Support Center" href="/support" />
            <FooterLink text="FAQs" href="/faq" />
            <FooterLink text="System Status" href="/status" />
            <FooterLink text="Privacy Policy" href="/privacy" />
          </div>

          <div>
            <h3 className="text-lg font-black mb-6 text-white">Contact Us</h3>
            <ContactItem
              icon={<FiMapPin className="w-4 h-4 text-white" />}
              text="Colombo International Book Fair, BMICH, Bauddhaloka Mawatha, Colombo 07"
            />
            <ContactItem
              icon={<FiPhone className="w-4 h-4 text-white" />}
              text="+94 11 234 5678"
              href="tel:+94112345678"
            />
            <ContactItem
              icon={<FiMail className="w-4 h-4 text-white" />}
              text="admin@cibf.lk"
              href="mailto:admin@cibf.lk"
            />
          </div>
        </div>

        <div className="border-t border-slate-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-slate-400 text-sm font-medium">
              © {currentYear} Colombo International Book Fair. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="/terms" className="text-slate-400 hover:text-white text-sm font-medium transition-colors duration-200">
                Terms of Service
              </a>
              <a href="/privacy" className="text-slate-400 hover:text-white text-sm font-medium transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="/cookies" className="text-slate-400 hover:text-white text-sm font-medium transition-colors duration-200">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;