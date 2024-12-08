import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set) => ({
      // Theme state
      theme:
        localStorage.theme === 'dark' ||
        (!('theme' in localStorage) &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
          ? 'dark'
          : 'light',
      setTheme: (theme) => {
        set({ theme });
        localStorage.theme = theme;
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      // Posts state with comments
      posts: [
        // Announcements
        {
          id: '1',
          title: '🎉 Welcome to Our Growing Community!',
          content: `
Hey everyone! 👋

We're thrilled to launch our community forum - a space where ideas flourish and connections thrive. Here's what makes our community special:

• Open discussions on technology, design, and development  
• Weekly featured posts and member spotlights  
• Regular AMAs with industry experts  
• Exclusive resources and tutorials  

**Remember to:**  
✅ Be kind and respectful  
✅ Share your knowledge  
✅ Ask questions freely  
✅ Report any issues  

Let's make this space awesome! 🚀
          `,
          author: 'CommunityAdmin',
          category: 'Announcements',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          votes: 156,
          views: 0,
          commentCount: 2,
          comments: [
            {
              id: 'c1',
              content: 'Excited to be part of this community!',
              author: 'NewMember',
              createdAt: new Date().toISOString(),
            },
            {
              id: 'c2',
              content: 'Looking forward to learning from everyone.',
              author: 'TechEnthusiast',
              createdAt: new Date().toISOString(),
            },
          ],
        },
        {
          id: '2',
          title: '🚀 Ultimate Guide: Modern React Best Practices 2024',
          content: `
Level up your React game with these modern best practices!

🎯 **Key Topics Covered:**

1.**Hooks Mastery**  
   • Custom hooks for reusability  
   • Performance optimization  
   • State management patterns  

2.**Component Architecture**  
   • Atomic design principles  
   • Props vs. Context  
   • Error boundaries  

3.**Performance Optimization**  
   • React.memo usage  
   • Lazy loading  
   • Code splitting strategies  

4.**Testing Strategies**  
   • Unit testing with Jest  
   • Integration tests  
   • E2E with Cypress  

**Questions?** Drop them in the comments! 👇
          `,
          author: 'ReactMaster',
          category: 'Guides',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          votes: 234,
          views: 0,
          commentCount: 0,
          comments: [],
        },
        {
          id: '3',
          title: '❓ Understanding TypeScript Generics in Depth',
          content: `
I'm diving deep into TypeScript and struggling with generics. Could someone explain:

1.**When should I use generics?**  
2.**How do they differ from 'any'?**  
3.**Best practices for constraint usage?**

Here's my current code:

\`\`\`typescript
function processItems<T>(items: T[]): T[] {
  return items;
}
\`\`\`

Any help would be appreciated! 🙏
          `,
          author: 'TypeScriptLearner',
          category: 'Questions',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          votes: 45,
          views: 0,
          commentCount: 0,
          comments: [],
        },
        {
          id: '4',
          title: '🔮 AI in Web Development: 2024 Trends and Tools',
          content: `
Exciting developments in AI for web development!

🤖 **Key Areas:**

1.**Code Generation**  
   • GitHub Copilot  
   • Amazon CodeWhisperer  

2.**Testing & QA**  
   • AI-powered test generation  
   • Visual regression testing  

3.**Development Workflow**  
   • Smart code review  
   • Bug prediction  

Stay ahead of the curve! 🎯
          `,
          author: 'AIEnthusiast',
          category: 'Technology',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          votes: 145,
          views: 0,
          commentCount: 0,
          comments: [],
        },
        {
          id: '5',
          title: '🔧 Debugging JavaScript Like a Pro',
          content: `
Debugging is a skill every developer must master. Here are my top tips for debugging JavaScript:

1.Use \`console.log\` effectively.  
2.Take advantage of browser developer tools.  
3.Learn how to use breakpoints.

What's your favorite debugging technique? Share below!
          `,
          author: 'DebugGuru',
          category: 'Guides',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          votes: 79,
          views: 0,
          commentCount: 0,
          comments: [],
        },
        {
          id: '6',
          title: '💻 Should I Use a CSS Framework or Write Custom Styles?',
          content: `
I'm working on a new project and can't decide between using a CSS framework like Tailwind or Bootstrap, or writing custom styles.

**Pros of frameworks:**  
• Speed of development  
• Consistent design  

**Cons of frameworks:**  
• Limited customization  
• Potential bloat  

What do you recommend?
          `,
          author: 'StyleSeeker',
          category: 'Questions',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          votes: 65,
          views: 0,
          commentCount: 0,
          comments: [],
        },
        {
          id: '7',
          title: '🌟 Top Design Trends for 2024',
          content: `
Here are the top design trends to watch out for in 2024:

1. Neumorphism 2.0  
2. AI-driven designs  
3. Interactive 3D elements  
      
Let me know which trend excites you the most!
          `,
          author: 'DesignPro',
          category: 'Design',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          votes: 87,
          views: 0,
          commentCount: 0,
          comments: [],
        },
        {
          id: '8',
          title: '🚧 Troubleshooting CI/CD Pipelines',
          content: `
Setting up a CI/CD pipeline is challenging. What's the most common issue you've faced?

1. Environment misconfigurations  
2. Incorrect secrets management  

Let's discuss solutions!
          `,
          author: 'DevOpsGuru',
          category: 'Development',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          votes: 102,
          views: 0,
          commentCount: 0,
          comments: [],
        },
        {
          id: '9',
          title: '🔥 Best Tools for Learning Backend Development',
          content: `
Here are some amazing tools:

1. Express.js (Node.js)  
2. Django (Python)  
3. Flask (Python)  

Do you have other recommendations?
          `,
          author: 'BackendBuddy',
          category: 'Technology',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          votes: 90,
          views: 0,
          commentCount: 0,
          comments: [],
        },
        {
          id: '10',
          title: '📱 Should Your App Go Native or Cross-Platform?',
          content: `
What's your take on native vs. cross-platform app development? Share pros/cons below!
          `,
          author: 'AppGuru',
          category: 'Technology',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          votes: 110,
          views: 0,
          commentCount: 0,
          comments: [],
        },
        {
          id: '11',
          title: '⚡ Improving Website Performance',
          content: `
Here are quick ways to boost performance:

1. Enable lazy loading  
2. Use CDN  
3. Optimize images  

What other tips do you follow?
          `,
          author: 'PerformanceGeek',
          category: 'Development',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          votes: 70,
          views: 0,
          commentCount: 0,
          comments: [],
        },
        {
          id: '12',
          title: '🌐 How to Start with Web3 Development',
          content: `
Curious about Web3? Here's how to get started:

1. Learn Solidity  
2. Understand blockchain basics  
3. Build decentralized apps  

What was your first Web3 project?
          `,
          author: 'CryptoCoder',
          category: 'Technology',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          votes: 50,
          views: 0,
          commentCount: 0,
          comments: [],
        },
        {
          id: '13',
          title: '🔒 Securing Your Web Apps',
          content: `
Security tips:

1. Use HTTPS  
2. Implement content security policies  
3. Validate all user inputs  

What are your go-to security practices?
          `,
          author: 'CyberSafe',
          category: 'Security',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          votes: 120,
          views: 0,
          commentCount: 0,
          comments: [],
        },
        {
          id: '14',
          title: '🛠️ Code Review Best Practices',
          content: `
Tips for effective code reviews:

1. Focus on the code, not the coder  
2. Provide constructive feedback  

How do you ensure productive reviews?
          `,
          author: 'CodeMaster',
          category: 'Guides',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          votes: 80,
          views: 0,
          commentCount: 0,
          comments: [],
        },
        {
          id: '15',
          title: '📅 Planning Your Projects Effectively',
          content: `
Tips for better planning:

1. Define clear milestones  
2. Use project management tools  

What tools do you use?
          `,
          author: 'PlannerPro',
          category: 'Development',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          votes: 75,
          views: 0,
          commentCount: 0,
          comments: [],
        },
      ],

      // Categories
      categories: [
        'All',
        'Announcements',
        'Guides',
        'Questions',
        'Technology',
        'Design',
        'Development',
        'Security',
      ],

      // Post actions
      addPost: (post) =>
        set((state) => ({
          posts: [...state.posts, { ...post, id: String(state.posts.length + 1) }],
        })),

      deletePost: (postId) =>
        set((state) => ({
          posts: state.posts.filter((post) => post.id !== postId),
        })),

      updatePost: (postId, updates) =>
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === postId ? { ...post, ...updates } : post
          ),
        })),

      // Comment actions
      addComment: (postId, comment) =>
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  comments: [
                    ...post.comments,
                    { ...comment, id: String(post.comments.length + 1) },
                  ],
                }
              : post
          ),
        })),

      deleteComment: (postId, commentId) =>
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  comments: post.comments.filter(
                    (comment) => comment.id !== commentId
                  ),
                }
              : post
          ),
        })),

      // Notifications state
      notifications: [],
      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            { ...notification, id: String(state.notifications.length + 1) },
            ...state.notifications,
          ],
        })),

      clearNotification: (notificationId) =>
        set((state) => ({
          notifications: state.notifications.filter(
            (notification) => notification.id !== notificationId
          ),
        })),
    }),
    {
      name: 'forum-storage',
      version: 1,
    }
  )
);
