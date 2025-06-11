# Testing Strategy - NoteFlow

## Tổng quan

Chiến lược testing của NoteFlow được thiết kế để đảm bảo chất lượng sản phẩm ở mọi cấp độ, từ unit testing đến user acceptance testing. Mục tiêu là duy trì code coverage > 80% và bug leakage rate < 5%.

## Testing Pyramid

```
                    ┌─────────────────────┐
                    │   Manual Testing    │ 
                    │   (5% - 10%)        │
                    └─────────────────────┘
                  ┌───────────────────────────┐
                  │    Integration Tests      │
                  │      (20% - 30%)          │
                  └───────────────────────────┘
              ┌─────────────────────────────────────┐
              │           Unit Tests                │
              │          (60% - 70%)                │
              └─────────────────────────────────────┘
```

## Unit Testing

### Backend Testing (Node.js)

#### Frameworks & Tools
```json
{
  "devDependencies": {
    "jest": "^29.0.0",
    "@types/jest": "^29.0.0",
    "supertest": "^6.3.0",
    "ts-jest": "^29.0.0",
    "faker": "^6.6.6"
  }
}
```

#### Test Structure
```javascript
// __tests__/services/noteService.test.js
describe('NoteService', () => {
  describe('createNote', () => {
    it('should create a note with valid data', async () => {
      // Arrange
      const noteData = {
        title: 'Test Note',
        content: 'Test content',
        type: 'note',
        groupId: 'group-123'
      };

      // Act
      const result = await noteService.createNote(noteData);

      // Assert
      expect(result).toMatchObject({
        id: expect.any(String),
        title: 'Test Note',
        content: 'Test content',
        type: 'note'
      });
      expect(result.createdAt).toBeInstanceOf(Date);
    });

    it('should throw error with invalid data', async () => {
      // Arrange
      const invalidData = { title: '' };

      // Act & Assert
      await expect(noteService.createNote(invalidData))
        .rejects
        .toThrow('Title is required');
    });
  });
});
```

#### Database Testing
```javascript
// __tests__/database/noteRepository.test.js
describe('NoteRepository', () => {
  let db;
  
  beforeAll(async () => {
    db = await setupTestDatabase();
  });
  
  afterAll(async () => {
    await teardownTestDatabase(db);
  });
  
  beforeEach(async () => {
    await db.raw('TRUNCATE TABLE notes CASCADE');
  });

  describe('findByGroupId', () => {
    it('should return notes for specific group', async () => {
      // Arrange
      await createTestNote({ groupId: 'group-1', title: 'Note 1' });
      await createTestNote({ groupId: 'group-2', title: 'Note 2' });

      // Act
      const notes = await noteRepository.findByGroupId('group-1');

      // Assert
      expect(notes).toHaveLength(1);
      expect(notes[0].title).toBe('Note 1');
    });
  });
});
```

#### GraphQL Testing
```javascript
// __tests__/graphql/noteResolvers.test.js
describe('Note Resolvers', () => {
  let server;
  
  beforeAll(async () => {
    server = await createTestServer();
  });

  describe('Query.notes', () => {
    it('should return notes for authenticated user', async () => {
      // Arrange
      const user = await createTestUser();
      const token = generateTestToken(user);

      // Act
      const response = await server
        .executeOperation({
          query: `
            query GetNotes {
              notes {
                id
                title
                type
              }
            }
          `,
        }, {
          request: {
            headers: {
              authorization: `Bearer ${token}`
            }
          }
        });

      // Assert
      expect(response.errors).toBeUndefined();
      expect(response.data.notes).toBeInstanceOf(Array);
    });
  });
});
```

### iOS Testing (SwiftUI)

#### Frameworks & Tools
```swift
// Package.swift dependencies
.package(url: "https://github.com/Quick/Quick.git", from: "5.0.0"),
.package(url: "https://github.com/Quick/Nimble.git", from: "10.0.0"),
.package(url: "https://github.com/pointfreeco/swift-snapshot-testing", from: "1.10.0")
```

#### ViewModel Testing
```swift
// Tests/ViewModelTests/NoteListViewModelTests.swift
import Quick
import Nimble
@testable import NoteFlow

class NoteListViewModelSpec: QuickSpec {
    override func spec() {
        describe("NoteListViewModel") {
            var viewModel: NoteListViewModel!
            var mockNoteService: MockNoteService!
            
            beforeEach {
                mockNoteService = MockNoteService()
                viewModel = NoteListViewModel(noteService: mockNoteService)
            }
            
            describe("loadNotes") {
                context("when service returns notes") {
                    beforeEach {
                        mockNoteService.notesToReturn = [
                            Note(id: "1", title: "Test Note", content: "Content", type: .note)
                        ]
                    }
                    
                    it("should update notes array") {
                        // Act
                        viewModel.loadNotes()
                        
                        // Assert
                        expect(viewModel.notes).to(haveCount(1))
                        expect(viewModel.notes.first?.title).to(equal("Test Note"))
                    }
                }
                
                context("when service fails") {
                    beforeEach {
                        mockNoteService.shouldFail = true
                    }
                    
                    it("should set error state") {
                        // Act
                        viewModel.loadNotes()
                        
                        // Assert
                        expect(viewModel.isError).to(beTrue())
                        expect(viewModel.errorMessage).toNot(beNil())
                    }
                }
            }
        }
    }
}
```

#### UI Testing with Snapshot Tests
```swift
// Tests/SnapshotTests/NoteCardSnapshotTests.swift
import SnapshotTesting
import SwiftUI
@testable import NoteFlow

class NoteCardSnapshotTests: XCTestCase {
    func testNoteCardAppearance() {
        let note = Note(
            id: "1",
            title: "Sample Note",
            content: "This is a sample note content for testing",
            type: .note,
            createdAt: Date()
        )
        
        let noteCard = NoteCard(note: note)
            .frame(width: 350, height: 200)
        
        assertSnapshot(matching: noteCard, as: .image)
    }
    
    func testNoteCardDarkMode() {
        let note = Note(
            id: "1", 
            title: "Dark Mode Note", 
            content: "Testing dark mode", 
            type: .task
        )
        
        let noteCard = NoteCard(note: note)
            .frame(width: 350, height: 200)
            .preferredColorScheme(.dark)
        
        assertSnapshot(matching: noteCard, as: .image)
    }
}
```

### Android Testing (Jetpack Compose)

#### Frameworks & Tools
```kotlin
// build.gradle dependencies
testImplementation 'junit:junit:4.13.2'
testImplementation 'org.mockito:mockito-core:4.6.1'
testImplementation 'org.mockito.kotlin:mockito-kotlin:4.0.0'
testImplementation 'org.jetbrains.kotlinx:kotlinx-coroutines-test:1.6.4'
androidTestImplementation 'androidx.compose.ui:ui-test-junit4:1.3.0'
androidTestImplementation 'androidx.test.ext:junit:1.1.4'
```

#### ViewModel Testing
```kotlin
// test/java/com/noteflow/viewmodel/NoteListViewModelTest.kt
@ExperimentalCoroutinesApi
class NoteListViewModelTest {
    @get:Rule
    val mainDispatcherRule = MainDispatcherRule()
    
    private lateinit var viewModel: NoteListViewModel
    private lateinit var mockNoteRepository: NoteRepository
    
    @Before
    fun setup() {
        mockNoteRepository = mockk()
        viewModel = NoteListViewModel(mockNoteRepository)
    }
    
    @Test
    fun `loadNotes should update uiState with notes`() = runTest {
        // Arrange
        val notes = listOf(
            Note(id = "1", title = "Test Note", content = "Content", type = NoteType.NOTE)
        )
        coEvery { mockNoteRepository.getNotes() } returns flow { emit(notes) }
        
        // Act
        viewModel.loadNotes()
        
        // Assert
        val uiState = viewModel.uiState.value
        assertThat(uiState.notes).isEqualTo(notes)
        assertThat(uiState.isLoading).isFalse()
    }
    
    @Test
    fun `loadNotes should handle error`() = runTest {
        // Arrange
        coEvery { mockNoteRepository.getNotes() } throws Exception("Network error")
        
        // Act
        viewModel.loadNotes()
        
        // Assert
        val uiState = viewModel.uiState.value
        assertThat(uiState.errorMessage).isNotNull()
        assertThat(uiState.isLoading).isFalse()
    }
}
```

#### Compose UI Testing
```kotlin
// androidTest/java/com/noteflow/ui/NoteListScreenTest.kt
@OptIn(ExperimentalComposeUiApi::class)
class NoteListScreenTest {
    @get:Rule
    val composeTestRule = createComposeRule()
    
    @Test
    fun noteListScreen_displaysNotes() {
        // Arrange
        val notes = listOf(
            Note(id = "1", title = "Note 1", content = "Content 1", type = NoteType.NOTE),
            Note(id = "2", title = "Note 2", content = "Content 2", type = NoteType.TASK)
        )
        
        // Act
        composeTestRule.setContent {
            NoteListScreen(
                uiState = NoteListUiState(notes = notes),
                onNoteClick = {},
                onCreateNote = {}
            )
        }
        
        // Assert
        composeTestRule.onNodeWithText("Note 1").assertIsDisplayed()
        composeTestRule.onNodeWithText("Note 2").assertIsDisplayed()
    }
    
    @Test
    fun noteListScreen_showsEmptyState() {
        // Act
        composeTestRule.setContent {
            NoteListScreen(
                uiState = NoteListUiState(notes = emptyList()),
                onNoteClick = {},
                onCreateNote = {}
            )
        }
        
        // Assert
        composeTestRule.onNodeWithText("No notes yet").assertIsDisplayed()
        composeTestRule.onNodeWithText("Create your first note").assertIsDisplayed()
    }
}
```

## Integration Testing

### API Integration Testing
```javascript
// __tests__/integration/noteFlow.test.js
describe('Note Flow Integration', () => {
  let app;
  let user;
  let authToken;
  
  beforeAll(async () => {
    app = await createTestApp();
    user = await createTestUser();
    authToken = await generateAuthToken(user);
  });

  describe('Complete note workflow', () => {
    it('should create, update, and delete a note', async () => {
      // Create note
      const createResponse = await request(app)
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            mutation CreateNote($input: CreateNoteInput!) {
              createNote(input: $input) {
                id
                title
                content
              }
            }
          `,
          variables: {
            input: {
              title: 'Integration Test Note',
              content: 'This is a test note',
              type: 'note'
            }
          }
        });

      expect(createResponse.status).toBe(200);
      const noteId = createResponse.body.data.createNote.id;

      // Update note
      const updateResponse = await request(app)
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            mutation UpdateNote($id: ID!, $input: UpdateNoteInput!) {
              updateNote(id: $id, input: $input) {
                id
                title
                content
              }
            }
          `,
          variables: {
            id: noteId,
            input: {
              title: 'Updated Test Note',
              content: 'Updated content'
            }
          }
        });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.data.updateNote.title).toBe('Updated Test Note');

      // Delete note
      const deleteResponse = await request(app)
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            mutation DeleteNote($id: ID!) {
              deleteNote(id: $id)
            }
          `,
          variables: { id: noteId }
        });

      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body.data.deleteNote).toBe(true);
    });
  });
});
```

### Database Integration Testing
```javascript
// __tests__/integration/sync.test.js
describe('Offline Sync Integration', () => {
  let db;
  let syncService;
  
  beforeAll(async () => {
    db = await setupTestDatabase();
    syncService = new SyncService(db);
  });

  describe('Conflict resolution', () => {
    it('should resolve conflicts with last-write-wins strategy', async () => {
      // Arrange
      const baseNote = await createNote({
        id: 'note-123',
        title: 'Original Title',
        content: 'Original content',
        version: 1
      });

      const clientUpdate = {
        id: 'note-123',
        title: 'Client Update',
        content: 'Updated by client',
        version: 1
      };

      const serverUpdate = {
        id: 'note-123',
        title: 'Server Update',
        content: 'Updated by server',
        version: 2
      };

      // Act
      const result = await syncService.resolveMergeConflict(
        clientUpdate,
        serverUpdate
      );

      // Assert
      expect(result.resolution).toBe('server-wins');
      expect(result.data.title).toBe('Server Update');
      expect(result.data.version).toBe(3);
    });
  });
});
```

### Mobile Integration Testing

#### iOS Integration Tests
```swift
// Tests/IntegrationTests/SyncIntegrationTests.swift
class SyncIntegrationTests: XCTestCase {
    var coreDataStack: CoreDataStack!
    var syncService: SyncService!
    
    override func setUp() {
        super.setUp()
        coreDataStack = CoreDataStack(inMemory: true)
        syncService = SyncService(coreDataStack: coreDataStack)
    }
    
    func testOfflineToOnlineSync() async {
        // Arrange
        let note = Note(context: coreDataStack.context)
        note.id = UUID().uuidString
        note.title = "Offline Note"
        note.content = "Created while offline"
        note.isLocalOnly = true
        
        try! coreDataStack.context.save()
        
        // Act
        let syncResult = await syncService.syncPendingChanges()
        
        // Assert
        XCTAssertTrue(syncResult.success)
        XCTAssertFalse(note.isLocalOnly)
        XCTAssertNotNil(note.serverVersion)
    }
}
```

#### Android Integration Tests
```kotlin
// androidTest/java/com/noteflow/sync/SyncIntegrationTest.kt
@RunWith(AndroidJUnit4::class)
class SyncIntegrationTest {
    @get:Rule
    val instantExecutorRule = InstantTaskExecutorRule()
    
    private lateinit var database: NoteFlowDatabase
    private lateinit var syncService: SyncService
    
    @Before
    fun setup() {
        database = Room.inMemoryDatabaseBuilder(
            ApplicationProvider.getApplicationContext(),
            NoteFlowDatabase::class.java
        ).build()
        
        syncService = SyncService(database.noteDao(), apiService)
    }
    
    @Test
    fun syncOfflineChanges_shouldUploadLocalNotes() = runTest {
        // Arrange
        val localNote = Note(
            id = "local-123",
            title = "Offline Note",
            content = "Created offline",
            isLocalOnly = true
        )
        database.noteDao().insert(localNote)
        
        // Act
        val result = syncService.syncPendingChanges()
        
        // Assert
        assertThat(result.success).isTrue()
        val syncedNote = database.noteDao().getById("local-123")
        assertThat(syncedNote?.isLocalOnly).isFalse()
    }
}
```

## End-to-End Testing

### Web E2E Testing (Playwright)

#### Setup
```javascript
// playwright.config.js
module.exports = {
  testDir: './e2e',
  timeout: 30000,
  retries: 2,
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'mobile',
      use: { ...devices['iPhone 12'] }
    }
  ]
};
```

#### Test Examples
```javascript
// e2e/note-management.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Note Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid=email]', 'test@example.com');
    await page.fill('[data-testid=password]', 'password123');
    await page.click('[data-testid=login-button]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should create a new note', async ({ page }) => {
    // Click create note button
    await page.click('[data-testid=create-note-button]');
    
    // Fill note form
    await page.fill('[data-testid=note-title]', 'E2E Test Note');
    await page.fill('[data-testid=note-content]', 'This is a test note created by E2E test');
    await page.selectOption('[data-testid=note-type]', 'note');
    
    // Save note
    await page.click('[data-testid=save-note-button]');
    
    // Verify note appears in list
    await expect(page.locator('[data-testid=note-list]')).toContainText('E2E Test Note');
  });

  test('should edit existing note', async ({ page }) => {
    // Create a note first
    await createTestNote(page, 'Original Title', 'Original content');
    
    // Click on note to edit
    await page.click('[data-testid=note-item]:has-text("Original Title")');
    
    // Edit title
    await page.fill('[data-testid=note-title]', 'Updated Title');
    await page.click('[data-testid=save-note-button]');
    
    // Verify update
    await expect(page.locator('[data-testid=note-list]')).toContainText('Updated Title');
    await expect(page.locator('[data-testid=note-list]')).not.toContainText('Original Title');
  });
});
```

### Mobile E2E Testing

#### iOS E2E (XCUITest)
```swift
// UITests/NoteFlowUITests.swift
class NoteFlowUITests: XCTestCase {
    var app: XCUIApplication!
    
    override func setUp() {
        super.setUp()
        app = XCUIApplication()
        app.launchArguments = ["--uitesting"]
        app.launch()
    }
    
    func testCreateNote() {
        // Navigate to login
        app.buttons["Get Started"].tap()
        
        // Login
        app.textFields["Email"].tap()
        app.textFields["Email"].typeText("test@example.com")
        app.secureTextFields["Password"].tap()
        app.secureTextFields["Password"].typeText("password123")
        app.buttons["Login"].tap()
        
        // Wait for home screen
        XCTAssertTrue(app.navigationBars["Notes"].waitForExistence(timeout: 5))
        
        // Create note
        app.buttons["Add Note"].tap()
        app.textFields["Title"].typeText("UI Test Note")
        app.textViews["Content"].tap()
        app.textViews["Content"].typeText("This note was created by UI test")
        app.buttons["Save"].tap()
        
        // Verify note appears
        XCTAssertTrue(app.cells.containing(.staticText, identifier: "UI Test Note").element.exists)
    }
    
    func testOfflineCreation() {
        // Login first
        performLogin()
        
        // Disable network
        app.buttons["Settings"].tap()
        app.switches["Offline Mode"].tap()
        app.buttons["Done"].tap()
        
        // Create note while offline
        app.buttons["Add Note"].tap()
        app.textFields["Title"].typeText("Offline Note")
        app.buttons["Save"].tap()
        
        // Verify note exists with offline indicator
        let offlineNote = app.cells.containing(.staticText, identifier: "Offline Note").element
        XCTAssertTrue(offlineNote.exists)
        XCTAssertTrue(offlineNote.images["offline-icon"].exists)
    }
}
```

#### Android E2E (Espresso)
```kotlin
// androidTest/java/com/noteflow/ui/NoteFlowE2ETest.kt
@LargeTest
@RunWith(AndroidJUnit4::class)
class NoteFlowE2ETest {
    @get:Rule
    val activityRule = ActivityScenarioRule(MainActivity::class.java)
    
    @Test
    fun createAndEditNote() {
        // Login
        onView(withId(R.id.email_input))
            .perform(typeText("test@example.com"), closeSoftKeyboard())
        onView(withId(R.id.password_input))
            .perform(typeText("password123"), closeSoftKeyboard())
        onView(withId(R.id.login_button)).perform(click())
        
        // Wait for home screen
        onView(withId(R.id.notes_recycler_view))
            .check(matches(isDisplayed()))
        
        // Create note
        onView(withId(R.id.fab_add_note)).perform(click())
        onView(withId(R.id.title_input))
            .perform(typeText("E2E Test Note"))
        onView(withId(R.id.content_input))
            .perform(typeText("Content created by E2E test"))
        onView(withId(R.id.save_button)).perform(click())
        
        // Verify note appears
        onView(withText("E2E Test Note"))
            .check(matches(isDisplayed()))
        
        // Edit note
        onView(withText("E2E Test Note")).perform(click())
        onView(withId(R.id.title_input)).perform(
            clearText(),
            typeText("Updated E2E Note")
        )
        onView(withId(R.id.save_button)).perform(click())
        
        // Verify update
        onView(withText("Updated E2E Note"))
            .check(matches(isDisplayed()))
    }
}
```

## Performance Testing

### Load Testing
```javascript
// performance/load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up
    { duration: '5m', target: 100 }, // Sustained load
    { duration: '2m', target: 200 }, // Peak load
    { duration: '5m', target: 200 }, // Peak sustained
    { duration: '2m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests under 500ms
    http_req_failed: ['rate<0.05'],   // Error rate under 5%
  },
};

const BASE_URL = 'https://api.noteflow.app';

export function setup() {
  // Login and get auth token
  const loginResponse = http.post(`${BASE_URL}/auth/login`, {
    email: 'loadtest@example.com',
    password: 'password123'
  });
  
  return { authToken: loginResponse.json('token') };
}

export default function(data) {
  const headers = {
    'Authorization': `Bearer ${data.authToken}`,
    'Content-Type': 'application/json'
  };

  // Test note creation
  const createResponse = http.post(`${BASE_URL}/graphql`, JSON.stringify({
    query: `
      mutation CreateNote($input: CreateNoteInput!) {
        createNote(input: $input) {
          id
          title
        }
      }
    `,
    variables: {
      input: {
        title: `Load Test Note ${Date.now()}`,
        content: 'Generated by load test',
        type: 'note'
      }
    }
  }), { headers });

  check(createResponse, {
    'create note status is 200': (r) => r.status === 200,
    'create note has data': (r) => r.json('data.createNote.id') !== null,
  });

  sleep(1);

  // Test note listing
  const listResponse = http.post(`${BASE_URL}/graphql`, JSON.stringify({
    query: `
      query GetNotes {
        notes(limit: 20) {
          id
          title
          type
          createdAt
        }
      }
    `
  }), { headers });

  check(listResponse, {
    'list notes status is 200': (r) => r.status === 200,
    'list notes returns array': (r) => Array.isArray(r.json('data.notes')),
  });

  sleep(1);
}
```

### Mobile Performance Testing
```swift
// Performance/MobilePerformanceTests.swift
class MobilePerformanceTests: XCTestCase {
    func testNoteListScrollingPerformance() {
        let app = XCUIApplication()
        app.launch()
        
        // Login and navigate to notes list
        performLogin(app: app)
        
        let notesList = app.tables["NotesList"]
        
        // Measure scrolling performance
        let scrollOptions = XCTMeasureOptions()
        scrollOptions.iterationCount = 10
        
        measure(metrics: [XCTClockMetric(), XCTCPUMetric()], options: scrollOptions) {
            notesList.swipeUp()
            notesList.swipeDown()
        }
    }
    
    func testNoteCreationPerformance() {
        let app = XCUIApplication()
        app.launch()
        
        performLogin(app: app)
        
        measure(metrics: [XCTClockMetric()]) {
            app.buttons["Add Note"].tap()
            app.textFields["Title"].typeText("Performance Test Note")
            app.textViews["Content"].typeText("This is a performance test note with some content")
            app.buttons["Save"].tap()
            
            // Wait for note to appear in list
            XCTAssertTrue(app.cells.containing(.staticText, identifier: "Performance Test Note").element.waitForExistence(timeout: 2))
        }
    }
}
```

## Test Data Management

### Test Data Factory
```javascript
// __tests__/factories/noteFactory.js
const { faker } = require('faker');

class NoteFactory {
  static build(overrides = {}) {
    return {
      id: faker.datatype.uuid(),
      title: faker.lorem.words(3),
      content: faker.lorem.paragraphs(2),
      type: faker.helpers.arrayElement(['note', 'task', 'issue']),
      status: 'open',
      priority: faker.helpers.arrayElement(['low', 'medium', 'high']),
      tags: faker.lorem.words(2).split(' '),
      createdAt: faker.date.recent(),
      updatedAt: faker.date.recent(),
      ...overrides
    };
  }

  static buildMany(count, overrides = {}) {
    return Array.from({ length: count }, () => this.build(overrides));
  }

  static buildTask(overrides = {}) {
    return this.build({
      type: 'task',
      status: faker.helpers.arrayElement(['todo', 'in_progress', 'done']),
      deadline: faker.date.future(),
      estimatedTime: faker.datatype.number({ min: 1, max: 40 }),
      ...overrides
    });
  }

  static buildIssue(overrides = {}) {
    return this.build({
      type: 'issue',
      severity: faker.helpers.arrayElement(['low', 'medium', 'critical']),
      status: faker.helpers.arrayElement(['open', 'in_progress', 'resolved', 'closed']),
      ...overrides
    });
  }
}

module.exports = { NoteFactory };
```

### Database Seeding
```javascript
// __tests__/helpers/seedData.js
const { NoteFactory } = require('../factories/noteFactory');
const { UserFactory } = require('../factories/userFactory');

async function seedTestData(db) {
  // Create test users
  const users = await Promise.all([
    UserFactory.build({ email: 'user1@test.com', role: 'admin' }),
    UserFactory.build({ email: 'user2@test.com', role: 'member' }),
    UserFactory.build({ email: 'user3@test.com', role: 'member' })
  ].map(user => db.users.create(user)));

  // Create test group
  const group = await db.groups.create({
    name: 'Test Group',
    domain: 'test.com'
  });

  // Associate users with group
  await Promise.all(users.map(user => 
    db.users.update(user.id, { groupId: group.id })
  ));

  // Create test notes
  const notes = await Promise.all([
    ...NoteFactory.buildMany(10, { groupId: group.id, creatorId: users[0].id }),
    ...NoteFactory.buildMany(5, { type: 'task', groupId: group.id, creatorId: users[1].id }),
    ...NoteFactory.buildMany(3, { type: 'issue', groupId: group.id, creatorId: users[2].id })
  ].map(note => db.notes.create(note)));

  return { users, group, notes };
}

module.exports = { seedTestData };
```

## Continuous Integration

### GitHub Actions Workflow
```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: noteflow_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
    - uses: actions/checkout@v3
    
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: backend/package-lock.json
    
    - name: Install dependencies
      run: |
        cd backend
        npm ci
    
    - name: Run tests
      run: |
        cd backend
        npm run test:unit
        npm run test:integration
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/noteflow_test
        NODE_ENV: test
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        file: backend/coverage/lcov.info

  ios-tests:
    runs-on: macos-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Xcode
      uses: maxim-lobanov/setup-xcode@v1
      with:
        xcode-version: '14.2'
    
    - name: Run iOS tests
      run: |
        cd app_ios
        xcodebuild test \
          -scheme NoteFlow \
          -destination 'platform=iOS Simulator,name=iPhone 14,OS=16.2' \
          -enableCodeCoverage YES

  android-tests:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - uses: actions/setup-java@v3
      with:
        distribution: 'temurin'
        java-version: '11'
    
    - name: Setup Android SDK
      uses: android-actions/setup-android@v2
    
    - name: Run Android tests
      run: |
        cd app_android
        ./gradlew test
        ./gradlew connectedAndroidTest

  e2e-tests:
    runs-on: ubuntu-latest
    needs: [backend-tests]
    
    steps:
    - uses: actions/checkout@v3
    
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Start test environment
      run: |
        docker-compose -f docker-compose.test.yml up -d
        npm run wait-for-services
    
    - name: Run E2E tests
      run: npx playwright test
    
    - name: Upload test results
      uses: actions/upload-artifact@v3
      if: failure()
      with:
        name: playwright-report
        path: playwright-report/
```

## Test Metrics & Reporting

### Coverage Goals
- **Backend**: > 85% line coverage
- **iOS**: > 80% line coverage  
- **Android**: > 80% line coverage
- **E2E**: > 70% user journey coverage

### Quality Gates
- All unit tests must pass
- Integration tests must pass
- No critical security vulnerabilities
- Performance benchmarks must be met
- Accessibility tests must pass

### Reporting Dashboard
```javascript
// test-report.js
const coverage = require('./coverage/coverage-summary.json');
const testResults = require('./test-results.json');

const report = {
  timestamp: new Date().toISOString(),
  coverage: {
    statements: coverage.total.statements.pct,
    branches: coverage.total.branches.pct,
    functions: coverage.total.functions.pct,
    lines: coverage.total.lines.pct
  },
  tests: {
    total: testResults.numTotalTests,
    passed: testResults.numPassedTests,
    failed: testResults.numFailedTests,
    skipped: testResults.numPendingTests
  },
  performance: {
    averageResponseTime: testResults.averageResponseTime,
    p95ResponseTime: testResults.p95ResponseTime,
    errorRate: testResults.errorRate
  }
};

console.log(JSON.stringify(report, null, 2));
```

## Debugging & Troubleshooting

### Test Debugging Tools
```javascript
// __tests__/helpers/debugger.js
const debug = require('debug')('test:debug');

class TestDebugger {
  static logRequest(request) {
    debug('Request:', {
      method: request.method,
      url: request.url,
      headers: request.headers,
      body: request.body
    });
  }

  static logResponse(response) {
    debug('Response:', {
      status: response.status,
      headers: response.headers,
      body: response.body
    });
  }

  static logDatabaseState(tables) {
    debug('Database state:', tables);
  }

  static takeScreenshot(page, name) {
    if (process.env.DEBUG_TESTS) {
      return page.screenshot({ 
        path: `debug-screenshots/${name}-${Date.now()}.png` 
      });
    }
  }
}

module.exports = { TestDebugger };
```

### Failed Test Analysis
```bash
#!/bin/bash
# scripts/analyze-failed-tests.sh

echo "Analyzing failed tests..."

# Parse test results
failed_tests=$(jq '.testResults[] | select(.status == "failed") | .ancestorTitles + [.title] | join(" > ")' test-results.json)

echo "Failed tests:"
echo "$failed_tests"

# Check for common issues
if grep -q "timeout" test-results.json; then
  echo "⚠️  Timeout issues detected"
fi

if grep -q "network" test-results.json; then
  echo "⚠️  Network-related failures detected"
fi

if grep -q "database" test-results.json; then
  echo "⚠️  Database-related failures detected"
fi

# Generate flaky test report
echo "Checking for flaky tests..."
node scripts/analyze-flaky-tests.js
```