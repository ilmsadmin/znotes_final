package com.zplus.noteflow.data.model

import java.util.*

data class Task(
    val id: String,
    val title: String,
    val content: String,
    val priority: TaskPriority,
    val status: TaskStatus,
    val tags: List<String> = emptyList(),
    val dueDate: Date? = null,
    val assignee: String? = null,
    val createdAt: Date,
    val updatedAt: Date
)

enum class TaskPriority(val value: String) {
    LOW("low"),
    MEDIUM("medium"),
    HIGH("high"),
    CRITICAL("critical");
    
    companion object {
        fun fromString(value: String): TaskPriority {
            return values().find { it.value == value } ?: MEDIUM
        }
    }
}

enum class TaskStatus(val value: String) {
    TODO("todo"),
    IN_PROGRESS("in_progress"),
    REVIEW("review"),
    DONE("done");
    
    companion object {
        fun fromString(value: String): TaskStatus {
            return values().find { it.value == value } ?: TODO
        }
    }
}