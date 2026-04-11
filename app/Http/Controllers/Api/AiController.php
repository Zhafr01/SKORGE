<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

#[OA\Tag(name: 'AI Features', description: 'Endpoints for AI-powered CV generation, Job matching, and Quiz generation')]
class AiController extends Controller
{
    private array $aiSummaries = [
        'Frontend Developer' => 'Highly motivated Frontend Developer certified by SKORGE. Proficient in React, TypeScript, and modern CSS architecture. Proven track record of building performant, accessible SPAs that delight users. Experienced with REST API integration, Git workflows, and Agile environments.',
        'Backend Developer' => 'Results-driven Backend Developer with expertise in building scalable, secure RESTful APIs. Certified in server-side architecture, database design, and cloud deployment. Adept at Laravel, Node.js, and PostgreSQL. Passionate about clean code and system reliability.',
        'UI/UX Designer' => 'Creative UI/UX Designer with a user-centric mindset and certified expertise in Figma, wireframing, and usability research. Skilled at translating complex user needs into elegant, conversion-focused digital experiences. Strong collaborator in cross-functional product teams.',
        'Data Analyst' => 'Analytical and detail-oriented Data Analyst certified by SKORGE. Proficient in SQL, Python (Pandas, NumPy), and data visualization tools including Tableau and Power BI. Expert at transforming raw datasets into actionable business insights for executive stakeholders.',
        'Digital Marketer' => 'Performance-driven Digital Marketer with certified mastery in SEO, Google Ads, and social media strategy. Experienced in managing multi-channel campaigns, A/B testing landing pages, and scaling user acquisition through data-backed decision-making.',
        'Cloud Engineer' => 'Cloud-first engineer certified in AWS and GCP infrastructure. Experienced in containerization (Docker, Kubernetes), CI/CD pipelines, and infrastructure-as-code with Terraform. Passionate about resilient, cost-optimized architectures that scale seamlessly.',
    ];

    private array $interestSkillMap = [
        'logic' => ['JavaScript', 'TypeScript', 'React', 'Vue', 'HTML/CSS', 'Git', 'Node.js', 'Python'],
        'visuals' => ['Figma', 'CSS Architecture', 'UI Design', 'Prototyping', 'Vue', 'React'],
        'numbers' => ['SQL', 'Python', 'Excel', 'Tableau', 'Data Analysis', 'R'],
        'strategy' => ['SEO', 'Analytics', 'Marketing', 'Growth', 'Email Marketing'],
        'cloud' => ['AWS', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'Linux'],
    ];

    /**
     * Maps course title keywords to relevant skill tags.
     *
     * @var array<string, list<string>>
     */
    private array $courseTitleSkillMap = [
        'react' => ['React', 'JavaScript', 'HTML/CSS'],
        'javascript' => ['JavaScript', 'TypeScript', 'Node.js'],
        'html' => ['HTML/CSS', 'React', 'Vue'],
        'css' => ['HTML/CSS', 'CSS Architecture', 'UI Design'],
        'laravel' => ['PHP', 'SQL', 'APIs'],
        'python' => ['Python', 'Data Analysis', 'SQL'],
        'sql' => ['SQL', 'Data Analysis', 'Excel'],
        'figma' => ['Figma', 'UI Design', 'Prototyping'],
        'data' => ['Data Analysis', 'SQL', 'Python'],
        'aws' => ['AWS', 'Cloud', 'Docker'],
        'docker' => ['Docker', 'Kubernetes', 'Linux'],
        'node' => ['Node.js', 'JavaScript', 'APIs'],
        'vue' => ['Vue', 'JavaScript', 'HTML/CSS'],
        'typescript' => ['TypeScript', 'JavaScript', 'React'],
        'seo' => ['SEO', 'Analytics', 'Marketing'],
        'marketing' => ['SEO', 'Marketing', 'Analytics'],
    ];

    /**
     * Curated quiz question bank indexed by topic keyword.
     *
     * @var array<string, list<array{question: string, options: list<string>, correct_index: int, explanation: string}>>
     */
    private array $quizBank = [
        'react' => [
            ['question' => 'Which React hook is used to manage side effects?', 'options' => ['useState', 'useEffect', 'useContext', 'useReducer'], 'correct_index' => 1, 'explanation' => 'useEffect runs after every render and is the place to handle side effects like data fetching or subscriptions.'],
            ['question' => 'What does JSX stand for?', 'options' => ['JavaScript XML', 'Java Syntax Extension', 'JSON XML', 'JavaScript Extension'], 'correct_index' => 0, 'explanation' => 'JSX stands for JavaScript XML — it allows you to write HTML-like syntax inside JavaScript.'],
            ['question' => 'How do you pass data from a parent to a child component in React?', 'options' => ['State', 'Props', 'Context', 'Redux'], 'correct_index' => 1, 'explanation' => 'Props (properties) are the primary mechanism for passing data down from parent to child components.'],
            ['question' => 'Which method is called when a React component is first rendered to the DOM?', 'options' => ['componentDidUpdate', 'componentWillMount', 'componentDidMount', 'render'], 'correct_index' => 2, 'explanation' => 'componentDidMount (or useEffect with an empty dependency array) runs once after the component has been inserted into the DOM.'],
            ['question' => 'What is the purpose of the virtual DOM in React?', 'options' => ['To replace traditional HTML entirely', 'To provide a memory-based representation for efficient UI diffing', 'To securely hash passwords in the browser', 'To manage CSS animations'], 'correct_index' => 1, 'explanation' => 'The Virtual DOM lets React compare the previous and new state and update only the parts of the real DOM that changed.'],
        ],
        'javascript' => [
            ['question' => 'Which keyword declares a block-scoped variable in modern JavaScript?', 'options' => ['var', 'let', 'define', 'static'], 'correct_index' => 1, 'explanation' => '`let` and `const` are block-scoped, unlike `var` which is function-scoped.'],
            ['question' => 'What does `===` check in JavaScript?', 'options' => ['Value only', 'Type only', 'Value and type', 'Reference equality'], 'correct_index' => 2, 'explanation' => 'Strict equality `===` checks both value and type, whereas `==` performs type coercion.'],
            ['question' => 'What is a closure in JavaScript?', 'options' => ['A function with no return value', 'A function that remembers its outer scope', 'An object constructor', 'An async function'], 'correct_index' => 1, 'explanation' => 'A closure is a function that retains access to the variables in its surrounding (lexical) scope even after the outer function has returned.'],
            ['question' => 'Which method converts a JSON string to a JavaScript object?', 'options' => ['JSON.stringify()', 'JSON.parse()', 'JSON.convert()', 'JSON.objectify()'], 'correct_index' => 1, 'explanation' => 'JSON.parse() deserializes a JSON string into a JavaScript object. JSON.stringify() does the reverse.'],
            ['question' => 'What is the event loop responsible for in JavaScript?', 'options' => ['Rendering the DOM', 'Managing memory allocation', 'Handling async callbacks from the call stack', 'Compiling TypeScript'], 'correct_index' => 2, 'explanation' => 'The event loop continuously checks the call stack and moves callbacks from the task queue to the stack when it is empty.'],
        ],
        'python' => [
            ['question' => 'Which data type is immutable in Python?', 'options' => ['List', 'Dictionary', 'Tuple', 'Set'], 'correct_index' => 2, 'explanation' => 'Tuples are immutable sequences — their elements cannot be changed after creation, unlike lists.'],
            ['question' => 'What does the `pandas` library primarily do?', 'options' => ['Machine learning', 'Data manipulation and analysis', 'Web scraping', 'Database ORM'], 'correct_index' => 1, 'explanation' => 'Pandas provides DataFrame and Series structures for powerful data manipulation and analysis.'],
            ['question' => 'Which keyword is used to define a function in Python?', 'options' => ['function', 'func', 'def', 'define'], 'correct_index' => 2, 'explanation' => 'Python uses the `def` keyword to define functions.'],
            ['question' => 'What is a list comprehension in Python?', 'options' => ['A way to document lists', 'A concise way to create lists from iterables', 'A type of sorted list', 'A built-in list class'], 'correct_index' => 1, 'explanation' => 'List comprehensions provide a concise syntax: `[expr for item in iterable if condition]`.'],
            ['question' => 'Which built-in function returns the number of items in a list?', 'options' => ['size()', 'count()', 'len()', 'length()'], 'correct_index' => 2, 'explanation' => '`len()` returns the number of items in any sequence or collection.'],
        ],
        'sql' => [
            ['question' => 'Which SQL clause is used to filter results?', 'options' => ['ORDER BY', 'GROUP BY', 'WHERE', 'HAVING'], 'correct_index' => 2, 'explanation' => 'WHERE filters rows before grouping; HAVING filters after grouping.'],
            ['question' => 'What does a JOIN operation do?', 'options' => ['Deletes related records', 'Combines rows from two or more tables based on a related column', 'Creates a new table', 'Indexes a column'], 'correct_index' => 1, 'explanation' => 'JOIN combines rows from multiple tables based on a matching column condition.'],
            ['question' => 'Which aggregate function returns the total count of rows?', 'options' => ['SUM()', 'AVG()', 'COUNT()', 'MAX()'], 'correct_index' => 2, 'explanation' => 'COUNT() returns the number of rows matching the condition.'],
            ['question' => 'What does PRIMARY KEY enforce?', 'options' => ['Unique and non-null values', 'Only unique values', 'Only non-null values', 'Foreign key reference'], 'correct_index' => 0, 'explanation' => 'A PRIMARY KEY uniquely identifies each row and cannot be NULL.'],
            ['question' => 'Which statement is used to retrieve data from a database?', 'options' => ['INSERT', 'UPDATE', 'SELECT', 'CREATE'], 'correct_index' => 2, 'explanation' => 'SELECT is the standard SQL statement for reading data.'],
        ],
        'figma' => [
            ['question' => 'What is a component in Figma?', 'options' => ['A page of the design', 'A reusable design element', 'A color style', 'An embedded image'], 'correct_index' => 1, 'explanation' => 'Components are reusable elements in Figma — changes to a master component propagate to all instances.'],
            ['question' => 'What does Auto Layout do in Figma?', 'options' => ['Automatically exports assets', 'Dynamically adjusts frame size based on content', 'Applies color schemes automatically', 'Generates code from designs'], 'correct_index' => 1, 'explanation' => 'Auto Layout lets frames resize dynamically to fit their content, great for responsive designs.'],
            ['question' => 'What are Figma Variants used for?', 'options' => ['Creating design systems with multiple states of a component', 'Exporting multiple file formats', 'Organizing pages', 'Sharing prototypes'], 'correct_index' => 0, 'explanation' => 'Variants group related components (e.g., button states: default, hover, disabled) into one master set.'],
            ['question' => 'Which Figma feature enables interactive prototyping?', 'options' => ['Grid system', 'Prototype panel with connections', 'Libraries', 'Inspect panel'], 'correct_index' => 1, 'explanation' => 'The Prototype panel allows you to add interactions and transitions between frames.'],
            ['question' => 'What does "Hand off" mode in Figma typically refer to?', 'options' => ['Transferring file ownership', 'Developer Inspect mode for CSS/measurements', 'Exporting the final PDF', 'Converting vectors to pixels'], 'correct_index' => 1, 'explanation' => 'Handoff (Inspect mode) gives developers detailed measurements, colors, and auto-generated CSS/Swift/Android code.'],
        ],
        'default' => [
            ['question' => 'What is the primary purpose of version control systems like Git?', 'options' => ['Data encryption', 'Tracking changes in code over time', 'Deploying applications', 'Managing databases'], 'correct_index' => 1, 'explanation' => 'Git tracks every change made to a codebase, enabling collaboration and rollback capabilities.'],
            ['question' => 'What does an API (Application Programming Interface) do?', 'options' => ['Designs the user interface', 'Allows different software systems to communicate', 'Compiles code', 'Manages databases'], 'correct_index' => 1, 'explanation' => 'APIs define contracts for how software components interact with each other.'],
            ['question' => 'What is Agile methodology focused on?', 'options' => ['Strict upfront planning', 'Iterative development and continuous feedback', 'Single large releases', 'Hardware management'], 'correct_index' => 1, 'explanation' => 'Agile emphasizes short, iterative cycles (sprints), continuous improvement, and collaboration.'],
            ['question' => 'Which HTTP method is typically used to create a new resource?', 'options' => ['GET', 'PUT', 'POST', 'DELETE'], 'correct_index' => 2, 'explanation' => 'POST is the conventional HTTP method for creating new resources on a server.'],
            ['question' => 'What does "responsive design" mean in web development?', 'options' => ['Fast server response times', 'UI that adapts to different screen sizes', 'Real-time data updates', 'Server-side rendering'], 'correct_index' => 1, 'explanation' => 'Responsive design uses flexible layouts and media queries so interfaces look great on any device size.'],
        ],
    ];

    private array $quizBankId = [
        'react' => [
            ['question' => 'Hook React mana yang digunakan untuk mengelola side effect?', 'options' => ['useState', 'useEffect', 'useContext', 'useReducer'], 'correct_index' => 1, 'explanation' => 'useEffect berjalan setelah setiap render untuk menangani aksi sampingan.'],
            ['question' => 'Apa kepanjangan dari JSX?', 'options' => ['JavaScript XML', 'Java Syntax Extension', 'JSON XML', 'JavaScript Extension'], 'correct_index' => 0, 'explanation' => 'JSX adalah JavaScript XML yang memungkinkan penulisan HTML di dalam JS.'],
            ['question' => 'Bagaimana cara meneruskan data dari komponen induk ke anak di React?', 'options' => ['State', 'Props', 'Context', 'Redux'], 'correct_index' => 1, 'explanation' => 'Props adalah mekanisme utama untuk meneruskan data dari komponen induk ke anak.'],
            ['question' => 'Metode mana yang dipanggil saat komponen React pertama kali dirender ke DOM?', 'options' => ['componentDidUpdate', 'componentWillMount', 'componentDidMount', 'render'], 'correct_index' => 2, 'explanation' => 'componentDidMount (atau useEffect dengan array kosong) berjalan sekali setelah komponen dimasukkan ke DOM.'],
            ['question' => 'Apa tujuan dari virtual DOM di React?', 'options' => ['Menggantikan HTML sepenuhnya', 'Menyediakan representasi memori untuk diffing UI yang efisien', 'Mengamankan kata sandi di browser', 'Mengelola animasi CSS'], 'correct_index' => 1, 'explanation' => 'Virtual DOM memungkinkan React membandingkan state sebelumnya dan yang baru lalu memperbarui hanya bagian DOM nyata yang berubah.'],
        ],
        'default' => [
            ['question' => 'Apa tujuan utama dari sistem kontrol versi seperti Git?', 'options' => ['Enkripsi data', 'Melacak perubahan kode dari waktu ke waktu', 'Men-deploy aplikasi', 'Mengelola database'], 'correct_index' => 1, 'explanation' => 'Git melacak setiap perubahan, memungkinkan kolaborasi dan rollback.'],
            ['question' => 'Apa fungsi API (Application Programming Interface)?', 'options' => ['Mendesain antarmuka pengguna', 'Memungkinkan sistem untuk berkomunikasi', 'Mengompilasi kode', 'Mengelola database'], 'correct_index' => 1, 'explanation' => 'API mendefinisikan kontrak cara komponen perangkat komputer berinteraksi.'],
            ['question' => 'Apa fokus metode Agile?', 'options' => ['Perencanaan awal yang ketat', 'Pengembangan iteratif dan umpan balik berkelanjutan', 'Rilis besar tunggal', 'Manajemen perangkat keras'], 'correct_index' => 1, 'explanation' => 'Agile menekankan siklus pendek (sprint), perbaikan berkelanjutan, dan kolaborasi.'],
            ['question' => 'Metode HTTP mana yang biasanya digunakan untuk membuat resource baru?', 'options' => ['GET', 'PUT', 'POST', 'DELETE'], 'correct_index' => 2, 'explanation' => 'POST adalah metode konvensional untuk membuat resource baru di server.'],
            ['question' => 'Apa arti "desain responsif" dalam pengembangan web?', 'options' => ['Waktu respons server yang cepat', 'UI yang beradaptasi dengan ukuran layar yang berbeda', 'Pembaruan data real-time', 'Rendering sisi server'], 'correct_index' => 1, 'explanation' => 'Desain responsif menggunakan layout fleksibel agar antarmuka tampak bagus di berbagai ukuran perangkat.'],
        ],
    ];

    #[OA\Post(path: '/api/ai/cv-summary', operationId: 'generateCvSummary', summary: 'Generate an AI powered CV Summary', description: 'Generates a professional summary based on the provided target role and skills.', tags: ['AI Features'])]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['role'],
            properties: [
                new OA\Property(property: 'role', type: 'string', example: 'Frontend Developer'),
                new OA\Property(property: 'skills', type: 'array', items: new OA\Items(type: 'string')),
            ]
        )
    )]
    #[OA\Response(
        response: 200,
        description: 'Successful response',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'summary', type: 'string', example: 'Highly motivated Frontend Developer...'),
            ]
        )
    )]
    #[OA\Response(response: 400, description: 'Invalid input')]
    public function generateCvSummary(Request $request): JsonResponse
    {
        $request->validate([
            'role' => 'required|string',
            'skills' => 'nullable|array',
        ]);

        $role = $request->input('role');
        $skills = $request->input('skills', []);

        usleep(1500000);

        $baseSummary = $this->aiSummaries[$role] ?? 'Versatile tech professional with a passion for continuous learning and problem solving. Dedicated to delivering high-quality results in cross-functional team environments.';

        if (! empty($skills)) {
            $skillsStr = implode(', ', array_slice($skills, 0, 3));
            $suffixes = [
                " Deeply specialized in $skillsStr, ready to make an immediate, measurable impact.",
                " Brings hands-on technical proficiency with $skillsStr to accelerate project delivery.",
                " Leverages expertise in $skillsStr to craft robust, scalable solutions.",
                " Continuously refining skills in $skillsStr to stay at the cutting edge of industry standards.",
                " Combines a strong foundational knowledge of $skillsStr with a highly adaptable work ethic.",
            ];
            $baseSummary .= $suffixes[array_rand($suffixes)];
        }

        $prefixes = ['Driven and ', 'Highly capable ', 'Innovative ', 'Detail-oriented ', ''];
        $prefix = $prefixes[array_rand($prefixes)];

        if ($prefix) {
            $baseSummary = $prefix.lcfirst($baseSummary);
        }

        return response()->json(['summary' => $baseSummary]);
    }

    #[OA\Post(path: '/api/ai/match-jobs', operationId: 'matchJobs', summary: 'Match Jobs using AI scoring', description: 'Scores a list of jobs based on the user\'s interest, enrolled courses, and skills.', tags: ['AI Features'])]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['jobs'],
            properties: [
                new OA\Property(property: 'interest', type: 'string', example: 'logic'),
                new OA\Property(property: 'courses', type: 'array', items: new OA\Items(type: 'string'), description: 'Titles of enrolled or bookmarked courses'),
                new OA\Property(property: 'skills', type: 'array', items: new OA\Items(type: 'string'), description: 'Known skills from user profile'),
                new OA\Property(property: 'jobs', type: 'array', items: new OA\Items(type: 'object')),
            ]
        )
    )]
    #[OA\Response(
        response: 200,
        description: 'Successfully scored jobs',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'jobs', type: 'array', items: new OA\Items(type: 'object')),
            ]
        )
    )]
    public function matchJobs(Request $request): JsonResponse
    {
        $request->validate([
            'interest' => 'nullable|string',
            'courses' => 'nullable|array',
            'courses.*' => 'string',
            'skills' => 'nullable|array',
            'skills.*' => 'string',
            'jobs' => 'required|array',
            'jobs.*.id' => 'required|integer',
            'jobs.*.skills' => 'required|array',
        ]);

        $interestKey = $request->input('interest');
        $inputJobs = $request->input('jobs');
        $userCourses = $request->input('courses', []);
        $userSkills = $request->input('skills', []);

        usleep(800000);

        // Derive preferred skills from interest key
        $preferredSkills = $this->interestSkillMap[$interestKey] ?? [];

        // Derive additional preferred skills from enrolled courses (title keyword matching)
        foreach ($userCourses as $courseTitle) {
            $lowTitle = strtolower((string) $courseTitle);
            foreach ($this->courseTitleSkillMap as $keyword => $mappedSkills) {
                if (str_contains($lowTitle, $keyword)) {
                    $preferredSkills = array_unique(array_merge($preferredSkills, $mappedSkills));
                }
            }
        }

        // Merge explicitly provided user skills as additional preferences
        if (! empty($userSkills)) {
            $preferredSkills = array_unique(array_merge($preferredSkills, $userSkills));
        }

        $scoredJobs = array_map(function (array $job) use ($preferredSkills, $interestKey): array {
            if (! $interestKey && empty($preferredSkills)) {
                $score = mt_rand(50, 80);
            } else {
                $jobSkills = $job['skills'];
                $overlap = 0;

                foreach ($jobSkills as $jobSkill) {
                    foreach ($preferredSkills as $preferred) {
                        if (strtolower((string) $preferred) === strtolower((string) $jobSkill)) {
                            $overlap++;
                            break;
                        }
                    }
                }

                $baseScore = min(100, round(($overlap / max(count($jobSkills), 1)) * 100 * 1.3));
                $score = max(40, $baseScore);
            }

            return [
                'id' => $job['id'],
                'matchScore' => $score,
            ];
        }, $inputJobs);

        usort($scoredJobs, fn ($a, $b) => $b['matchScore'] <=> $a['matchScore']);

        return response()->json(['jobs' => $scoredJobs]);
    }

    #[OA\Post(path: '/api/ai/generate-quiz', operationId: 'generateQuiz', summary: 'Generate AI quiz questions', description: 'Returns 5 curated multiple-choice questions based on a topic (course title or job role).', tags: ['AI Features'])]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['topic'],
            properties: [
                new OA\Property(property: 'topic', type: 'string', example: 'React Modern Patterns'),
                new OA\Property(property: 'difficulty', type: 'string', enum: ['beginner', 'intermediate', 'advanced'], example: 'intermediate'),
            ]
        )
    )]
    #[OA\Response(
        response: 200,
        description: 'Generated quiz questions',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'topic', type: 'string'),
                new OA\Property(property: 'difficulty', type: 'string'),
                new OA\Property(property: 'questions', type: 'array', items: new OA\Items(type: 'object')),
            ]
        )
    )]
    public function generateQuiz(Request $request): JsonResponse
    {
        $request->validate([
            'topic' => 'required|string|max:200',
            'difficulty' => 'nullable|string|in:beginner,intermediate,advanced',
            'lang' => 'nullable|string|in:en,id',
        ]);

        $topic = $request->input('topic');
        $difficulty = $request->input('difficulty', 'intermediate');
        $lang = $request->input('lang', 'en');

        // Simulated AI thinking time
        usleep(1200000);

        // Resolve questions by matching topic keyword against the bank
        $questions = $this->resolveQuestionsForTopic($topic, $lang);

        // Tag each question with an id for frontend keying
        $numberedQuestions = array_map(
            fn (array $q, int $index): array => array_merge($q, ['id' => $index + 1]),
            $questions,
            array_keys($questions)
        );

        return response()->json([
            'topic' => $topic,
            'difficulty' => $difficulty,
            'questions' => $numberedQuestions,
        ]);
    }

    /**
     * Resolves 5 questions from the bank for the given topic string.
     *
     * @return list<array{question: string, options: list<string>, correct_index: int, explanation: string}>
     */
    private function resolveQuestionsForTopic(string $topic, string $lang): array
    {
        $lowTopic = strtolower($topic);
        $bank = $lang === 'id' ? $this->quizBankId : $this->quizBank;

        foreach ($bank as $keyword => $questions) {
            if ($keyword !== 'default' && str_contains($lowTopic, $keyword)) {
                return $questions;
            }
        }

        return $bank['default'] ?? $this->quizBank['default'];
    }
}
