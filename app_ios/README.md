# iOS App - NoteFlow

Ứng dụng iOS cho NoteFlow được xây dựng bằng SwiftUI, hỗ trợ offline-first và đồng bộ hóa thông minh.

## Yêu cầu hệ thống

- **iOS**: 15.0+
- **Xcode**: 14.0+
- **Swift**: 5.7+
- **Deployment Target**: iOS 15.0

## Công nghệ sử dụng

- **UI Framework**: SwiftUI
- **Architecture**: MVVM + Combine
- **Local Database**: Core Data + SQLite
- **Networking**: URLSession + GraphQL
- **Authentication**: Firebase Auth
- **Push Notifications**: Firebase Cloud Messaging
- **Image Caching**: Kingfisher
- **Offline Storage**: Core Data

## Cấu trúc dự án

```
app_ios/
├── NoteFlow/
│   ├── App/                    # App entry point
│   ├── Views/                  # SwiftUI Views
│   │   ├── Authentication/     # Login, Register screens
│   │   ├── Home/              # Dashboard, Navigation
│   │   ├── Notes/             # Note management
│   │   ├── Tasks/             # Task management
│   │   ├── Issues/            # Issue tracking
│   │   ├── Settings/          # App settings
│   │   └── Common/            # Shared UI components
│   ├── ViewModels/            # MVVM ViewModels
│   ├── Models/                # Data models
│   ├── Services/              # Business logic
│   │   ├── NetworkService/    # API communication
│   │   ├── DatabaseService/   # Core Data operations
│   │   ├── SyncService/       # Offline sync
│   │   └── AuthService/       # Authentication
│   ├── Utils/                 # Utility classes
│   ├── Extensions/            # Swift extensions
│   └── Resources/             # Assets, localization
├── NoteFlowTests/             # Unit tests
├── NoteFlowUITests/           # UI tests
└── NoteFlow.xcodeproj/        # Xcode project
```

## Tính năng chính

### Authentication
- Firebase Auth integration
- Face ID / Touch ID support
- Secure token storage in Keychain
- Auto-login với stored credentials

### Note Management
- Rich text editor với SwiftUI
- Photo & file attachments
- Tags và categories
- Full-text search
- Export to PDF

### Offline Capabilities
- Core Data local storage
- Sync queue management
- Conflict resolution UI
- Smart sync khi có mạng

### Team Collaboration
- Real-time comments
- @mention notifications
- File sharing
- Assignment management

### UI/UX Features
- Dark mode support
- Dynamic Type support
- Accessibility labels
- Haptic feedback
- Pull-to-refresh
- Infinite scrolling

## Cài đặt môi trường phát triển

### Prerequisites
- macOS 12.0+
- Xcode 14.0+
- iOS Simulator hoặc device iOS 15.0+

### Clone và setup
```bash
cd app_ios
open NoteFlow.xcodeproj
```

### Cài đặt dependencies
```bash
# Dependencies được quản lý bằng Swift Package Manager
# Xcode sẽ tự động tải các dependencies khi build
```

### Cấu hình Firebase
1. Tải `GoogleService-Info.plist` từ Firebase Console
2. Thêm file vào Xcode project
3. Đảm bảo file được include trong target

### Build và run
1. Chọn simulator hoặc device
2. Cmd+R để build và run

## Dependencies

### Swift Package Manager
```swift
dependencies: [
    .package(url: "https://github.com/firebase/firebase-ios-sdk", from: "10.0.0"),
    .package(url: "https://github.com/onevcat/Kingfisher.git", from: "7.0.0"),
    .package(url: "https://github.com/Alamofire/Alamofire.git", from: "5.6.0"),
    .package(url: "https://github.com/apollographql/apollo-ios.git", from: "1.0.0"),
    .package(url: "https://github.com/realm/SwiftLint", from: "0.50.0")
]
```

## Architecture

### MVVM Pattern
```swift
// ViewModel example
class NoteListViewModel: ObservableObject {
    @Published var notes: [Note] = []
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    private let noteService: NoteServiceProtocol
    private let syncService: SyncServiceProtocol
    
    func loadNotes() {
        // Load notes logic
    }
    
    func createNote(_ note: Note) {
        // Create note logic
    }
}

// View example
struct NoteListView: View {
    @StateObject private var viewModel = NoteListViewModel()
    
    var body: some View {
        NavigationView {
            List(viewModel.notes) { note in
                NoteRowView(note: note)
            }
            .navigationTitle("Notes")
            .onAppear {
                viewModel.loadNotes()
            }
        }
    }
}
```

### Core Data Stack
```swift
class CoreDataStack {
    lazy var persistentContainer: NSPersistentContainer = {
        let container = NSPersistentContainer(name: "NoteFlow")
        container.loadPersistentStores { _, error in
            if let error = error {
                fatalError("Core Data error: \(error)")
            }
        }
        return container
    }()
    
    var context: NSManagedObjectContext {
        return persistentContainer.viewContext
    }
    
    func save() {
        if context.hasChanges {
            try? context.save()
        }
    }
}
```

## Testing

### Unit Tests
```bash
# Run unit tests
Cmd+U trong Xcode
# hoặc
xcodebuild test -scheme NoteFlow -destination 'platform=iOS Simulator,name=iPhone 14'
```

### UI Tests
```bash
# Run UI tests
xcodebuild test -scheme NoteFlowUITests -destination 'platform=iOS Simulator,name=iPhone 14'
```

### Testing Strategy
- ViewModels: Unit tests với mock services
- Views: Snapshot tests
- Services: Integration tests
- UI: End-to-end tests

## Deployment

### Debug Build
- Development certificates
- Debug Firebase configuration
- Detailed logging enabled

### Release Build
- Distribution certificates
- Production Firebase configuration
- Optimized performance
- Crash reporting enabled

### App Store Submission
1. Archive build (Cmd+Shift+I)
2. Upload to App Store Connect
3. TestFlight beta testing
4. App Store review submission

## Performance

### Optimization
- Lazy loading cho large lists
- Image caching với Kingfisher
- Core Data batch operations
- Memory management với weak references

### Monitoring
- Firebase Performance
- Firebase Crashlytics
- Custom analytics events
- Memory usage tracking

## Security

### Data Protection
- Keychain cho sensitive data
- Core Data encryption
- Certificate pinning
- Biometric authentication

### Privacy
- Permission requests
- Data usage transparency
- GDPR compliance
- User data export/deletion

## Accessibility

### Features
- VoiceOver support
- Dynamic Type
- High contrast support
- Reduced motion
- Voice Control

### Implementation
```swift
// Accessibility example
Text("Note Title")
    .accessibilityLabel("Note title")
    .accessibilityHint("Double tap to edit")
    .accessibilityAddTraits(.isButton)
```

## Localization

### Supported Languages
- English (base)
- Vietnamese
- More languages in future releases

### Implementation
```swift
// Localization example
Text("welcome_message")
    .localizedStringKey("Welcome to NoteFlow")
```

## Contributing

1. Follow Swift style guide
2. Write unit tests cho new features
3. Update documentation
4. Test trên multiple devices
5. Submit Pull Request

## Troubleshooting

### Common Issues
- **Build errors**: Clean build folder (Cmd+Shift+K)
- **Simulator issues**: Reset simulator
- **Core Data errors**: Check data model versions
- **Network issues**: Check Firebase configuration

### Debug Tools
- Xcode Debugger
- Instruments profiling
- Console logs
- Network debugging

## License

Proprietary - NoteFlow Team