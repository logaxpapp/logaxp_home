import React, { useState } from 'react';
import { useFetchTestAnalysisQuery } from '../../api/testCaseApi';
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
  VictoryPie,
  VictoryStack,
  VictoryTooltip,
  VictoryLabel,
  VictoryLegend,
  VictoryContainer,
  VictoryLine,
} from 'victory';
import DatePicker from 'react-datepicker'; // For date range filtering
import 'react-datepicker/dist/react-datepicker.css'; // Date picker styles
import { saveAs } from 'file-saver'; // For exporting data
import { FaDownload, FaFilter, FaChartLine, FaChartBar } from 'react-icons/fa'; // Icons

const TestAnalysisPage: React.FC = () => {
  const { data, isLoading, isError, refetch } = useFetchTestAnalysisQuery();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedApp, setSelectedApp] = useState<string>('All');
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

  if (isLoading) return <div className="p-6">Loading analysis...</div>;
  if (isError) return <div className="p-6 text-red-500">Failed to load analysis</div>;
  if (!data) return <div className="p-6">No analysis data available.</div>;

  const { totalTestCases, totalPass, totalFail, totalBlocked, totalRetest, byApplication } = data;

  // Filter data based on selected application and date range
  const filteredData = byApplication
    .filter((app) => selectedApp === 'All' || app._id === selectedApp)
    .map((app) => ({
      ...app,
      // Add date filtering logic here if needed
    }));

  // For overall pie chart
  const overallPieData = [
    { x: 'Pass', y: totalPass },
    { x: 'Fail', y: totalFail },
    { x: 'Blocked', y: totalBlocked },
    { x: 'Retest', y: totalRetest },
  ].filter((d) => d.y > 0);

  // For stacked bar or line chart
  const passData = filteredData.map((app) => ({ x: app._id, y: app.totalPass || 0 }));
  const failData = filteredData.map((app) => ({ x: app._id, y: app.totalFail || 0 }));
  const blockedData = filteredData.map((app) => ({ x: app._id, y: app.totalBlocked || 0 }));
  const retestData = filteredData.map((app) => ({ x: app._id, y: app.totalRetest || 0 }));

  // Export data as CSV
  const handleExportData = () => {
    const csvData = [
      ['Application', 'Total', 'Pass', 'Fail', 'Blocked', 'Retest'],
      ...filteredData.map((app) => [
        app._id,
        app.total,
        app.totalPass,
        app.totalFail,
        app.totalBlocked,
        app.totalRetest,
      ]),
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'test_analysis.csv');
  };

  return (
    <div className="p-6 space-y-8 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold mb-4">Test Analysis Dashboard</h2>

      {/* Filters and Actions */}
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

      {/* TOP SUMMARY CARDS */}
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

      {/* MAIN CONTENT ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Pie/Donut Chart */}
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

        {/* Right Column: Stacked Bar or Line Chart */}
        <div className="bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Pass/Fail/Blocked/Retest by App</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setChartType('bar')}
                className={`p-2 rounded ${chartType === 'bar' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                <FaChartBar />
              </button>
              <button
                onClick={() => setChartType('line')}
                className={`p-2 rounded ${chartType === 'line' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                <FaChartLine />
              </button>
            </div>
          </div>
          {filteredData.length === 0 ? (
            <p className="text-sm text-gray-500">No applications found.</p>
          ) : (
            <VictoryChart
              theme={VictoryTheme.material}
              domainPadding={30}
              containerComponent={<VictoryContainer responsive={true} />}
            >
              <VictoryAxis
                style={{
                  tickLabels: { fontSize: 9, angle: 45, textAnchor: 'start' },
                }}
              />
              <VictoryAxis
                dependentAxis
                tickFormat={(t) => `${t}`}
                style={{ tickLabels: { fontSize: 8 } }}
              />
              {chartType === 'bar' ? (
                <VictoryStack
                  colorScale={['#48BB78', '#F56565', '#B794F4', '#ECC94B']}
                  labels={({ datum }) => datum.y}
                  labelComponent={<VictoryTooltip flyoutPadding={{ left: 10, right: 10, top: 5, bottom: 5 }} />}
                >
                  <VictoryBar data={passData} />
                  <VictoryBar data={failData} />
                  <VictoryBar data={blockedData} />
                  <VictoryBar data={retestData} />
                </VictoryStack>
              ) : (
                <>
                  <VictoryLine data={passData} style={{ data: { stroke: '#48BB78' } }} />
                  <VictoryLine data={failData} style={{ data: { stroke: '#F56565' } }} />
                  <VictoryLine data={blockedData} style={{ data: { stroke: '#B794F4' } }} />
                  <VictoryLine data={retestData} style={{ data: { stroke: '#ECC94B' } }} />
                </>
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

      {/* TABLE OR TEXT BREAKDOWN */}
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

      {/* Always show vital message */}
      <div className="mt-6 p-4 bg-indigo-50 border-l-4 border-indigo-500 text-indigo-700">
        <strong>Note:</strong> Every test case should be executed and results recorded.
      </div>
    </div>
  );
};

export default TestAnalysisPage;