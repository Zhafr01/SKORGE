<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\JobRole;
use App\Models\Video;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CourseVideoSeeder extends Seeder
{
    /**
     * Seed job roles, courses, and real YouTube tutorial videos.
     */
    public function run(): void
    {
        $roles = $this->getRolesData();
        $courseOrder = 0;

        foreach ($roles as $roleName => $roleData) {
            $jobRole = JobRole::create([
                'name' => $roleName,
                'slug' => Str::slug($roleName),
                'description' => $roleData['description'],
                'icon' => $roleData['icon'],
                'category' => $roleData['category'],
            ]);

            foreach ($roleData['courses'] as $courseData) {
                $courseOrder++;
                $course = Course::create([
                    'job_role_id' => $jobRole->id,
                    'title' => $courseData['title'],
                    'slug' => Str::slug($courseData['title'].'-'.$courseOrder),
                    'description' => $courseData['description'],
                    'field' => $courseData['field'],
                    'level' => $courseData['level'],
                    'duration_minutes' => $courseData['duration_minutes'],
                    'order' => $courseOrder,
                ]);

                foreach ($courseData['videos'] as $videoOrder => $videoData) {
                    Video::create([
                        'course_id' => $course->id,
                        'title' => $videoData['title'],
                        'slug' => Str::slug($videoData['title'].'-'.$course->id.'-'.($videoOrder + 1)),
                        'description' => $videoData['description'] ?? null,
                        'url' => $videoData['url'],
                        'duration_seconds' => $videoData['duration_seconds'],
                        'order' => $videoOrder + 1,
                    ]);
                }
            }
        }
    }

    /**
     * @return array<string, array{description: string, icon: string, category: string, courses: list<array>}>
     */
    private function getRolesData(): array
    {
        return [
            // ═══════════════════════════════════════════════
            // 1. FULL-STACK WEB DEVELOPER
            // ═══════════════════════════════════════════════
            'Full-Stack Web Developer' => [
                'description' => 'Build complete web applications from front-end interfaces to back-end systems and databases.',
                'icon' => '💻',
                'category' => 'Engineering',
                'courses' => [
                    [
                        'title' => 'HTML Fundamentals',
                        'description' => 'Learn the building blocks of every website with HTML5 semantic markup.',
                        'field' => 'IT',
                        'level' => 'Beginner',
                        'duration_minutes' => 180,
                        'videos' => [
                            ['title' => 'HTML Full Course for Beginners – Complete All-in-One Tutorial', 'url' => 'https://www.youtube.com/watch?v=kUMe1FH4CHE', 'duration_seconds' => 14400, 'description' => 'Dave Gray (via freeCodeCamp)'],
                            ['title' => 'HTML & CSS Full Course – Beginner to Pro', 'url' => 'https://www.youtube.com/watch?v=G3e-cpL7ofc', 'duration_seconds' => 23400, 'description' => 'SuperSimpleDev'],
                            ['title' => 'HTML Crash Course For Absolute Beginners', 'url' => 'https://www.youtube.com/watch?v=UB1O30fR-EE', 'duration_seconds' => 3600, 'description' => 'Traversy Media'],
                            ['title' => 'HTML Tutorial for Beginners: HTML Crash Course', 'url' => 'https://www.youtube.com/watch?v=qz0aGYrrlhU', 'duration_seconds' => 3600, 'description' => 'Programming with Mosh'],
                        ],
                    ],
                    [
                        'title' => 'CSS Styling & Layout',
                        'description' => 'Master CSS styling, Flexbox, CSS Grid, and responsive design techniques.',
                        'field' => 'IT',
                        'level' => 'Beginner',
                        'duration_minutes' => 240,
                        'videos' => [
                            ['title' => 'CSS Full Course for Beginners – Complete All-in-One Tutorial', 'url' => 'https://www.youtube.com/watch?v=n4R2E7O-Ngo', 'duration_seconds' => 39600, 'description' => 'Dave Gray (via freeCodeCamp)'],
                            ['title' => 'CSS Tutorial – Full Course for Beginners', 'url' => 'https://www.youtube.com/watch?v=OXGznpKZ_sA', 'duration_seconds' => 39600, 'description' => 'freeCodeCamp.org'],
                            ['title' => 'HTML & CSS Full Course – Beginner to Pro', 'url' => 'https://www.youtube.com/watch?v=G3e-cpL7ofc', 'duration_seconds' => 23400, 'description' => 'SuperSimpleDev (covers both HTML & CSS)'],
                            ['title' => 'CSS Crash Course For Absolute Beginners', 'url' => 'https://www.youtube.com/watch?v=yfoY53QXEnI', 'duration_seconds' => 5400, 'description' => 'Traversy Media'],
                        ],
                    ],
                    [
                        'title' => 'JavaScript from Zero to Hero',
                        'description' => 'Master JavaScript from variables to async programming and DOM manipulation.',
                        'field' => 'IT',
                        'level' => 'Beginner',
                        'duration_minutes' => 360,
                        'videos' => [
                            ['title' => 'JavaScript Full Course – Beginner to Pro', 'url' => 'https://www.youtube.com/watch?v=EerdGm-ehJQ', 'duration_seconds' => 39600, 'description' => 'SuperSimpleDev'],
                            ['title' => 'JavaScript Full Course (2024)', 'url' => 'https://www.youtube.com/watch?v=lfmg-EJ8gm4', 'duration_seconds' => 28800, 'description' => 'Bro Code'],
                            ['title' => 'JavaScript Programming – Full Course', 'url' => 'https://www.youtube.com/watch?v=jS4aFq5-91M', 'duration_seconds' => 28800, 'description' => 'freeCodeCamp.org'],
                            ['title' => 'JavaScript Tutorial for Beginners', 'url' => 'https://www.youtube.com/watch?v=W6NZfCO5SIk', 'duration_seconds' => 3600, 'description' => 'Programming with Mosh'],
                        ],
                    ],
                    [
                        'title' => 'React.js Modern Frontend',
                        'description' => 'Build modern, component-based user interfaces with React hooks and state management.',
                        'field' => 'IT',
                        'level' => 'Intermediate',
                        'duration_minutes' => 480,
                        'videos' => [
                            ['title' => 'ReactJS Full Course for Beginners – Complete All-in-One Tutorial', 'url' => 'https://www.youtube.com/watch?v=RVFAyFWO4go', 'duration_seconds' => 32400, 'description' => 'Dave Gray'],
                            ['title' => 'React Course – Beginner\'s Tutorial for React JavaScript Library', 'url' => 'https://www.youtube.com/watch?v=bMknfKXIFA8', 'duration_seconds' => 39600, 'description' => 'freeCodeCamp.org (Bob Ziroll / Scrimba)'],
                            ['title' => 'React Full Course – Beginner\'s Guide to React Library 2024', 'url' => 'https://www.youtube.com/watch?v=CgkZ7MvWUAA', 'duration_seconds' => 28800, 'description' => 'Bro Code'],
                            ['title' => 'React Full Course', 'url' => 'https://www.youtube.com/watch?v=ZXIN4Nee5JU', 'duration_seconds' => 21600, 'description' => 'SuperSimpleDev'],
                        ],
                    ],
                    [
                        'title' => 'Node.js & Express Backend',
                        'description' => 'Build RESTful APIs and server-side applications with Node.js and Express.',
                        'field' => 'IT',
                        'level' => 'Intermediate',
                        'duration_minutes' => 480,
                        'videos' => [
                            ['title' => 'Node.js Full Course for Beginners – Complete All-in-One Tutorial', 'url' => 'https://www.youtube.com/watch?v=f2EqECiTBL8', 'duration_seconds' => 25200, 'description' => 'Dave Gray'],
                            ['title' => 'Node.js and Express.js – Full Course', 'url' => 'https://www.youtube.com/watch?v=Oe421EPjeBE', 'duration_seconds' => 28800, 'description' => 'freeCodeCamp.org'],
                            ['title' => 'Node.js Crash Course', 'url' => 'https://www.youtube.com/watch?v=32M1al-Y6Ag', 'duration_seconds' => 5400, 'description' => 'Traversy Media'],
                            ['title' => 'Node.js Full Course for Beginners (2024)', 'url' => 'https://www.youtube.com/watch?v=ooBxSg1Cl1w', 'duration_seconds' => 21600, 'description' => 'Bro Code'],
                        ],
                    ],
                    [
                        'title' => 'SQL & Database Design',
                        'description' => 'Master relational database design, SQL queries, joins, and data modeling.',
                        'field' => 'IT',
                        'level' => 'Intermediate',
                        'duration_minutes' => 300,
                        'videos' => [
                            ['title' => 'SQL Tutorial - Full Database Course for Beginners', 'url' => 'https://www.youtube.com/watch?v=HXV3zeQKqGY', 'duration_seconds' => 15600, 'description' => 'freeCodeCamp 4+ hour SQL fundamentals course.'],
                            ['title' => 'MySQL Tutorial for Beginners', 'url' => 'https://www.youtube.com/watch?v=7S_tz1z_5bA', 'duration_seconds' => 10800, 'description' => 'Programming with Mosh 3-hour MySQL course.'],
                            ['title' => 'Database Design Course - Learn How to Design & Plan a Database', 'url' => 'https://www.youtube.com/watch?v=ztHopE5Wnpc', 'duration_seconds' => 28800, 'description' => 'freeCodeCamp 8-hour database design and planning course.'],
                        ],
                    ],
                    [
                        'title' => 'Git & GitHub Workflow',
                        'description' => 'Version control with Git and collaborative workflows using GitHub.',
                        'field' => 'IT',
                        'level' => 'Beginner',
                        'duration_minutes' => 60,
                        'videos' => [
                            ['title' => 'Git and GitHub for Beginners - Crash Course', 'url' => 'https://www.youtube.com/watch?v=RGOj5yH7evk', 'duration_seconds' => 4080, 'description' => 'freeCodeCamp Git & GitHub crash course for beginners.'],
                            ['title' => 'Git Tutorial for Beginners: Learn Git in 1 Hour', 'url' => 'https://www.youtube.com/watch?v=8JJ101D3knE', 'duration_seconds' => 4200, 'description' => 'Programming with Mosh complete Git tutorial.'],
                            ['title' => 'Git Branching and Merging - Detailed Tutorial', 'url' => 'https://www.youtube.com/watch?v=Q1kHG842HoI', 'duration_seconds' => 1200, 'description' => 'Practical branching strategies and merge conflict resolution.'],
                        ],
                    ],
                ],
            ],

            // ═══════════════════════════════════════════════
            // 2. UI/UX DESIGNER
            // ═══════════════════════════════════════════════
            'UI/UX Designer' => [
                'description' => 'Design beautiful, user-centered digital experiences using industry-standard tools and methodologies.',
                'icon' => '🎨',
                'category' => 'Design',
                'courses' => [
                    [
                        'title' => 'UI/UX Design Fundamentals',
                        'description' => 'Understand the core principles of user experience and user interface design.',
                        'field' => 'Design',
                        'level' => 'Beginner',
                        'duration_minutes' => 120,
                        'videos' => [
                            ['title' => 'UI / UX Design Tutorial – Wireframe, Mockup & Design in Figma', 'url' => 'https://www.youtube.com/watch?v=c9Wg6Cb_YlU', 'duration_seconds' => 5400, 'description' => 'freeCodeCamp complete UI/UX design process tutorial.'],
                            ['title' => 'The 2024 UI Design Crash Course for Beginners', 'url' => 'https://www.youtube.com/watch?v=_Hp_dI0DzY4', 'duration_seconds' => 2400, 'description' => 'Gary Simon UI design fundamentals crash course.'],
                            ['title' => '4 Foundational UI Design Principles', 'url' => 'https://www.youtube.com/watch?v=gkvOywKIS4Y', 'duration_seconds' => 1200, 'description' => 'Essential design principles: contrast, alignment, repetition, proximity.'],
                            ['title' => 'UX Design vs UI Design - What\'s The Difference?', 'url' => 'https://www.youtube.com/watch?v=5CxXhyhT6Fc', 'duration_seconds' => 600, 'description' => 'Clear explanation of UX vs UI roles and responsibilities.'],
                        ],
                    ],
                    [
                        'title' => 'Figma Complete Guide',
                        'description' => 'Master Figma from basics to advanced prototyping, components, and design systems.',
                        'field' => 'Design',
                        'level' => 'Beginner',
                        'duration_minutes' => 300,
                        'videos' => [
                            ['title' => 'Figma Tutorial for UI Design - Course for Beginners', 'url' => 'https://www.youtube.com/watch?v=jwCmIBJ8Jtc', 'duration_seconds' => 10800, 'description' => 'freeCodeCamp 3-hour Figma course from zero to hero.'],
                            ['title' => 'Figma Tutorial for Beginners: Complete Website from Start to Finish', 'url' => 'https://www.youtube.com/watch?v=HZuk6Wkx_Eg', 'duration_seconds' => 4200, 'description' => 'Flux Academy complete Figma website design walkthrough.'],
                            ['title' => 'Figma in 40 Minutes', 'url' => 'https://www.youtube.com/watch?v=4W4LvJnNegA', 'duration_seconds' => 2400, 'description' => 'DesignCourse rapid-fire overview of Figma features.'],
                            ['title' => 'Advanced Figma Tips: Components, Auto Layout, Variants', 'url' => 'https://www.youtube.com/watch?v=EK-pHkc5EL4', 'duration_seconds' => 3600, 'description' => 'Advanced Figma features for building design systems.'],
                        ],
                    ],
                    [
                        'title' => 'User Research & Usability Testing',
                        'description' => 'Conduct user research, create personas, and run usability tests to improve designs.',
                        'field' => 'Design',
                        'level' => 'Intermediate',
                        'duration_minutes' => 120,
                        'videos' => [
                            ['title' => 'User Research Basics – How to Conduct UX Research', 'url' => 'https://www.youtube.com/watch?v=zGCRhd3r4fE', 'duration_seconds' => 2400, 'description' => 'Step-by-step guide to user research methodologies.'],
                            ['title' => 'How to Conduct User Interviews', 'url' => 'https://www.youtube.com/watch?v=MT4Ig2uqjTc', 'duration_seconds' => 1800, 'description' => 'Practical tips for effective user interviews.'],
                            ['title' => 'Design Thinking Explained', 'url' => 'https://www.youtube.com/watch?v=_r0VX-aU_T8', 'duration_seconds' => 1800, 'description' => 'IBM design thinking process and methodology.'],
                            ['title' => 'How to Create User Personas', 'url' => 'https://www.youtube.com/watch?v=GaEdg9zTdB8', 'duration_seconds' => 900, 'description' => 'Create effective user personas for your design process.'],
                        ],
                    ],
                    [
                        'title' => 'Design Systems & Component Libraries',
                        'description' => 'Build scalable design systems with reusable components and style guides.',
                        'field' => 'Design',
                        'level' => 'Intermediate',
                        'duration_minutes' => 150,
                        'videos' => [
                            ['title' => 'Design Systems, Pattern Libraries & Style Guides... Oh My!', 'url' => 'https://www.youtube.com/watch?v=rO5dBA-avfw', 'duration_seconds' => 1200, 'description' => 'Understanding the differences between design systems and their components.'],
                            ['title' => 'Building a Design System in Figma', 'url' => 'https://www.youtube.com/watch?v=EK-pHkc5EL4', 'duration_seconds' => 3600, 'description' => 'Hands-on tutorial for creating a comprehensive design system.'],
                            ['title' => 'Color Theory for Designers', 'url' => 'https://www.youtube.com/watch?v=YeI6Wqn4I78', 'duration_seconds' => 1200, 'description' => 'Understanding color theory for effective UI design.'],
                        ],
                    ],
                    [
                        'title' => 'Responsive & Mobile Design',
                        'description' => 'Design for all screen sizes using responsive and mobile-first principles.',
                        'field' => 'Design',
                        'level' => 'Intermediate',
                        'duration_minutes' => 100,
                        'videos' => [
                            ['title' => 'Responsive Web Design Tutorial', 'url' => 'https://www.youtube.com/watch?v=srvUrASNj0s', 'duration_seconds' => 3600, 'description' => 'Kevin Powell responsive design tutorial from beginner to advanced.'],
                            ['title' => 'Mobile App Design in Figma – Full Course', 'url' => 'https://www.youtube.com/watch?v=PeGfX7W1mJk', 'duration_seconds' => 7200, 'description' => 'Complete mobile app UI design course in Figma.'],
                            ['title' => 'Responsive Web Design - What It Is And How To Use It', 'url' => 'https://www.youtube.com/watch?v=ZYV6dYtz4HA', 'duration_seconds' => 900, 'description' => 'Responsive design concepts and breakpoint strategies.'],
                        ],
                    ],
                ],
            ],

            // ═══════════════════════════════════════════════
            // 3. DATA SCIENTIST
            // ═══════════════════════════════════════════════
            'Data Scientist' => [
                'description' => 'Analyze data, build machine learning models, and extract insights from complex datasets.',
                'icon' => '📊',
                'category' => 'Data',
                'courses' => [
                    [
                        'title' => 'Python Programming for Data Science',
                        'description' => 'Learn Python programming with focus on data manipulation and analysis libraries.',
                        'field' => 'Data',
                        'level' => 'Beginner',
                        'duration_minutes' => 300,
                        'videos' => [
                            ['title' => 'Learn Python - Full Course for Beginners', 'url' => 'https://www.youtube.com/watch?v=rfscVS0vtbw', 'duration_seconds' => 16080, 'description' => 'freeCodeCamp 4.5-hour complete Python tutorial for beginners.'],
                            ['title' => 'Python Tutorial - Python Full Course for Beginners', 'url' => 'https://www.youtube.com/watch?v=_uQrJ0TkZlc', 'duration_seconds' => 21600, 'description' => 'Programming with Mosh 6-hour Python for beginners.'],
                            ['title' => 'Intermediate Python Programming Course', 'url' => 'https://www.youtube.com/watch?v=HGOBQPFzWKo', 'duration_seconds' => 21600, 'description' => 'freeCodeCamp intermediate Python – OOP, generators, decorators.'],
                        ],
                    ],
                    [
                        'title' => 'Data Analysis with Pandas & NumPy',
                        'description' => 'Master core data science libraries: Pandas for data manipulation and NumPy for numerical computing.',
                        'field' => 'Data',
                        'level' => 'Beginner',
                        'duration_minutes' => 240,
                        'videos' => [
                            ['title' => 'Data Analysis with Python - Full Course for Beginners', 'url' => 'https://www.youtube.com/watch?v=r-uOLxNrNk8', 'duration_seconds' => 16200, 'description' => 'freeCodeCamp Pandas, NumPy, Matplotlib, and Seaborn full course.'],
                            ['title' => 'Pandas Tutorial - Data Analysis with Python', 'url' => 'https://www.youtube.com/watch?v=vmEHCJofslg', 'duration_seconds' => 5400, 'description' => 'freeCodeCamp Pandas crash course for data manipulation.'],
                            ['title' => 'NumPy Tutorial for Beginners', 'url' => 'https://www.youtube.com/watch?v=QUT1VHiLmmI', 'duration_seconds' => 3600, 'description' => 'freeCodeCamp NumPy fundamentals – arrays, operations, broadcasting.'],
                            ['title' => 'Python Pandas Tutorial for Beginners', 'url' => 'https://www.youtube.com/watch?v=ZyhVh-qRZPA', 'duration_seconds' => 3600, 'description' => 'Corey Schafer practical Pandas tutorial series.'],
                        ],
                    ],
                    [
                        'title' => 'Statistics & Probability for Data Science',
                        'description' => 'Master statistics and probability foundations needed for data science.',
                        'field' => 'Data',
                        'level' => 'Beginner',
                        'duration_minutes' => 300,
                        'videos' => [
                            ['title' => 'Statistics - A Full University Course on Data Science Basics', 'url' => 'https://www.youtube.com/watch?v=xxpc-HPKN28', 'duration_seconds' => 28800, 'description' => 'freeCodeCamp 8-hour university-level statistics course.'],
                            ['title' => 'Probability Explained - Introduction to Probability', 'url' => 'https://www.youtube.com/watch?v=uzkc-qNVoOk', 'duration_seconds' => 3600, 'description' => 'Comprehensive probability introduction from zedstatistics.'],
                            ['title' => 'Statistics Fundamentals - StatQuest', 'url' => 'https://www.youtube.com/watch?v=qBigTkBLU6g', 'duration_seconds' => 1200, 'description' => 'StatQuest with Josh Starmer – statistics explained clearly.'],
                        ],
                    ],
                    [
                        'title' => 'Machine Learning Fundamentals',
                        'description' => 'Understand core ML algorithms – regression, classification, clustering, and evaluation.',
                        'field' => 'Data',
                        'level' => 'Intermediate',
                        'duration_minutes' => 600,
                        'videos' => [
                            ['title' => 'Machine Learning Course for Beginners', 'url' => 'https://www.youtube.com/watch?v=NWONeJKn6kc', 'duration_seconds' => 36000, 'description' => 'freeCodeCamp 10-hour machine learning full course.'],
                            ['title' => 'Scikit-Learn Crash Course - Machine Learning Library', 'url' => 'https://www.youtube.com/watch?v=0B5eIE_1vpU', 'duration_seconds' => 5400, 'description' => 'freeCodeCamp scikit-learn practical tutorial.'],
                            ['title' => 'Machine Learning Explained in 100 Seconds', 'url' => 'https://www.youtube.com/watch?v=PeMlggyqz0Y', 'duration_seconds' => 180, 'description' => 'Fireship ultra-concise ML concepts overview.'],
                            ['title' => 'Linear Regression in Python - Machine Learning From Scratch', 'url' => 'https://www.youtube.com/watch?v=4PHI11lX11I', 'duration_seconds' => 1200, 'description' => 'Implement linear regression from scratch in Python.'],
                        ],
                    ],
                    [
                        'title' => 'Data Visualization',
                        'description' => 'Create compelling visualizations with Matplotlib, Seaborn, and Plotly.',
                        'field' => 'Data',
                        'level' => 'Intermediate',
                        'duration_minutes' => 120,
                        'videos' => [
                            ['title' => 'Matplotlib Tutorial - Full Python Course', 'url' => 'https://www.youtube.com/watch?v=3Xc3CA655Y4', 'duration_seconds' => 3000, 'description' => 'NeuralNine full Matplotlib visualization course.'],
                            ['title' => 'Data Visualization with Python Full Course', 'url' => 'https://www.youtube.com/watch?v=a9UrKTVEeZA', 'duration_seconds' => 7200, 'description' => 'Complete data visualization with Matplotlib and Seaborn.'],
                            ['title' => 'Seaborn Tutorial - Python Seaborn Full Course', 'url' => 'https://www.youtube.com/watch?v=6GUZXDef2U0', 'duration_seconds' => 2400, 'description' => 'Derek Banas comprehensive Seaborn tutorial.'],
                        ],
                    ],
                ],
            ],

            // ═══════════════════════════════════════════════
            // 4. DIGITAL MARKETER
            // ═══════════════════════════════════════════════
            'Digital Marketer' => [
                'description' => 'Plan and execute digital marketing strategies across SEO, social media, ads, and content.',
                'icon' => '📣',
                'category' => 'Marketing',
                'courses' => [
                    [
                        'title' => 'Digital Marketing Foundations',
                        'description' => 'Overview of digital marketing channels, funnels, strategies, and KPIs.',
                        'field' => 'Marketing',
                        'level' => 'Beginner',
                        'duration_minutes' => 660,
                        'videos' => [
                            ['title' => 'Digital Marketing Course - 11 Hours Full Course', 'url' => 'https://www.youtube.com/watch?v=nU-IIXBWlS4', 'duration_seconds' => 40200, 'description' => 'Simplilearn complete 11-hour digital marketing course.'],
                            ['title' => 'What Is Digital Marketing? Everything You Need to Know', 'url' => 'https://www.youtube.com/watch?v=bixR-KIJKYM', 'duration_seconds' => 900, 'description' => 'HubSpot overview of digital marketing channels and principles.'],
                            ['title' => 'Marketing Funnel Explained - Sales Funnel Tutorial', 'url' => 'https://www.youtube.com/watch?v=hFOQdFJkMIQ', 'duration_seconds' => 900, 'description' => 'Understanding the marketing funnel stages TOFU, MOFU, BOFU.'],
                        ],
                    ],
                    [
                        'title' => 'SEO Mastery',
                        'description' => 'Learn on-page, off-page, and technical SEO to rank websites higher in search results.',
                        'field' => 'Marketing',
                        'level' => 'Intermediate',
                        'duration_minutes' => 240,
                        'videos' => [
                            ['title' => 'SEO Full Course for Beginners', 'url' => 'https://www.youtube.com/watch?v=xsVTqzratPs', 'duration_seconds' => 14400, 'description' => 'Ahrefs comprehensive SEO course – keyword research, link building, technical SEO.'],
                            ['title' => 'SEO for Beginners: Rank #1 In Google', 'url' => 'https://www.youtube.com/watch?v=IkmPjeNKkBQ', 'duration_seconds' => 1200, 'description' => 'Brian Dean step-by-step SEO ranking strategy.'],
                            ['title' => 'Keyword Research Tutorial - From Beginner to Advanced', 'url' => 'https://www.youtube.com/watch?v=OMJQPqG2Uas', 'duration_seconds' => 1800, 'description' => 'Ahrefs in-depth keyword research tutorial.'],
                            ['title' => 'On-Page SEO - 9 Actionable Techniques', 'url' => 'https://www.youtube.com/watch?v=jl0wjhJzPdo', 'duration_seconds' => 1200, 'description' => 'Ahrefs on-page SEO optimization techniques.'],
                        ],
                    ],
                    [
                        'title' => 'Social Media Marketing',
                        'description' => 'Grow brand awareness and engagement across Instagram, TikTok, LinkedIn, and more.',
                        'field' => 'Marketing',
                        'level' => 'Beginner',
                        'duration_minutes' => 300,
                        'videos' => [
                            ['title' => 'Social Media Marketing Full Course', 'url' => 'https://www.youtube.com/watch?v=GkPUjd3hNOA', 'duration_seconds' => 18000, 'description' => 'Simplilearn complete social media marketing course.'],
                            ['title' => 'Instagram Marketing Full Course', 'url' => 'https://www.youtube.com/watch?v=Wkk-lE9jHKI', 'duration_seconds' => 1500, 'description' => 'InstagramMarketing growth strategies and content planning.'],
                            ['title' => 'Content Marketing Full Course', 'url' => 'https://www.youtube.com/watch?v=p1dPh8kAdIA', 'duration_seconds' => 10800, 'description' => 'Simplilearn content marketing strategy course.'],
                        ],
                    ],
                    [
                        'title' => 'Google Ads & PPC Advertising',
                        'description' => 'Create and optimize pay-per-click campaigns with Google Ads for maximum ROI.',
                        'field' => 'Marketing',
                        'level' => 'Intermediate',
                        'duration_minutes' => 180,
                        'videos' => [
                            ['title' => 'Google Ads Tutorial for Beginners', 'url' => 'https://www.youtube.com/watch?v=oQw8pn-xgZY', 'duration_seconds' => 10800, 'description' => 'Surfside PPC complete Google Ads tutorial.'],
                            ['title' => 'Google Analytics 4 Tutorial for Beginners', 'url' => 'https://www.youtube.com/watch?v=dPYx-eS4gyE', 'duration_seconds' => 5400, 'description' => 'Loves Data GA4 beginner tutorial for tracking and analysis.'],
                            ['title' => 'PPC Marketing Explained for Beginners', 'url' => 'https://www.youtube.com/watch?v=kxBE2j9bJHk', 'duration_seconds' => 900, 'description' => 'Pay-per-click advertising concepts and best practices.'],
                        ],
                    ],
                ],
            ],

            // ═══════════════════════════════════════════════
            // 5. MOBILE APP DEVELOPER
            // ═══════════════════════════════════════════════
            'Mobile App Developer' => [
                'description' => 'Build cross-platform and native mobile applications for iOS and Android.',
                'icon' => '📱',
                'category' => 'Engineering',
                'courses' => [
                    [
                        'title' => 'Flutter & Dart Development',
                        'description' => 'Build beautiful, natively-compiled mobile apps with Dart and the Flutter framework.',
                        'field' => 'IT',
                        'level' => 'Beginner',
                        'duration_minutes' => 420,
                        'videos' => [
                            ['title' => 'Flutter Course for Beginners – 37-hour Cross Platform App Development', 'url' => 'https://www.youtube.com/watch?v=VPvVD8t02U8', 'duration_seconds' => 13380, 'description' => 'freeCodeCamp comprehensive Flutter full course.'],
                            ['title' => 'Dart Programming Tutorial - Full Course', 'url' => 'https://www.youtube.com/watch?v=Ej_Pcr4uC2Q', 'duration_seconds' => 4500, 'description' => 'freeCodeCamp Dart language fundamentals course.'],
                            ['title' => 'Flutter Widget Tutorial for Beginners', 'url' => 'https://www.youtube.com/watch?v=b_sQ9bMltGU', 'duration_seconds' => 2400, 'description' => 'Understanding Flutter widgets, layout, and state management.'],
                            ['title' => 'Flutter State Management – Provider, Riverpod, BLoC', 'url' => 'https://www.youtube.com/watch?v=3tm-R7ymwhc', 'duration_seconds' => 5400, 'description' => 'Compare state management solutions in Flutter.'],
                        ],
                    ],
                    [
                        'title' => 'React Native Cross-Platform',
                        'description' => 'Build cross-platform mobile apps with React Native and Expo framework.',
                        'field' => 'IT',
                        'level' => 'Intermediate',
                        'duration_minutes' => 300,
                        'videos' => [
                            ['title' => 'React Native Tutorial for Beginners', 'url' => 'https://www.youtube.com/watch?v=0-S5a0eXPoc', 'duration_seconds' => 9000, 'description' => 'Programming with Mosh 2.5-hour React Native crash course.'],
                            ['title' => 'React Native Crash Course', 'url' => 'https://www.youtube.com/watch?v=VozPNrt-LfE', 'duration_seconds' => 7200, 'description' => 'Traversy Media React Native crash course with project.'],
                            ['title' => 'React Native Navigation Tutorial', 'url' => 'https://www.youtube.com/watch?v=npe3Wf4tpSg', 'duration_seconds' => 3600, 'description' => 'React Navigation stack, tab, and drawer navigators.'],
                        ],
                    ],
                    [
                        'title' => 'Mobile UI/UX Best Practices',
                        'description' => 'Design effective mobile interfaces using platform guidelines and patterns.',
                        'field' => 'Design',
                        'level' => 'Beginner',
                        'duration_minutes' => 90,
                        'videos' => [
                            ['title' => 'Mobile App Design in Figma – Full Course', 'url' => 'https://www.youtube.com/watch?v=PeGfX7W1mJk', 'duration_seconds' => 7200, 'description' => 'Complete mobile app UI design process in Figma.'],
                            ['title' => 'Mobile UI Design Fundamentals', 'url' => 'https://www.youtube.com/watch?v=JGLfyTDgfDc', 'duration_seconds' => 1800, 'description' => 'Key mobile design principles and platform conventions.'],
                        ],
                    ],
                    [
                        'title' => 'App Store Optimization & Publishing',
                        'description' => 'Prepare, optimize, and publish your app to the App Store and Google Play.',
                        'field' => 'Marketing',
                        'level' => 'Beginner',
                        'duration_minutes' => 60,
                        'videos' => [
                            ['title' => 'How to Publish an App to the Google Play Store', 'url' => 'https://www.youtube.com/watch?v=5GHT4QtotE4', 'duration_seconds' => 1200, 'description' => 'Step-by-step guide to publishing on Google Play Store.'],
                            ['title' => 'App Store Optimization (ASO) – Complete Guide', 'url' => 'https://www.youtube.com/watch?v=oudog2TOPdk', 'duration_seconds' => 1800, 'description' => 'AppRadar complete ASO guide for app discoverability.'],
                        ],
                    ],
                ],
            ],

            // ═══════════════════════════════════════════════
            // 6. DEVOPS ENGINEER
            // ═══════════════════════════════════════════════
            'DevOps Engineer' => [
                'description' => 'Automate infrastructure, CI/CD pipelines, and deployments for reliable software delivery.',
                'icon' => '⚙️',
                'category' => 'Engineering',
                'courses' => [
                    [
                        'title' => 'Linux & Command Line',
                        'description' => 'Master Linux fundamentals and command-line tools essential for DevOps workflows.',
                        'field' => 'IT',
                        'level' => 'Beginner',
                        'duration_minutes' => 300,
                        'videos' => [
                            ['title' => 'Introduction to Linux – Full Course for Beginners', 'url' => 'https://www.youtube.com/watch?v=sWbUDq4S6Y8', 'duration_seconds' => 21600, 'description' => 'freeCodeCamp 6-hour Linux fundamentals course.'],
                            ['title' => 'Linux Command Line Full Course', 'url' => 'https://www.youtube.com/watch?v=ZtqBQ68cfJc', 'duration_seconds' => 5400, 'description' => 'Comprehensive command-line tools and shell scripting.'],
                            ['title' => 'Bash Scripting Tutorial - Full Course', 'url' => 'https://www.youtube.com/watch?v=tK9Oc6AEnR4', 'duration_seconds' => 7200, 'description' => 'freeCodeCamp complete bash scripting course.'],
                        ],
                    ],
                    [
                        'title' => 'Docker & Containerization',
                        'description' => 'Containerize applications with Docker, Docker Compose, and multi-stage builds.',
                        'field' => 'IT',
                        'level' => 'Intermediate',
                        'duration_minutes' => 180,
                        'videos' => [
                            ['title' => 'Docker Tutorial for Beginners – Full Course', 'url' => 'https://www.youtube.com/watch?v=3c-iBn73dDE', 'duration_seconds' => 9960, 'description' => 'TechWorld with Nana 2hr 46min Docker complete course.'],
                            ['title' => 'Docker Tutorial for Beginners', 'url' => 'https://www.youtube.com/watch?v=fqMOX6JJhGo', 'duration_seconds' => 7200, 'description' => 'freeCodeCamp 2-hour Docker fundamentals.'],
                            ['title' => 'Docker Compose Tutorial', 'url' => 'https://www.youtube.com/watch?v=HG6yIjZapSA', 'duration_seconds' => 3600, 'description' => 'TechWorld with Nana Docker Compose multi-container apps.'],
                            ['title' => 'Docker in 100 Seconds', 'url' => 'https://www.youtube.com/watch?v=Gjnup-PuquQ', 'duration_seconds' => 180, 'description' => 'Fireship ultra-concise Docker concepts overview.'],
                        ],
                    ],
                    [
                        'title' => 'CI/CD with GitHub Actions',
                        'description' => 'Automate testing, building, and deployment with GitHub Actions workflows.',
                        'field' => 'IT',
                        'level' => 'Intermediate',
                        'duration_minutes' => 120,
                        'videos' => [
                            ['title' => 'GitHub Actions Tutorial - Full Course for CI/CD', 'url' => 'https://www.youtube.com/watch?v=R8_veQiYBjI', 'duration_seconds' => 5400, 'description' => 'TechWorld with Nana GitHub Actions complete tutorial.'],
                            ['title' => 'GitHub Actions - Crash Course', 'url' => 'https://www.youtube.com/watch?v=mFFXuXjVgkU', 'duration_seconds' => 3600, 'description' => 'Visual Studio Code YouTube CI/CD crash course.'],
                            ['title' => 'DevOps CI/CD Explained in 100 Seconds', 'url' => 'https://www.youtube.com/watch?v=scEDHsr3APg', 'duration_seconds' => 180, 'description' => 'Fireship ultra-concise CI/CD concepts.'],
                        ],
                    ],
                    [
                        'title' => 'Kubernetes Orchestration',
                        'description' => 'Orchestrate containers at scale with Kubernetes pods, services, and deployments.',
                        'field' => 'IT',
                        'level' => 'Advanced',
                        'duration_minutes' => 240,
                        'videos' => [
                            ['title' => 'Kubernetes Tutorial for Beginners – Full Course', 'url' => 'https://www.youtube.com/watch?v=X48VuDVv0do', 'duration_seconds' => 14400, 'description' => 'TechWorld with Nana 4-hour Kubernetes complete course.'],
                            ['title' => 'Kubernetes Crash Course for Absolute Beginners', 'url' => 'https://www.youtube.com/watch?v=s_o8dwzRlu4', 'duration_seconds' => 5400, 'description' => 'TechWorld with Nana Kubernetes crash course.'],
                            ['title' => 'Kubernetes in 100 Seconds', 'url' => 'https://www.youtube.com/watch?v=PziYflu8cB8', 'duration_seconds' => 180, 'description' => 'Fireship quick Kubernetes concepts overview.'],
                        ],
                    ],
                ],
            ],

            // ═══════════════════════════════════════════════
            // 7. CYBERSECURITY ANALYST
            // ═══════════════════════════════════════════════
            'Cybersecurity Analyst' => [
                'description' => 'Protect systems and networks from cyber threats through security analysis and ethical hacking.',
                'icon' => '🛡️',
                'category' => 'Security',
                'courses' => [
                    [
                        'title' => 'Cybersecurity Fundamentals',
                        'description' => 'Learn cybersecurity essentials: threats, defense mechanisms, and security principles.',
                        'field' => 'IT',
                        'level' => 'Beginner',
                        'duration_minutes' => 480,
                        'videos' => [
                            ['title' => 'Cybersecurity Full Course for Beginners', 'url' => 'https://www.youtube.com/watch?v=U_P23SqJaDc', 'duration_seconds' => 28800, 'description' => 'freeCodeCamp 8-hour cybersecurity foundations course.'],
                            ['title' => 'What is Cybersecurity? Introduction', 'url' => 'https://www.youtube.com/watch?v=inWWhr5tnEA', 'duration_seconds' => 1800, 'description' => 'Simplilearn cybersecurity introduction and career overview.'],
                            ['title' => 'Cybersecurity in 100 Seconds', 'url' => 'https://www.youtube.com/watch?v=tRi7GrHMdC4', 'duration_seconds' => 180, 'description' => 'Fireship ultra-concise cybersecurity overview.'],
                        ],
                    ],
                    [
                        'title' => 'Networking & Network Security',
                        'description' => 'Understand TCP/IP, protocols, firewalls, VPNs, and intrusion detection systems.',
                        'field' => 'IT',
                        'level' => 'Beginner',
                        'duration_minutes' => 360,
                        'videos' => [
                            ['title' => 'Computer Networking Full Course - OSI Model, TCP/IP', 'url' => 'https://www.youtube.com/watch?v=qiQR5rTSshw', 'duration_seconds' => 21600, 'description' => 'freeCodeCamp 6-hour computer networking full course.'],
                            ['title' => 'Network Security Tutorial for Beginners', 'url' => 'https://www.youtube.com/watch?v=E03gh1huvW4', 'duration_seconds' => 7200, 'description' => 'Edureka network security concepts and tools.'],
                            ['title' => 'Subnetting Mastery', 'url' => 'https://www.youtube.com/watch?v=BWZ-MHIhqjM', 'duration_seconds' => 2700, 'description' => 'Practical Networking subnetting tutorial.'],
                        ],
                    ],
                    [
                        'title' => 'Ethical Hacking & Penetration Testing',
                        'description' => 'Learn to think like a hacker – reconnaissance, exploitation, and reporting.',
                        'field' => 'IT',
                        'level' => 'Intermediate',
                        'duration_minutes' => 900,
                        'videos' => [
                            ['title' => 'Ethical Hacking Full Course - Learn Ethical Hacking in 10 Hours', 'url' => 'https://www.youtube.com/watch?v=3Kq1MIfTWCE', 'duration_seconds' => 36000, 'description' => 'Edureka 10-hour ethical hacking comprehensive course.'],
                            ['title' => 'Linux for Ethical Hackers - Full Course', 'url' => 'https://www.youtube.com/watch?v=U1w4T03B30I', 'duration_seconds' => 21600, 'description' => 'freeCodeCamp/NetworkChuck Linux for security professionals.'],
                            ['title' => 'Nmap Tutorial to find Network Vulnerabilities', 'url' => 'https://www.youtube.com/watch?v=4t4kBkMsDbQ', 'duration_seconds' => 3600, 'description' => 'NetworkChuck Nmap scanning and enumeration tutorial.'],
                        ],
                    ],
                    [
                        'title' => 'Web Application Security',
                        'description' => 'Identify and mitigate web application vulnerabilities: XSS, SQL Injection, CSRF.',
                        'field' => 'IT',
                        'level' => 'Intermediate',
                        'duration_minutes' => 120,
                        'videos' => [
                            ['title' => 'Web Application Security – Understanding the OWASP Top 10', 'url' => 'https://www.youtube.com/watch?v=rWHvp7rUka8', 'duration_seconds' => 5400, 'description' => 'freeCodeCamp OWASP Top 10 vulnerabilities explained.'],
                            ['title' => 'SQL Injection Attack Tutorial', 'url' => 'https://www.youtube.com/watch?v=2OPVViV-GQk', 'duration_seconds' => 1800, 'description' => 'NetworkChuck practical SQL injection demonstration.'],
                            ['title' => 'XSS Explained and How to Prevent It', 'url' => 'https://www.youtube.com/watch?v=EoaDgUgS6QA', 'duration_seconds' => 1200, 'description' => 'PwnFunction animated XSS tutorial.'],
                        ],
                    ],
                ],
            ],

            // ═══════════════════════════════════════════════
            // 8. CLOUD ARCHITECT
            // ═══════════════════════════════════════════════
            'Cloud Architect' => [
                'description' => 'Design and manage scalable cloud infrastructure on AWS, GCP, or Azure.',
                'icon' => '☁️',
                'category' => 'Engineering',
                'courses' => [
                    [
                        'title' => 'AWS Cloud Essentials',
                        'description' => 'Foundational cloud computing concepts with Amazon Web Services.',
                        'field' => 'IT',
                        'level' => 'Beginner',
                        'duration_minutes' => 840,
                        'videos' => [
                            ['title' => 'AWS Certified Cloud Practitioner Training – Full Course', 'url' => 'https://www.youtube.com/watch?v=SOTamWNgDKc', 'duration_seconds' => 50400, 'description' => 'freeCodeCamp 14-hour AWS Cloud Practitioner certification course.'],
                            ['title' => 'AWS in 10 Minutes – Introduction', 'url' => 'https://www.youtube.com/watch?v=r4YIdn2eTm4', 'duration_seconds' => 600, 'description' => 'TechWorld with Nana quick AWS services overview.'],
                        ],
                    ],
                    [
                        'title' => 'Cloud Architecture & System Design',
                        'description' => 'Learn microservices, serverless, event-driven, and scalable architecture patterns.',
                        'field' => 'IT',
                        'level' => 'Advanced',
                        'duration_minutes' => 240,
                        'videos' => [
                            ['title' => 'System Design for Beginners', 'url' => 'https://www.youtube.com/watch?v=MbjObHmDbZo', 'duration_seconds' => 5400, 'description' => 'NeetCode system design fundamentals for interviews and production.'],
                            ['title' => 'Microservices Explained in 5 Minutes', 'url' => 'https://www.youtube.com/watch?v=lTAcCNbJ7KE', 'duration_seconds' => 300, 'description' => '5-minute microservices architecture overview.'],
                            ['title' => 'Serverless Computing Explained', 'url' => 'https://www.youtube.com/watch?v=W_VV2Fx32_Y', 'duration_seconds' => 3600, 'description' => 'IBM Technology serverless architecture tutorial.'],
                            ['title' => 'Event-Driven Architecture Explained', 'url' => 'https://www.youtube.com/watch?v=o2HJCGcYwoU', 'duration_seconds' => 1200, 'description' => 'IBM Technology event-driven architecture concepts.'],
                        ],
                    ],
                    [
                        'title' => 'Infrastructure as Code with Terraform',
                        'description' => 'Provision and manage cloud resources declaratively using Terraform.',
                        'field' => 'IT',
                        'level' => 'Advanced',
                        'duration_minutes' => 150,
                        'videos' => [
                            ['title' => 'Terraform Course - Automate Your AWS Cloud Infrastructure', 'url' => 'https://www.youtube.com/watch?v=7xngnjfIlK4', 'duration_seconds' => 9000, 'description' => 'freeCodeCamp 2.5-hour Terraform with AWS full course.'],
                            ['title' => 'Terraform in 100 Seconds', 'url' => 'https://www.youtube.com/watch?v=tomUWcQ0P3k', 'duration_seconds' => 180, 'description' => 'Fireship ultra-concise Terraform IaC overview.'],
                            ['title' => 'Infrastructure as Code Explained', 'url' => 'https://www.youtube.com/watch?v=POPP2WTJ8es', 'duration_seconds' => 1200, 'description' => 'IBM Technology IaC concepts and benefits.'],
                        ],
                    ],
                ],
            ],

            // ═══════════════════════════════════════════════
            // 9. PRODUCT MANAGER
            // ═══════════════════════════════════════════════
            'Product Manager' => [
                'description' => 'Lead product strategy, roadmaps, and cross-functional teams to deliver impactful products.',
                'icon' => '🚀',
                'category' => 'Product',
                'courses' => [
                    [
                        'title' => 'Product Management Essentials',
                        'description' => 'Learn the foundations of product management from discovery to delivery.',
                        'field' => 'IT',
                        'level' => 'Beginner',
                        'duration_minutes' => 120,
                        'videos' => [
                            ['title' => 'Product Management Full Course', 'url' => 'https://www.youtube.com/watch?v=_Mcd90LxTCU', 'duration_seconds' => 7200, 'description' => 'Simplilearn complete product management course.'],
                            ['title' => 'What is Product Management?', 'url' => 'https://www.youtube.com/watch?v=xJGNHB-lxHs', 'duration_seconds' => 900, 'description' => 'TechLead overview of product management role and responsibilities.'],
                            ['title' => 'How to Write a Product Requirements Document (PRD)', 'url' => 'https://www.youtube.com/watch?v=cWHk6QEOV4U', 'duration_seconds' => 1200, 'description' => 'Practical guide to writing effective PRDs.'],
                        ],
                    ],
                    [
                        'title' => 'Agile & Scrum Methodology',
                        'description' => 'Manage projects with Agile frameworks, Scrum ceremonies, and sprint planning.',
                        'field' => 'IT',
                        'level' => 'Beginner',
                        'duration_minutes' => 180,
                        'videos' => [
                            ['title' => 'Agile Project Management Full Course', 'url' => 'https://www.youtube.com/watch?v=thsFsPnUHRA', 'duration_seconds' => 10800, 'description' => 'Simplilearn 3-hour Agile project management course.'],
                            ['title' => 'Scrum in 20 Minutes – Scrum Master Training', 'url' => 'https://www.youtube.com/watch?v=SWDhGSZNF9M', 'duration_seconds' => 1200, 'description' => 'Concise Scrum framework overview for product teams.'],
                            ['title' => 'Jira Tutorial for Beginners', 'url' => 'https://www.youtube.com/watch?v=GWxMTvRGIpc', 'duration_seconds' => 3600, 'description' => 'Jira setup, boards, sprints, and workflow management.'],
                        ],
                    ],
                    [
                        'title' => 'Product Analytics & Data-Driven Decisions',
                        'description' => 'Track and analyze key metrics to make data-driven product decisions.',
                        'field' => 'Data',
                        'level' => 'Intermediate',
                        'duration_minutes' => 100,
                        'videos' => [
                            ['title' => 'Product Analytics for Product Managers', 'url' => 'https://www.youtube.com/watch?v=SlhESAKF1Tk', 'duration_seconds' => 1800, 'description' => 'Understanding product analytics frameworks and tools.'],
                            ['title' => 'Key Metrics Every Product Manager Should Know', 'url' => 'https://www.youtube.com/watch?v=bBDQpIN6RRc', 'duration_seconds' => 1200, 'description' => 'Essential product KPIs: DAU, MAU, retention, churn, NPS.'],
                            ['title' => 'A/B Testing Explained in 5 Minutes', 'url' => 'https://www.youtube.com/watch?v=XDoAglqd7ss', 'duration_seconds' => 300, 'description' => 'Introduction to A/B testing methodology for product optimization.'],
                        ],
                    ],
                ],
            ],

            // ═══════════════════════════════════════════════
            // 10. AI/ML ENGINEER
            // ═══════════════════════════════════════════════
            'AI/ML Engineer' => [
                'description' => 'Build, train, and deploy artificial intelligence and machine learning systems at scale.',
                'icon' => '🤖',
                'category' => 'Engineering',
                'courses' => [
                    [
                        'title' => 'Deep Learning with TensorFlow & Keras',
                        'description' => 'Build neural networks and deep learning models with TensorFlow 2.0 and Keras.',
                        'field' => 'Data',
                        'level' => 'Advanced',
                        'duration_minutes' => 420,
                        'videos' => [
                            ['title' => 'TensorFlow 2.0 Complete Course - Python Neural Networks', 'url' => 'https://www.youtube.com/watch?v=tPYj3fFJGjk', 'duration_seconds' => 25200, 'description' => 'freeCodeCamp 7-hour TensorFlow 2.0 complete course.'],
                            ['title' => 'Deep Learning Crash Course for Beginners', 'url' => 'https://www.youtube.com/watch?v=VyWAvY2CF9c', 'duration_seconds' => 5400, 'description' => 'freeCodeCamp deep learning essentials crash course.'],
                            ['title' => 'Neural Networks Explained', 'url' => 'https://www.youtube.com/watch?v=aircAruvnKk', 'duration_seconds' => 1140, 'description' => '3Blue1Brown beautiful visual explanation of neural networks.'],
                            ['title' => 'But what is a neural network? (Chapter 1)', 'url' => 'https://www.youtube.com/watch?v=aircAruvnKk', 'duration_seconds' => 1140, 'description' => '3Blue1Brown neural network intuition series.'],
                        ],
                    ],
                    [
                        'title' => 'Natural Language Processing (NLP)',
                        'description' => 'Process and analyze text data using NLP techniques, BERT, and transformers.',
                        'field' => 'Data',
                        'level' => 'Advanced',
                        'duration_minutes' => 300,
                        'videos' => [
                            ['title' => 'NLP Full Course - Natural Language Processing Tutorial', 'url' => 'https://www.youtube.com/watch?v=fOvTtapxa9c', 'duration_seconds' => 18000, 'description' => 'Edureka 5-hour NLP complete tutorial with Python.'],
                            ['title' => 'Transformers, explained: Understand the model behind GPT, BERT', 'url' => 'https://www.youtube.com/watch?v=SZorAJ4I-sA', 'duration_seconds' => 1500, 'description' => 'Google Cloud transformer architecture explained visually.'],
                            ['title' => 'Hugging Face Transformers Course', 'url' => 'https://www.youtube.com/watch?v=QEaBAZQCtwE', 'duration_seconds' => 3600, 'description' => 'Practical Hugging Face transformers library tutorial.'],
                        ],
                    ],
                    [
                        'title' => 'Computer Vision with OpenCV',
                        'description' => 'Implement image processing, object detection, and computer vision applications.',
                        'field' => 'Data',
                        'level' => 'Intermediate',
                        'duration_minutes' => 360,
                        'videos' => [
                            ['title' => 'OpenCV Course - Full Tutorial with Python', 'url' => 'https://www.youtube.com/watch?v=oXlwWbU8l2o', 'duration_seconds' => 21600, 'description' => 'freeCodeCamp 6-hour OpenCV with Python complete course.'],
                            ['title' => 'Computer Vision Basics', 'url' => 'https://www.youtube.com/watch?v=01sAkU_NvbY', 'duration_seconds' => 3600, 'description' => 'freeCodeCamp computer vision concepts and applications.'],
                            ['title' => 'YOLO Object Detection', 'url' => 'https://www.youtube.com/watch?v=WgPbbWmnXJ8', 'duration_seconds' => 2400, 'description' => 'YOLO object detection implementation tutorial.'],
                        ],
                    ],
                    [
                        'title' => 'MLOps & Model Deployment',
                        'description' => 'Deploy, monitor, and maintain ML models in production environments.',
                        'field' => 'IT',
                        'level' => 'Advanced',
                        'duration_minutes' => 150,
                        'videos' => [
                            ['title' => 'MLOps Course – Machine Learning Engineering for Production', 'url' => 'https://www.youtube.com/watch?v=9BgIDqAzfuA', 'duration_seconds' => 7200, 'description' => 'MLOps full tutorial: pipelines, monitoring, and deployment.'],
                            ['title' => 'Deploy ML Models with FastAPI and Docker', 'url' => 'https://www.youtube.com/watch?v=h5wLuVDr0oc', 'duration_seconds' => 3600, 'description' => 'Practical ML model deployment with FastAPI and containerization.'],
                            ['title' => 'ML in Production - Best Practices', 'url' => 'https://www.youtube.com/watch?v=Vci0usJHbAM', 'duration_seconds' => 2400, 'description' => 'Google Cloud best practices for ML in production systems.'],
                        ],
                    ],
                ],
            ],
        ];
    }
}
