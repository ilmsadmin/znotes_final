'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import WebLayout from '@/components/layout/WebLayout';
import NotesGridView from '@/components/dashboard/NotesGridView';
import NoteForm from '@/components/notes/NoteForm';
import NoteDetail from '@/components/notes/NoteDetail';
import { useNotes } from '@/lib/hooks';
import { NoteType } from '@/types';

type ViewMode = 'list' | 'create' | 'edit' | 'detail';

function NotesContent() {
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
    const searchParams = useSearchParams();

    const { data: notesData, loading: notesLoading } = useNotes();
    const notes = notesData?.notes || [];

    // Check if we should start in create mode
    useEffect(() => {
        const mode = searchParams.get('mode');
        if (mode === 'create') {
            setViewMode('create');
        }
    }, [searchParams]);

    const handleCreateNote = () => {
        setSelectedNoteId(null);
        setViewMode('create');
    };

    const handleEditNote = (noteId: string) => {
        setSelectedNoteId(noteId);
        setViewMode('edit');
    };

    const handleViewNote = (noteId: string) => {
        setSelectedNoteId(noteId);
        setViewMode('detail');
    };

    const handleBackToList = () => {
        setSelectedNoteId(null);
        setViewMode('list');
    };

    const handleNoteCreated = () => {
        setViewMode('list');
    };

    const handleNoteUpdated = () => {
        setViewMode('detail');
    };

    if (viewMode === 'create') {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleBackToList}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Notes
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Create New Note</h1>
                </div>

                <NoteForm
                    initialType={NoteType.NOTE}
                    onSuccess={handleNoteCreated}
                    onCancel={handleBackToList}
                />
            </div>
        );
    }

    if (viewMode === 'edit' && selectedNoteId) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleBackToList}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Notes
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Edit Note</h1>
                </div>

                <NoteForm
                    noteId={selectedNoteId}
                    initialType={NoteType.NOTE}
                    onSuccess={handleNoteUpdated}
                    onCancel={handleBackToList}
                />
            </div>
        );
    }

    if (viewMode === 'detail' && selectedNoteId) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleBackToList}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Notes
                    </button>
                </div>

                <NoteDetail
                    noteId={selectedNoteId}
                    onEdit={() => handleEditNote(selectedNoteId)}
                    onDelete={handleBackToList}
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Notes</h1>
                    <p className="text-gray-600">Manage all your notes in one place</p>
                </div>
                <button
                    onClick={handleCreateNote}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                    <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Note
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <NotesGridView
                    notes={notes}
                    loading={notesLoading}
                    onNoteClick={handleViewNote}
                    onEditClick={handleEditNote}
                />
            </div>
        </div>
    );
}

export default function NotesPage() {
    return (
        <WebLayout>
            <NotesContent />
        </WebLayout>
    );
}
