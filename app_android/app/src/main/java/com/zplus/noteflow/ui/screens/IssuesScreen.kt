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
import com.zplus.noteflow.data.model.Issue
import com.zplus.noteflow.data.model.IssueSeverity
import com.zplus.noteflow.data.model.IssueStatus
import com.zplus.noteflow.data.model.IssueType
import com.zplus.noteflow.ui.theme.*
import java.text.SimpleDateFormat
import java.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun IssuesScreen() {
    val issues = MockData.sampleIssues
    
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
                text = "Issues",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold
            )
            
            FloatingActionButton(
                onClick = { /* TODO: Create issue */ },
                containerColor = MaterialTheme.colorScheme.primary
            ) {
                Icon(Icons.Default.Add, contentDescription = "Add Issue")
            }
        }
        
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(issues) { issue ->
                IssueCard(issue = issue)
            }
        }
    }
}

@Composable
fun IssueCard(issue: Issue) {
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
                    text = issue.title,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Medium,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                    modifier = Modifier.weight(1f)
                )
                
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    // Type chip
                    AssistChip(
                        onClick = { },
                        label = { 
                            Text(
                                text = issue.type.value.uppercase(),
                                style = MaterialTheme.typography.labelSmall
                            ) 
                        },
                        colors = AssistChipDefaults.assistChipColors(
                            containerColor = when (issue.type) {
                                IssueType.BUG -> Error.copy(alpha = 0.1f)
                                IssueType.FEATURE -> Info.copy(alpha = 0.1f)
                                IssueType.ENHANCEMENT -> Success.copy(alpha = 0.1f)
                                IssueType.TASK -> Warning.copy(alpha = 0.1f)
                            },
                            labelColor = when (issue.type) {
                                IssueType.BUG -> Error
                                IssueType.FEATURE -> Info
                                IssueType.ENHANCEMENT -> Success
                                IssueType.TASK -> Warning
                            }
                        )
                    )
                    
                    // Severity chip
                    AssistChip(
                        onClick = { },
                        label = { 
                            Text(
                                text = issue.severity.value.uppercase(),
                                style = MaterialTheme.typography.labelSmall
                            ) 
                        },
                        colors = AssistChipDefaults.assistChipColors(
                            containerColor = when (issue.severity) {
                                IssueSeverity.LOW -> SeverityLow.copy(alpha = 0.1f)
                                IssueSeverity.MEDIUM -> SeverityMedium.copy(alpha = 0.1f)
                                IssueSeverity.HIGH -> SeverityHigh.copy(alpha = 0.1f)
                                IssueSeverity.CRITICAL -> SeverityCritical.copy(alpha = 0.1f)
                            },
                            labelColor = when (issue.severity) {
                                IssueSeverity.LOW -> SeverityLow
                                IssueSeverity.MEDIUM -> SeverityMedium
                                IssueSeverity.HIGH -> SeverityHigh
                                IssueSeverity.CRITICAL -> SeverityCritical
                            }
                        )
                    )
                }
            }
            
            Spacer(modifier = Modifier.height(8.dp))
            
            // Status chip
            AssistChip(
                onClick = { },
                label = { 
                    Text(
                        text = issue.status.value.replace("-", " ").uppercase(),
                        style = MaterialTheme.typography.labelSmall
                    ) 
                },
                colors = AssistChipDefaults.assistChipColors(
                    containerColor = when (issue.status) {
                        IssueStatus.OPEN -> Error.copy(alpha = 0.1f)
                        IssueStatus.IN_PROGRESS -> Warning.copy(alpha = 0.1f)
                        IssueStatus.CLOSED -> Success.copy(alpha = 0.1f)
                    },
                    labelColor = when (issue.status) {
                        IssueStatus.OPEN -> Error
                        IssueStatus.IN_PROGRESS -> Warning
                        IssueStatus.CLOSED -> Success
                    }
                )
            )
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Text(
                text = issue.description,
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
                        text = "Assignee: ${issue.assignee ?: "Unassigned"}",
                        style = MaterialTheme.typography.labelMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Text(
                        text = "Reporter: ${issue.reporter}",
                        style = MaterialTheme.typography.labelMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                
                Text(
                    text = dateFormat.format(issue.createdAt),
                    style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}