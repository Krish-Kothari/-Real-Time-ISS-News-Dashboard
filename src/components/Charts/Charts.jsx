import React, { useMemo } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { useISSStore, useNewsStore } from '../../utils/store.js';

export const SpeedChart = () => {
  const { lastPositions } = useISSStore();

  const chartData = useMemo(() => {
    const timestamps = lastPositions
      .slice()
      .reverse()
      .map((pos) => {
        const date = new Date(pos.timestamp);
        return date.toLocaleTimeString();
      });

    const speeds = lastPositions
      .slice()
      .reverse()
      .map(() => Math.random() * 3 + 25); // Simulated speeds

    return {
      labels: timestamps,
      datasets: [
        {
          label: 'ISS Speed (km/h)',
          data: speeds,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#3b82f6',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  }, [lastPositions]);

  return (
    <div className="card p-6">
      <h3 className="text-lg font-bold mb-4">ISS Speed Trend</h3>
      <div style={{ height: '300px', position: 'relative' }}>
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                labels: {
                  color: '#6b7280',
                  font: { size: 12 },
                },
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 30,
                ticks: { color: '#6b7280' },
                grid: { color: '#e5e7eb' },
              },
              x: {
                ticks: { color: '#6b7280' },
                grid: { color: '#e5e7eb' },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export const NewsDistributionChart = () => {
  const { articles } = useNewsStore();

  const chartData = useMemo(() => {
    const sourceCount = {};
    articles.forEach((article) => {
      const source = article.source.name;
      sourceCount[source] = (sourceCount[source] || 0) + 1;
    });

    const labels = Object.keys(sourceCount).slice(0, 6);
    const data = labels.map((label) => sourceCount[label]);
    const colors = [
      '#3b82f6',
      '#8b5cf6',
      '#ec4899',
      '#f59e0b',
      '#10b981',
      '#06b6d4',
    ];

    return {
      labels,
      datasets: [
        {
          label: 'Articles by Source',
          data,
          backgroundColor: colors.slice(0, labels.length),
          borderColor: '#fff',
          borderWidth: 2,
        },
      ],
    };
  }, [articles]);

  return (
    <div className="card p-6">
      <h3 className="text-lg font-bold mb-4">News Distribution</h3>
      <div style={{ height: '300px', position: 'relative' }}>
        <Pie
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'bottom',
                labels: {
                  color: '#6b7280',
                  font: { size: 12 },
                  padding: 15,
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default { SpeedChart, NewsDistributionChart };
