# Inkwell - Product Requirements Document

## Executive Summary

**Product Name:** Inkwell  
**Version:** 1.0  
**Last Updated:** January 28, 2026  

Inkwell is an AI-powered document editor that helps writers craft content with intelligent assistance. It combines a clean, distraction-free writing environment with an AI assistant that understands your context through a knowledge library and customizable instructions.

---

## Product Vision

### Vision Statement
"Write with Knowledge" — Inkwell enables writers to produce better content by combining a beautiful, focused writing experience with AI assistance that truly understands their context, references, and preferences.

### Design Philosophy
Inkwell embodies "Mindful Productivity" — an interface that feels as soft as paper but as powerful as modern software. The design uses tactile depth, organic softness, and focused minimalism to create a writing environment that promotes focus and creativity.

---

## Target Users

### Primary Persona: Content Creators
- **Writers and Authors**: Creating articles, blog posts, stories, and books
- **Marketers**: Drafting copy, campaigns, and brand content
- **Knowledge Workers**: Producing reports, documentation, and proposals

### User Needs
- A distraction-free writing environment
- AI assistance that maintains consistent tone and style
- Ability to reference research materials while writing
- Control over how AI assists their writing process

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, Tailwind CSS 4 |
| Editor | Tiptap (ProseMirror-based) |
| Backend | Convex (real-time database & functions) |
| Authentication | Convex Auth |
| AI | OpenAI GPT-4o-mini |
| Payments | Polar.sh |
| Build | Vite 7 |

---

## Core Features

### 1. Document Management

#### 1.1 Document Dashboard
- Grid view of all user documents
- Document cards showing title and last updated time
- Quick actions: open, delete
- Empty state with call-to-action for first document
- **Status:** ✅ Implemented

#### 1.2 Document CRUD Operations
- Create new documents (default title: "Untitled Document")
- Auto-save with debounced updates (1-second delay)
- Delete documents with confirmation dialog
- Real-time sync via Convex
- **Status:** ✅ Implemented

#### 1.3 Document Editor Header
- Editable document title (inline)
- Save status indicator ("Just saved", "Saving...")
- Toggle buttons for sidebars
- Back navigation to dashboard
- **Status:** ✅ Implemented

---

### 2. Rich Text Editor

#### 2.1 Tiptap-Based Editor
Built on the Tiptap editor framework with StarterKit extension.

#### 2.2 Formatting Tools
| Tool | Description | Status |
|------|-------------|--------|
| Bold | Toggle bold text | ✅ |
| Italic | Toggle italic text | ✅ |
| Strikethrough | Toggle strikethrough | ✅ |
| Heading 1 | Large heading | ✅ |
| Heading 2 | Medium heading | ✅ |
| Heading 3 | Small heading | ✅ |
| Bullet List | Unordered list | ✅ |
| Numbered List | Ordered list | ✅ |
| Block Quote | Indented quote block | ✅ |
| Code Block | Monospace code formatting | ✅ |
| Undo | Revert last change | ✅ |
| Redo | Restore reverted change | ✅ |

#### 2.3 Toolbar Design
- Grouped toolbar buttons with visual dividers
- Active state indication (3D pressed effect)
- Disabled state for unavailable actions
- **Status:** ✅ Implemented

---

### 3. AI Writing Assistant ("Inky")

#### 3.1 Chat Interface
- Right sidebar panel (toggleable)
- Message history per document
- User and assistant message bubbles
- Loading state with animated dots
- Clear chat functionality
- **Status:** ✅ Implemented

#### 3.2 AI Capabilities
- Context-aware responses using:
  - Current document content
  - Knowledge library items
  - Global user AI instructions
  - Document-specific AI instructions
- Writing assistance (drafting, editing, expanding)
- Style matching to existing document tone
- **Status:** ✅ Implemented

#### 3.3 Insert to Document
- "Insert into document" button on AI responses
- Strips markdown code blocks when inserting
- Appends content to document end
- **Status:** ✅ Implemented

#### 3.4 AI Model Configuration
- Model: GPT-4o-mini
- Temperature: 0.7
- Max tokens: 2000
- **Status:** ✅ Implemented

---

### 4. Knowledge Library

#### 4.1 Knowledge Sidebar
- Left sidebar panel (toggleable)
- List of knowledge items per document
- Add new knowledge form
- **Status:** ✅ Implemented

#### 4.2 Knowledge Items
- Title and content fields
- Edit existing items
- Delete with confirmation dialog
- Content preview (2-line clamp)
- **Status:** ✅ Implemented

#### 4.3 AI Integration
- Knowledge automatically included in AI context
- Formatted as "Reference Knowledge" sections
- Supports multiple knowledge items
- **Status:** ✅ Implemented

---

### 5. Text Selection Context

#### 5.1 Selection Popup
- Appears when text is selected in editor
- "Add to AI" button positioned above selection
- **Status:** ✅ Implemented

#### 5.2 Context Snippets
- Display as pills in chat input area
- Shows first two words of selection
- Individual remove button
- "Clear all" option for multiple snippets
- **Status:** ✅ Implemented

#### 5.3 Context Usage
- Prepended to user message as "[Selected Text]"
- Context cleared after message sent
- **Status:** ✅ Implemented

---

### 6. AI Instructions System

#### 6.1 Global AI Instructions
- Configured in Profile settings
- Applies to all documents
- Text area with example placeholders
- Save with success feedback
- **Status:** ✅ Implemented

#### 6.2 Document-Specific Instructions
- Modal accessed from AI chat header
- Per-document customization
- Overrides/supplements global instructions
- Visual indicator when instructions exist
- **Status:** ✅ Implemented

#### 6.3 Instruction Priority
1. Document-specific instructions
2. Global user instructions
3. Default system prompt
- **Status:** ✅ Implemented

---

### 7. User Management

#### 7.1 Authentication
- Email/password authentication via Convex Auth
- Sign up / Sign in flows
- Protected routes requiring authentication
- Automatic redirect for authenticated users
- **Status:** ✅ Implemented

#### 7.2 Profile Settings
- Display name editing
- Email editing
- Avatar (initials-based)
- AI instructions management
- **Status:** ✅ Implemented

#### 7.3 Account Dropdown
- Quick access from header
- Profile link
- Sign out action
- **Status:** ✅ Implemented

---

### 8. Subscription & Payments

#### 8.1 Polar.sh Integration
- Subscription checkout flow
- Webhook handling for subscription events
- **Status:** ✅ Implemented

#### 8.2 Subscription States
| State | Description |
|-------|-------------|
| none | No subscription |
| active | Valid subscription |
| canceled | Subscription canceled |
| past_due | Payment failed |

#### 8.3 Trial/Paywall
- Subscription required to access app
- Trial popup for new users
- Subscription verification polling
- Logout option for wrong account
- **Status:** ✅ Implemented

#### 8.4 Subscription Linking
- Link by email (pre-registration)
- Link by user ID (post-registration)
- Debug tools for testing
- **Status:** ✅ Implemented

---

## Database Schema

### Tables

```
users (from Convex Auth)
├── _id: Id<"users">
├── email: string
└── name: string

userSettings
├── _id: Id<"userSettings">
├── userId: Id<"users">
└── aiSystemInstructions: string (optional)

documents
├── _id: Id<"documents">
├── userId: Id<"users">
├── title: string
├── content: string (HTML)
├── updatedAt: number (timestamp)
└── aiSystemInstructions: string (optional)

knowledge
├── _id: Id<"knowledge">
├── documentId: Id<"documents">
├── title: string
└── content: string

messages
├── _id: Id<"messages">
├── documentId: Id<"documents">
├── role: "user" | "assistant"
└── content: string

subscriptions
├── _id: Id<"subscriptions">
├── userId: Id<"users"> (optional)
├── email: string
├── polarCustomerId: string (optional)
├── polarSubscriptionId: string (optional)
├── status: "active" | "canceled" | "past_due" | "none"
└── currentPeriodEnd: number (optional)
```

### Indexes
- `userSettings.by_user` → userId
- `documents.by_user` → userId
- `knowledge.by_document` → documentId
- `messages.by_document` → documentId
- `subscriptions.by_user` → userId
- `subscriptions.by_email` → email
- `subscriptions.by_polar_subscription` → polarSubscriptionId

---

## UI/UX Design System

### Design Pillars
1. **Tactile Depth** — Soft shadows, inset button states
2. **Organic Softness** — High corner radius (24px+ for containers)
3. **Focused Minimalism** — Low information density, generous whitespace
4. **Luminous Surfaces** — Glassmorphism for overlays

### Typography
| Type | Font | Weights |
|------|------|---------|
| Headings | Libre Baskerville (serif) | 400, 700 |
| Body | Plus Jakarta Sans | 400, 500, 600, 700 |
| Logo | Custom italic serif | — |

### Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| cream-50 | #FAF9F6 | Surface background |
| cream-100 | #F5F2EF | Page background |
| ink-700/800 | #2D2D30 | Primary text, dark surfaces |
| accent-500 | #5858D6 | Action accent, links |
| ink-400/500 | #6E6E73 | Secondary text |

### Component Patterns
- **Cards**: 24px radius, soft shadow, cream-50 background
- **Buttons**: Primary (ink-700), Secondary (cream-200), Ghost (transparent)
- **Inputs**: 12px radius, cream-100 background, cream-300 border
- **Modals**: Backdrop blur, centered card, escape to close

---

## Application Routes

| Route | Component | Access |
|-------|-----------|--------|
| `/` | Landing | Public |
| `/auth` | Auth | Public (redirects if authenticated) |
| `/dashboard` | Dashboard | Protected |
| `/document/:id` | DocumentEditor | Protected |
| `/profile` | Profile | Protected |
| `/checkout/success` | CheckoutSuccess | Public |
| `/style-guide` | StyleGuide | Public |

---

## API Endpoints (Convex Functions)

### Documents
- `documents.list` — Get all user documents
- `documents.get` — Get single document by ID
- `documents.create` — Create new document
- `documents.update` — Update document (title, content, instructions)
- `documents.remove` — Delete document

### Knowledge
- `knowledge.list` — Get knowledge for document
- `knowledge.create` — Add knowledge item
- `knowledge.update` — Edit knowledge item
- `knowledge.remove` — Delete knowledge item

### Messages
- `messages.list` — Get chat history for document
- `messages.create` — Add message
- `messages.clear` — Delete all messages for document

### Users
- `users.getCurrentUser` — Get authenticated user
- `users.getUserSettings` — Get user settings
- `users.updateProfile` — Update name/email
- `users.updateAIInstructions` — Update global AI instructions

### Subscriptions
- `subscriptions.getSubscriptionStatus` — Check subscription status
- `subscriptions.checkSubscriptionByEmail` — Check by email
- `subscriptions.linkSubscriptionToCurrentUser` — Link subscription

### AI
- `ai.chat` — Send message to AI, get response

---

## Planned Features (Backlog)

### Near-Term
| Feature | Priority | Status |
|---------|----------|--------|
| App UI for delete confirmation (replace native dialog) | High | 🔄 In Progress |
| Fix bullet point visibility in document | High | Pending |
| Pre-created tone templates for AI instructions | Medium | Pending |
| Account management (password change, delete account) | Medium | Pending |

### Future Considerations
- Document sharing/collaboration
- Export to various formats (PDF, Markdown, Word)
- Version history
- Templates library
- Folder organization
- Dark mode
- Mobile responsive improvements
- Keyboard shortcuts
- AI writing suggestions (inline)
- Grammar/spelling check
- Word count and reading time

---

## Non-Functional Requirements

### Performance
- Auto-save debounce: 1 second
- AI response timeout: handled by OpenAI defaults
- Real-time updates via Convex subscriptions

### Security
- Authentication required for all document operations
- User can only access their own documents
- API keys stored as environment variables

### Accessibility
- Keyboard navigation support
- Focus management in modals
- Semantic HTML structure

---

## Environment Configuration

### Required Environment Variables
```
VITE_CONVEX_URL=<convex-deployment-url>
OPENAI_API_KEY=<openai-api-key>
POLAR_ACCESS_TOKEN=<polar-api-token>
```

---

## Success Metrics

### User Engagement
- Documents created per user
- AI interactions per document
- Knowledge items added per document
- Session duration

### Product Health
- Subscription conversion rate
- User retention rate
- AI response quality (future: user feedback)

---

## Appendix

### File Structure
```
inkwell/
├── convex/           # Backend (Convex functions, schema)
├── src/
│   ├── components/   # React components
│   │   └── ui/       # Reusable UI components
│   └── pages/        # Page components
├── Planning/         # Documentation
└── public/           # Static assets
```

### Key Dependencies
- `@tiptap/react` — Rich text editor
- `convex` — Real-time backend
- `@convex-dev/auth` — Authentication
- `openai` — AI integration
- `@polar-sh/checkout` — Payment checkout
- `react-router-dom` — Routing
