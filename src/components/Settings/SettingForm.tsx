import React, { useState } from 'react';
import TextInput from '../common/Input/TextInput';
import Button from '../common/Button/Button';
import { ISetting } from '../../types/setting';

interface SettingFormProps {
  setting: ISetting | null;
  onSubmit: (settingData: Partial<ISetting>) => void;
  onCancel: () => void;
}

const SettingForm: React.FC<SettingFormProps> = ({ setting, onSubmit, onCancel }) => {
  const [key, setKey] = useState(setting?.key || '');
  const [value, setValue] = useState(setting?.value || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ key, value });
  };

  return (
    <form onSubmit={handleSubmit}>
      {!setting && (
        <TextInput
          label="Key"
          name="key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          required
        />
      )}
      <TextInput
        label="Value"
        name="value"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required
      />
      <div className="flex justify-end mt-4">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="ml-2">
          Save
        </Button>
      </div>
    </form>
  );
};

export default SettingForm;
