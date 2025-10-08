export const messages = [
  {
    id: '1',
    type: 'inbox',
    read: false,
    sender: {
      name: 'John Doe',
      email: 'john.doe@example.com',
    },
    subject: 'Meeting Reminder',
    body: 'Hi team, just a reminder that we have a meeting at 2 PM today.',
    date: '2 hours ago',
    labels: ['work', 'important'],
  },
  {
    id: '2',
    type: 'inbox',
    read: true,
    sender: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
    },
    subject: 'Re: Project Update',
    body: 'Thanks for the update! Everything looks good on my end.',
    date: '1 day ago',
    labels: ['work'],
  },
  {
    id: '3',
    type: 'inbox',
    read: false,
    sender: {
      name: 'Personal Finance',
      email: 'noreply@finance.com',
    },
    subject: 'Your monthly statement is ready',
    body: 'Your monthly statement for your account is now available.',
    date: '2 days ago',
    labels: ['personal'],
  },
];

export const sentMessages = [
  {
    id: 's1',
    type: 'sent',
    read: true,
    sender: {
      name: 'Addmin User',
      email: 'admin@example.com',
    },
    subject: 'Re: Inquiry about Halal Meat',
    body: 'Thank you for your inquiry. We have received your request and will get back to you shortly.',
    date: '3 hours ago',
    labels: ['customer'],
  },
  {
    id: 's2',
    type: 'sent',
    read: true,
    sender: {
      name: 'Admin User',
      email: 'admin@example.com',
    },
    subject: 'Follow-up on Quote Request',
    body: 'Following up on your recent quote request. Please find the attached details.',
    date: '1 day ago',
    labels: ['sales'],
  },
];

export const archivedMessages = [
  {
    id: 'a1',
    type: 'archived',
    read: true,
    sender: {
      name: 'Old Customer',
      email: 'old.customer@example.com',
    },
    subject: 'Old Order Confirmation',
    body: 'This is a confirmation for your order #12345 from last year.',
    date: '1 month ago',
    labels: ['order'],
  },
  {
    id: 'a2',
    type: 'archived',
    read: true,
    sender: {
      name: 'Spam Bot',
      email: 'spam@example.com',
    },
    subject: 'Win a free prize!',
    body: 'Congratulations! You have been selected to win a free prize. Click here.',
    date: '2 months ago',
    labels: ['spam'],
  },
];
