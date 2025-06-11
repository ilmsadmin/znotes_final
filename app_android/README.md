# Android App - NoteFlow

Ứng dụng Android cho NoteFlow được xây dựng bằng Jetpack Compose, tuân thủ Material Design 3 và hỗ trợ offline-first architecture.

## Yêu cầu hệ thống

- **Android**: 7.0 (API level 24)+
- **Target SDK**: Android 13 (API level 33)
- **Android Studio**: Flamingo (2022.2.1)+
- **Kotlin**: 1.8.0+
- **JDK**: 11+

## Công nghệ sử dụng

- **UI Framework**: Jetpack Compose
- **Architecture**: MVVM + Clean Architecture
- **DI**: Hilt (Dagger)
- **Local Database**: Room + SQLite
- **Networking**: Retrofit + OkHttp
- **Image Loading**: Coil
- **Authentication**: Firebase Auth
- **Push Notifications**: Firebase Cloud Messaging
- **Reactive Programming**: Coroutines + Flow

## Cấu trúc dự án

```
app_android/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/noteflow/
│   │   │   │   ├── ui/                    # UI components
│   │   │   │   │   ├── auth/              # Authentication screens
│   │   │   │   │   ├── home/              # Dashboard
│   │   │   │   │   ├── notes/             # Note management
│   │   │   │   │   ├── tasks/             # Task management
│   │   │   │   │   ├── issues/            # Issue tracking
│   │   │   │   │   ├── settings/          # Settings screens
│   │   │   │   │   └── common/            # Shared UI components
│   │   │   │   ├── viewmodel/             # ViewModels
│   │   │   │   ├── data/                  # Data layer
│   │   │   │   │   ├── local/             # Room database
│   │   │   │   │   ├── remote/            # API services
│   │   │   │   │   └── repository/        # Repository pattern
│   │   │   │   ├── domain/                # Business logic
│   │   │   │   │   ├── usecase/           # Use cases
│   │   │   │   │   └── model/             # Domain models
│   │   │   │   ├── di/                    # Dependency injection
│   │   │   │   └── utils/                 # Utility classes
│   │   │   └── res/                       # Resources
│   │   ├── test/                          # Unit tests
│   │   └── androidTest/                   # Instrumented tests
│   ├── build.gradle                       # App-level build config
│   └── proguard-rules.pro                # ProGuard rules
├── buildSrc/                              # Build configuration
├── gradle/                                # Gradle wrapper
└── build.gradle                           # Project-level build config
```

## Tính năng chính

### Material Design 3
- Dynamic theming
- Material You color scheme
- Motion animations
- Adaptive layouts

### Authentication
- Firebase Auth integration
- Biometric authentication
- Secure token storage
- Auto-login functionality

### Note Management
- Rich text editing
- File attachments
- Tag system
- Search functionality
- Export capabilities

### Offline Support
- Room database
- Sync queue management
- Conflict resolution
- Smart synchronization

### Team Features
- Real-time collaboration
- Comment system
- File sharing
- Assignment management

## Cài đặt môi trường phát triển

### Prerequisites
- Android Studio Flamingo+
- JDK 11+
- Android SDK 33+
- Git

### Setup project
```bash
git clone <repository-url>
cd app_android
```

### Cấu hình Firebase
1. Tạo project trên Firebase Console
2. Tải `google-services.json`
3. Đặt file vào `app/` directory
4. Sync project

### Build project
```bash
./gradlew build
```

### Run trên emulator/device
```bash
./gradlew installDebug
```

## Dependencies

### Core Dependencies
```kotlin
dependencies {
    // Jetpack Compose
    implementation "androidx.compose.ui:ui:$compose_version"
    implementation "androidx.compose.ui:ui-tooling-preview:$compose_version"
    implementation "androidx.compose.material3:material3:$material3_version"
    implementation "androidx.activity:activity-compose:$activity_compose_version"
    
    // Architecture Components
    implementation "androidx.lifecycle:lifecycle-viewmodel-compose:$lifecycle_version"
    implementation "androidx.navigation:navigation-compose:$navigation_version"
    
    // Hilt
    implementation "com.google.dagger:hilt-android:$hilt_version"
    kapt "com.google.dagger:hilt-compiler:$hilt_version"
    
    // Room
    implementation "androidx.room:room-runtime:$room_version"
    implementation "androidx.room:room-ktx:$room_version"
    kapt "androidx.room:room-compiler:$room_version"
    
    // Networking
    implementation "com.squareup.retrofit2:retrofit:$retrofit_version"
    implementation "com.squareup.retrofit2:converter-gson:$retrofit_version"
    implementation "com.squareup.okhttp3:logging-interceptor:$okhttp_version"
    
    // Firebase
    implementation platform("com.google.firebase:firebase-bom:$firebase_bom_version")
    implementation "com.google.firebase:firebase-auth-ktx"
    implementation "com.google.firebase:firebase-messaging-ktx"
    implementation "com.google.firebase:firebase-analytics-ktx"
    
    // Image Loading
    implementation "io.coil-kt:coil-compose:$coil_version"
    
    // Coroutines
    implementation "org.jetbrains.kotlinx:kotlinx-coroutines-android:$coroutines_version"
}
```

## Architecture

### Clean Architecture Layers

#### Presentation Layer
```kotlin
// ViewModel example
@HiltViewModel
class NoteListViewModel @Inject constructor(
    private val getNoteUseCase: GetNotesUseCase,
    private val createNoteUseCase: CreateNoteUseCase
) : ViewModel() {
    
    private val _uiState = MutableStateFlow(NoteListUiState())
    val uiState: StateFlow<NoteListUiState> = _uiState.asStateFlow()
    
    fun loadNotes() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)
            try {
                getNoteUseCase().collect { notes ->
                    _uiState.value = _uiState.value.copy(
                        notes = notes,
                        isLoading = false
                    )
                }
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    errorMessage = e.message
                )
            }
        }
    }
}

// Compose Screen
@Composable
fun NoteListScreen(
    viewModel: NoteListViewModel = hiltViewModel(),
    onNoteClick: (Note) -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()
    
    LazyColumn {
        items(uiState.notes) { note ->
            NoteItem(
                note = note,
                onClick = { onNoteClick(note) }
            )
        }
    }
}
```

#### Domain Layer
```kotlin
// Use Case example
class GetNotesUseCase @Inject constructor(
    private val noteRepository: NoteRepository
) {
    operator fun invoke(): Flow<List<Note>> {
        return noteRepository.getAllNotes()
    }
}

// Domain Model
data class Note(
    val id: String,
    val title: String,
    val content: String,
    val type: NoteType,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)
```

#### Data Layer
```kotlin
// Repository Implementation
@Singleton
class NoteRepositoryImpl @Inject constructor(
    private val localDataSource: NoteLocalDataSource,
    private val remoteDataSource: NoteRemoteDataSource,
    private val syncManager: SyncManager
) : NoteRepository {
    
    override fun getAllNotes(): Flow<List<Note>> {
        return localDataSource.getAllNotes()
            .map { entities -> entities.map { it.toDomainModel() } }
    }
    
    override suspend fun createNote(note: Note): Result<Note> {
        return try {
            // Save locally first
            val localNote = localDataSource.insertNote(note.toEntity())
            
            // Try to sync with server
            if (networkManager.isConnected()) {
                syncManager.syncNote(localNote)
            }
            
            Result.success(localNote.toDomainModel())
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
```

### Room Database
```kotlin
// Entity
@Entity(tableName = "notes")
data class NoteEntity(
    @PrimaryKey val id: String,
    val title: String,
    val content: String,
    val type: String,
    val createdAt: Long,
    val updatedAt: Long,
    val isLocalOnly: Boolean = false
)

// DAO
@Dao
interface NoteDao {
    @Query("SELECT * FROM notes ORDER BY updatedAt DESC")
    fun getAllNotes(): Flow<List<NoteEntity>>
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertNote(note: NoteEntity): Long
    
    @Update
    suspend fun updateNote(note: NoteEntity)
    
    @Delete
    suspend fun deleteNote(note: NoteEntity)
}

// Database
@Database(
    entities = [NoteEntity::class],
    version = 1,
    exportSchema = false
)
@TypeConverters(Converters::class)
abstract class NoteFlowDatabase : RoomDatabase() {
    abstract fun noteDao(): NoteDao
}
```

## Testing

### Unit Tests
```kotlin
@ExtendWith(MockitoExtension::class)
class NoteListViewModelTest {
    
    @Mock
    private lateinit var getNoteUseCase: GetNotesUseCase
    
    @Mock
    private lateinit var createNoteUseCase: CreateNoteUseCase
    
    private lateinit var viewModel: NoteListViewModel
    
    @Before
    fun setup() {
        viewModel = NoteListViewModel(getNoteUseCase, createNoteUseCase)
    }
    
    @Test
    fun `loadNotes should update uiState with notes`() = runTest {
        // Given
        val notes = listOf(
            Note(id = "1", title = "Test Note", content = "Content", type = NoteType.NOTE)
        )
        whenever(getNoteUseCase()).thenReturn(flowOf(notes))
        
        // When
        viewModel.loadNotes()
        
        // Then
        assertEquals(notes, viewModel.uiState.value.notes)
        assertFalse(viewModel.uiState.value.isLoading)
    }
}
```

### UI Tests
```kotlin
@HiltAndroidTest
class NoteListScreenTest {
    
    @get:Rule
    val composeTestRule = createAndroidComposeRule<MainActivity>()
    
    @Test
    fun noteListScreen_displaysNotes() {
        // Given
        val notes = listOf(
            Note(id = "1", title = "Test Note", content = "Content", type = NoteType.NOTE)
        )
        
        // When
        composeTestRule.setContent {
            NoteListScreen(
                notes = notes,
                onNoteClick = {}
            )
        }
        
        // Then
        composeTestRule.onNodeWithText("Test Note").assertIsDisplayed()
    }
}
```

## Build Configuration

### Build Types
```kotlin
android {
    buildTypes {
        debug {
            applicationIdSuffix ".debug"
            debuggable true
            buildConfigField "String", "BASE_URL", "\"https://staging-api.noteflow.app\""
        }
        
        release {
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
            buildConfigField "String", "BASE_URL", "\"https://api.noteflow.app\""
        }
    }
}
```

### ProGuard Rules
```proguard
# Keep Firebase
-keep class com.google.firebase.** { *; }

# Keep Room
-keep class * extends androidx.room.RoomDatabase
-keep @androidx.room.Entity class *

# Keep Retrofit models
-keep class com.noteflow.data.remote.dto.** { *; }
```

## Performance

### Optimization
- Lazy loading với Paging 3
- Image caching với Coil
- Database indexing
- Background processing với WorkManager

### Monitoring
- Firebase Performance
- Firebase Crashlytics
- Custom metrics
- ANR tracking

## Security

### Best Practices
- Certificate pinning
- Encrypted SharedPreferences
- Biometric authentication
- Root detection
- Code obfuscation

### Implementation
```kotlin
// Secure Storage
@Singleton
class SecureStorage @Inject constructor(
    @ApplicationContext private val context: Context
) {
    private val sharedPreferences = EncryptedSharedPreferences.create(
        "secure_prefs",
        MasterKey.Builder(context)
            .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
            .build(),
        context,
        EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
        EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
    )
    
    fun saveToken(token: String) {
        sharedPreferences.edit()
            .putString("auth_token", token)
            .apply()
    }
}
```

## Deployment

### Debug Build
```bash
./gradlew assembleDebug
```

### Release Build
```bash
./gradlew assembleRelease
```

### Upload to Play Store
```bash
./gradlew publishReleaseBundle
```

## CI/CD

### GitHub Actions
```yaml
name: Android CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up JDK 11
      uses: actions/setup-java@v3
      with:
        java-version: '11'
        distribution: 'temurin'
    
    - name: Grant execute permission for gradlew
      run: chmod +x gradlew
    
    - name: Run tests
      run: ./gradlew test
    
    - name: Build APK
      run: ./gradlew assembleDebug
```

## Troubleshooting

### Common Issues
- **Build errors**: Clean and rebuild
- **Firebase issues**: Check google-services.json
- **Room migration**: Update database version
- **Compose preview**: Invalidate caches

### Debug Tools
- Layout Inspector
- Database Inspector
- Network Profiler
- Memory Profiler

## Contributing

1. Follow Kotlin coding standards
2. Write tests cho new features
3. Update documentation
4. Test trên multiple devices và Android versions
5. Submit Pull Request với clear description

## License

Proprietary - NoteFlow Team