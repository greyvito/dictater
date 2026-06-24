# Dictater 🎧📝

Dictater is a modern, premium web application designed to help primary school students (Grades K–6) master English spelling, listening comprehension, and dictation. 

Built using pure HTML, Vanilla CSS, and JavaScript, it offers a visual, interactive single-page layout that runs entirely client-side. Dictater aligns with the **Cambridge American English** standards.

---

## 🌟 Key Features

### 📖 Dual Practice Formats
*   **Passage Mode**: Focuses on transcribing full paragraphs and stories. It dynamically divides text into small, digestible phrases to make dictation writing easier.
*   **Word List Mode**: An interactive spelling test environment. It queries individual words one-by-one, accepts keyboard entries (pressing `Enter` to submit), and compiles a detailed scorecard at the end.

### 🎛️ Phrase-by-Phrase Control Hub
*   **Segmented Playback**: A specialized navigation bar featuring `[Prev Phrase]`, `[Play Phrase]`, and `[Next Phrase]` controls lets students take dictations chunk-by-chunk.
*   **Click-to-Play Read Along**: Clicking the "Show Text" button displays the passage split into phrase spans. Students can hover over any phrase to highlight it and click to play only that segment.

### 🎙️ Dual Speech Synthesizer Engines
*   **Native Web Speech API (Local & Free)**: Works offline immediately using high-quality pre-installed system voices (such as *Google US English* or *Microsoft Aria*).
*   **Puter AI Voices (Cloud AI)**: Utilizes the Puter.js framework to call ultra-realistic, natural cloud speech synthesis models.
*   **Speed Controls**: Adjustable rates (`1.0x`, `0.75x`, and `0.5x`) to assist struggling ears.
*   **Pause & Resume Memory**: Built-in boundary character-index tracking for Web Speech API and `currentTime` locking for Puter.js ensure resuming continues *exactly* where the student paused instead of starting over.

### 📊 Intelligent Grading & Diffing
*   **LCS Word-level Alignment**: Uses a Longest Common Subsequence word-diff algorithm to check passage transcripts.
*   **Visual Color-coded Feedback**: Highlights correct words in **green**, extra or incorrect words in **strike-through red**, and missing words in **dashed grey**.
*   **Spelling Scorecard**: Compiles correct vs. misspelled words with spelling correction guidelines.

### 🎨 Premium Visual Theme
*   Vibrant indigo-slate dark background gradients with glassmorphic cards.
*   Modern typography (Outfit and Inter from Google Fonts) with smooth transitions.
*   Fully responsive layout optimized for desktop, tablet, and mobile browsers.

---

## 📂 Project Structure

```
dictater/
├── index.html          # HTML structure (curriculum navigation, workouts, forms, modals)
├── index.css           # Styling tokens, responsive grid, glassmorphism, animations
├── app.js              # State manager, speech synthesizer wrapper, LCS word-diff, spelling engines
├── package.json        # Serve dependencies and startup script
└── curriculum/         # Curriculum database split by grades
    ├── gradeK.js       # Grade K passages (1-15) and word lists (1-12)
    ├── grade1.js       # Grade 1 passages (1-15) and word lists (1-12)
    ├── grade2.js       # Grade 2 passages (1-15) and word lists (1-12)
    ├── grade3.js       # Grade 3 passages (1-15) and word lists (1-12)
    ├── grade4.js       # Grade 4 passages (1-15) and word lists (1-12)
    ├── grade5.js       # Grade 5 passages (1-15) and word lists (1-12)
    └── grade6.js       # Grade 6 passages (1-15) and word lists (1-12)
```

---

## 🚀 How to Run

### Option 1: Development Server (Recommended)
Launch a local static file server using the integrated script:
1.  Navigate to the project root directory.
2.  Install dependencies and start:
    ```bash
    npm start
    ```
3.  Open the address printed in the terminal (usually `http://localhost:3000` or `http://localhost:5000`).

### Option 2: Standalone Local file
Since the project does not require compilation, you can double-click **`index.html`** to run the app directly in any browser (Web Speech API works fully offline; Puter.js AI voices require an internet connection).

---

## 📚 Curriculum Design

The built-in curriculum features **141 passages** and **120 spelling word lists** (over 1,100 target words). All grades (Grades K–6) feature three difficulty tiers (Beginner, Intermediate, Advanced) for personalized learning.

| Grade | CEFR Level | Key Focus | Spelling Focus |
| :--- | :--- | :--- | :--- |
| **Grade K** | Pre-A1 | CVC families, sight words, body parts, colors, basic blends, simple past tense | CVC short vowels, sight words, blends, body parts, farm, digraphs, long vowels, past verbs |
| **Grade 1** | Pre-A1 / A1 | Family/food/school, past tense sequences, contractions, silent-e, vowel teams, plurals | Sight words, family, food, double consonants, plurals, contractions, silent-e, vowel teams |
| **Grade 2** | A1 | Prepositions, adverbs, time words, simple narrative, compound words, suffixes, prefixes, dialogue | Action verbs, prepositions, time words, suffixes, compound words, homophones, prefixes |
| **Grade 3** | Pre-A1 / A1 | Daily routines, stories, past tenses | Action verbs, classroom nouns, homophones, silent letters |
| **Grade 4** | A1 / A2 | compound sentences, safety instructions | Astronomy terms, healthy living, double consonants, sound-alikes |
| **Grade 5** | A2 | Science reports, passive voice, history of civilization | Ecosystem biology, suffixes (-ment, -tion), homophones, spelling traps |
| **Grade 6** | A2 / B1 | Complex grammar, robotics, renewable energy | Greek/Latin roots, abstract nouns, academic verbs, advanced demons |

### 🛠️ Extending the Database
You can easily add new lessons by opening any file in `curriculum/` (e.g., [grade4.js](file:///Users/greyvito/dictater/curriculum/grade4.js)) and appending a new JSON object to the `passages` or `words` array:

```javascript
// Example passage template
{
  id: 'g4-p16',
  title: 'My Custom Title',
  text: 'The quick brown fox jumps over the lazy dog.',
  hint: 'Focus on typing all alphabet letters.'
}
```
The application will dynamically pick up and display the new exercise on page reload.
