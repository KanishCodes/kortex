// Mock data for Phase 1 frontend development
import { ChatMessage } from './types';
import type { Subject } from '@shared/types';

export const MOCK_SUBJECTS: Subject[] = [
  {
    id: 'sub-1',
    userId: 'user-123',
    name: 'Data Structures & Algorithms',
    documentCount: 5,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'sub-2',
    userId: 'user-123',
    name: 'System Design',
    documentCount: 3,
    createdAt: new Date('2024-01-20'),
  },
  {
    id: 'sub-3',
    userId: 'user-123',
    name: 'Ancient History',
    documentCount: 8,
    createdAt: new Date('2024-02-01'),
  },
];

export const MOCK_DOCUMENTS = {
  'sub-1': [
    { id: 'doc-1', title: 'Introduction to Trees.pdf', pages: 45 },
    { id: 'doc-2', title: 'Graph Algorithms.pdf', pages: 67 },
    { id: 'doc-3', title: 'Dynamic Programming.pdf', pages: 89 },
  ],
  'sub-2': [
    { id: 'doc-4', title: 'Scaling Systems.pdf', pages: 120 },
    { id: 'doc-5', title: 'Database Design.pdf', pages: 78 },
  ],
  'sub-3': [
    { id: 'doc-6', title: 'Roman Empire.pdf', pages: 234 },
    { id: 'doc-7', title: 'Ancient Greece.pdf', pages: 189 },
  ],
};

export const MOCK_CHAT_HISTORY: ChatMessage[] = [
  {
    id: 'msg-1',
    role: 'user',
    text: 'What is a binary search tree?',
    timestamp: new Date('2024-02-15T10:00:00'),
  },
  {
    id: 'msg-2',
    role: 'assistant',
    text: 'A Binary Search Tree (BST) is a hierarchical data structure where each node has at most two children. The key property is that for any given node, all values in the left subtree are smaller, and all values in the right subtree are greater. This property enables efficient searching, insertion, and deletion operations with average time complexity of O(log n).',
    timestamp: new Date('2024-02-15T10:00:03'),
    xrayContext: {
      retrievedChunks: [
        {
          id: 'chunk-1',
          content: 'Binary Search Trees maintain the BST property: left child < parent < right child. This ordering enables binary search operations on the tree structure, providing logarithmic time complexity for search operations in balanced trees.',
          similarity: 0.94,
          sourceLabel: 'Introduction to Trees.pdf - Page 12',
        },
        {
          id: 'chunk-2',
          content: 'The efficiency of BST operations depends heavily on tree balance. In the worst case (completely unbalanced tree), operations degrade to O(n). Self-balancing variants like AVL trees and Red-Black trees maintain O(log n) guarantees.',
          similarity: 0.87,
          sourceLabel: 'Introduction to Trees.pdf - Page 15',
        },
        {
          id: 'chunk-3',
          content: 'Common BST operations include: insert(value), search(value), delete(value), and various traversal methods (in-order, pre-order, post-order). In-order traversal of a BST yields values in sorted order.',
          similarity: 0.73,
          sourceLabel: 'Introduction to Trees.pdf - Page 18',
        },
      ],
      inferenceTime: 0.42,
    },
  },
  {
    id: 'msg-3',
    role: 'user',
    text: 'How do I implement insert operation?',
    timestamp: new Date('2024-02-15T10:01:00'),
  },
  {
    id: 'msg-4',
    role: 'assistant',
    text: 'To implement the insert operation in a BST: Start at the root. Compare the new value with the current node. If smaller, go left; if larger, go right. Repeat until you find an empty spot (null). Create a new node there. This maintains the BST property automatically.',
    timestamp: new Date('2024-02-15T10:01:02'),
  },
];

// Mock AI response generator
export const generateMockAIResponse = (userMessage: string): ChatMessage => {
  const responses = [
    {
      text: 'Great question! Based on your study materials, here\'s what I found...',
      hasXRay: true,
    },
    {
      text: 'Let me explain that concept from your documents...',
      hasXRay: false,
    },
    {
      text: 'According to the materials you\'ve uploaded, the answer is...',
      hasXRay: true,
    },
  ];

  const randomResponse = responses[Math.floor(Math.random() * responses.length)];

  return {
    id: `msg-${Date.now()}`,
    role: 'assistant',
    text: randomResponse.text + ' ' + userMessage.split(' ').reverse().join(' '),
    timestamp: new Date(),
    xrayContext: randomResponse.hasXRay
      ? {
        retrievedChunks: [
          {
            id: `chunk-${Date.now()}-1`,
            content: `This is a mock retrieved chunk related to: "${userMessage}". In a real implementation, this would come from your uploaded PDFs via vector search.`,
            similarity: 0.91,
            sourceLabel: 'Mock Document.pdf - Page 5',
          },
          {
            id: `chunk-${Date.now()}-2`,
            content: 'Another relevant passage from your study materials that helps answer this question.',
            similarity: 0.84,
            sourceLabel: 'Mock Document.pdf - Page 12',
          },
        ],
        inferenceTime: Math.random() * 0.5 + 0.3,
      }
      : undefined,
  };
};
