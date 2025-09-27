# Frontend System Design Practice Guide

## Table of Contents

1. [Common Frontend System Design Questions](#questions)
2. [General Approach Framework](#approach)
3. [Detailed Solutions](#solutions)
4. [Key Frontend Concepts](#concepts)
5. [Best Practices](#best-practices)

---

## Common Frontend System Design Questions {#questions}

### Beginner Level

1. **Design a Todo List Application**
2. **Design a Simple Chat Interface**
3. **Design a Photo Gallery**

### Intermediate Level

4. **Design a Real-time Chat Application (WhatsApp Web)**
5. **Design a Social Media Feed (Facebook/Twitter)**
6. **Design a Video Streaming Platform (YouTube)**
7. **Design an E-commerce Product Listing Page**

### Advanced Level

8. **Design a Collaborative Text Editor (Google Docs)**
9. **Design a Trading Dashboard with Real-time Data**
10. **Design a Large-scale Dashboard with Analytics**

---

## General Approach Framework {#approach}

### Step 1: Requirements Gathering (5-10 minutes)

- **Functional Requirements**: What features does the system need?
- **Non-functional Requirements**: Performance, scalability, accessibility
- **Scale**: How many users? Data volume? Traffic patterns?
- **Constraints**: Browser support, mobile responsiveness, offline support

### Step 2: High-Level Architecture (10-15 minutes)

- **Component Hierarchy**: Break down into major components
- **Data Flow**: How data moves through the system
- **State Management**: Local state vs global state
- **API Integration**: REST vs GraphQL vs WebSockets

### Step 3: Detailed Design (15-20 minutes)

- **Component Design**: Props, state, lifecycle
- **Performance Optimizations**: Lazy loading, caching, virtualization
- **Error Handling**: Fallbacks, retry mechanisms
- **Security Considerations**: XSS, CSRF, authentication

### Step 4: Deep Dive & Trade-offs (10-15 minutes)

- **Scalability**: Code splitting, CDN, bundle optimization
- **Accessibility**: ARIA, keyboard navigation, screen readers
- **Testing Strategy**: Unit, integration, e2e tests
- **Monitoring**: Analytics, error tracking, performance metrics

---

## Detailed Solutions {#solutions}

### 1. Design a Real-time Chat Application

#### Requirements

- **Functional**: Send/receive messages, user presence, chat history, file sharing
- **Non-functional**: Real-time updates, offline support, 10k concurrent users
- **Scale**: 100k daily active users, 1M messages/day

#### High-Level Architecture

```
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐
│   Chat Client   │◄──►│  WebSocket   │◄──►│   Backend API   │
│                 │    │   Gateway    │    │                 │
└─────────────────┘    └──────────────┘    └─────────────────┘
         │                                           │
         ▼                                           ▼
┌─────────────────┐                        ┌─────────────────┐
│ Local Storage/  │                        │    Database     │
│ IndexedDB       │                        │   (Messages)    │
└─────────────────┘                        └─────────────────┘
```

#### Component Architecture

```jsx
// Main App Structure
<ChatApp>
  <Sidebar>
    <UserProfile />
    <ChatList />
    <SearchBar />
  </Sidebar>
  <ChatWindow>
    <ChatHeader />
    <MessagesList />
    <MessageInput />
  </ChatWindow>
  <NotificationProvider />
</ChatApp>
```

#### Key Implementation Details

**1. Real-time Communication**

```javascript
// WebSocket connection management
class WebSocketManager {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect() {
    this.ws = new WebSocket("wss://api.chat.com/ws");
    this.ws.onmessage = this.handleMessage.bind(this);
    this.ws.onclose = this.handleReconnect.bind(this);
  }

  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => {
        this.reconnectAttempts++;
        this.connect();
      }, Math.pow(2, this.reconnectAttempts) * 1000);
    }
  }
}
```

**2. State Management**

```javascript
// Using Redux/Zustand for global state
const chatStore = {
  activeChats: new Map(),
  currentChat: null,
  messages: new Map(), // chatId -> messages[]
  users: new Map(),
  connectionStatus: "disconnected",
};

// Actions
const actions = {
  sendMessage: (chatId, message) => {
    // Optimistic update
    addMessageToStore(message);
    // Send via WebSocket
    webSocketManager.send({ type: "MESSAGE", chatId, message });
  },

  receiveMessage: (message) => {
    addMessageToStore(message);
    showNotification(message);
  },
};
```

**3. Performance Optimizations**

```javascript
// Virtual scrolling for message list
const MessagesList = () => {
  const { messages } = useChat();

  return (
    <VirtualizedList
      height={500}
      itemCount={messages.length}
      itemSize={80}
      renderItem={({ index, style }) => (
        <div style={style}>
          <Message message={messages[index]} />
        </div>
      )}
    />
  );
};

// Message input with debounced typing indicators
const useTypingIndicator = () => {
  const [isTyping, setIsTyping] = useState(false);

  const debouncedStopTyping = useMemo(
    () => debounce(() => setIsTyping(false), 1000),
    []
  );

  const startTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      webSocketManager.send({ type: "TYPING_START" });
    }
    debouncedStopTyping();
  };

  return { isTyping, startTyping };
};
```

**4. Offline Support**

```javascript
// Service Worker for offline caching
self.addEventListener("fetch", (event) => {
  if (event.request.url.includes("/api/messages")) {
    event.respondWith(
      caches
        .match(event.request)
        .then((response) => response || fetch(event.request))
    );
  }
});

// IndexedDB for message persistence
class MessageStore {
  async saveMessage(message) {
    const db = await openDB("chat-db", 1);
    await db.add("messages", message);
  }

  async getMessages(chatId) {
    const db = await openDB("chat-db", 1);
    return db.getAllFromIndex("messages", "chatId", chatId);
  }
}
```

#### Trade-offs & Considerations

**Real-time vs Performance**

- WebSocket vs Server-Sent Events vs Polling
- Connection pooling for multiple tabs
- Message batching for high-frequency updates

**State Management**

- Local component state vs global state
- Message pagination and memory management
- Optimistic updates vs eventual consistency

**Security**

- Message encryption (E2E encryption overview)
- XSS prevention in message rendering
- Rate limiting on client side

---

### 2. Design a Social Media Feed

#### Requirements

- **Functional**: Infinite scroll, post interactions (like, comment, share), media support
- **Non-functional**: Fast loading, smooth scrolling, 1M+ posts
- **Scale**: 100k DAU, 10k posts/hour

#### High-Level Architecture

```
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐
│   Feed Client   │◄──►│   CDN/Cache  │◄──►│   Feed API      │
│                 │    │              │    │                 │
└─────────────────┘    └──────────────┘    └─────────────────┘
         │                                           │
         ▼                                           ▼
┌─────────────────┐                        ┌─────────────────┐
│ Browser Cache/  │                        │   Recommendation│
│ Local Storage   │                        │    Service      │
└─────────────────┘                        └─────────────────┘
```

#### Component Architecture

```jsx
<FeedApp>
  <Header>
    <SearchBar />
    <NotificationBell />
    <UserMenu />
  </Header>
  <MainContent>
    <CreatePost />
    <FeedContainer>
      <VirtualizedFeed />
    </FeedContainer>
  </MainContent>
  <Sidebar>
    <TrendingTopics />
    <SuggestedUsers />
  </Sidebar>
</FeedApp>
```

#### Key Implementation Details

**1. Infinite Scroll with Virtualization**

```javascript
const VirtualizedFeed = () => {
  const [posts, setPosts] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(false);

  const {
    fetchNextPage,
    hasNextPage: hasMore,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["feed"],
    queryFn: ({ pageParam = 0 }) => fetchFeed(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return (
    <InfiniteScroll
      dataLength={posts.length}
      next={fetchNextPage}
      hasMore={hasMore}
      loader={<FeedSkeleton />}
      endMessage={<EndOfFeed />}
    >
      <FixedSizeList
        height={600}
        itemCount={posts.length}
        itemSize={400}
        itemData={posts}
      >
        {PostItem}
      </FixedSizeList>
    </InfiniteScroll>
  );
};
```

**2. Post Component with Optimizations**

```javascript
const PostItem = React.memo(({ index, style, data }) => {
  const post = data[index];
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer for analytics
  const postRef = useRef();
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Track post view
          analytics.track("post_viewed", { postId: post.id });
        }
      },
      { threshold: 0.5 }
    );

    if (postRef.current) {
      observer.observe(postRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div style={style} ref={postRef}>
      <PostCard post={post}>
        <PostHeader user={post.author} timestamp={post.createdAt} />
        <PostContent content={post.content} />
        <LazyMedia media={post.media} />
        <PostActions
          likes={post.likes}
          comments={post.comments}
          shares={post.shares}
          onLike={() => handleLike(post.id)}
          onComment={() => handleComment(post.id)}
          onShare={() => handleShare(post.id)}
        />
      </PostCard>
    </div>
  );
});
```

**3. Optimistic Updates**

```javascript
const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId) => likePost(postId),
    onMutate: async (postId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(["feed"]);

      // Snapshot previous value
      const previousFeed = queryClient.getQueryData(["feed"]);

      // Optimistically update
      queryClient.setQueryData(["feed"], (old) => {
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            posts: page.posts.map((post) =>
              post.id === postId
                ? { ...post, liked: true, likes: post.likes + 1 }
                : post
            ),
          })),
        };
      });

      return { previousFeed };
    },
    onError: (err, postId, context) => {
      // Rollback on error
      queryClient.setQueryData(["feed"], context.previousFeed);
    },
  });
};
```

**4. Media Handling**

```javascript
const LazyMedia = ({ media }) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loaded) {
          setLoaded(true);
        }
      },
      { rootMargin: "50px" }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [loaded]);

  if (media.type === "image") {
    return (
      <div ref={imgRef} className="media-container">
        {loaded ? (
          <img
            src={media.url}
            alt={media.alt}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
          />
        ) : (
          <ImagePlaceholder />
        )}
      </div>
    );
  }

  if (media.type === "video") {
    return (
      <video ref={imgRef} controls preload="metadata" poster={media.thumbnail}>
        <source src={media.url} type="video/mp4" />
      </video>
    );
  }
};
```

#### Performance Optimizations

**1. Bundle Splitting**

```javascript
// Route-based code splitting
const Feed = lazy(() => import("./Feed"));
const Profile = lazy(() => import("./Profile"));
const Messages = lazy(() => import("./Messages"));

const App = () => (
  <Suspense fallback={<PageSkeleton />}>
    <Routes>
      <Route path="/feed" element={<Feed />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/messages" element={<Messages />} />
    </Routes>
  </Suspense>
);
```

**2. Caching Strategy**

```javascript
// Service Worker caching
const CACHE_NAME = "feed-v1";
const urlsToCache = ["/", "/static/js/bundle.js", "/static/css/main.css"];

self.addEventListener("fetch", (event) => {
  if (event.request.url.includes("/api/feed")) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return fetch(event.request)
          .then((response) => {
            cache.put(event.request, response.clone());
            return response;
          })
          .catch(() => {
            return cache.match(event.request);
          });
      })
    );
  }
});
```

---

## Key Frontend Concepts {#concepts}

### Performance Optimization Techniques

1. **Code Splitting**: Route-based and component-based
2. **Lazy Loading**: Images, components, and modules
3. **Virtualization**: For large lists and grids
4. **Caching**: Browser cache, service workers, CDN
5. **Bundle Optimization**: Tree shaking, minification
6. **Critical Path Optimization**: Inline critical CSS, preload resources

### State Management Patterns

1. **Local State**: useState, useReducer
2. **Global State**: Redux, Zustand, Context API
3. **Server State**: React Query, SWR, Apollo Client
4. **URL State**: React Router, Next.js router
5. **Form State**: React Hook Form, Formik

### Real-time Communication

1. **WebSockets**: Bidirectional, persistent connection
2. **Server-Sent Events**: Unidirectional, automatic reconnection
3. **Long Polling**: HTTP-based, fallback option
4. **WebRTC**: Peer-to-peer communication

### Security Considerations

1. **XSS Prevention**: Sanitize inputs, CSP headers
2. **CSRF Protection**: CSRF tokens, SameSite cookies
3. **Authentication**: JWT, OAuth, session management
4. **Data Validation**: Client-side and server-side

---

## Best Practices {#best-practices}

### Architecture Design

- **Component Composition** over inheritance
- **Single Responsibility Principle** for components
- **Separation of Concerns**: UI, business logic, data
- **Progressive Enhancement**: Works without JavaScript

### Performance

- **Measure First**: Use DevTools, Lighthouse, Web Vitals
- **Optimize Critical Path**: First Contentful Paint, Largest Contentful Paint
- **Reduce Bundle Size**: Code splitting, tree shaking
- **Optimize Images**: WebP, lazy loading, responsive images

### Accessibility

- **Semantic HTML**: Use proper HTML elements
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Tab order, focus management
- **Color Contrast**: WCAG 2.1 AA compliance

### Testing Strategy

- **Unit Tests**: Components, utilities, hooks
- **Integration Tests**: User interactions, API integration
- **E2E Tests**: Critical user flows
- **Visual Regression**: Storybook, Chromatic

### Monitoring & Analytics

- **Error Tracking**: Sentry, Bugsnag
- **Performance Monitoring**: Web Vitals, custom metrics
- **User Analytics**: Event tracking, conversion funnels
- **A/B Testing**: Feature flags, experiments

---

## Interview Tips

### Communication

- **Think Out Loud**: Explain your reasoning
- **Ask Clarifying Questions**: Don't assume requirements
- **Discuss Trade-offs**: There's no perfect solution
- **Be Honest**: Admit when you don't know something

### Problem-Solving Approach

1. **Start Simple**: Build MVP first, then iterate
2. **Scale Gradually**: Don't over-engineer from the start
3. **Consider Edge Cases**: Error states, loading states
4. **Think About Users**: Accessibility, performance, UX

### Technical Depth

- **Know Your Tools**: React ecosystem, build tools, testing
- **Understand Browsers**: How browsers work, limitations
- **Web Standards**: HTML, CSS, JavaScript APIs
- **Performance**: Critical rendering path, optimization techniques

Good luck with your frontend system design interviews! Practice these questions and approaches, and remember to always start with the user experience in mind.
