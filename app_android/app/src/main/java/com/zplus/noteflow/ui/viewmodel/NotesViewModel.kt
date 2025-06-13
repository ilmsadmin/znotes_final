package com.zplus.noteflow.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.zplus.noteflow.data.model.Note
import com.zplus.noteflow.data.model.NoteStatus
import com.zplus.noteflow.data.model.NoteType
import com.zplus.noteflow.data.repository.NoteFlowRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class NotesViewModel(
    private val repository: NoteFlowRepository
) : ViewModel() {
    
    private val _uiState = MutableStateFlow(NotesUiState())
    val uiState: StateFlow<NotesUiState> = _uiState.asStateFlow()
    
    private val _notes = MutableStateFlow<List<Note>>(emptyList())
    val notes: StateFlow<List<Note>> = _notes.asStateFlow()
    
    init {
        loadNotes()
    }
    
    fun loadNotes() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            
            repository.getNotes()
                .onSuccess { notesList ->
                    _notes.value = notesList
                    _uiState.value = _uiState.value.copy(isLoading = false)
                }
                .onFailure { error ->
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        error = error.message ?: "Unknown error occurred"
                    )
                }
        }
    }
    
    fun loadNotesByType(type: NoteType) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            
            repository.getNotesByType(type)
                .onSuccess { notesList ->
                    _notes.value = notesList
                    _uiState.value = _uiState.value.copy(isLoading = false)
                }
                .onFailure { error ->
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        error = error.message ?: "Unknown error occurred"
                    )
                }
        }
    }
    
    fun createNote(title: String, content: String, type: NoteType) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            
            repository.createNote(title, content, type)
                .onSuccess { newNote ->
                    // Refresh the notes list
                    loadNotes()
                }
                .onFailure { error ->
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        error = error.message ?: "Failed to create note"
                    )
                }
        }
    }
    
    fun updateNote(id: String, title: String?, content: String?, status: NoteStatus?) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            
            repository.updateNote(id, title, content, status)
                .onSuccess { updatedNote ->
                    // Update the local list
                    val updatedList = _notes.value.map { note ->
                        if (note.id == id) updatedNote else note
                    }
                    _notes.value = updatedList
                    _uiState.value = _uiState.value.copy(isLoading = false)
                }
                .onFailure { error ->
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        error = error.message ?: "Failed to update note"
                    )
                }
        }
    }
    
    fun deleteNote(id: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            
            repository.deleteNote(id)
                .onSuccess { success ->
                    if (success) {
                        // Remove from local list
                        _notes.value = _notes.value.filter { it.id != id }
                    }
                    _uiState.value = _uiState.value.copy(isLoading = false)
                }
                .onFailure { error ->
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        error = error.message ?: "Failed to delete note"
                    )
                }
        }
    }
    
    fun clearError() {
        _uiState.value = _uiState.value.copy(error = null)
    }
}

data class NotesUiState(
    val isLoading: Boolean = false,
    val error: String? = null
)