import React, { useState } from 'react';
import { Form, Select, Button, message, Tooltip } from 'antd';
import { useAddMemberMutation } from '../../api/groupApi';
import { useFetchAllUsersQuery } from '../../api/usersApi';
import { FaUserPlus, FaTimes } from 'react-icons/fa';
import DefaultUserAvatar from '../../assets/images/banner.jpeg';
import { IUserMinimal } from '../../types/user';

interface AddMemberFormProps {
  groupId: string;
  existingMembers: IUserMinimal[];
  userId: string;
}

const AddMemberForm: React.FC<AddMemberFormProps> = ({ groupId, existingMembers, userId }) => {
  const [form] = Form.useForm();
  const [addMember, { isLoading }] = useAddMemberMutation();
  const { data: usersData, isLoading: isUsersLoading } = useFetchAllUsersQuery({
    page: 1,
    limit: 1000, // Adjust as needed
  });

  const [isFormVisible, setIsFormVisible] = useState(false);

  const onFinish = async (values: { memberId: string }) => {
    try {
      await addMember({
        groupId,
        memberId: values.memberId,
      }).unwrap();
      message.success('Member added successfully!');
      form.resetFields();
      setIsFormVisible(false); // Auto-close the form after success
    } catch (error: any) {
      message.error(error.data?.message || 'Failed to add member.');
    }
  };

  const toggleFormVisibility = () => setIsFormVisible(!isFormVisible);

  // Map users to IUserMinimal, providing a default profile_picture_url if undefined
  const allUsers: IUserMinimal[] = (usersData?.users || []).map((user) => ({
    ...user,
    profile_picture_url: user.profile_picture_url || DefaultUserAvatar,
  }));

  // Exclude existing members and the current user
  const availableUsers = allUsers.filter(
    (user) =>
      !existingMembers.some((member) => member._id === user._id) &&
      user._id !== userId
  );

  return (
    <div className="flex items-center gap-4">
      {isFormVisible ? (
        <Form
          form={form}
          layout="inline"
          onFinish={onFinish}
          className="flex items-center gap-2"
        >
          <Form.Item
            name="memberId"
            rules={[{ required: true, message: 'Please select a member' }]}
          >
            <Select
              placeholder="Select a member"
              style={{ width: 200 }}
              loading={isUsersLoading}
              options={availableUsers.map((user) => ({
                label: user.name,
                value: user._id,
              }))}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading} icon={<FaUserPlus />}>
              Add
            </Button>
          </Form.Item>
          <Button
            type="text"
            danger
            icon={<FaTimes />}
            onClick={toggleFormVisibility}
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
          />
        </Form>
      ) : (
        <Tooltip title="Add a new member">
          <Button
            type="primary"
            shape="circle"
            icon={<FaUserPlus />}
            onClick={toggleFormVisibility}
            className="hover:scale-110 transition-transform"
          />
        </Tooltip>
      )}
    </div>
  );
};

export default AddMemberForm;
