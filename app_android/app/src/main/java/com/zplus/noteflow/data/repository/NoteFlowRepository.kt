package com.zplus.noteflow.data.repository

import com.zplus.noteflow.data.model.*
import com.zplus.noteflow.data.remote.CreateCommentInput
import com.zplus.noteflow.data.remote.CreateNoteInput
import com.zplus.noteflow.data.remote.UpdateNoteInput
import kotlinx.coroutines.flow.Flow

interface NoteFlowRepository {
    
    // Health
    suspend fun checkHealth(): Result<String>
    
    // User management
    suspend fun getCurrentUser(): Result<User>
    suspend fun getUsersInGroup(): Result<List<User>>
    
    // Notes management
    fun getNotesStream(): Flow<List<Note>>
    suspend fun getNotes(): Result<List<Note>>
    suspend fun getNotesByType(type: NoteType): Result<List<Note>>
    suspend fun createNote(title: String, content: String, type: NoteType): Result<Note>
    suspend fun updateNote(id: String, title: String?, content: String?, status: NoteStatus?): Result<Note>
    suspend fun deleteNote(id: String): Result<Boolean>
    
    // Comments management
    suspend fun getCommentsByNote(noteId: String): Result<List<Comment>>
    suspend fun createComment(noteId: String, content: String): Result<Comment>
}