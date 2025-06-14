package com.zplus.noteflow.ui.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Assignment
import androidx.compose.material.icons.filled.BugReport
import androidx.compose.material.icons.filled.Notes
import androidx.compose.material.icons.filled.Settings
import androidx.compose.ui.graphics.vector.ImageVector

sealed class Screen(val route: String, val title: String, val icon: ImageVector) {
    object Notes : Screen("notes", "Notes", Icons.Default.Notes)
    object Tasks : Screen("tasks", "Tasks", Icons.Default.Assignment)
    object Issues : Screen("issues", "Issues", Icons.Default.BugReport)
    object Settings : Screen("settings", "Settings", Icons.Default.Settings)
    
    // Detail screens
    object NoteDetail : Screen("note_detail/{noteId}", "Note Detail", Icons.Default.Notes) {
        fun createRoute(noteId: String) = "note_detail/$noteId"
    }
    object TaskDetail : Screen("task_detail/{taskId}", "Task Detail", Icons.Default.Assignment) {
        fun createRoute(taskId: String) = "task_detail/$taskId"
    }
    object IssueDetail : Screen("issue_detail/{issueId}", "Issue Detail", Icons.Default.BugReport) {
        fun createRoute(issueId: String) = "issue_detail/$issueId"
    }
}

val bottomNavigationItems = listOf(
    Screen.Notes,
    Screen.Tasks,
    Screen.Issues,
    Screen.Settings
)