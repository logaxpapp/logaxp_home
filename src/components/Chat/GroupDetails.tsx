// src/components/Chat/GroupDetails.tsx

import React, { useState } from 'react';
import { useUpdateGroupMutation, useDeleteGroupMutation, useGetGroupDetailsQuery } from '../../api/groupApi';
import { Spin, List, Avatar, Tooltip, Typography, Button, Modal, Collapse } from 'antd';
import { UserOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import AddMemberForm from './AddMemberForm'; 
import EditGroupModal from './EditGroupModal';
import { IUserMinimal } from '../../types/user';

const { Panel } = Collapse;
const { Title, Text } = Typography;

interface RemoveMemberTrigger {
  groupId: string;
  memberId: string;
}

interface GroupDetailsProps {
  groupId: string;
  removeMember: (trigger: RemoveMemberTrigger) => void;
  userId: string;
  className?: string;
}

const GroupDetails: React.FC<GroupDetailsProps> = ({
  groupId,
  removeMember,
  userId,
  className,
}) => {
  const { data: group, error, isLoading } = useGetGroupDetailsQuery(groupId);
  const [isEditing, setIsEditing] = useState(false);
  const [updateGroup] = useUpdateGroupMutation();
  const [deleteGroup] = useDeleteGroupMutation();

  const handleDelete = async () => {
    Modal.confirm({
      title: 'Confirm Deletion',
      content: 'Are you sure you want to delete this group? This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteGroup(groupId).unwrap();
          Modal.success({
            title: 'Group Deleted',
            content: 'The group has been successfully deleted.',
          });
        } catch (error: any) {
          Modal.error({
            title: 'Deletion Failed',
            content: error?.data?.message || 'Failed to delete group.',
          });
        }
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="text-red-500 text-center">
        Error loading group details.
      </div>
    );
  }

  return (
    <div className={`w-full lg:w-1/4 ${className}`}>
      <Collapse
        defaultActiveKey={['1']}
        accordion
        className="bg-transparent"
      >
        <Panel
          header={
            <div className="flex items-center justify-between w-full">
              <Title level={4} className="text-gray-800 dark:text-gray-200">
                {group.name}
              </Title>
              <div className="flex items-center gap-2">
                <Tooltip title="Edit Group">
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => setIsEditing(true)}
                    className="hover:scale-110 transition-transform"
                    aria-label="Edit Group"
                  />
                </Tooltip>
                <Tooltip title="Delete Group">
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={handleDelete}
                    className="hover:scale-110 transition-transform"
                    aria-label="Delete Group"
                  />
                </Tooltip>
              </div>
            </div>
          }
          key="1"
          showArrow={false}
          className="bg-white dark:bg-gray-900 rounded-lg shadow-lg"
        >
          {/* Members List */}
          <div className="mb-6">
            <Text strong className="block text-gray-700 dark:text-gray-300 mb-2">
              Members
            </Text>
            <List
              dataSource={group.members}
              renderItem={(member: IUserMinimal) => (
                <List.Item
                  className="rounded-lg bg-gray-100 dark:bg-gray-800 my-2 p-2"
                  actions={[
                    member._id !== userId && (
                      <Tooltip title="Remove Member" key="remove">
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() =>
                            removeMember({
                              groupId,
                              memberId: member._id,
                            })
                          }
                          aria-label={`Remove ${member.name}`}
                        />
                      </Tooltip>
                    ),
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src={member.profile_picture_url}
                        icon={<UserOutlined />}
                        size="large"
                      />
                    }
                    title={<span className="text-gray-900 dark:text-white">{member.name}</span>}
                    description={<span className="text-gray-500 dark:text-gray-400">{member.email}</span>}
                  />
                </List.Item>
              )}
            />
          </div>

          {/* Add Member Form */}
          <div className="mt-4">
            <AddMemberForm
              groupId={groupId}
              existingMembers={group.members || []}
              userId={userId}
            />
          </div>
        </Panel>
      </Collapse>

      {/* Edit Modal */}
      <EditGroupModal
        open={isEditing}
        onClose={() => setIsEditing(false)}
        groupId={groupId}
        groupName={group.name}
        existingMembers={group.members.map((member) => member._id)}
      />
    </div>
  );
};

export default GroupDetails;
