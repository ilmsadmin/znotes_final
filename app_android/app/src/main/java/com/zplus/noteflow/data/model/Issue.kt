package com.zplus.noteflow.data.model

import java.util.*

data class Issue(
    val id: String,
    val title: String,
    val description: String,
    val type: IssueType,
    val severity: IssueSeverity,
    val status: IssueStatus,
    val assignee: String? = null,
    val reporter: String,
    val tags: List<String> = emptyList(),
    val createdAt: Date,
    val updatedAt: Date
)

enum class IssueType(val value: String) {
    BUG("bug"),
    FEATURE("feature"),
    ENHANCEMENT("enhancement"),
    TASK("task");
    
    companion object {
        fun fromString(value: String): IssueType {
            return values().find { it.value == value } ?: BUG
        }
    }
}

enum class IssueSeverity(val value: String) {
    LOW("low"),
    MEDIUM("medium"),
    HIGH("high"),
    CRITICAL("critical");
    
    companion object {
        fun fromString(value: String): IssueSeverity {
            return values().find { it.value == value } ?: MEDIUM
        }
    }
}

enum class IssueStatus(val value: String) {
    OPEN("open"),
    IN_PROGRESS("in-progress"),
    CLOSED("closed");
    
    companion object {
        fun fromString(value: String): IssueStatus {
            return values().find { it.value == value } ?: OPEN
        }
    }
}