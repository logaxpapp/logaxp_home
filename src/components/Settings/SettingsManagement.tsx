import React, { useState } from 'react';
import {
  useGetSettingsQuery,
  useUpdateSettingMutation,
  useDeleteSettingMutation,
  useRevertSettingMutation,
} from '../../api/settingApi';
import { ISetting } from '../../types/setting';
import Button from '../common/Button/Button';
import Modal from '../common/Feedback/Modal';
import DataTable, { Column } from '../common/DataTable/DataTable';
import DropdownMenu from '../common/DropdownMenu/DropdownMenu';
import SettingForm from './SettingForm';
import HistoryTable from './HistoryTable';

const SettingsManagement: React.FC = () => {
  const { data: settings, isLoading, error } = useGetSettingsQuery();
  const [updateSetting] = useUpdateSettingMutation();
  const [deleteSetting] = useDeleteSettingMutation();
  const [revertSetting] = useRevertSettingMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSetting, setCurrentSetting] = useState<ISetting | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedSettingKey, setSelectedSettingKey] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');

  const handleSaveSetting = async (settingData: Partial<ISetting>) => {
    await updateSetting(settingData);
    setIsModalOpen(false);
    setCurrentSetting(null);
  };

  const handleDelete = async (key: string) => {
    if (window.confirm(`Are you sure you want to delete the setting "${key}"?`)) {
      await deleteSetting(key);
    }
  };

  const handleEditSetting = (setting: ISetting) => {
    setCurrentSetting(setting);
    setIsModalOpen(true);
  };

  const handleCreateSetting = () => {
    setCurrentSetting(null);
    setIsModalOpen(true);
  };

  const handleViewHistory = (key: string) => {
    setSelectedSettingKey(key);
    setIsHistoryModalOpen(true);
  };

  const handleRevertSetting = async (version: number) => {
    if (selectedSettingKey) {
      await revertSetting({ key: selectedSettingKey, version });
      setIsHistoryModalOpen(false);
    }
  };

  const filteredSettings = settings?.filter(
    (setting) =>
      setting.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      setting.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: Column<ISetting>[] = [
    {
      header: 'Key',
      accessor: 'key',
      sortable: true,
      
    },
    {
      header: 'Value',
      accessor: 'value',
    
    },
    {
      header: 'Actions',
      accessor: (setting) => (
        <DropdownMenu
          options={[
            {
              label: 'Edit',
              onClick: () => handleEditSetting(setting),
            },
            {
              label: 'Delete',
              onClick: () => handleDelete(setting.key),
            },
            {
              label: 'History',
              onClick: () => handleViewHistory(setting.key),
            },
          ]}
        />
      ),
     
    },
  ];

  if (isLoading) return <div>Loading settings...</div>;
  if (error) return <div>Error loading settings</div>;

  return (
    <div className="bg-gray-50 shadow-lg rounded-lg p-8 w-full mb-20 mx-auto mt-10">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold font-primary text-blue-800">
          Settings Management
        </h3>
        <Button onClick={handleCreateSetting} variant="primary">
          Create Setting
        </Button>
      </div>
      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search settings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <DataTable data={filteredSettings || []} columns={columns} />

      {/* Setting Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setCurrentSetting(null);
          }}
          title={currentSetting ? 'Edit Setting' : 'Create Setting'}
        >
          <SettingForm
            setting={currentSetting}
            onSubmit={handleSaveSetting}
            onCancel={() => {
              setIsModalOpen(false);
              setCurrentSetting(null);
            }}
          />
        </Modal>
      )}

      {/* History Modal */}
      {isHistoryModalOpen && selectedSettingKey && (
        <Modal
          isOpen={isHistoryModalOpen}
          onClose={() => {
            setIsHistoryModalOpen(false);
            setSelectedSettingKey(null);
          }}
          title={`History for ${selectedSettingKey}`}
        >
          <div className="p-4 max-h-96 overflow-y-auto">
            <HistoryTable settingKey={selectedSettingKey} onRevert={handleRevertSetting} />
          </div>
        </Modal>
      )}
    </div>
  );
};
export default SettingsManagement;
