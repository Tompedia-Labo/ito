"use client";

import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useLottery } from "./hook";

export default function Top() {
  const {
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
    minParticipants,
    maxParticipants,
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
  } = useLottery();

  const readyProgressLabel =
    participantCount != null && currentPerson != null
      ? `${currentPerson}/${participantCount}`
      : undefined;

  const handoffProgressLabel =
    participantCount != null && previousPerson != null
      ? `${previousPerson}/${participantCount}`
      : undefined;

  const revealedResults = sortedResults.slice(0, reviewIndex);
  const reviewComplete =
    sortedResults.length > 0 && reviewIndex >= sortedResults.length;
  const remainingCount = Math.max(sortedResults.length - reviewIndex, 0);
  const isNameReady = currentNameInput.trim().length > 0;

  const BackButton = ({ disabled }: { disabled?: boolean }) => (
    <Button variant="text" onClick={goBack} disabled={disabled}>
      戻る
    </Button>
  );

  const handleResetWithConfirm = () => {
    if (
      typeof window === "undefined" ||
      window.confirm(
        "最初の画面に戻ると全ての抽選結果が消えます。よろしいですか？",
      )
    ) {
      resetFlow();
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Box width="100%">
        {phase === "input" && (
          <Stack spacing={3}>
            <Typography variant="h5" fontWeight={700} textAlign="center">
              人数を入力してください
            </Typography>
            <Typography color="text.secondary" textAlign="center">
              2〜100人まで対応しています。スマホを回しながら進めてください。
            </Typography>
            <TextField
              label="参加人数"
              type="number"
              value={inputValue}
              inputMode="numeric"
              onChange={(event) => handleInputChange(event.target.value)}
              inputProps={{ min: minParticipants, max: maxParticipants }}
              helperText={
                errorMessage ??
                `最小${minParticipants}人 / 最大${maxParticipants}人`
              }
              error={Boolean(errorMessage)}
              fullWidth
            />
            <Button
              variant="contained"
              size="large"
              onClick={startLottery}
              disabled={!isInputValid}
            >
              抽選を開始
            </Button>
            <BackButton disabled />
          </Stack>
        )}

        {phase === "ready" && currentPerson != null && (
          <Stack spacing={3} textAlign="center">
            <Typography variant="overline" color="text.secondary">
              {readyProgressLabel}
            </Typography>
            <Typography variant="h5" fontWeight={700}>
              {currentPerson}人目の方の番です
            </Typography>
            <Typography>
              まずはあなたの名前を入力してから、下のボタンで抽選してください。
            </Typography>
            <TextField
              label="あなたの名前"
              value={currentNameInput}
              onChange={(event) => handleNameInputChange(event.target.value)}
              placeholder="例: 山田"
              error={Boolean(nameError)}
              helperText={nameError ?? "ニックネームでも構いません"}
              fullWidth
            />
            <Button
              variant="contained"
              size="large"
              onClick={showNumber}
              disabled={!isNameReady}
            >
              自分の番号を表示する
            </Button>
            <BackButton />
          </Stack>
        )}

        {phase === "reveal" &&
          currentPerson != null &&
          currentNumber != null && (
            <Stack spacing={3} textAlign="center">
              <Typography variant="overline" color="text.secondary">
                {readyProgressLabel}
              </Typography>
              <Typography variant="h6">
                {currentName ? `${currentName}さん` : `${currentPerson}人目`}
                の番号
              </Typography>
              <Typography variant="h2" fontWeight={800} letterSpacing={4}>
                {currentNumber}
              </Typography>
              <Typography color="text.secondary">
                番号を覚えたら、画面を閉じて「次へ」を押してください。
              </Typography>
              <Button variant="contained" size="large" onClick={closeReveal}>
                確認したので次へ
              </Button>
              <BackButton />
            </Stack>
          )}

        {phase === "handoff" && nextPerson != null && (
          <Stack spacing={3} textAlign="center">
            <Typography variant="overline" color="text.secondary">
              {handoffProgressLabel}
            </Typography>
            <Typography variant="h5" fontWeight={700}>
              次の人に回してください
            </Typography>
            <Typography>
              {previousPerson != null
                ? `${previousPerson}人目${previousName ? `（${previousName}さん）` : ""}の抽選が終わりました。`
                : "前の方の抽選が終わりました。"}
            </Typography>
            <Typography color="text.secondary">
              {nextPerson}
              人目の方に端末を渡し、準備ができたら下のボタンを押してください。
            </Typography>
            <Button variant="contained" size="large" onClick={proceedNext}>
              渡しました
            </Button>
            <BackButton />
          </Stack>
        )}

        {phase === "finished" && (
          <Stack spacing={3} textAlign="center">
            <Typography variant="h5" fontWeight={800}>
              全員の抽選が完了しました
            </Typography>
            <Typography color="text.secondary">
              答え合わせボタンで、小さい番号順に結果を確認できます。
            </Typography>
            <Button variant="contained" size="large" onClick={startReview}>
              答え合わせを始める
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={handleResetWithConfirm}
            >
              最初に戻る
            </Button>
            <Typography variant="caption" color="text.secondary">
              ※戻ると番号と名前の記録はすべて消えます。
            </Typography>
            <BackButton />
          </Stack>
        )}

        {phase === "review" && (
          <Stack spacing={3}>
            <Typography variant="h5" fontWeight={700} textAlign="center">
              答え合わせ
            </Typography>
            <Typography color="text.secondary" textAlign="center">
              最小の番号から順番に開いていきます。残り{remainingCount}人。
            </Typography>
            <Stack spacing={2}>
              {revealedResults.length === 0 && (
                <Paper
                  elevation={0}
                  variant="outlined"
                  sx={{
                    p: 2,
                    textAlign: "center",
                    bgcolor: (theme) => theme.palette.action.hover,
                  }}
                >
                  まだ誰の結果も表示されていません。
                </Paper>
              )}
              {revealedResults.map((result, index) => (
                <Paper
                  elevation={0}
                  key={`${result.number}-${result.name}-${index}`}
                  sx={{
                    p: 2,
                    bgcolor: (theme) => theme.palette.action.hover,
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    {index + 1}番目に小さい番号
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {result.number} ／ {result.name + "さん" || "名前未入力"}
                  </Typography>
                </Paper>
              ))}
            </Stack>
            <Button
              variant="contained"
              size="large"
              onClick={revealNextResult}
              disabled={!canRevealMore}
            >
              {canRevealMore ? "次の人を開ける" : "全員開きました"}
            </Button>
            {reviewComplete && (
              <Stack spacing={1} alignItems="center">
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleResetWithConfirm}
                >
                  最初の画面に戻る
                </Button>
                <Typography variant="caption" color="text.secondary">
                  ※戻ると番号と名前の記録はすべて消えます。
                </Typography>
              </Stack>
            )}
            <BackButton />
          </Stack>
        )}
      </Box>
    </Container>
  );
}
