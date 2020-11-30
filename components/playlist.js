import { useState } from "react";

//Components
import Image from "next/image";

//ICONS
import { FiPlay } from "react-icons/fi";
import { FiChevronDown } from "react-icons/fi";

//MATERIAL UI
import { withStyles } from "@material-ui/core/styles";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { makeStyles } from "@material-ui/core/styles";

const Accordion = withStyles({
  root: {
    border: "1px solid #a9a9a9",
    backgroundColor: "transparent",
    borderLeft: "0px",
    borderRight: "0px",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "auto",
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    borderBottom: "0px solid #a9a9a9",

    marginBottom: -1,
    minHeight: 56,
    "&$expanded": {
      minHeight: 56,
    },
  },
  content: {
    "&$expanded": {
      margin: "12px 0",
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    borderBottom: "0px solid #a9a9a9",
  },
}))(MuiAccordionDetails);

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  insideModal: {
    padding: "0px",
    outline: "none",
    border: " none",
    objectFit: "cover",
    height: "500px",
    width: "500px",

    [theme.breakpoints.down("sm")]: {
      width: "300px",
      height: "300px",
    },
  },
  imageCont: {
    width: "100px",
    height: "100px",
    marginTop: "8px",
    cursor: "pointer",
  },
  image: {
    objectFit: "cover",
  },
  arrowDown: {
    color: theme.palette.primary.main,
  },
  playBtn: {
    margin: "0.5rem 0",
    cursor: "pointer",
    color: theme.palette.secondary.main,
    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
}));

export default function Playlist({ track, setSelectedTrack }) {
  const classes = useStyles();

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Accordion square>
        <AccordionSummary
          color="primary"
          expandIcon={<FiChevronDown className={classes.arrowDown} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Grid container>
            <Grid item md={2} sm={12} xs={12}>
              <Typography variant="body2">{track.number}</Typography>
            </Grid>
            <Grid item md={7} sm={12} xs={12}>
              <Typography variant="body2">{track.title}</Typography>
            </Grid>
            <Grid item md={2} sm={12} xs={12}>
              <Typography variant="body2">{track.duration}</Typography>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container>
            <Grid item md={2} sm={12} xs={12}>
              <Box className={classes.imageCont} onClick={handleOpen}>
                <Image
                  className={classes.image}
                  src={track.image}
                  alt="avatar"
                  layout="responsive"
                  width={400}
                  height={400}
                />
              </Box>
            </Grid>
            <Grid item md={9} sm={12} xs={12}>
              <FiPlay
                onClick={() => {
                  setSelectedTrack(track);
                }}
                className={classes.playBtn}
              />
              <Typography variant="body2">{track.description}</Typography>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <img
            className={classes.insideModal}
            src={track.image}
            alt="avatar"
            // layout="fixed"
            // width={400}
            // height={400}
          />
        </Fade>
      </Modal>
    </>
  );
}
