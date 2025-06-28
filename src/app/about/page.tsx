import { Metadata } from 'next';
import { Users, Target, Award, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us - CryptoNews UK',
  description: 'Learn about CryptoNews UK - your trusted source for cryptocurrency news, analysis, and insights in the United Kingdom.',
  keywords: 'crypto news UK, cryptocurrency news, blockchain news, about us',
  openGraph: {
    title: 'About Us - CryptoNews UK',
    description: 'Learn about CryptoNews UK - your trusted source for cryptocurrency news, analysis, and insights.',
    type: 'website',
  },
};

export default function AboutPage() {
  const teamMembers = [
    {
      name: "James Mitchell",
      role: "Editor-in-Chief",
      bio: "Veteran financial journalist with 15+ years covering markets and emerging technologies.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"
    },
    {
      name: "Sarah Thompson",
      role: "Senior Analyst",
      bio: "Blockchain expert and cryptocurrency researcher with extensive market analysis experience.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face"
    },
    {
      name: "David Chen",
      role: "Technical Writer",
      bio: "Software engineer turned crypto enthusiast, specializing in DeFi and smart contract analysis.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face"
    },
    {
      name: "Emma Wilson",
      role: "Market Reporter",
      bio: "Real-time market coverage specialist with deep understanding of crypto trading dynamics.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face"
    }
  ];

  const values = [
    {
      icon: Target,
      title: "Accuracy First",
      description: "We prioritize factual reporting and thorough fact-checking in all our content."
    },
    {
      icon: Globe,
      title: "Global Perspective",
      description: "Covering crypto news from a uniquely British viewpoint while maintaining global awareness."
    },
    {
      icon: Users,
      title: "Community Focused",
      description: "Building a knowledgeable community of crypto enthusiasts and investors."
    },
    {
      icon: Award,
      title: "Editorial Excellence",
      description: "Maintaining the highest standards of journalism and editorial integrity."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About CryptoNews UK
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Your trusted source for cryptocurrency news, market analysis, and blockchain insights 
            in the United Kingdom and beyond.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-slate-800 rounded-lg p-8 mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              To provide accurate, timely, and insightful cryptocurrency news and analysis 
              that empowers our readers to make informed decisions in the rapidly evolving 
              digital asset landscape.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              We believe in the transformative potential of blockchain technology and 
              cryptocurrencies, and we're committed to being your reliable guide through 
              this exciting journey.
            </p>
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-slate-800 rounded-lg p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
                <p className="text-gray-300">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-slate-800 rounded-lg p-6 text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-white mb-2">{member.name}</h3>
                <p className="text-blue-400 mb-3">{member.role}</p>
                <p className="text-gray-300 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What We Cover */}
        <div className="bg-slate-800 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">What We Cover</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-3">Market Analysis</h3>
              <p className="text-gray-300">
                In-depth analysis of cryptocurrency markets, price movements, and trading opportunities.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-3">Regulatory News</h3>
              <p className="text-gray-300">
                Latest updates on UK and international cryptocurrency regulations and compliance.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-3">Technology Insights</h3>
              <p className="text-gray-300">
                Breaking down complex blockchain technologies and their real-world applications.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-3">DeFi Coverage</h3>
              <p className="text-gray-300">
                Comprehensive coverage of decentralized finance protocols and innovations.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-3">NFT & Gaming</h3>
              <p className="text-gray-300">
                Latest trends in non-fungible tokens and blockchain gaming ecosystems.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-3">Educational Content</h3>
              <p className="text-gray-300">
                Beginner-friendly guides and advanced tutorials for crypto enthusiasts.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Get In Touch</h2>
          <p className="text-lg text-gray-300 mb-8">
            Have a story tip, partnership inquiry, or just want to say hello?
          </p>
          <div className="space-y-4">
            <p className="text-gray-300">
              <span className="font-semibold">Email:</span> editorial@cryptonews-uk.com
            </p>
            <p className="text-gray-300">
              <span className="font-semibold">Press Inquiries:</span> press@cryptonews-uk.com
            </p>
            <p className="text-gray-300">
              <span className="font-semibold">Partnerships:</span> partnerships@cryptonews-uk.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 