<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Video;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index($videoId)
    {
        $video = Video::findOrFail($videoId);

        $comments = $video->comments()
            ->with('user:id,name')
            ->latest()
            ->get();

        $formatted = $comments->map(function ($comment) {
            return [
                'id' => $comment->id,
                'author' => $comment->user->name,
                'msg' => $comment->message,
                'ago' => $comment->created_at->diffForHumans(),
            ];
        });

        return response()->json(['data' => $formatted]);
    }

    public function store(Request $request, $videoId)
    {
        $request->validate([
            'message' => 'required|string|max:1000',
        ]);

        $video = Video::findOrFail($videoId);

        $comment = $video->comments()->create([
            'user_id' => $request->user()->id,
            'message' => $request->message,
        ]);

        // Load the user relation to match index format
        $comment->load('user:id,name');

        return response()->json([
            'message' => 'Comment posted',
            'data' => [
                'id' => $comment->id,
                'author' => $comment->user->name,
                'msg' => $comment->message,
                'ago' => $comment->created_at->diffForHumans(),
            ],
        ]);
    }
}
