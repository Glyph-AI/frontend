import { Avatar, Box, Typography, useTheme } from "@mui/material";

const dotStyles = {
    display: "inline-block",
    animationName: "bouncing",
    animationDuration: "700ms",
    animationIterationCount: "infinite",
    animationTimingFunction: "ease-out",
    "&>*:nth-child(2)": {
        animationDelay: "125ms"
    },
    "&>*:nth-child(3)": {
        animationDelay: "250mx"
    },
    "@keyframes bouncing": {
        "0%": {
          transform: "none"
        },
        
        "33%": {
          transform: "translateY(-.5em)"
        },
        
        "66%": {
          transform: "none"
        }
      }
}

export default function TypingIndicator({botName, avatarUrl}) {
    const theme = useTheme()
    return (
        <Box sx={{display: "flex", color: theme.palette.common.darkBlue, alignItems: "center"}}>
            <Box 
              sx={{
                  letterSpacing: "4px", 
                  // padding: "8px 10px", 
                  height: "24px",
                  width: "56px",
                  borderRadius: "8px",
                  backgroundColor: theme.palette.common.offWhite,
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex"
              }}>
              <Typography variant="body" className="dot" sx={dotStyles}>.</Typography>
              <Typography variant="body" className="dot" sx={{animationDelay: "125ms", ...dotStyles}}>.</Typography>
              <Typography variant="body" className="dot" sx={{animationDelay: "250ms", ...dotStyles}}>.</Typography>
            </Box>
            <Avatar sx={{marginLeft: "8px", height: "18px", width: "18px"}}/>
            <Typography sx={{paddingLeft: "8px"}} variant="body2">Glyph is Typing</Typography>
        </Box>
    )
}