'use client';

import { useState, useEffect } from 'react';
import { BarChart, TrendingUp, Eye, Users, Clock, Globe, Calendar, ArrowUp, ArrowDown } from 'lucide-react';

export default function StatsPage() {
  const [timeRange, setTimeRange] = useState('7d');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.title = 'Analytics & Stats - InfoCryptoX.com';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Website analytics and performance statistics for InfoCryptoX.com. View visitor insights and article performance.');
    }
  }, []);

  // Моковые данные для демонстрации
  const stats = {
    totalViews: 45623,
    uniqueVisitors: 12453,
    avgSessionTime: '3m 24s',
    bounceRate: '42.3%',
    topCountries: [
      { country: 'United Kingdom', views: 18249, percentage: 40 },
      { country: 'United States', views: 9124, percentage: 20 },
      { country: 'Germany', views: 4562, percentage: 10 },
      { country: 'France', views: 3187, percentage: 7 },
      { country: 'Canada', views: 2275, percentage: 5 }
    ],
    topArticles: [
      {
        title: 'Bitcoin Surges to New All-Time High as Institutional Adoption Grows',
        views: 3456,
        trend: 'up',
        trendPercent: 23.5
      },
      {
        title: 'Ethereum 2.0 Staking Rewards: Complete Guide for UK Investors',
        views: 2891,
        trend: 'up',
        trendPercent: 18.2
      },
      {
        title: 'UK Crypto Regulation Update: What You Need to Know',
        views: 2567,
        trend: 'down',
        trendPercent: -5.3
      },
      {
        title: 'DeFi Protocols Security Analysis: Best Practices',
        views: 2234,
        trend: 'up',
        trendPercent: 12.7
      },
      {
        title: 'NFT Market Trends: What\'s Hot in Digital Collectibles',
        views: 1987,
        trend: 'up',
        trendPercent: 8.9
      }
    ],
    dailyViews: [
      { date: '2024-12-01', views: 3250 },
      { date: '2024-12-02', views: 3890 },
      { date: '2024-12-03', views: 4120 },
      { date: '2024-12-04', views: 3675 },
      { date: '2024-12-05', views: 4456 },
      { date: '2024-12-06', views: 5123 },
      { date: '2024-12-07', views: 4987 }
    ]
  };

  const overviewCards = [
    {
      title: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      trend: '+12.5%',
      trendUp: true
    },
    {
      title: 'Unique Visitors',
      value: stats.uniqueVisitors.toLocaleString(),
      icon: Users,
      trend: '+8.3%',
      trendUp: true
    },
    {
      title: 'Avg. Session Time',
      value: stats.avgSessionTime,
      icon: Clock,
      trend: '+15.2%',
      trendUp: true
    },
    {
      title: 'Bounce Rate',
      value: stats.bounceRate,
      icon: TrendingUp,
      trend: '-3.1%',
      trendUp: true
    }
  ];

  if (!mounted) {
    return <div className="min-h-screen bg-slate-900"></div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Analytics Dashboard</h1>
              <p className="text-gray-400">Website performance and visitor insights</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {overviewCards.map((card, index) => (
            <div key={index} className="bg-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center text-sm ${
                  card.trendUp ? 'text-green-400' : 'text-red-400'
                }`}>
                  {card.trendUp ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                  {card.trend}
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">{card.value}</h3>
                <p className="text-gray-400 text-sm">{card.title}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Daily Views Chart */}
          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <BarChart className="w-5 h-5 mr-2" />
                Daily Views
              </h2>
            </div>
            <div className="space-y-4">
              {stats.dailyViews.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">
                    {new Date(day.date).toLocaleDateString('en-GB', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                  <div className="flex items-center space-x-3 flex-1 ml-4">
                    <div className="flex-1 bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(day.views / Math.max(...stats.dailyViews.map(d => d.views))) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-white text-sm font-medium min-w-[60px] text-right">
                      {day.views.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Countries */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              Top Countries
            </h2>
            <div className="space-y-4">
              {stats.topCountries.map((country, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-400">#{index + 1}</span>
                    <span className="text-white">{country.country}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-20 bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${country.percentage * 2}%` }}
                      ></div>
                    </div>
                    <span className="text-gray-400 text-sm min-w-[80px] text-right">
                      {country.views.toLocaleString()} ({country.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Articles */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Top Performing Articles
          </h2>
          <div className="space-y-4">
            {stats.topArticles.map((article, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                <div className="flex-1">
                  <h3 className="text-white font-medium mb-2 line-clamp-2">{article.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {article.views.toLocaleString()} views
                    </span>
                    <span className={`flex items-center ${
                      article.trend === 'up' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {article.trend === 'up' ? 
                        <ArrowUp className="w-4 h-4 mr-1" /> : 
                        <ArrowDown className="w-4 h-4 mr-1" />
                      }
                      {Math.abs(article.trendPercent)}%
                    </span>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <span className="text-2xl font-bold text-white">#{index + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-slate-800 rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">847</h3>
            <p className="text-gray-400">Articles Published</p>
          </div>
          
          <div className="bg-slate-800 rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">92.3%</h3>
            <p className="text-gray-400">Uptime This Month</p>
          </div>
          
          <div className="bg-slate-800 rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">23,456</h3>
            <p className="text-gray-400">Newsletter Subscribers</p>
          </div>
        </div>
      </div>
    </div>
  );
} 