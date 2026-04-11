<?php

use function Pest\Laravel\postJson;

it('generates a CV summary for a given role', function () {
    $response = postJson('/api/ai/cv-summary', [
        'role' => 'Frontend Developer',
        'skills' => ['React', 'TypeScript'],
    ]);

    $response->assertStatus(200)
        ->assertJsonStructure(['summary']);

    expect($response->json('summary'))->toContain('Frontend Developer')
        ->toContain('React, TypeScript');
});

it('matches jobs based on interest', function () {
    $response = postJson('/api/ai/match-jobs', [
        'interest' => 'logic',
        'jobs' => [
            ['id' => 1, 'skills' => ['React', 'TypeScript', 'Node.js']], // strong logic overlap
            ['id' => 2, 'skills' => ['Photoshop', 'Illustrator']],       // no overlap
        ],
    ]);

    $response->assertStatus(200)
        ->assertJsonStructure(['jobs']);

    $jobs = $response->json('jobs');
    expect($jobs)->toHaveCount(2);
    expect($jobs[0]['id'])->toBe(1);
    expect($jobs[1]['id'])->toBe(2);
    expect($jobs[0]['matchScore'])->toBeGreaterThan($jobs[1]['matchScore']);
});

it('matches jobs higher when enrolled courses overlap with job skills', function () {
    $response = postJson('/api/ai/match-jobs', [
        'courses' => ['React Modern Patterns', 'JavaScript Mastery'],
        'jobs' => [
            ['id' => 1, 'skills' => ['React', 'JavaScript', 'TypeScript']], // overlaps with courses
            ['id' => 2, 'skills' => ['SQL', 'R', 'Tableau']],               // no overlap
        ],
    ]);

    $response->assertStatus(200)
        ->assertJsonStructure(['jobs']);

    $jobs = $response->json('jobs');
    expect($jobs[0]['id'])->toBe(1);
    expect($jobs[0]['matchScore'])->toBeGreaterThan($jobs[1]['matchScore']);
});

it('matches jobs higher when user skills overlap with job skills', function () {
    $response = postJson('/api/ai/match-jobs', [
        'skills' => ['Python', 'SQL', 'Data Analysis'],
        'jobs' => [
            ['id' => 1, 'skills' => ['Python', 'SQL', 'Tableau']], // high overlap
            ['id' => 2, 'skills' => ['React', 'CSS', 'Figma']],    // no overlap
        ],
    ]);

    $response->assertStatus(200);
    $jobs = $response->json('jobs');
    expect($jobs[0]['id'])->toBe(1);
    expect($jobs[0]['matchScore'])->toBeGreaterThan($jobs[1]['matchScore']);
});

it('generates 5 quiz questions for a given topic', function () {
    $response = postJson('/api/ai/generate-quiz', [
        'topic' => 'React Modern Patterns',
        'difficulty' => 'intermediate',
    ]);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'topic',
            'difficulty',
            'questions' => [
                '*' => ['id', 'question', 'options', 'correct_index', 'explanation'],
            ],
        ]);

    expect($response->json('questions'))->toHaveCount(5);
    expect($response->json('topic'))->toBe('React Modern Patterns');
    expect($response->json('difficulty'))->toBe('intermediate');
});

it('generates quiz questions with correct structure for each question', function () {
    $response = postJson('/api/ai/generate-quiz', [
        'topic' => 'Python for Data Science',
    ]);

    $response->assertStatus(200);
    $questions = $response->json('questions');

    foreach ($questions as $question) {
        expect($question)->toHaveKey('id');
        expect($question)->toHaveKey('question');
        expect($question['options'])->toBeArray()->toHaveCount(4);
        expect($question['correct_index'])->toBeInt()->toBeGreaterThanOrEqual(0)->toBeLessThan(4);
        expect($question['explanation'])->toBeString()->not->toBeEmpty();
    }
});

it('falls back to default questions for an unknown topic', function () {
    $response = postJson('/api/ai/generate-quiz', [
        'topic' => 'Underwater Basket Weaving',
    ]);

    $response->assertStatus(200);
    expect($response->json('questions'))->toHaveCount(5);
});

it('validates that topic is required for quiz generation', function () {
    $response = postJson('/api/ai/generate-quiz', [
        'difficulty' => 'beginner',
    ]);

    $response->assertStatus(422);
});
