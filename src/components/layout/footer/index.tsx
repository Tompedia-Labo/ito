import { Box, Stack, Typography } from "@mui/material";
import Image from "next/image";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        px: 2,
        mt: "auto",
        bgcolor: "background.paper",
      }}
    >
      <Stack alignItems="center">
        <Stack alignItems="flex-start">
          <Typography variant="caption" color="text.secondary">
            Powered by
          </Typography>
          <Image
            src="/Tompedia_Labo-united-jp-color-44.webp"
            alt="Tompedia Laboのロゴ"
            width={196}
            height={22}
            priority
          />
        </Stack>
      </Stack>
    </Box>
  );
}
