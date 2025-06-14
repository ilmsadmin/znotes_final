package com.zplus.noteflow.data.model

import java.util.*

data class User(
    val id: String,
    val name: String,
    val email: String,
    val role: UserRole,
    val avatarUrl: String? = null,
    val group: Group? = null
)

enum class UserRole(val value: String) {
    ADMIN("admin"),
    MEMBER("member");
    
    companion object {
        fun fromString(value: String): UserRole {
            return values().find { it.value == value } ?: MEMBER
        }
    }
}

data class Group(
    val id: String,
    val name: String,
    val domain: String,
    val users: List<User> = emptyList()
)

data class Comment(
    val id: String,
    val noteId: String,
    val content: String,
    val author: User,
    val createdAt: Date,
    val updatedAt: Date
)