// src/components/Chat/CreateGroupModal.tsx

import React from 'react';
import { Modal, Form, Input, Select, Button, message as AntMessage } from 'antd';
import { useCreateGroupMutation } from '../../api/groupApi';
import { useFetchAllUsersQuery } from '../../api/usersApi';
import { useAppSelector } from '../../app/hooks';
import { selectCurrentUser } from '../../store/slices/authSlice';
import { IUser } from '../../types/user';

interface CreateGroupModalProps {
  open: boolean;
  onClose: () => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const user = useAppSelector(selectCurrentUser);
  const userId = user?._id || '';

  // Fetch all users for selection, excluding the current user
  const { data: usersData, isLoading: isUsersLoading, error: usersError } = useFetchAllUsersQuery({
    page: 1,
    limit: 1000, // Adjust as needed; consider implementing pagination or search if the user base is large
  });

  const [createGroup, { isLoading }] = useCreateGroupMutation();

  const onFinish = async (values: { name: string; members: string[] }) => {
    try {
      await createGroup({
        name: values.name,
        members: values.members,
      }).unwrap();
      AntMessage.success('Group created successfully!');
      form.resetFields();
      onClose();
    } catch (error: any) {
      AntMessage.error(error.data?.message || 'Failed to create group.');
      console.error('Create group error:', error);
    }
  };

  return (
    <Modal
      title="Create New Group"
        open={open}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Group Name"
          name="name"
          rules={[{ required: true, message: 'Please enter a group name' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Members"
          name="members"
          rules={[{ required: true, message: 'Please select at least one member' }]}
        >
          <Select
            mode="multiple"
            placeholder="Select members"
            loading={isUsersLoading}
            options={
              usersData?.users
                .filter((u: IUser) => u._id !== userId) // Exclude the current user
                .map((u: IUser) => ({
                  label: u.name,
                  value: u._id,
                })) || []
            }
            optionFilterProp="label"
            showSearch
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={isLoading}>
            Create Group
          </Button>
        </Form.Item>
        {/* {usersError && <AntMessage type="error">{usersError.message}</AntMessage>} */}
      </Form>
    </Modal>
  );
};

export default CreateGroupModal;
