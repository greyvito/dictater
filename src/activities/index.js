import { registerActivity } from './registry.js';
import { dictationActivity, spellingActivity } from './core.js';
import {
  speakWordActivity,
  speakSentenceActivity,
  speakPassageActivity,
  speakRepeatActivity
} from './speaking.js';
import {
  rhymeActivity,
  syllableActivity,
  initialSoundActivity,
  letterSoundActivity,
  pictureVocabActivity
} from './prek.js';
import { wordIntroActivity } from './wordIntro.js';
import {
  comprehensionActivity,
  grammarActivity,
  vocabularyActivity,
  phonicsBlendActivity,
  sightWordActivity,
  sentenceBuilderActivity,
  writingPromptActivity
} from './extended.js';

[
  dictationActivity,
  spellingActivity,
  speakWordActivity,
  speakSentenceActivity,
  speakPassageActivity,
  speakRepeatActivity,
  rhymeActivity,
  syllableActivity,
  initialSoundActivity,
  letterSoundActivity,
  pictureVocabActivity,
  wordIntroActivity,
  comprehensionActivity,
  grammarActivity,
  vocabularyActivity,
  phonicsBlendActivity,
  sightWordActivity,
  sentenceBuilderActivity,
  writingPromptActivity
].forEach(registerActivity);

export { registerActivity };
