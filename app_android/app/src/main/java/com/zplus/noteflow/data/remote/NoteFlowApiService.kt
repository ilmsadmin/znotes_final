package com.zplus.noteflow.data.remote

import com.zplus.noteflow.data.model.*

class NoteFlowApiService(private val graphQLClient: GraphQLClient) {
    
    // Health check
    suspend fun checkHealth(): Result<String> {
        val query = """
            query {
                health
            }
        """.trimIndent()
        
        return graphQLClient.execute<HealthResponse>(query)
            .map { it.health }
    }
    
    // User management
    suspend fun getCurrentUser(): Result<User> {
        val query = """
            query {
                me {
                    id
                    name
                    email
                    role
                    avatarUrl
                    group {
                        id
                        name
                        domain
                    }
                }
            }
        """.trimIndent()
        
        return graphQLClient.execute<UserResponse>(query)
            .map { it.me }
    }
    
    suspend fun getUsersInGroup(): Result<List<User>> {
        val query = """
            query {
                usersInGroup {
                    id
                    name
                    email
                    role
                    avatarUrl
                }
            }
        """.trimIndent()
        
        return graphQLClient.execute<UsersResponse>(query)
            .map { it.usersInGroup }
    }
    
    // Notes management
    suspend fun getNotes(): Result<List<Note>> {
        val query = """
            query {
                notes {
                    id
                    title
                    content
                    type
                    status
                    createdAt
                    updatedAt
                    creator {
                        id
                        name
                        email
                    }
                }
            }
        """.trimIndent()
        
        return graphQLClient.execute<NotesResponse>(query)
            .map { it.notes }
    }
    
    suspend fun getNotesByType(type: String): Result<List<Note>> {
        val query = """
            query GetNotesByType(${'$'}type: String!) {
                notesByType(type: ${'$'}type) {
                    id
                    title
                    content
                    type
                    status
                    createdAt
                    updatedAt
                    creator {
                        id
                        name
                        email
                    }
                }
            }
        """.trimIndent()
        
        val variables = mapOf("type" to type)
        
        return graphQLClient.execute<NotesResponse>(query, variables)
            .map { it.notes }
    }
    
    suspend fun createNote(input: CreateNoteInput): Result<Note> {
        val query = """
            mutation CreateNote(${'$'}input: CreateNoteInput!) {
                createNote(input: ${'$'}input) {
                    id
                    title
                    content
                    type
                    status
                    createdAt
                    updatedAt
                    creator {
                        id
                        name
                        email
                    }
                }
            }
        """.trimIndent()
        
        val variables = mapOf("input" to input)
        
        return graphQLClient.execute<CreateNoteResponse>(query, variables)
            .map { it.createNote }
    }
    
    suspend fun updateNote(id: String, input: UpdateNoteInput): Result<Note> {
        val query = """
            mutation UpdateNote(${'$'}id: String!, ${'$'}input: UpdateNoteInput!) {
                updateNote(id: ${'$'}id, input: ${'$'}input) {
                    id
                    title
                    content
                    type
                    status
                    createdAt
                    updatedAt
                    creator {
                        id
                        name
                        email
                    }
                }
            }
        """.trimIndent()
        
        val variables = mapOf("id" to id, "input" to input)
        
        return graphQLClient.execute<UpdateNoteResponse>(query, variables)
            .map { it.updateNote }
    }
    
    suspend fun deleteNote(id: String): Result<Boolean> {
        val query = """
            mutation DeleteNote(${'$'}id: String!) {
                deleteNote(id: ${'$'}id)
            }
        """.trimIndent()
        
        val variables = mapOf("id" to id)
        
        return graphQLClient.execute<DeleteNoteResponse>(query, variables)
            .map { it.deleteNote }
    }
    
    // Comments management
    suspend fun getCommentsByNote(noteId: String): Result<List<Comment>> {
        val query = """
            query GetCommentsByNote(${'$'}noteId: String!) {
                commentsByNote(noteId: ${'$'}noteId) {
                    id
                    content
                    createdAt
                    updatedAt
                    author {
                        id
                        name
                        email
                        avatarUrl
                    }
                }
            }
        """.trimIndent()
        
        val variables = mapOf("noteId" to noteId)
        
        return graphQLClient.execute<CommentsResponse>(query, variables)
            .map { it.commentsByNote }
    }
    
    suspend fun createComment(input: CreateCommentInput): Result<Comment> {
        val query = """
            mutation CreateComment(${'$'}input: CreateCommentInput!) {
                createComment(input: ${'$'}input) {
                    id
                    content
                    createdAt
                    updatedAt
                    author {
                        id
                        name
                        email
                        avatarUrl
                    }
                }
            }
        """.trimIndent()
        
        val variables = mapOf("input" to input)
        
        return graphQLClient.execute<CreateCommentResponse>(query, variables)
            .map { it.createComment }
    }
}

// Response data classes
data class HealthResponse(val health: String)
data class UserResponse(val me: User)
data class UsersResponse(val usersInGroup: List<User>)
data class NotesResponse(val notes: List<Note>)
data class CreateNoteResponse(val createNote: Note)
data class UpdateNoteResponse(val updateNote: Note)
data class DeleteNoteResponse(val deleteNote: Boolean)
data class CommentsResponse(val commentsByNote: List<Comment>)
data class CreateCommentResponse(val createComment: Comment)

// Input data classes
data class CreateNoteInput(
    val title: String,
    val content: String,
    val type: String
)

data class UpdateNoteInput(
    val title: String? = null,
    val content: String? = null,
    val status: String? = null
)

data class CreateCommentInput(
    val noteId: String,
    val content: String
)