import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-hot-toast';

const PostContext = createContext();

const initialPosts = [
  {
    id: '1',
    title: 'Getting Started with React',
    content: '# Introduction to React\n\nReact is a powerful library for building user interfaces. In this guide, we\'ll cover:\n\n## Key Concepts\n- Components and Props\n- State Management\n- Hooks\n- Virtual DOM\n\n## Code Example\n```jsx\nfunction Welcome() {\n  return <h1>Hello React!</h1>;\n}\n```\n\n## Why React?\nReact makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes.\n\n## Getting Started\n1. Create a new project with Create React App\n2. Learn about JSX syntax\n3. Understand component lifecycle\n4. Master state and props',
    author: {
      id: '1',
      username: 'john_doe',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john'
    },
    createdAt: '2024-02-08T10:00:00Z',
    likes: ['2', '3'],
    comments: [
      {
        id: 'c1',
        content: 'Great introduction! This helped me understand React basics.',
        author: {
          id: '2',
          username: 'jane_smith',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane'
        },
        createdAt: '2024-02-08T11:30:00Z'
      },
      {
        id: 'c2',
        content: 'Could you add more examples about hooks?',
        author: {
          id: '3',
          username: 'alex_dev',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex'
        },
        createdAt: '2024-02-08T12:15:00Z'
      }
    ],
    tags: ['react', 'javascript', 'frontend'],
    category: 'Tutorial'
  },
  {
    id: '2',
    title: 'Advanced State Management in React',
    content: '# State Management Patterns\n\nLearn about different state management approaches:\n\n## 1. Context API\nBuilt-in solution for prop drilling\n```jsx\nconst ThemeContext = React.createContext();\n\nfunction App() {\n  return (\n    <ThemeContext.Provider value="dark">\n      <ThemedButton />\n    </ThemeContext.Provider>\n  );\n}\n```\n\n## 2. Redux\nPredictable state container\n```jsx\nconst counterReducer = (state = 0, action) => {\n  switch (action.type) {\n    case "INCREMENT":\n      return state + 1;\n    default:\n      return state;\n  }\n};\n```\n\n## 3. Zustand\nSimple and unopinionated\n\n## 4. Jotai\nPrimitive and flexible state management\n\nChoose the right tool based on your needs!',
    author: {
      id: '2',
      username: 'jane_smith',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane'
    },
    createdAt: '2024-02-08T11:00:00Z',
    likes: ['1'],
    comments: [
      {
        id: 'c3',
        content: 'Redux is still my go-to for large applications.',
        author: {
          id: '4',
          username: 'sarah_code',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah'
        },
        createdAt: '2024-02-08T13:45:00Z'
      }
    ],
    tags: ['react', 'state-management', 'redux'],
    category: 'Discussion'
  },
  {
    id: '3',
    title: 'Building Responsive Layouts with Tailwind CSS',
    content: '# Tailwind CSS Mastery\n\nLearn how to create beautiful, responsive layouts using Tailwind CSS:\n\n## Topics Covered\n\n### 1. Flex and Grid\n```html\n<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">\n  <div class="p-4 bg-white shadow rounded">Item 1</div>\n  <div class="p-4 bg-white shadow rounded">Item 2</div>\n  <div class="p-4 bg-white shadow rounded">Item 3</div>\n</div>\n```\n\n### 2. Responsive Design\nTailwind\'s mobile-first breakpoints:\n- sm: 640px\n- md: 768px\n- lg: 1024px\n- xl: 1280px\n\n### 3. Custom Animations\n```css\n@keyframes bounce {\n  0%, 100% {\n    transform: translateY(-25%);\n  }\n  50% {\n    transform: translateY(0);\n  }\n}\n```\n\n### 4. Dark Mode\n```html\n<div class="bg-white dark:bg-gray-800">\n  <h1 class="text-gray-900 dark:text-white">Hello!</h1>\n</div>\n```',
    author: {
      id: '3',
      username: 'alex_dev',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex'
    },
    createdAt: '2024-02-07T15:30:00Z',
    likes: ['1', '2'],
    comments: [
      {
        id: 'c4',
        content: 'Tailwind has completely changed how I style my applications!',
        author: {
          id: '8',
          username: 'lisa_style',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa'
        },
        createdAt: '2024-02-07T16:20:00Z'
      }
    ],
    tags: ['css', 'tailwind', 'frontend'],
    category: 'Tutorial'
  },
  {
    id: '4',
    title: 'TypeScript Best Practices for React',
    content: '# TypeScript in React\n\nImprove your React applications with TypeScript:\n\n## Key Benefits\n- Type Safety\n- Better IDE Support\n- Fewer Runtime Errors\n\n## Common Patterns\n- Props Interfaces\n- Generic Components\n- Type Guards',
    author: {
      id: '4',
      username: 'sarah_code',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah'
    },
    createdAt: '2024-02-07T09:15:00Z',
    likes: [],
    comments: [],
    tags: ['typescript', 'react', 'frontend'],
    category: 'Tutorial'
  },
  {
    id: '5',
    title: 'Web Performance Optimization Tips',
    content: '# Optimize Your Web App\n\nLearn essential techniques for improving web performance:\n\n1. Code Splitting\n2. Lazy Loading\n3. Image Optimization\n4. Caching Strategies',
    author: {
      id: '5',
      username: 'mike_perf',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike'
    },
    createdAt: '2024-02-06T14:20:00Z',
    likes: ['2', '4'],
    comments: [],
    tags: ['performance', 'optimization', 'web'],
    category: 'Discussion'
  },
  {
    id: '6',
    title: 'Modern Authentication Patterns',
    content: '# Secure Authentication\n\nExplore modern authentication approaches:\n\n## Topics\n- JWT\n- OAuth 2.0\n- Social Login\n- Best Practices',
    author: {
      id: '6',
      username: 'emma_sec',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma'
    },
    createdAt: '2024-02-06T11:30:00Z',
    likes: ['1'],
    comments: [],
    tags: ['security', 'authentication', 'web'],
    category: 'Tutorial'
  },
  {
    id: '7',
    title: 'React Testing Strategies',
    content: '# Testing React Applications\n\nComprehensive guide to testing React apps:\n\n## Testing Types\n- Unit Tests\n- Integration Tests\n- E2E Tests\n\n## Tools\n- Jest\n- React Testing Library\n- Cypress',
    author: {
      id: '7',
      username: 'tom_test',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tom'
    },
    createdAt: '2024-02-05T16:45:00Z',
    likes: ['3', '5'],
    comments: [],
    tags: ['testing', 'react', 'jest'],
    category: 'Tutorial'
  },
  {
    id: '8',
    title: 'CSS-in-JS vs Traditional CSS',
    content: '# Styling Approaches Compared\n\nLet\'s discuss the pros and cons of different styling approaches:\n\n## CSS-in-JS\n- Styled Components\n- Emotion\n- CSS Modules\n\n## Traditional CSS\n- SCSS\n- BEM\n- Utility Classes',
    author: {
      id: '8',
      username: 'lisa_style',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa'
    },
    createdAt: '2024-02-05T13:10:00Z',
    likes: ['2'],
    comments: [],
    tags: ['css', 'styling', 'frontend'],
    category: 'Discussion'
  },
  {
    id: '9',
    title: 'Micro-Frontend Architecture',
    content: '# Understanding Micro-Frontends\n\nExplore the benefits and challenges of micro-frontend architecture:\n\n## Key Concepts\n- Module Federation\n- Routing\n- Shared Dependencies\n- Team Organization',
    author: {
      id: '9',
      username: 'david_arch',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david'
    },
    createdAt: '2024-02-04T10:20:00Z',
    likes: ['1', '4', '6'],
    comments: [],
    tags: ['architecture', 'micro-frontend', 'web'],
    category: 'Discussion'
  },
  {
    id: '10',
    title: 'Getting Started with Next.js',
    content: '# Next.js Fundamentals\n\nLearn the basics of Next.js framework:\n\n## Features\n- Server-Side Rendering\n- Static Site Generation\n- API Routes\n- File-based Routing\n\n## Code Example\n```jsx\nexport default function Home() {\n  return <h1>Welcome to Next.js!</h1>;\n}\n```',
    author: {
      id: '10',
      username: 'chris_next',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chris'
    },
    createdAt: '2024-02-04T09:00:00Z',
    likes: ['2', '5', '8'],
    comments: [],
    tags: ['nextjs', 'react', 'framework'],
    category: 'Tutorial'
  }
];

export function PostProvider({ children }) {
  const [posts, setPosts] = useState(initialPosts);

  const getPost = useCallback((id) => {
    console.log('PostContext - Getting post with ID:', id);
    console.log('PostContext - Available posts:', posts);
    
    if (!id) return null;
    
    const post = posts.find(p => String(p.id) === String(id));
    console.log('PostContext - Found post:', post);
    
    return post || null;
  }, [posts]);

  const addPost = useCallback((postData) => {
    const newPost = {
      id: uuidv4(),
      ...postData,
      createdAt: new Date().toISOString(),
      likes: [],
      comments: []
    };

    setPosts(prevPosts => [newPost, ...prevPosts]);
    toast.success('Post created successfully!');
    return newPost;
  }, []);

  const updatePost = useCallback((id, updatedData) => {
    setPosts(prevPosts => {
      const postIndex = prevPosts.findIndex(p => p.id === id);
      if (postIndex === -1) {
        toast.error('Post not found');
        return prevPosts;
      }

      const updatedPosts = [...prevPosts];
      updatedPosts[postIndex] = {
        ...updatedPosts[postIndex],
        ...updatedData,
        updatedAt: new Date().toISOString()
      };

      toast.success('Post updated successfully!');
      return updatedPosts;
    });
  }, []);

  const deletePost = useCallback((id) => {
    setPosts(prevPosts => {
      const filteredPosts = prevPosts.filter(post => post.id !== id);
      if (filteredPosts.length === prevPosts.length) {
        toast.error('Post not found');
        return prevPosts;
      }
      toast.success('Post deleted successfully!');
      return filteredPosts;
    });
  }, []);

  const likePost = useCallback((postId, userId) => {
    if (!userId) {
      toast.error('You must be logged in to like posts');
      return;
    }

    setPosts(prevPosts => {
      const postIndex = prevPosts.findIndex(p => p.id === postId);
      if (postIndex === -1) {
        toast.error('Post not found');
        return prevPosts;
      }

      const post = prevPosts[postIndex];
      const likes = new Set(post.likes);

      if (likes.has(userId)) {
        likes.delete(userId);
        toast.success('Post unliked');
      } else {
        likes.add(userId);
        toast.success('Post liked');
      }

      const updatedPost = {
        ...post,
        likes: Array.from(likes)
      };

      const updatedPosts = [...prevPosts];
      updatedPosts[postIndex] = updatedPost;
      return updatedPosts;
    });
  }, []);

  const addComment = useCallback((postId, commentData) => {
    setPosts(prevPosts => {
      const postIndex = prevPosts.findIndex(p => p.id === postId);
      if (postIndex === -1) {
        toast.error('Post not found');
        return prevPosts;
      }

      const newComment = {
        id: uuidv4(),
        ...commentData,
        createdAt: new Date().toISOString()
      };

      const updatedPosts = [...prevPosts];
      updatedPosts[postIndex] = {
        ...updatedPosts[postIndex],
        comments: [...updatedPosts[postIndex].comments, newComment]
      };

      toast.success('Comment added successfully!');
      return updatedPosts;
    });
  }, []);

  const value = {
    posts,
    getPost,
    addPost,
    updatePost,
    deletePost,
    likePost,
    addComment
  };

  return (
    <PostContext.Provider value={value}>
      {children}
    </PostContext.Provider>
  );
}

export function usePosts() {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostProvider');
  }
  return context;
}