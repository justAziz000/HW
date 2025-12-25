# Integration Guide - How to Add Components to Dashboards

## 1. StudentDashboard Integration

### Add StudentProfile Tab
```tsx
// In StudentDashboard.jsx sidebar, add:
import { StudentProfile } from './StudentProfile';

// In your tab switching logic:
{activeTab === 'profile' && <StudentProfile userId={user.id} />}

// Add button to ITSidebar:
<button onClick={() => onTabChange('profile')}>
  👤 Mening Profilim
</button>
```

### Add ProgressTracker
```tsx
import { ProgressTracker } from './ProgressTracker';

// In dashboard overview section:
<ProgressTracker userId={user.id} role="student" />
```

### Add Onboarding Tutorial
```tsx
import { OnboardingTutorial } from './OnboardingTutorial';

// At the end of StudentDashboard:
<OnboardingTutorial />
```

### Add AnnouncementBanner
```tsx
import { AnnouncementBanner } from './AnnouncementBanner';

// Show at top of dashboard:
<AnnouncementBanner role="student" />
```

### Add Coin Reward Modal
```tsx
import { CoinRewardModal } from './CoinRewardModal';

// Track coin changes and show modal when coins increase:
const [showCoinModal, setShowCoinModal] = useState(false);
const [coinsEarned, setCoinsEarned] = useState(0);

useEffect(() => {
  // Check if user earned coins
  const lastCoins = localStorage.getItem(`student_coins_${user.id}`);
  if (lastCoins && user.coins > parseInt(lastCoins)) {
    setCoinsEarned(user.coins - parseInt(lastCoins));
    setShowCoinModal(true);
  }
  localStorage.setItem(`student_coins_${user.id}`, user.coins);
}, [user.coins]);

// In JSX:
<CoinRewardModal 
  coins={coinsEarned}
  totalCoins={user.coins}
  isOpen={showCoinModal}
  onClose={() => setShowCoinModal(false)}
/>
```

## 2. TeacherDashboard Integration

### Add Parent Activity Tracker
```tsx
import { ParentActivityTracker } from './ParentActivityTracker';

// Add new section in teacher dashboard:
<div className="mt-8">
  <h2 className="text-2xl font-bold mb-4">Ota-Onalar Faoliyati</h2>
  <ParentActivityTracker groupId={groupId} />
</div>
```

### Integrate TeacherRating with Search
```tsx
// TeacherRating.jsx already has search - just display it:
import { TeacherRating } from './TeacherRating';

// In dashboard:
{activeTab === 'rating' && <TeacherRating />}
```

### Add AnnouncementBanner
```tsx
import { AnnouncementBanner } from './AnnouncementBanner';

// Show announcements for teachers:
<AnnouncementBanner role="teacher" />
```

## 3. AdminDashboard Integration

### Add Password Management
```tsx
import { AdminPasswordManagement } from './AdminPasswordManagement';

// In AdminDashboard:
<AdminPasswordManagement 
  students={students}
  teachers={teachers}
  parents={parents}
/>
```

### Add Teacher Coin Limits
```tsx
import { TeacherCoinLimits } from './TeacherCoinLimits';

// In AdminDashboard:
<TeacherCoinLimits />
```

### Add AnnouncementBanner for Admin
```tsx
import { AnnouncementBanner } from './AnnouncementBanner';

// Show admin-created announcements everywhere:
<AnnouncementBanner role="admin" />
```

## 4. ParentDashboard Integration

### Add Child Selection
```tsx
// Add children selector:
const [selectedChild, setSelectedChild] = useState(children[0]?.id);

// Dropdown to select child:
<select value={selectedChild} onChange={(e) => setSelectedChild(e.target.value)}>
  {children.map(child => (
    <option key={child.id} value={child.id}>{child.name}</option>
  ))}
</select>
```

### Add ParentChildInfo
```tsx
import { ParentChildInfo } from './ParentChildInfo';

// Display for selected child:
<ParentChildInfo 
  childId={selectedChild}
  childName={children.find(c => c.id === selectedChild)?.name}
/>
```

### Add ProgressTracker
```tsx
import { ProgressTracker } from './ProgressTracker';

// Show progress for child:
<ProgressTracker userId={selectedChild} role="parent" />
```

### Add AnnouncementBanner
```tsx
import { AnnouncementBanner } from './AnnouncementBanner';

// Show announcements for parents:
<AnnouncementBanner role="parent" />
```

## 5. Complete Component Import Example

```tsx
import { StudentProfile } from './StudentProfile';
import { ProgressTracker } from './ProgressTracker';
import { OnboardingTutorial } from './OnboardingTutorial';
import { AnnouncementBanner } from './AnnouncementBanner';
import { CoinRewardModal } from './CoinRewardModal';
import { ParentActivityTracker } from './ParentActivityTracker';
import { AdminPasswordManagement } from './AdminPasswordManagement';
import { TeacherCoinLimits } from './TeacherCoinLimits';
import { ParentChildInfo } from './ParentChildInfo';
import { LessonViewer } from './LessonViewer';
import { TeacherRating } from './TeacherRating';
```

## 6. LocalStorage Keys Used

```javascript
// Session management
'mars-user-session' - Last activity timestamp
'mars-user-passwords' - Stored passwords (for demo)

// Announcements
'admin-announcements' - All announcements

// Teacher Coins
'teacher-coin-limits' - Teacher daily limits

// Parent Activity
'parent-activity-tracking' - Parent login tracking

// Onboarding
'onboarding-tutorial-seen' - User tutorial status

// Student Coins
'student_coins_{userId}' - Last known coin count
```

## 7. Key Props Required

### StudentProfile
- `userId` (string) - Required

### ProgressTracker
- `userId` (string) - Required
- `role` (string) - 'student' or 'parent', default: 'student'

### OnboardingTutorial
- No props required

### AnnouncementBanner
- `role` (string) - 'student', 'teacher', 'parent', or 'admin'

### CoinRewardModal
- `coins` (number) - Coins earned
- `totalCoins` (number) - Total coin balance
- `isOpen` (boolean) - Show/hide modal
- `onClose` (function) - Close handler

### ParentActivityTracker
- `groupId` (string) - Group identifier

### ParentChildInfo
- `childId` (string) - Required
- `childName` (string) - Optional, displays child name

### LessonViewer
- `lesson` (object) - Lesson data from mockData
- `isCompleted` (boolean) - Completion status
- `onComplete` (function) - Completion handler

### TeacherRating
- No props required

## 8. Testing Checklist

- [ ] All components render without errors
- [ ] Dark/Light theme toggle works
- [ ] Responsive design on mobile (< 768px)
- [ ] Responsive design on tablet (768px - 1024px)
- [ ] Responsive design on desktop (> 1024px)
- [ ] All modals and popups are accessible
- [ ] LocalStorage persistence works
- [ ] Session timeout triggers correctly
- [ ] Link validation rejects non-GitHub/Vercel links
- [ ] Announcements display correctly per role
- [ ] Password management UI is intuitive

## 9. Common Issues & Solutions

**Issue**: Components not showing
- **Solution**: Check that imports are correct and components are exported

**Issue**: LocalStorage not persisting
- **Solution**: Check browser localStorage is enabled, check key names

**Issue**: Dark theme not applying
- **Solution**: Ensure ThemeProvider wraps the app, check class names

**Issue**: Swiper carousel not working
- **Solution**: Ensure swiper CSS is imported in component

**Issue**: Type errors in TypeScript
- **Solution**: Use `useRef` instead of `useState` for interval references
