package com.zplus.noteflow

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.zplus.noteflow.data.model.NoteType
import com.zplus.noteflow.data.repository.MockNoteFlowRepository
import com.zplus.noteflow.di.RepositoryProvider
import com.zplus.noteflow.ui.navigation.Screen
import com.zplus.noteflow.ui.navigation.bottomNavigationItems
import com.zplus.noteflow.ui.screens.*
import com.zplus.noteflow.ui.theme.NoteFlowTheme
import com.zplus.noteflow.ui.viewmodel.NotesViewModel

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            NoteFlowTheme {
                NoteFlowApp()
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NoteFlowApp() {
    val navController = rememberNavController()
    val repository = remember { RepositoryProvider.getRepository() }
    
    Scaffold(
        modifier = Modifier.fillMaxSize(),
        bottomBar = {
            NavigationBar {
                val navBackStackEntry by navController.currentBackStackEntryAsState()
                val currentDestination = navBackStackEntry?.destination
                
                bottomNavigationItems.forEach { screen ->
                    NavigationBarItem(
                        icon = { Icon(screen.icon, contentDescription = null) },
                        label = { Text(screen.title) },
                        selected = currentDestination?.hierarchy?.any { it.route == screen.route } == true,
                        onClick = {
                            navController.navigate(screen.route) {
                                // Pop up to the start destination of the graph to
                                // avoid building up a large stack of destinations
                                // on the back stack as users select items
                                popUpTo(navController.graph.findStartDestination().id) {
                                    saveState = true
                                }
                                // Avoid multiple copies of the same destination when
                                // reselecting the same item
                                launchSingleTop = true
                                // Restore state when reselecting a previously selected item
                                restoreState = true
                            }
                        }
                    )
                }
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = Screen.Notes.route,
            modifier = Modifier.padding(innerPadding)
        ) {
            composable(Screen.Notes.route) {
                val notesViewModel: NotesViewModel = viewModel { NotesViewModel(repository) }
                val notes by notesViewModel.notes.collectAsState()
                val uiState by notesViewModel.uiState.collectAsState()
                
                NotesScreen(
                    notes = notes,
                    onCreateNote = { title, content, type ->
                        notesViewModel.createNote(title, content, type)
                    },
                    onNoteClick = { note ->
                        // TODO: Navigate to note detail
                    },
                    isLoading = uiState.isLoading,
                    error = uiState.error
                )
            }
            
            composable(Screen.Tasks.route) {
                TasksScreen()
            }
            
            composable(Screen.Issues.route) {
                IssuesScreen()
            }
            
            composable(Screen.Settings.route) {
                SettingsScreen()
            }
        }
    }
}