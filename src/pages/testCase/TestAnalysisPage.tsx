// "I want the vital message at all time."
// src/features/testAnalysis/TestAnalysisPage.tsx

import React, { useState } from 'react';
import { useFetchTestAnalysisQuery } from '../../api/testCaseApi';
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
  VictoryPie,
  VictoryGroup,
  VictoryTooltip,
  VictoryLegend,
  VictoryContainer,
  VictoryStack,
} from 'victory';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { saveAs } from 'file-saver';
import { FaDownload, FaFilter, FaChartBar, FaRegListAlt } from 'react-icons/fa';

const TestAnalysisPage: React.FC = () => {
  const { data, isLoading, isError, refetch } = useFetchTestAnalysisQuery();
  const [chartType, setChartType] = useState<'grouped' | 'pct'>('grouped');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedApp, setSelectedApp] = useState<string>('All');

  if (isLoading) return <div className="p-6">Loading analysis...</div>;
  if (isError) return <div className="p-6 text-red-500">Failed to load analysis</div>;
  if (!data) return <div className="p-6">No analysis data available.</div>;

  const { totalTestCases, totalPass, totalFail, totalBlocked, totalRetest, byApplication } = data;

  // Filter
  const filteredData = byApplication.filter(
    (app) => selectedApp === 'All' || app._id === selectedApp
  );

  // Overall pie
  const overallPieData = [
    { x: 'Pass', y: totalPass },
    { x: 'Fail', y: totalFail },
    { x: 'Blocked', y: totalBlocked },
    { x: 'Retest', y: totalRetest },
  ].filter((d) => d.y > 0);

  // "pct" means 100% stacked bars
  // For each category, we either store raw or percentage
  function toPercent(count: number, sum: number) {
    return sum === 0 ? 0 : Math.round((count / sum) * 100);
  }

  // Build pass/fail/blocked/retest arrays
  const passData = filteredData.map((app) => {
    const sum = (app.totalPass || 0) + (app.totalFail || 0) + (app.totalBlocked || 0) + (app.totalRetest || 0);
    const raw = app.totalPass || 0;
    return {
      x: app._id,
      y: chartType === 'pct' ? toPercent(raw, sum) : raw,
    };
  });

  const failData = filteredData.map((app) => {
    const sum = (app.totalPass || 0) + (app.totalFail || 0) + (app.totalBlocked || 0) + (app.totalRetest || 0);
    const raw = app.totalFail || 0;
    return {
      x: app._id,
      y: chartType === 'pct' ? toPercent(raw, sum) : raw,
    };
  });

  const blockedData = filteredData.map((app) => {
    const sum = (app.totalPass || 0) + (app.totalFail || 0) + (app.totalBlocked || 0) + (app.totalRetest || 0);
    const raw = app.totalBlocked || 0;
    return {
      x: app._id,
      y: chartType === 'pct' ? toPercent(raw, sum) : raw,
    };
  });

  const retestData = filteredData.map((app) => {
    const sum = (app.totalPass || 0) + (app.totalFail || 0) + (app.totalBlocked || 0) + (app.totalRetest || 0);
    const raw = app.totalRetest || 0;
    return {
      x: app._id,
      y: chartType === 'pct' ? toPercent(raw, sum) : raw,
    };
  });

  // For domain
  const allVals = [...passData, ...failData, ...blockedData, ...retestData].map((d) => d.y);
  const maxVal = Math.max(0, ...allVals);
  const domainMax = chartType === 'pct' ? 100 : maxVal;

  // CSV
  const handleExportData = () => {
    const csvRows = [
      ['Application','Total','Pass','Fail','Blocked','Retest'],
      ...filteredData.map((app) => [
        app._id,
        app.total,
        app.totalPass,
        app.totalFail,
        app.totalBlocked,
        app.totalRetest,
      ]),
    ];
    const csvString = csvRows.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'test_analysis.csv');
  };

  // A helper for the "labels" prop so we only show text if y>0
  const labelFormatter = (datum: { y: number }) => {
    if (datum.y <= 0) return '';
    // If "pct" mode, show a "%", else raw number
    if (chartType === 'pct') return `${datum.y}%`;
    return String(datum.y);
  };

  return (
    <div className="p-6 space-y-8 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold mb-4">Test Analysis Dashboard</h2>

      {/* Filters, date pickers, etc. */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <FaFilter className="text-gray-600" />
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            placeholderText="Start Date"
            className="p-2 border rounded"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            placeholderText="End Date"
            className="p-2 border rounded"
          />
        </div>

        <select
          value={selectedApp}
          onChange={(e) => setSelectedApp(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="All">All Applications</option>
          {byApplication.map((app) => (
            <option key={app._id} value={app._id}>
              {app._id}
            </option>
          ))}
        </select>

        <button
          onClick={() => refetch()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Refresh Data
        </button>

        <button
          onClick={handleExportData}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
        >
          <FaDownload />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-xs uppercase text-gray-500">Total Cases</p>
          <p className="text-2xl font-bold text-blue-700">{totalTestCases}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-xs uppercase text-gray-500">Total Pass</p>
          <p className="text-2xl font-bold text-green-600">{totalPass}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-xs uppercase text-gray-500">Total Fail</p>
          <p className="text-2xl font-bold text-red-600">{totalFail}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-xs uppercase text-gray-500">Blocked / Retest</p>
          <p className="text-sm font-bold text-purple-700">
            Blocked: {totalBlocked} | Retest: {totalRetest}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Overall Execution Status</h3>
          {overallPieData.length === 0 ? (
            <p className="text-sm text-gray-500">No executions recorded yet.</p>
          ) : (
            <VictoryPie
              data={overallPieData}
              colorScale={['#48BB78', '#F56565', '#B794F4', '#ECC94B']}
              labels={({ datum }) => `${datum.x}: ${datum.y}`}
              labelComponent={<VictoryTooltip />}
              innerRadius={70}
              padAngle={2}
              style={{ labels: { fontSize: 12 } }}
              animate={{ duration: 1000 }}
            />
          )}
        </div>

        {/* Right Chart => grouped or 100% stacked */}
        <div className="bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">
              {chartType === 'pct' ? 'Percent Stacked' : 'Grouped'}: Pass/Fail/Blocked/Retest
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setChartType('grouped')}
                className={`p-2 rounded ${
                  chartType === 'grouped' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
              >
                <FaChartBar />
              </button>
              <button
                onClick={() => setChartType('pct')}
                className={`p-2 rounded ${
                  chartType === 'pct' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
              >
                <FaRegListAlt />
              </button>
            </div>
          </div>

          {filteredData.length === 0 ? (
            <p className="text-sm text-gray-500">No applications found.</p>
          ) : domainMax === 0 ? (
            <p className="text-sm text-gray-500">All counts are zero; nothing to plot.</p>
          ) : (
            <VictoryChart
              theme={VictoryTheme.material}
              domainPadding={{ x: 30, y: 10 }}
              containerComponent={<VictoryContainer responsive={true} />}
              domain={{ y: [0, domainMax] }}
            >
              <VictoryAxis
                style={{
                  tickLabels: { fontSize: 10, angle: 45, textAnchor: 'start' },
                }}
              />
              <VictoryAxis
                dependentAxis
                tickFormat={(val) =>
                  chartType === 'pct' ? `${val}%` : val
                }
                style={{ tickLabels: { fontSize: 9 } }}
              />

              {chartType === 'grouped' ? (
                <VictoryGroup
                  offset={12}
                  colorScale={['#48BB78', '#F56565', '#B794F4', '#ECC94B']}
                >
                  <VictoryBar
                    data={passData}
                    labels={({ datum }) => labelFormatter(datum)}
                    labelComponent={<VictoryTooltip />}
                  />
                  <VictoryBar
                    data={failData}
                    labels={({ datum }) => labelFormatter(datum)}
                    labelComponent={<VictoryTooltip />}
                  />
                  <VictoryBar
                    data={blockedData}
                    labels={({ datum }) => labelFormatter(datum)}
                    labelComponent={<VictoryTooltip />}
                  />
                  <VictoryBar
                    data={retestData}
                    labels={({ datum }) => labelFormatter(datum)}
                    labelComponent={<VictoryTooltip />}
                  />
                </VictoryGroup>
              ) : (
                <VictoryStack
                  colorScale={['#48BB78', '#F56565', '#B794F4', '#ECC94B']}
                  labelComponent={<VictoryTooltip />}
                >
                  <VictoryBar
                    data={passData}
                    labels={({ datum }) => labelFormatter(datum)}
                  />
                  <VictoryBar
                    data={failData}
                    labels={({ datum }) => labelFormatter(datum)}
                  />
                  <VictoryBar
                    data={blockedData}
                    labels={({ datum }) => labelFormatter(datum)}
                  />
                  <VictoryBar
                    data={retestData}
                    labels={({ datum }) => labelFormatter(datum)}
                  />
                </VictoryStack>
              )}

              <VictoryLegend
                x={50}
                y={0}
                orientation="horizontal"
                gutter={20}
                style={{ labels: { fontSize: 10 } }}
                data={[
                  { name: 'Pass', symbol: { fill: '#48BB78' } },
                  { name: 'Fail', symbol: { fill: '#F56565' } },
                  { name: 'Blocked', symbol: { fill: '#B794F4' } },
                  { name: 'Retest', symbol: { fill: '#ECC94B' } },
                ]}
              />
            </VictoryChart>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">Details by Application</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Application</th>
                <th className="border px-4 py-2">Total</th>
                <th className="border px-4 py-2">Pass</th>
                <th className="border px-4 py-2">Fail</th>
                <th className="border px-4 py-2">Blocked</th>
                <th className="border px-4 py-2">Retest</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((app) => (
                <tr key={app._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2 font-semibold">{app._id}</td>
                  <td className="border px-4 py-2 text-center">{app.total}</td>
                  <td className="border px-4 py-2 text-center text-green-600">{app.totalPass}</td>
                  <td className="border px-4 py-2 text-center text-red-600">{app.totalFail}</td>
                  <td className="border px-4 py-2 text-center text-purple-600">{app.totalBlocked}</td>
                  <td className="border px-4 py-2 text-center text-yellow-600">{app.totalRetest}</td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center p-4 text-gray-500">
                    No applications
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vital message */}
      <div className="mt-6 p-4 bg-indigo-50 border-l-4 border-indigo-500 text-indigo-700">
        <strong>Note:</strong> Non-zero segments now all show a tooltip and label.
      </div>
    </div>
  );
};

export default TestAnalysisPage;
