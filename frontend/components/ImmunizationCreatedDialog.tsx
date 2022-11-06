import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { useSnackbar } from "notistack";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

async function copyTextToClipboard(text: string) {
    if ("clipboard" in navigator) {
        return await navigator.clipboard.writeText(text);
    } else {
        return document.execCommand("copy", true, text);
    }
}

type Props = {
    dialogOpen: boolean;
    showDialog: () => void;
    closeDialog: () => void;
    immunizationId: string;
};

export default function ImmunizationCreatedDialog(props: Props) {
    const { enqueueSnackbar } = useSnackbar();

    return (
        <Dialog
            open={props.dialogOpen}
            TransitionComponent={Transition}
            keepMounted
            onClose={props.closeDialog}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle sx={{ textAlign: "center" }}>
                {"✅ Immunization Group Created ✅"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    Immunization Group successfully created 🚀 <br />
                    Share the immunization page and let people join 🦄
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={async () => {
                        const url = `${window.location.href}/${props.immunizationId}`;
                        await copyTextToClipboard(url);
                        enqueueSnackbar("Copied!");
                    }}
                >
                    Copy immunization URL
                </Button>
                <Button onClick={props.closeDialog}>close</Button>
            </DialogActions>
        </Dialog>
    );
}