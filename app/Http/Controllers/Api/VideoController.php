<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bookmark;
use App\Models\Video;
use App\Models\VideoProgress;
use Illuminate\Http\Request;

class VideoController extends Controller
{
    public function show($id)
    {
        $video = Video::with('course')->findOrFail($id);

        return response()->json(['data' => $video]);
    }

    public function updateProgress(Request $request, $id)
    {
        $request->validate([
            'watched_percent' => 'required|integer|min:0|max:100',
        ]);

        $video = Video::findOrFail($id);

        $progress = VideoProgress::updateOrCreate(
            ['user_id' => $request->user()->id, 'video_id' => $video->id],
            [
                'watched_percent' => $request->watched_percent,
                'last_watched_at' => now(),
            ]
        );

        return response()->json([
            'message' => 'Progress updated',
            'data' => $progress,
        ]);
    }

    public function toggleBookmark(Request $request, $id)
    {
        $video = Video::findOrFail($id);

        $bookmark = Bookmark::where('user_id', $request->user()->id)
            ->where('video_id', $video->id)
            ->first();

        if ($bookmark) {
            $bookmark->delete();

            return response()->json(['message' => 'Bookmark removed', 'bookmarked' => false]);
        }

        Bookmark::create([
            'user_id' => $request->user()->id,
            'video_id' => $video->id,
        ]);

        return response()->json(['message' => 'Bookmark added', 'bookmarked' => true]);
    }
}
