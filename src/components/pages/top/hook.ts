import { useCallback, useMemo, useState } from "react";

type Phase = "input" | "ready" | "reveal" | "handoff" | "finished" | "review";

const MIN_PARTICIPANTS = 2;
const MAX_PARTICIPANTS = 100;
const MAX_NUMBER = 100;

const generateUniqueNumbers = (count: number): number[] => {
  const pool = Array.from({ length: MAX_NUMBER }, (_, index) => index + 1);

  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, count);
};

export const useLottery = () => {
  const [phase, setPhase] = useState<Phase>("input");
  const [inputValue, setInputValue] = useState("");
  const [participantCount, setParticipantCount] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [names, setNames] = useState<string[]>([]);
  const [currentNameInput, setCurrentNameInput] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [reviewIndex, setReviewIndex] = useState(0);

  const isInputValid = useMemo(() => {
    const count = Number(inputValue);
    return (
      Number.isInteger(count) &&
      count >= MIN_PARTICIPANTS &&
      count <= MAX_PARTICIPANTS
    );
  }, [inputValue]);

  const currentNumber = numbers[currentIndex] ?? null;
  const currentPerson =
    participantCount != null && currentIndex < participantCount
      ? currentIndex + 1
      : null;
  const previousPerson = previousIndex != null ? previousIndex + 1 : null;
  const nextPerson =
    participantCount != null && currentIndex < participantCount
      ? currentIndex + 1
      : null;
  const currentName = names[currentIndex] ?? "";
  const previousName =
    previousIndex != null ? (names[previousIndex] ?? "") : null;

  const assignments = useMemo(() => {
    if (participantCount == null) {
      return [] as { name: string; number: number }[];
    }

    return Array.from({ length: participantCount }, (_, index) => ({
      name: names[index] ?? "",
      number: numbers[index],
    })).filter(
      (entry): entry is { name: string; number: number } =>
        typeof entry.number === "number",
    );
  }, [names, numbers, participantCount]);

  const sortedResults = useMemo(() => {
    return [...assignments].sort((a, b) => a.number - b.number);
  }, [assignments]);

  const canRevealMore = reviewIndex < sortedResults.length;

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
    setErrorMessage(null);
  }, []);

  const handleNameInputChange = useCallback((value: string) => {
    setCurrentNameInput(value);
    setNameError(null);
  }, []);

  const backToInput = useCallback(() => {
    setPhase("input");
    setParticipantCount(null);
    setCurrentIndex(0);
    setPreviousIndex(null);
    setNumbers([]);
    setNames([]);
    setCurrentNameInput("");
    setNameError(null);
    setErrorMessage(null);
    setReviewIndex(0);
  }, []);

  const startLottery = useCallback(() => {
    const count = Number(inputValue);

    if (
      !Number.isInteger(count) ||
      count < MIN_PARTICIPANTS ||
      count > MAX_PARTICIPANTS
    ) {
      setErrorMessage(
        `人数は${MIN_PARTICIPANTS}〜${MAX_PARTICIPANTS}の整数で入力してください`,
      );
      return;
    }

    setParticipantCount(count);
    setNumbers(generateUniqueNumbers(count));
    setNames(Array(count).fill(""));
    setCurrentIndex(0);
    setPreviousIndex(null);
    setCurrentNameInput("");
    setReviewIndex(0);
    setNameError(null);
    setErrorMessage(null);
    setPhase("ready");
  }, [inputValue]);

  const showNumber = useCallback(() => {
    const trimmed = currentNameInput.trim();

    if (!trimmed) {
      setNameError("名前を入力してください");
      return;
    }

    setNames((prev) => {
      const next = [...prev];
      next[currentIndex] = trimmed;
      return next;
    });

    setPhase("reveal");
  }, [currentNameInput, currentIndex]);

  const closeReveal = useCallback(() => {
    if (participantCount == null) {
      return;
    }

    if (currentIndex === participantCount - 1) {
      setPreviousIndex(currentIndex);
      setPhase("finished");
      return;
    }

    const nextIndex = currentIndex + 1;
    setPreviousIndex(currentIndex);
    setCurrentIndex(nextIndex);
    setCurrentNameInput(names[nextIndex] ?? "");
    setNameError(null);
    setPhase("handoff");
  }, [currentIndex, names, participantCount]);

  const proceedNext = useCallback(() => {
    if (participantCount == null) {
      return;
    }

    if (currentIndex >= participantCount) {
      return;
    }

    setPhase("ready");
    setNameError(null);
  }, [currentIndex, participantCount]);

  const startReview = useCallback(() => {
    setReviewIndex(0);
    setPhase("review");
  }, []);

  const revealNextResult = useCallback(() => {
    if (!canRevealMore) {
      return;
    }

    setReviewIndex((prev) => prev + 1);
  }, [canRevealMore]);

  const resetFlow = useCallback(() => {
    backToInput();
    setInputValue("");
  }, [backToInput]);

  const goBack = useCallback(() => {
    switch (phase) {
      case "input":
        return;
      case "ready":
        if (previousIndex == null) {
          backToInput();
        } else {
          setPhase("handoff");
        }
        break;
      case "reveal":
        setPhase("ready");
        setNameError(null);
        setCurrentNameInput(names[currentIndex] ?? "");
        break;
      case "handoff": {
        if (previousIndex == null) {
          backToInput();
          return;
        }

        const targetIndex = previousIndex;
        setCurrentIndex(targetIndex);
        setPreviousIndex(targetIndex > 0 ? targetIndex - 1 : null);
        setCurrentNameInput(names[targetIndex] ?? "");
        setPhase("reveal");
        break;
      }
      case "finished":
        setPhase("reveal");
        setCurrentNameInput(names[currentIndex] ?? "");
        break;
      case "review":
        setPhase("finished");
        break;
      default:
        break;
    }
  }, [phase, previousIndex, backToInput, names, currentIndex]);

  return {
    phase,
    inputValue,
    errorMessage,
    nameError,
    participantCount,
    currentPerson,
    previousPerson,
    nextPerson,
    previousName,
    currentName,
    currentNumber,
    currentNameInput,
    reviewIndex,
    sortedResults,
    canRevealMore,
    isInputValid,
    minParticipants: MIN_PARTICIPANTS,
    maxParticipants: MAX_PARTICIPANTS,
    handleInputChange,
    handleNameInputChange,
    startLottery,
    showNumber,
    closeReveal,
    proceedNext,
    startReview,
    revealNextResult,
    resetFlow,
    goBack,
  };
};
