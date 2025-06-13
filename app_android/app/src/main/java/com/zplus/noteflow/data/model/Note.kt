package com.zplus.noteflow.data.model

import java.util.*

data class Note(
    val id: String,
    val title: String,
    val content: String,
    val type: NoteType,
    val status: NoteStatus,
    val tags: List<String> = emptyList(),
    val createdAt: Date,
    val updatedAt: Date,
    val isPinned: Boolean = false,
    val creator: User? = null
)

enum class NoteType(val value: String) {
    NOTE("note"),
    TASK("task"),
    MEETING("meeting"),
    ISSUE("issue");
    
    companion object {
        fun fromString(value: String): NoteType {
            return values().find { it.value == value } ?: NOTE
        }
    }
}

enum class NoteStatus(val value: String) {
    DRAFT("draft"),
    ACTIVE("active"),
    COMPLETED("completed"),
    ARCHIVED("archived"),
    DELETED("deleted");
    
    companion object {
        fun fromString(value: String): NoteStatus {
            return values().find { it.value == value } ?: DRAFT
        }
    }
}