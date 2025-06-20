<?php

namespace App\Http\Controllers;

use App\Models\Journal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class JournalController extends Controller
{
    // List all journals (including from other users)
    public function index()
    {
        $journals = Journal::latest()->paginate(10);
        return response()->json($journals);
    }
    
    // Show a single journal
    public function show($id)
    {
        $journal = Journal::find($id);
        
        if (!$journal) {
            return response()->json([
                'message' => 'Journal not found',
                'success' => false
            ], 404);
        }
        
        // Debug output
        logger()->info('Journal data:', $journal->toArray());
        
        return response()->json([
            'data' => $journal,
            'success' => true
        ]);
    }
    
    // Create a new journal entry
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'user_id' => 'required|exists:users,id' // Validate user exists
        ]);
        
        // Use the user_id from request instead of Auth::id()
        $journal = Journal::create($validated);
        
        return response()->json($journal, 201);
    }
    
    // Update an existing journal (only by owner)
    public function update(Request $request, $id)
    {
        $journal = Journal::findOrFail($id);
        
        if ($journal->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);
        
        $journal->update([
            'title' => $request->title,
            'content' => $request->content,
        ]);
        
        return response()->json($journal);
    }
    
    // Delete a journal (only by owner)
    public function destroy($id)
    {
        $journal = Journal::findOrFail($id);
        
        if ($journal->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $journal->delete();
        
        return response()->json(['message' => 'Journal deleted']);
    }
    
    
    public function myJournals()
    {
        try {
            // Fetch ALL journals without any conditions
            $journals = Journal::with('user')->latest()->get();
            
            return response()->json([
                'data' => $journals,
                'success' => true
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to load journals',
                'error' => $e->getMessage(),
                'success' => false
            ], 500);
        }
    }
    
    public function search(Request $request)
    {
        $query = $request->input('query');
        
        $journals = Journal::where('user_id', auth()->id())
        ->where(function ($q) use ($query) {
            $q->where('title', 'LIKE', "%{$query}%")
            ->orWhere('content', 'LIKE', "%{$query}%");
        })
        ->get();
        
        return response()->json($journals);
    }
    public function filterByDate($date)
    {
        $journals = Journal::where('user_id', auth()->id())
        ->whereDate('created_at', $date)
        ->get();
        
        return response()->json($journals);
    }
    public function summary($id)
    {
        $journal = Journal::where('user_id', auth()->id())->findOrFail($id);
        return response()->json([
            'title' => $journal->title,
            'preview' => substr($journal->content, 0, 100) . '...'
        ]);
    }
    
}
