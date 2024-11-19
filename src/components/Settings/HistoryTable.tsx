import React from 'react';
import { useGetSettingHistoryQuery } from '../../api/settingApi';
import { ISettingHistory } from '../../types/settingHistory';
import Button from '../common/Button/Button';

interface HistoryTableProps {
  settingKey: string;
  onRevert: (version: number) => void;
}

const HistoryTable: React.FC<HistoryTableProps> = ({ settingKey, onRevert }) => {
  const { data: historyData, isLoading, error } = useGetSettingHistoryQuery(settingKey);

  if (isLoading) return <div>Loading history...</div>;
  if (error) return <div>Error loading history.</div>;
  if (!historyData || historyData.length === 0) return <div>No history data available.</div>;

  return (
    <table className="min-w-full">
      <thead>
        <tr>
          <th className="px-4 py-2">Version</th>
          <th className="px-4 py-2">Value</th>
          <th className="px-4 py-2">Modified By</th>
          <th className="px-4 py-2">Modified At</th>
          <th className="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {historyData.map((record: ISettingHistory) => (
          <tr key={record.version}>
            <td className="border px-4 py-2">{record.version}</td>
            <td className="border px-4 py-2">{record.value}</td>
            <td className="border px-4 py-2">{record.modifiedBy}</td>
            <td className="border px-4 py-2">
              {new Date(record.modifiedAt).toLocaleString()}
            </td>
            <td className="border px-4 py-2">
              <Button onClick={() => onRevert(record.version)}>Revert</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default HistoryTable;
