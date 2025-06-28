'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, Clock, MessageSquare } from 'lucide-react';

export default function ContactsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Устанавливаем метаданные
  useEffect(() => {
    document.title = 'Contact Us - InfoCryptoX.com';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Get in touch with InfoCryptoX.com team. Send us your news tips, partnership inquiries, or feedback.');
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Симуляция отправки формы
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubmitted(true);
    setIsSubmitting(false);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });

    // Скрыть сообщение об успехе через 5 секунд
    setTimeout(() => setSubmitted(false), 5000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Get in touch via email",
      contact: "editorial@infocryptox.com",
      link: "mailto:editorial@infocryptox.com"
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Speak with our team",
      contact: "+1 (555) CRYPTO-X",
      link: "tel:+1555CRYPTOX"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      description: "Worldwide coverage",
      contact: "infocryptox.com - Global Network",
      link: "https://infocryptox.com"
    }
  ];

  const departments = [
    {
      name: "Editorial",
      email: "editorial@infocryptox.com",
      description: "News tips, story suggestions, press releases"
    },
    {
      name: "Partnerships",
      email: "partnerships@infocryptox.com",
      description: "Business partnerships, sponsorships, collaborations"
    },
    {
      name: "Technical Support",
      email: "support@infocryptox.com",
      description: "Website issues, technical problems, accessibility"
    },
    {
      name: "Advertising",
      email: "advertising@infocryptox.com",
      description: "Advertising opportunities, media kit requests"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Have a question, story tip, or just want to get in touch? 
            We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          
          {/* Contact Form */}
          <div className="bg-slate-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <MessageSquare className="w-6 h-6 mr-3" />
              Send us a Message
            </h2>
            
            {submitted && (
              <div className="bg-green-600 text-white p-4 rounded-lg mb-6">
                <p className="font-semibold">Message sent successfully!</p>
                <p className="text-sm">We'll get back to you within 24 hours.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a subject</option>
                  <option value="news-tip">News Tip</option>
                  <option value="press-release">Press Release</option>
                  <option value="partnership">Partnership Inquiry</option>
                  <option value="advertising">Advertising</option>
                  <option value="technical">Technical Issue</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Get in Touch</h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <a
                    key={index}
                    href={info.link}
                    className="flex items-start space-x-4 p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                        <info.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{info.title}</h3>
                      <p className="text-gray-400 text-sm">{info.description}</p>
                      <p className="text-blue-400 font-medium">{info.contact}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Office Hours */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Office Hours
              </h3>
              <div className="space-y-2 text-gray-300">
                <div className="flex justify-between">
                  <span>Monday - Friday:</span>
                  <span>9:00 AM - 6:00 PM GMT</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday:</span>
                  <span>10:00 AM - 4:00 PM GMT</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday:</span>
                  <span>Closed</span>
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-4">
                We typically respond to emails within 24 hours during business days.
              </p>
            </div>
          </div>
        </div>

        {/* Department Contacts */}
        <div>
          <h2 className="text-3xl font-bold text-white text-center mb-12">Contact by Department</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {departments.map((dept, index) => (
              <div key={index} className="bg-slate-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-2">{dept.name}</h3>
                <p className="text-gray-400 text-sm mb-3">{dept.description}</p>
                <a
                  href={`mailto:${dept.email}`}
                  className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                  {dept.email}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

 