import { useCallback, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { PasswordGate } from './components/PasswordGate';
import { InteractiveWelcome } from './components/InteractiveWelcome';
import { ExcitementConfirmation } from './components/ExcitementConfirmation';
import { SecretPasscodeScreen } from './components/SecretPasscodeScreen';
import { CanvaMemoryScreen } from './components/CanvaMemoryScreen';
import { NextSecretPasscodeScreen } from './components/NextSecretPasscodeScreen';
import { BirthdayExperience } from './components/BirthdayExperience';
import { MemoryChallengeScreen } from './components/MemoryChallengeScreen';
import { OurMemoriesGallery } from './components/OurMemoriesGallery';
import { MemoryDetectiveScreen } from './components/MemoryDetectiveScreen';
import { VintageLetterScreen } from './components/VintageLetterScreen';
import { MomentsMemoryQuizScreen } from './components/MomentsMemoryQuizScreen';
import { CollectedMomentsScreen } from './components/CollectedMomentsScreen';
import { OneLastPageScreen } from './components/OneLastPageScreen';
import { DedicationDateLockScreen } from './components/DedicationDateLockScreen';
import { FinalRevealScreen } from './components/FinalRevealScreen';
import { EndingQuestionScreen } from './components/EndingQuestionScreen';
import { BackgroundMusicPlayer } from './components/BackgroundMusicPlayer';
import type { SurpriseData, UnlockMode } from './types';

type FlowStage =
  | 'intro'
  | 'excitement'
  | 'passcode'
  | 'memory'
  | 'nextPasscode'
  | 'homepage'
  | 'memoryChallenge'
  | 'ourMemories'
  | 'memoryDetective'
  | 'vintageLetter'
  | 'momentsQuiz'
  | 'collectedMoments'
  | 'oneLastPage'
  | 'dedicationLock'
  | 'finalReveal'
  | 'endingQuestion';

export default function App() {
  const [surpriseData, setSurpriseData] = useState<SurpriseData | null>(null);
  const [unlockMode, setUnlockMode] = useState<UnlockMode>('later-escapes');
  const [stage, setStage] = useState<FlowStage>('intro');
  const [homepageInitialChapter, setHomepageInitialChapter] = useState<
    1 | 2 | 3 | 4 | 5
  >(1);

  const handleUnlock = (data: SurpriseData, mode: UnlockMode) => {
    setSurpriseData(data);
    setUnlockMode(mode);
    setHomepageInitialChapter(1);
    setStage('intro');
  };

  const handleLock = () => {
    setSurpriseData(null);
    setUnlockMode('later-escapes');
    setHomepageInitialChapter(1);
    setStage('intro');
  };

  const handleMemoryComplete = useCallback(() => {
    setStage('nextPasscode');
  }, []);

  const handleNextPasscodeSuccess = useCallback(() => {
    setHomepageInitialChapter(1);
    setStage('homepage');
  }, []);

  const handleStartMemoryChallenge = useCallback(() => {
    setStage('memoryChallenge');
  }, []);

  const handleBackToFinalPoem = useCallback(() => {
    setHomepageInitialChapter(5);
    setStage('homepage');
  }, []);

  const handleMemoryChallengeSuccess = useCallback(() => {
    setStage('ourMemories');
  }, []);

  const handleGalleryComplete = useCallback(() => {
    setStage('memoryDetective');
  }, []);

  const handleBackToGallery = useCallback(() => {
    setStage('ourMemories');
  }, []);

  const handleDetectiveComplete = useCallback(() => {
    setStage('vintageLetter');
  }, []);

  const handleLetterContinue = useCallback(() => {
    setStage('momentsQuiz');
  }, []);

  const handleBackToLetter = useCallback(() => {
    setStage('vintageLetter');
  }, []);

  const handleMomentsQuizComplete = useCallback(() => {
    setStage('collectedMoments');
  }, []);

  const handleCollectedMomentsContinue = useCallback(() => {
    setStage('oneLastPage');
  }, []);

  const handleBackToCollectedMoments = useCallback(() => {
    setStage('collectedMoments');
  }, []);

  const handleOneLastPageContinue = useCallback(() => {
    setStage('dedicationLock');
  }, []);

  const handleDedicationUnlock = useCallback(() => {
    setStage('finalReveal');
  }, []);

  const handleBackToOneLastPage = useCallback(() => {
    setStage('oneLastPage');
  }, []);

  const handleFinalRevealContinue = useCallback(() => {
    setStage('endingQuestion');
  }, []);

  const handleBackToFinalReveal = useCallback(() => {
    setStage('finalReveal');
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {!surpriseData ? (
          <PasswordGate key="gate" onUnlock={handleUnlock} />
        ) : stage === 'intro' ? (
          <InteractiveWelcome
            key="welcome"
            unlockMode={unlockMode}
            onProceed={() => setStage('excitement')}
          />
        ) : stage === 'excitement' ? (
          <ExcitementConfirmation
            key="excitement"
            onConfirm={() => setStage('passcode')}
          />
        ) : stage === 'passcode' ? (
          <SecretPasscodeScreen
            key="passcode"
            onSuccess={() => setStage('memory')}
          />
        ) : stage === 'memory' ? (
          <CanvaMemoryScreen key="memory" onComplete={handleMemoryComplete} />
        ) : stage === 'nextPasscode' ? (
          <NextSecretPasscodeScreen
            key="next-passcode"
            onSuccess={handleNextPasscodeSuccess}
          />
        ) : stage === 'memoryChallenge' ? (
          <MemoryChallengeScreen
            key="memory-challenge"
            onLock={handleLock}
            onBack={handleBackToFinalPoem}
            onSuccess={handleMemoryChallengeSuccess}
          />
        ) : stage === 'ourMemories' ? (
          <OurMemoriesGallery
            key="our-memories"
            onLock={handleLock}
            onComplete={handleGalleryComplete}
          />
        ) : stage === 'memoryDetective' ? (
          <MemoryDetectiveScreen
            key="memory-detective"
            onLock={handleLock}
            onBack={handleBackToGallery}
            onComplete={handleDetectiveComplete}
          />
        ) : stage === 'vintageLetter' ? (
          <VintageLetterScreen
            key="vintage-letter"
            onLock={handleLock}
            onBack={handleBackToGallery}
            onContinue={handleLetterContinue}
          />
        ) : stage === 'momentsQuiz' ? (
          <MomentsMemoryQuizScreen
            key="moments-quiz"
            onLock={handleLock}
            onBack={handleBackToLetter}
            onComplete={handleMomentsQuizComplete}
          />
        ) : stage === 'collectedMoments' ? (
          <CollectedMomentsScreen
            key="collected-moments"
            onLock={handleLock}
            onBack={handleBackToLetter}
            onContinue={handleCollectedMomentsContinue}
          />
        ) : stage === 'oneLastPage' ? (
          <OneLastPageScreen
            key="one-last-page"
            onLock={handleLock}
            onBack={handleBackToCollectedMoments}
            onContinue={handleOneLastPageContinue}
          />
        ) : stage === 'dedicationLock' ? (
          <DedicationDateLockScreen
            key="dedication-lock"
            onLock={handleLock}
            onBack={handleBackToOneLastPage}
            onUnlock={handleDedicationUnlock}
          />
        ) : stage === 'finalReveal' ? (
          <FinalRevealScreen
            key="final-reveal"
            onLock={handleLock}
            onBack={handleBackToOneLastPage}
            onContinue={handleFinalRevealContinue}
          />
        ) : stage === 'endingQuestion' ? (
          <EndingQuestionScreen
            key="ending-question"
            onLock={handleLock}
            onBack={handleBackToFinalReveal}
          />
        ) : (
          <BirthdayExperience
            key="experience"
            data={surpriseData}
            initialChapter={homepageInitialChapter}
            onContinueToChallenge={handleStartMemoryChallenge}
            onLock={handleLock}
          />
        )}
      </AnimatePresence>

      <BackgroundMusicPlayer />
    </>
  );
}
