import React, { useState } from 'react';
import { Button, Popconfirm, Tooltip, message, Modal, Spin } from 'antd';
import { FaTrash } from 'react-icons/fa';
import { useRemoveMemberMutation } from '../../api/groupApi';
import { ExclamationCircleOutlined } from '@ant-design/icons';

// Derive the type from the mutation hook
type RemoveMemberTrigger = ReturnType<typeof useRemoveMemberMutation>[0];

interface RemoveMemberButtonProps {
  groupId: string;
  memberId: string;
  memberName: string;
}

const RemoveMemberButton: React.FC<RemoveMemberButtonProps> = ({ groupId, memberId, memberName }) => {
  const [removeMember, { isLoading }] = useRemoveMemberMutation();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleRemove = async () => {
    try {
      await removeMember({ groupId, memberId }).unwrap();
      message.success(`${memberName} has been removed from the group!`);
      setIsModalVisible(false);
    } catch (error: any) {
      message.error(error.data?.message || 'Failed to remove member.');
      console.error('Error removing member:', error);
    }
  };

  const showModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  return (
    <>
      {/* Tooltip with Trash Icon */}
      <Tooltip title="Remove Member" placement="top">
        <Button
          type="text"
          danger
          icon={<FaTrash className="text-lg hover:text-red-600 transition-transform transform hover:scale-125" />}
          onClick={showModal}
          disabled={isLoading}
        />
      </Tooltip>

      {/* Modal Confirmation */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-red-500">
            <ExclamationCircleOutlined />
            Confirm Member Removal
          </div>
        }
        visible={isModalVisible}
        onOk={handleRemove}
        onCancel={closeModal}
        okText="Remove"
        okButtonProps={{ danger: true, loading: isLoading }}
        cancelText="Cancel"
      >
        {isLoading ? (
          <div className="flex justify-center items-center">
            <Spin />
          </div>
        ) : (
          <p>
            Are you sure you want to remove <strong>{memberName}</strong> from this group? This action cannot be undone.
          </p>
        )}
      </Modal>
    </>
  );
};
export type { RemoveMemberTrigger };
export default RemoveMemberButton;
