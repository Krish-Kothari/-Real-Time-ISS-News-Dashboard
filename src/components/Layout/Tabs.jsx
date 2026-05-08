import React, { useState } from 'react';
import { Satellite, Newspaper, BarChart3 } from 'lucide-react';
import ISSTracker from '../ISS/ISSTracker.jsx';
import NewsPanel from '../News/NewsPanel.jsx';
import { SpeedChart, NewsDistributionChart } from '../Charts/Charts.jsx';

export const Tabs = () => {
  const [activeTab, setActiveTab] = useState('iss');

  const tabs = [
    { id: 'iss', label: 'ISS Tracker', icon: Satellite, component: ISSTracker },
    { id: 'news', label: 'News', icon: Newspaper, component: NewsPanel },
    { id: 'charts', label: 'Charts', icon: BarChart3, component: null },
  ];

  const activeTabObj = tabs.find((t) => t.id === activeTab);
  const Component = activeTabObj?.component;

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="card p-0 flex border-b border-slate-200 dark:border-slate-700">
        {tabs.map((tab) => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-all border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <TabIcon size={20} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="animate-fadeIn">
        {activeTab === 'iss' && <Component />}
        {activeTab === 'news' && <Component />}
        {activeTab === 'charts' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SpeedChart />
            <NewsDistributionChart />
          </div>
        )}
      </div>
    </div>
  );
};

export default Tabs;
