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
            'completed' => 'nullable|boolean',
        ]);

        $video = Video::findOrFail($id);
        $user = $request->user();

        $progress = VideoProgress::firstOrNew([
            'user_id' => $user->id,
            'video_id' => $video->id,
        ]);

        $progress->watched_percent = $request->watched_percent;
        $progress->last_watched_at = now();

        $completedNow = $request->input('completed', false) || $request->watched_percent >= 90;

        $xpEarned = 0;
        $leveledUp = false;

        if ($completedNow && ! $progress->completed) {
            $progress->completed = true;
            // Grant XP for first time video completion
            $user->xp_points += 10;
            $xpEarned = 10;

            while ($user->xp_points >= $user->level * 500) {
                $user->level++;
                $leveledUp = true;
            }
            $user->save();
        }

        $progress->save();

        return response()->json([
            'message' => 'Progress updated',
            'data' => clone $progress,
            'gamification' => [
                'xp_earned' => $xpEarned,
                'leveled_up' => $leveledUp,
                'new_level' => $user->level,
                'total_xp' => $user->xp_points,
            ],
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
