// import React from "react";
// import { useAuth } from "../context/authContext";
// import {
//   Card as MUICard,
//   CardContent,
//   CardActions,
//   CardMedia,
//   Typography,
//   Button,
//   Box,
// } from "@mui/material";

// const Card = ({ text, origin, roastLevel, onView, onEdit, onDelete, image }) => {
//   const { isAuthenticated } = useAuth();

//   // Default SVG if no image is provided
//   const fallbackSvg = "/images/fallback.svg";

//   return (
//     <MUICard
//       sx={{
//         height: 320,
//         display: "flex",
//         flexDirection: "column",
//         borderRadius: 1,
//         backgroundColor: "white",
//         marginBottom: "29px",
//       }}
//     >
//       {/* Coffee Image */}
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           padding: 2,
//           flex: 1,
//         }}
//       >
//         <a
//           href="#"
//           onClick={(e) => {
//             e.preventDefault();
//             onView();
//           }}
//         >
//           <CardMedia
//             component="img"
//             alt="Coffee Icon"
//             sx={{
//               height: 130,
//               width: "auto",
//               objectFit: "contain",
//             }}
//             src={image || fallbackSvg}
//             onError={(e) => {
//               console.error(`Failed to load image: ${image}`);
//               e.target.src = fallbackSvg;
//             }}
//           />
//         </a>
//       </Box>

//       {/* Card Content with Origin and Roast Level */}
//       <CardContent
//         sx={{
//           padding: 2,
//         }}
//       >
//         <Typography variant="h6" gutterBottom>
//           {text}
//         </Typography>
//         <Typography variant="body2" color="text.secondary" gutterBottom>
//           Origin: {origin}
//         </Typography>
//         <Typography variant="body2" color="text.secondary">
//           Roast Level: {roastLevel}
//         </Typography>
//       </CardContent>

//       {/* Buttons Section */}
//       {isAuthenticated && (
//         <CardActions
//           sx={{
//             display: "flex",
//             justifyContent: "flex-start",
//             gap: 1,
//             borderTop: "1px solid rgba(0, 0, 0, 0.1)",
//           }}
//         >
//           <Button
//             size="small"
//             variant="outlined"
//             color="primary"
//             onClick={onView}
//           >
//             View
//           </Button>
//           <Button
//             size="small"
//             variant="outlined"
//             color="secondary"
//             onClick={onEdit}
//           >
//             Edit
//           </Button>
//           <Button
//             size="small"
//             variant="outlined"
//             color="error"
//             onClick={onDelete}
//           >
//             Delete
//           </Button>
//         </CardActions>
//       )}
//     </MUICard>
//   );
// };

// export default Card;
