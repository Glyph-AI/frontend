const { Box, Typography } = require("@mui/material");

export default function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: "24px 8px 24px 8px" }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}