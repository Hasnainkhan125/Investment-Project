import React, { useState, useEffect } from "react";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from "@mui/material";
import GetAppIcon from "@mui/icons-material/GetApp";
import { keyframes } from "@mui/system";
import RocketLaunchRoundedIcon from "@mui/icons-material/RocketLaunchRounded";
import Zoom from "@mui/material/Zoom";

// 🚀 Smooth modern animations
const float = keyframes`
  0%,100% { transform: translateY(0px) scale(1); }
  25% { transform: translateY(-8px) scale(1.02); }
  50% { transform: translateY(-4px) scale(1.05); }
  75% { transform: translateY(-6px) scale(1.03); }
`;

const rotateTilt = keyframes`
  0%,100% { transform: rotate(0deg) perspective(500px) rotateY(0deg); }
  50% { transform: rotate(2deg) perspective(500px) rotateY(4deg); }
`;

const zoomPulse = keyframes`
  0%,100% { transform: scale(1); }
  50% { transform: scale(1.08); }
`;

const swingTilt = keyframes`
  0%,100% { transform: rotate(0deg) perspective(500px) rotateX(0deg); }
  25% { transform: rotate(2deg) perspective(500px) rotateX(1deg); }
  75% { transform: rotate(-2deg) perspective(500px) rotateX(-1deg); }
`;

const ImageCarousel = ({ darkMode = false, height = 350 }) => {
  const images = [
    "https://incomix-world.vercel.app/images/picture1.jpg",
    "https://incomix-world.vercel.app/images/picture2.jpg",
    "https://incomix-world.vercel.app/images/picture3.jpg",    
    "https://incomix-world.vercel.app/images/picture4.jpg",
    "https://incomix-world.vercel.app/images/picture5.jpg",
  ];

  const [currentImage, setCurrentImage] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  // Array of different animations for each image
  const animations = [float, rotateTilt, zoomPulse, swingTilt, float];

  // Modern filters for contrast & brightness
  const filters = [
    "contrast(115%) brightness(105%) saturate(120%)",
    "contrast(120%) brightness(100%) saturate(110%)",
    "contrast(105%) brightness(110%) saturate(110%)",
    "contrast(110%) brightness(95%) saturate(125%)",
    "contrast(108%) brightness(115%) saturate(120%)",
  ];

  return (
    <Box sx={{ width: "100%", mt: 2, mb: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
      
      {/* Carousel Container */}
      <Box
        sx={{
          overflow: "hidden",
          position: "relative",
          width: "100%",
          height: height,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 5,
          perspective: "1000px", // For 3D tilt effect
        }}
      >
        {images.map((src, index) => (
          <Box
            key={index}
            component="img"
            src={src}
            alt={`Slide ${index + 1}`}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "certain",
              position: "absolute",
              top: 0,
              left: 0,
              opacity: index === currentImage ? 1 : 0,
              transition: "opacity 1s ease-in-out",
              borderRadius: 8,
              animation: `${animations[index]} 6s ease-in-out infinite`,
              filter: filters[index],
              transformOrigin: "center center",
              boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
            }}
          />
        ))}

        {/* Dots */}
        <Box
          sx={{
            position: "absolute",
            bottom: 12,
            display: "flex",
            justifyContent: "center",
            width: "100%",
            gap: 1.5,
          }}
        >
          {images.map((_, index) => {
            const isActive = index === currentImage;
            return (
              <Box
                key={index}
                sx={{
                  width: isActive ? 14 : 10,
                  height: isActive ? 14 : 10,
                  borderRadius: "50%",
                  backgroundColor: isActive ? "#fff" : "rgba(162, 162, 162, 0.5)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: isActive ? "0 0 12px rgba(0,0,0,0.5)" : "none",
                  "&:hover": { transform: "scale(1.3)" },
                }}
                onClick={() => setCurrentImage(index)}
              />
            );
          })}
        </Box>
      </Box>

      {/* Download App Button */}
      <Button
        variant="contained"
        startIcon={<GetAppIcon />}
        fullWidth
        sx={{
          mt: 3,
          backgroundColor: darkMode ? "#fff" : "#3b82f6",
          color: darkMode ? "#000" : "#fff",
          textTransform: "none",
          fontWeight: 600,
          fontSize: 16,
          py: 1.5,
          borderRadius: 12,
          "&:hover": { backgroundColor: darkMode ? "#f1f1f1" : "#3071d8" },
        }}
        onClick={() => setOpenDialog(true)}
      >
        Download App
      </Button>

      {/* Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        TransitionComponent={Zoom}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: { xs: 3, sm: 5 },
            p: { xs: 3.5, sm: 4 },
            minWidth: { xs: "90%", sm: 320 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            background: "linear-gradient(135deg, #f9fbff, #eef2ff)",
            border: "1px solid rgba(63,81,181,0.08)",
            boxShadow: {
              xs: "0 8px 25px rgba(63,81,181,0.12)",
              sm: "0 20px 45px rgba(63,81,181,0.18)",
            },
            backdropFilter: "blur(16px)",
            transition: "all 0.3s ease",
          },
        }}
      >
        <RocketLaunchRoundedIcon
          sx={{
            fontSize: { xs: 48, sm: 60 },
            color: "#3f51b5",
            mb: 1,
            animation: `${float} 2.5s ease-in-out infinite`,
            filter: "drop-shadow(0px 5px 15px rgba(63,81,181,0.4))",
          }}
        />

        <DialogTitle
          sx={{
            fontWeight: 800,
            fontSize: { xs: 20, sm: 24 },
            background: "linear-gradient(90deg, #3f51b5, #6573c3)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 1,
          }}
        >
          Coming Soon
        </DialogTitle>

        <DialogContent sx={{ px: { xs: 1, sm: 2 } }}>
          <Typography
            sx={{
              fontSize: { xs: 14, sm: 16 },
              color: "#555",
              lineHeight: 1.7,
            }}
          >
            The app download will be available soon. Stay tuned for something amazing 🚀
          </Typography>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            fullWidth
            onClick={() => setOpenDialog(false)}
            sx={{
              fontWeight: 600,
              textTransform: "none",
              px: { xs: 9, sm: 6 },
              py: 1.5,
              borderRadius: "30px",
              fontSize: { xs: 14, sm: 15 },
              background: "linear-gradient(90deg, #3f51b5, #6573c3)",
              color: "#fff",
              boxShadow: "0 8px 20px rgba(63,81,181,0.3)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0 12px 25px rgba(63,81,181,0.4)",
                background: "linear-gradient(90deg, #6573c3, #3f51b5)",
              },
            }}
          >
            Got it
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ImageCarousel;