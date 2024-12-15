import React from 'react';
import { Modal, Form, Input, Select, Button, message as AntMessage } from 'antd';
import { useUpdateGroupMutation } from '../../api/groupApi';
import { useFetchAllUsersQuery } from '../../api/usersApi';
import { IUser } from '../../types/user';

interface EditGroupModalProps {
  open: boolean;
  onClose: () => void;
  groupId: string;
  groupName: string;
  existingMembers: string[];
}

const EditGroupModal: React.FC<EditGroupModalProps> = ({
  open,
  onClose,
  groupId,
  groupName,
  existingMembers,
}) => {
  const [form] = Form.useForm();
  const { data: usersData, isLoading: isUsersLoading } = useFetchAllUsersQuery({
    page: 1,
    limit: 1000,
  });
  const [updateGroup, { isLoading }] = useUpdateGroupMutation();

  const onFinish = async (values: { name: string; members: string[] }) => {
    try {
      await updateGroup({ groupId, ...values }).unwrap();
      AntMessage.success('Group updated successfully!');
      onClose();
    } catch (error: any) {
      AntMessage.error(error.data?.message || 'Failed to update group.');
    }
  };

  return (
    <Modal
      title="Edit Group"
      open={open}
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ name: groupName, members: existingMembers }}
      >
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
              usersData?.users.map((user: IUser) => ({
                label: user.name,
                value: user._id,
              })) || []
            }
            optionFilterProp="label"
            showSearch
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={isLoading}>
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditGroupModal;
