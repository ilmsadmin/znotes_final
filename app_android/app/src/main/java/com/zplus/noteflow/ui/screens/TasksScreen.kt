package com.zplus.noteflow.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.zplus.noteflow.data.mock.MockData
import com.zplus.noteflow.data.model.Task
import com.zplus.noteflow.data.model.TaskPriority
import com.zplus.noteflow.data.model.TaskStatus
import com.zplus.noteflow.ui.theme.*
import java.text.SimpleDateFormat
import java.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TasksScreen() {
    val tasks = MockData.sampleTasks
    
    Column(
        modifier = Modifier.fillMaxSize()
    ) {
        // Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "Tasks",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold
            )
            
            FloatingActionButton(
                onClick = { /* TODO: Create task */ },
                containerColor = MaterialTheme.colorScheme.primary
            ) {
                Icon(Icons.Default.Add, contentDescription = "Add Task")
            }
        }
        
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(tasks) { task ->
                TaskCard(task = task)
            }
        }
    }
}

@Composable
fun TaskCard(task: Task) {
    val dateFormat = SimpleDateFormat("MMM dd, yyyy", Locale.getDefault())
    
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top
            ) {
                Text(
                    text = task.title,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Medium,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                    modifier = Modifier.weight(1f)
                )
                
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    // Priority chip
                    AssistChip(
                        onClick = { },
                        label = { 
                            Text(
                                text = task.priority.value.uppercase(),
                                style = MaterialTheme.typography.labelSmall
                            ) 
                        },
                        colors = AssistChipDefaults.assistChipColors(
                            containerColor = when (task.priority) {
                                TaskPriority.LOW -> PriorityLow.copy(alpha = 0.1f)
                                TaskPriority.MEDIUM -> PriorityMedium.copy(alpha = 0.1f)
                                TaskPriority.HIGH -> PriorityHigh.copy(alpha = 0.1f)
                                TaskPriority.CRITICAL -> PriorityCritical.copy(alpha = 0.1f)
                            },
                            labelColor = when (task.priority) {
                                TaskPriority.LOW -> PriorityLow
                                TaskPriority.MEDIUM -> PriorityMedium
                                TaskPriority.HIGH -> PriorityHigh
                                TaskPriority.CRITICAL -> PriorityCritical
                            }
                        )
                    )
                    
                    // Status chip
                    AssistChip(
                        onClick = { },
                        label = { 
                            Text(
                                text = task.status.value.replace("_", " ").uppercase(),
                                style = MaterialTheme.typography.labelSmall
                            ) 
                        },
                        colors = AssistChipDefaults.assistChipColors(
                            containerColor = when (task.status) {
                                TaskStatus.TODO -> StatusTodo.copy(alpha = 0.1f)
                                TaskStatus.IN_PROGRESS -> StatusProgress.copy(alpha = 0.1f)
                                TaskStatus.REVIEW -> StatusReview.copy(alpha = 0.1f)
                                TaskStatus.DONE -> StatusDone.copy(alpha = 0.1f)
                            },
                            labelColor = when (task.status) {
                                TaskStatus.TODO -> StatusTodo
                                TaskStatus.IN_PROGRESS -> StatusProgress
                                TaskStatus.REVIEW -> StatusReview
                                TaskStatus.DONE -> StatusDone
                            }
                        )
                    )
                }
            }
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Text(
                text = task.content,
                style = MaterialTheme.typography.bodyMedium,
                maxLines = 3,
                overflow = TextOverflow.Ellipsis,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            
            Spacer(modifier = Modifier.height(12.dp))
            
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "Assignee: ${task.assignee ?: "Unassigned"}",
                        style = MaterialTheme.typography.labelMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    task.dueDate?.let { date ->
                        Text(
                            text = "Due: ${dateFormat.format(date)}",
                            style = MaterialTheme.typography.labelMedium,
                            color = if (date.before(Date())) Error else MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
                
                Text(
                    text = dateFormat.format(task.createdAt),
                    style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}