import { Metadata } from 'next';
import { Shield, Eye, Cookie, Database, Mail, Scale } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy - CryptoNews UK',
  description: 'Privacy Policy for CryptoNews UK. Learn how we collect, use, and protect your personal information.',
  keywords: 'privacy policy, data protection, GDPR, personal information',
  openGraph: {
    title: 'Privacy Policy - CryptoNews UK',
    description: 'Privacy Policy for CryptoNews UK. Learn how we collect, use, and protect your personal information.',
    type: 'website',
  },
};

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: Database,
      title: "Information We Collect",
      content: [
        "Personal information you provide when contacting us (name, email)",
        "Usage data (pages visited, time spent, browser information)",
        "Device information (IP address, device type, operating system)",
        "Cookies and similar tracking technologies",
        "Comments and feedback you submit on our articles"
      ]
    },
    {
      icon: Eye,
      title: "How We Use Your Information",
      content: [
        "To provide and improve our news services",
        "To respond to your inquiries and support requests",
        "To analyze website usage and optimize user experience",
        "To send relevant newsletters (with your consent)",
        "To comply with legal obligations and prevent fraud"
      ]
    },
    {
      icon: Shield,
      title: "Data Protection",
      content: [
        "We implement appropriate security measures to protect your data",
        "Your personal information is encrypted during transmission",
        "Access to personal data is restricted to authorized personnel only",
        "Regular security audits and updates to our systems",
        "Data backup and recovery procedures are in place"
      ]
    },
    {
      icon: Cookie,
      title: "Cookies Policy",
      content: [
        "Essential cookies for website functionality",
        "Analytics cookies to understand user behavior (anonymized)",
        "Preference cookies to remember your settings",
        "You can control cookie preferences in your browser settings",
        "Some features may not work properly if cookies are disabled"
      ]
    }
  ];

  const rights = [
    "Access: Request copies of your personal data",
    "Rectification: Request correction of inaccurate data",
    "Erasure: Request deletion of your personal data",
    "Portability: Request transfer of your data to another service",
    "Restriction: Request limitation of processing your data",
    "Objection: Object to processing of your personal data"
  ];

  return (
    <div className="min-h-screen bg-slate-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed">
            Your privacy is important to us. This policy explains how we collect, 
            use, and protect your personal information.
          </p>
          <div className="mt-6 text-sm text-gray-400">
            <p>Last updated: December 2024</p>
            <p>Effective date: December 2024</p>
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-slate-800 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Introduction</h2>
          <div className="text-gray-300 space-y-4">
            <p>
              CryptoNews UK ("we," "our," or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your 
              information when you visit our website or use our services.
            </p>
            <p>
              By using our website, you consent to the data practices described in this policy. 
              If you do not agree with the practices described in this policy, please do not 
              use our website.
            </p>
            <p>
              This policy complies with the UK General Data Protection Regulation (UK GDPR) 
              and the Data Protection Act 2018.
            </p>
          </div>
        </div>

        {/* Main Sections */}
        <div className="space-y-8 mb-12">
          {sections.map((section, index) => (
            <div key={index} className="bg-slate-800 rounded-lg p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                  <section.icon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">{section.title}</h2>
              </div>
              <ul className="space-y-3">
                {section.content.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start text-gray-300">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Your Rights */}
        <div className="bg-slate-800 rounded-lg p-8 mb-12">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Your Rights Under UK GDPR</h2>
          </div>
          <p className="text-gray-300 mb-6">
            Under UK GDPR, you have the following rights regarding your personal data:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rights.map((right, index) => (
              <div key={index} className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-300">{right}</span>
              </div>
            ))}
          </div>
          <p className="text-gray-300 mt-6">
            To exercise any of these rights, please contact us using the information provided below.
          </p>
        </div>

        {/* Third Party Services */}
        <div className="bg-slate-800 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Third-Party Services</h2>
          <div className="space-y-6 text-gray-300">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Google Analytics</h3>
              <p>
                We use Google Analytics to analyze website usage. Google Analytics collects 
                information anonymously and reports website trends. You can opt-out of Google 
                Analytics by installing the Google Analytics opt-out browser add-on.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Social Media</h3>
              <p>
                Our website includes social media features (Twitter, Facebook, LinkedIn). 
                These features may collect your IP address and set cookies. Social media 
                features are governed by the privacy policies of the respective companies.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">External Links</h3>
              <p>
                Our website contains links to external sites. We are not responsible for 
                the privacy practices of these external sites. We encourage you to review 
                their privacy policies.
              </p>
            </div>
          </div>
        </div>

        {/* Data Retention */}
        <div className="bg-slate-800 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Data Retention</h2>
          <div className="text-gray-300 space-y-4">
            <p>
              We retain your personal information only for as long as necessary to fulfill 
              the purposes outlined in this privacy policy, unless a longer retention period 
              is required by law.
            </p>
            <ul className="space-y-2 ml-4">
              <li>• Contact form submissions: 2 years</li>
              <li>• Newsletter subscriptions: Until you unsubscribe</li>
              <li>• Analytics data: 26 months (Google Analytics default)</li>
              <li>• Comments: Until you request deletion</li>
            </ul>
          </div>
        </div>

        {/* International Transfers */}
        <div className="bg-slate-800 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">International Data Transfers</h2>
          <div className="text-gray-300 space-y-4">
            <p>
              Some of our service providers may be located outside the UK/EEA. When we 
              transfer your personal data internationally, we ensure appropriate safeguards 
              are in place, such as:
            </p>
            <ul className="space-y-2 ml-4">
              <li>• Standard Contractual Clauses approved by the European Commission</li>
              <li>• Adequacy decisions by the UK government</li>
              <li>• Certification schemes and codes of conduct</li>
            </ul>
          </div>
        </div>

        {/* Changes to Policy */}
        <div className="bg-slate-800 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Changes to This Policy</h2>
          <div className="text-gray-300 space-y-4">
            <p>
              We may update this privacy policy from time to time. We will notify you of 
              any changes by posting the new privacy policy on this page and updating the 
              "Last updated" date.
            </p>
            <p>
              You are advised to review this privacy policy periodically for any changes. 
              Changes to this privacy policy are effective when they are posted on this page.
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-blue-900/50 rounded-lg p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
          <p className="text-gray-300 mb-6">
            If you have any questions about this Privacy Policy or our data practices, 
            please contact us:
          </p>
          <div className="space-y-2 text-gray-300">
            <p><strong>Email:</strong> privacy@cryptonews-uk.com</p>
            <p><strong>Data Protection Officer:</strong> dpo@cryptonews-uk.com</p>
            <p><strong>Address:</strong> 123 Crypto Street, London, UK, EC1A 1BB</p>
          </div>
          <p className="text-sm text-gray-400 mt-6">
            You also have the right to lodge a complaint with the Information Commissioner's 
            Office (ICO) if you believe we have not handled your personal data appropriately.
          </p>
        </div>
      </div>
    </div>
  );
} 