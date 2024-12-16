// src/components/Ticket/Tag.tsx
import React from 'react';

interface TagProps {
  tag: string;
}

const tagColors: { [key: string]: string } = {
  Urgent: 'red',
  'Non-Urgent': 'yellow',
  Pending: 'yellow',
  Critical: 'red',
  Open: 'green',
  Closed: 'gray',
  'In Progress': 'blue',
  Resolved: 'purple',
};

const Tag: React.FC<TagProps> = ({ tag }) => {
  const color = tagColors[tag] || 'gray';

  return (
    <span
      className={`bg-${color}-100 text-${color}-800 text-xs rounded-full px-2 py-0.5`}
    >
      {tag}
    </span>
  );
};

export default Tag;
