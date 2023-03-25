import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import useTheme from "@mui/material/styles/useTheme";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ListItem from "../components/ListItem";
import RowDivider from "../components/RowDivider";
import { sessionContext } from "../features/Session";
import { socket } from "../socket.io/socket";
import { getCurrentTime } from "../utils/utils";

function copyListItems(array) {
  const formattedText = array
    .map((item) => {
      return `${item.username}`;
    })
    .join("\n");

  navigator.clipboard
    .writeText(formattedText)
    .then(() => {
      console.log("Copied to clipboard:", formattedText);
    })
    .catch((err) => {
      console.error("Failed to copy to clipboard:", err);
    });
}

function List() {
  const theme = useTheme();
  const { session } = useContext(sessionContext);
  const isMobile = useMediaQuery("(max-width:500px)");
  const navigate = useNavigate();
  const { eventType, webhookID } = useParams();
  const location = useLocation();
  const name = location.state?.name;
  const EVENT_TYPES = useMemo(() => {
    return ["JOIN", "GIFT", "LIKE", "SHARE", "FOLLOW", "SUBSCRIBE", "COMMENT"];
  }, []);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!session.isLoggedIn) {
      navigate("/");
    }
  }, [session.isLoggedIn, navigate]);

  useEffect(() => {
    if (!EVENT_TYPES.includes(eventType)) {
      navigate("/dashboard");
    }
  }, [eventType, navigate, EVENT_TYPES]);

  useEffect(() => {
    function handleEvent(data) {
      console.log("data", data);
      setEvents((prev) => {
        data.time = getCurrentTime();
        return [data, ...prev];
      });
    }
    socket.on(webhookID, handleEvent);
    return () => {
      socket.off(webhookID, handleEvent);
    };
  }, [webhookID]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100vw",
      }}
    >
      <Typography
        variant="h6"
        component={"h1"}
        fontWeight="400"
        sx={{ margin: "2rem 0" }}
      >
        Akisyah Live Interaction
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "white",
          padding: isMobile ? "2rem 1rem" : "2rem 4rem",
          width: isMobile ? "100%" : "unset",
          borderRadius: theme.shape.borderRadius - 2,
        }}
      >
        <Box
          sx={{
            margin: isMobile ? "2rem 0" : "2rem 8rem",
            textAlign: "center",
          }}
        >
          <Typography variant="h5" component={"h1"}>
            {name}
          </Typography>
          <Typography variant="body1" component={"p"}>
            Total Users : {events.length}
          </Typography>
        </Box>
        <Box width={"100%"}>
          <Box
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"space-around"}
            width={"100%"}
          >
            <Typography
              variant="caption"
              component={"h1"}
              fontWeight="400"
              color={"GrayText"}
            >
              Username
            </Typography>
            <Typography
              variant="caption"
              component={"h1"}
              fontWeight="400"
              color={"GrayText"}
            >
              Time
            </Typography>
          </Box>
          <Box
            display={"flex"}
            sx={{
              flexDirection: "column",
              height: "45vh",
              overflow: "scroll",
              "::-webkit-scrollbar": {
                display: "none",
              },
              "::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(0,0,0,0)",
              },
              my: 2,
            }}
            width="100%"
          >
            {/* <ListItem img={AvatarImg} /> */}
            {/* <RowDivider /> */}
            {events.map((event, index) => {
              return (
                <React.Fragment key={index}>
                  <ListItem
                    imgUrl={event["avatar_url"]}
                    name={event["value1"]}
                    username={event["username"]}
                    time={event["time"]}
                  />
                  <RowDivider />
                </React.Fragment>
              );
            })}
          </Box>
          <Box
            display={"flex"}
            sx={{ width: "100%" }}
            justifyContent="space-between"
          >
            <Button
              variant="contained"
              fullWidth={true}
              color={"buttonGray"}
              sx={{
                borderBottom: "4px solid #B9BCBE",
              }}
              onClick={() => setEvents([])}
            >
              Clear List
            </Button>
            <Box sx={{ width: "10px" }}></Box>
            <Button
              variant="contained"
              fullWidth={true}
              sx={{
                borderBottom: "4px solid #3687D9",
              }}
              onClick={() => copyListItems(events)}
            >
              Copy List
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              component={"p"}
              sx={{
                textAlign: "center",
                fontSize: "0.8rem",
                fontWeight: "300",
                color: "GrayText",
                mt: 2,
              }}
            >
              Back to Dashboard?
            </Typography>
            <Typography
              component={"a"}
              color={"primary"}
              onClick={() => navigate("/dashboard")}
              sx={{
                textAlign: "center",
                fontSize: "0.8rem",
                fontWeight: "400",
                textDecoration: "none",
                cursor: "pointer",
                mt: 2,
                ml: 1,
              }}
            >
              click here
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default List;
