package com.zplus.noteflow.di

import com.zplus.noteflow.data.remote.GraphQLClient
import com.zplus.noteflow.data.remote.NoteFlowApiService
import com.zplus.noteflow.data.repository.GraphQLNoteFlowRepository
import com.zplus.noteflow.data.repository.MockNoteFlowRepository
import com.zplus.noteflow.data.repository.NoteFlowRepository

object RepositoryProvider {
    
    private var _useMockData = true
    private var _repository: NoteFlowRepository? = null
    
    var useMockData: Boolean
        get() = _useMockData
        set(value) {
            if (_useMockData != value) {
                _useMockData = value
                _repository = null // Clear cached repository
            }
        }
    
    fun getRepository(): NoteFlowRepository {
        return _repository ?: run {
            val repo = if (_useMockData) {
                MockNoteFlowRepository()
            } else {
                // For real GraphQL API
                val client = GraphQLClient(
                    baseUrl = "http://localhost:3000/graphql",
                    authToken = "test-uid:test@example.com" // For development
                )
                val apiService = NoteFlowApiService(client)
                GraphQLNoteFlowRepository(apiService)
            }
            _repository = repo
            repo
        }
    }
    
    fun clearRepository() {
        _repository = null
    }
}