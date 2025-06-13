package com.zplus.noteflow.data.repository

import com.zplus.noteflow.data.mock.MockData
import com.zplus.noteflow.data.model.*
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.flowOf
import java.util.*

class MockNoteFlowRepository : NoteFlowRepository {
    
    private val _notes = mutableListOf<Note>().apply {
        addAll(MockData.sampleNotes)
    }
    
    override suspend fun checkHealth(): Result<String> {
        delay(200) // Simulate network delay
        return Result.success("OK")
    }
    
    override suspend fun getCurrentUser(): Result<User> {
        delay(200)
        return Result.success(
            User(
                id = "current-user",
                name = "John Doe",
                email = "john@example.com",
                role = UserRole.MEMBER,
                group = Group(
                    id = "group-1",
                    name = "Example Team",
                    domain = "example.com"
                )
            )
        )
    }
    
    override suspend fun getUsersInGroup(): Result<List<User>> {
        delay(300)
        return Result.success(
            listOf(
                User("user-1", "John Doe", "john@example.com", UserRole.MEMBER),
                User("user-2", "Jane Smith", "jane@example.com", UserRole.ADMIN),
                User("user-3", "Mike Wilson", "mike@example.com", UserRole.MEMBER),
                User("user-4", "Sarah Johnson", "sarah@example.com", UserRole.MEMBER)
            )
        )
    }
    
    override fun getNotesStream(): Flow<List<Note>> = flow {
        while (true) {
            delay(1000) // Emit updates every second
            emit(_notes.toList())
        }
    }
    
    override suspend fun getNotes(): Result<List<Note>> {
        delay(300)
        return Result.success(_notes.toList())
    }
    
    override suspend fun getNotesByType(type: NoteType): Result<List<Note>> {
        delay(300)
        val filteredNotes = _notes.filter { it.type == type }
        return Result.success(filteredNotes)
    }
    
    override suspend fun createNote(title: String, content: String, type: NoteType): Result<Note> {
        delay(500)
        val newNote = Note(
            id = "note-${UUID.randomUUID()}",
            title = title,
            content = content,
            type = type,
            status = NoteStatus.ACTIVE,
            createdAt = Date(),
            updatedAt = Date(),
            creator = User("current-user", "John Doe", "john@example.com", UserRole.MEMBER)
        )
        _notes.add(0, newNote) // Add to beginning
        return Result.success(newNote)
    }
    
    override suspend fun updateNote(
        id: String,
        title: String?,
        content: String?,
        status: NoteStatus?
    ): Result<Note> {
        delay(400)
        val noteIndex = _notes.indexOfFirst { it.id == id }
        if (noteIndex == -1) {
            return Result.failure(Exception("Note not found"))
        }
        
        val originalNote = _notes[noteIndex]
        val updatedNote = originalNote.copy(
            title = title ?: originalNote.title,
            content = content ?: originalNote.content,
            status = status ?: originalNote.status,
            updatedAt = Date()
        )
        
        _notes[noteIndex] = updatedNote
        return Result.success(updatedNote)
    }
    
    override suspend fun deleteNote(id: String): Result<Boolean> {
        delay(300)
        val removed = _notes.removeIf { it.id == id }
        return Result.success(removed)
    }
    
    override suspend fun getCommentsByNote(noteId: String): Result<List<Comment>> {
        delay(200)
        val comments = MockData.sampleComments.filter { it.noteId == noteId }
        return Result.success(comments)
    }
    
    override suspend fun createComment(noteId: String, content: String): Result<Comment> {
        delay(400)
        val newComment = Comment(
            id = "comment-${UUID.randomUUID()}",
            noteId = noteId,
            content = content,
            author = User("current-user", "John Doe", "john@example.com", UserRole.MEMBER),
            createdAt = Date(),
            updatedAt = Date()
        )
        return Result.success(newComment)
    }
}