import React from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    IconButton,
    TextField,
    Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import QrReader from "react-qr-reader";

import Container from "../components/Container";
import Form, { TForm } from "../components/Form";
import ImmunizationCreatedDialog from "../components/ImmunizationCreatedDialog";

type Props = {
    adminAddress: string;
    dialogOpen: boolean;
    sDialogOpen: boolean;
    eDialogOpen: boolean;
    immunizationId: string;
    inputImmunizationId: string;
    handleSubmit: (form: TForm) => void;
    handleDialogClose: () => void;
    handleClickDialogOpen: () => void;
    handleSDialogClose: () => void;
    handleSDialogOpen: () => void;
    onClickVerify: () => void;
    onUpdateInputImmunization: (immunization: React.ChangeEvent<HTMLInputElement>) => void;
    handleOpenJoinImmunization: () => void;
    handleCloseJoinImmunization: () => void;
    onClickJoinImmunization: () => void;
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));

export interface DialogTitleProps {
    id: string;
    children?: React.ReactNode;
    onClose: () => void;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: theme => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

export default function ImmunizationsTemplate(props: Props) {
    return (
        <Container>
            <BootstrapDialog
                open={props.dialogOpen}
                onClose={props.handleDialogClose}
                disableEscapeKeyDown
                fullWidth={true}
            >
                <BootstrapDialogTitle
                    onClose={props.handleDialogClose}
                    id={"type"}
                >
                    Create Immunization Group
                </BootstrapDialogTitle>
                <DialogContent>
                    <DialogContentText></DialogContentText>
                    <Form
                        onSubmit={props.handleSubmit}
                        address={props.adminAddress}
                    />
                </DialogContent>
            </BootstrapDialog>
            <ImmunizationCreatedDialog
                immunizationId={props.immunizationId}
                dialogOpen={props.sDialogOpen}
                showDialog={props.handleSDialogOpen}
                closeDialog={props.handleSDialogClose}
            />
            <Dialog
                open={props.eDialogOpen}
                onClose={props.handleCloseJoinImmunization}
            >
                <DialogTitle>Join Immunization Group</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To join a immunization, please enter the immunizationID here.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="immunization ID"
                        fullWidth
                        variant="standard"
                        value={props.inputImmunizationId}
                        onChange={props.onUpdateInputImmunization}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleCloseJoinImmunization}>Cancel</Button>
                    <Button onClick={props.onClickJoinImmunization}>Find Immunization</Button>
                </DialogActions>
            </Dialog>
            <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={2}
            >
                <Grid
                    item
                    sx={{
                        mt: {
                            xs: 4,
                            md: 12,
                        },
                    }}
                >
                    <Button
                        color="inherit"
                        variant={"outlined"}
                        sx={{
                            textTransform: "none",
                            backgroundColor: "#FFC749",
                            border: "none",
                            color: "#463B2A",
                            paddingX: 7,
                            paddingY: 1,
                            "&:hover": {
                                backgroundColor: "#2BA9E0",
                                color: "rgba(62,51,62,1)",
                            },
                        }}
                        onClick={props.handleClickDialogOpen}
                    >
                        <Typography
                            component={"h2"}
                            sx={{
                                fontSize: 32,
                                fontWeight: 600,
                            }}
                        >
                            {"Create Immunization Group"}
                        </Typography>
                    </Button>
                </Grid>
                <Grid
                    item
                    sx={{
                        mt: {
                            xs: 4,
                            md: 12,
                        },
                    }}
                >
                    <Button
                        color="inherit"
                        variant={"outlined"}
                        sx={{
                            textTransform: "none",
                            backgroundColor: "#FFC749",
                            border: "none",
                            color: "#463B2A",
                            paddingX: 9,
                            paddingY: 1,
                            "&:hover": {
                                backgroundColor: "#2BA9E0",
                                color: "rgba(62,51,62,1)",
                            },
                        }}
                        onClick={props.handleOpenJoinImmunization}
                    >
                        <Typography
                            component={"h2"}
                            sx={{
                                fontSize: 32,
                                fontWeight: 600,
                            }}
                        >
                            {"Join Immunization Group"}
                        </Typography>
                    </Button>
                </Grid>
                <Grid
                    item
                    sx={{
                        mt: {
                            xs: 4,
                            md: 12,
                        },
                    }}
                >
                    <Button
                        color="inherit"
                        variant={"outlined"}
                        sx={{
                            textTransform: "none",
                            backgroundColor: "#FFC749",
                            border: "none",
                            color: "#463B2A",
                            paddingX: 9,
                            paddingY: 1,
                            "&:hover": {
                                backgroundColor: "#2BA9E0",
                                color: "rgba(62,51,62,1)",
                            },
                        }}
                        onClick={props.onClickVerify}
                    >
                        <Typography
                            component={"h2"}
                            sx={{
                                fontSize: 32,
                                fontWeight: 600,
                            }}
                        >
                            {"Verify Proof"}
                        </Typography>
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
}