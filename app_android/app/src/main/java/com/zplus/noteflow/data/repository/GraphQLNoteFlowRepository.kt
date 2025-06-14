package com.zplus.noteflow.data.repository

import com.zplus.noteflow.data.model.*
import com.zplus.noteflow.data.remote.CreateCommentInput
import com.zplus.noteflow.data.remote.CreateNoteInput
import com.zplus.noteflow.data.remote.NoteFlowApiService
import com.zplus.noteflow.data.remote.UpdateNoteInput
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow

class GraphQLNoteFlowRepository(
    private val apiService: NoteFlowApiService
) : NoteFlowRepository {
    
    override suspend fun checkHealth(): Result<String> {
        return apiService.checkHealth()
    }
    
    override suspend fun getCurrentUser(): Result<User> {
        return apiService.getCurrentUser()
    }
    
    override suspend fun getUsersInGroup(): Result<List<User>> {
        return apiService.getUsersInGroup()
    }
    
    override fun getNotesStream(): Flow<List<Note>> = flow {
        while (true) {
            val result = apiService.getNotes()
            result.onSuccess { notes ->
                emit(notes)
            }
            kotlinx.coroutines.delay(5000) // Refresh every 5 seconds
        }
    }
    
    override suspend fun getNotes(): Result<List<Note>> {
        return apiService.getNotes()
    }
    
    override suspend fun getNotesByType(type: NoteType): Result<List<Note>> {
        return apiService.getNotesByType(type.value)
    }
    
    override suspend fun createNote(title: String, content: String, type: NoteType): Result<Note> {
        val input = CreateNoteInput(
            title = title,
            content = content,
            type = type.value
        )
        return apiService.createNote(input)
    }
    
    override suspend fun updateNote(
        id: String,
        title: String?,
        content: String?,
        status: NoteStatus?
    ): Result<Note> {
        val input = UpdateNoteInput(
            title = title,
            content = content,
            status = status?.value
        )
        return apiService.updateNote(id, input)
    }
    
    override suspend fun deleteNote(id: String): Result<Boolean> {
        return apiService.deleteNote(id)
    }
    
    override suspend fun getCommentsByNote(noteId: String): Result<List<Comment>> {
        return apiService.getCommentsByNote(noteId)
    }
    
    override suspend fun createComment(noteId: String, content: String): Result<Comment> {
        val input = CreateCommentInput(
            noteId = noteId,
            content = content
        )
        return apiService.createComment(input)
    }
}