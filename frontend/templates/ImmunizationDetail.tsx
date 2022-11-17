import React from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    Grid,
    IconButton,
    Input,
    InputAdornment,
    InputLabel,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { AccountCircle, Diamond } from "@mui/icons-material";
import DownloadIcon from '@mui/icons-material/Download';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SourceIcon from '@mui/icons-material/Source';
import CoronavirusIcon from '@mui/icons-material/Coronavirus';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import QRcode from 'qrcode.react'
import { useSnackbar } from "notistack";
import Container from "../components/Container";
import { Immunization } from "../utilities/entities";

type Props = {
    immunization: Immunization;
    rawSHC: string;
    dialogOpen: boolean;
    eDialogOpen: boolean;
    handleDialogClose: () => void;
    handleClickDialogOpen: () => void;
    handleCloseJoinImmunization: () => void;
    handleOpenJoinImmunization: () => void;
    onClickJoinImmunization: () => void;
    onClickGenerateProof: () => void;
    onUpdateRawSHC: (rawSHC: React.ChangeEvent<HTMLInputElement>) => void;
    solidityProof?: string;
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

async function copyTextToClipboard(text: string) {
    if ("clipboard" in navigator) {
        return await navigator.clipboard.writeText(text);
    } else {
        return document.execCommand("copy", true, text);
    }
}

export default function ImmunizationDetailTemplate(props: Props) {
    const { enqueueSnackbar } = useSnackbar();

    const downloadQR: React.MouseEventHandler<HTMLButtonElement> | undefined = () => {
        const canvas = document.getElementById("proofQRCode") as HTMLCanvasElement;
        const pngUrl: string = canvas
            .toDataURL("image/png")
            .replace("image/png", "image/octet-stream");
        let downloadLink: HTMLAnchorElement = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `zkSHCPoof_${props.immunization.vaccineType}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    return (
        <Container>
            <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="flexStart"
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
                    <Container maxWidth={800} paddingY={"0 !important"}>
                        <Typography
                            component={"h2"}
                            sx={{
                                color: "#003939",
                                fontSize: 28,
                                fontWeight: 600,
                            }}
                        >
                            Immunization Group Detail
                        </Typography>
                    </Container>
                </Grid>
                <Grid item>
                    <Container maxWidth={800} paddingY={"0 !important"}>
                        <Stack spacing={2}>
                            <FormControl variant="standard">
                                <InputLabel 
                                    htmlFor="input-with-icon-adornment"
                                    sx={{
                                        fontSize: 18,
                                    }}
                                >
                                    Admin Address
                                </InputLabel>
                                <Input
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <AccountCircle />
                                        </InputAdornment>
                                    }
                                    value={props.immunization.adminAddress || ""}
                                    readOnly
                                    sx={{
                                        fontSize: 19,
                                        color: "gray",
                                    }}
                                />
                            </FormControl>
                            <FormControl variant="standard">
                                <InputLabel 
                                    htmlFor="input-with-icon-adornment"
                                    sx={{
                                        fontSize: 18,
                                    }}
                                >
                                    Vaccine Type
                                </InputLabel>
                                <Input
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <CoronavirusIcon />
                                        </InputAdornment>
                                    }
                                    value={props.immunization.vaccineType || ""}
                                    readOnly
                                    sx={{
                                        fontSize: 19,
                                        color: "gray",
                                    }}
                                />
                            </FormControl>
                            <FormControl variant="standard">
                                <InputLabel 
                                    htmlFor="input-with-icon-adornment"
                                    sx={{
                                        fontSize: 18,
                                    }}
                                >
                                    Vaccine Code [system]
                                </InputLabel>
                                <Input
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <VaccinesIcon />
                                        </InputAdornment>
                                    }
                                    value={props.immunization.vaccineCodeSystem || ""}
                                    readOnly
                                    sx={{
                                        fontSize: 19,
                                        color: "gray",
                                    }}
                                />
                            </FormControl>
                            <FormControl variant="standard">
                                <InputLabel 
                                    htmlFor="input-with-icon-adornment"
                                    sx={{
                                        fontSize: 18,
                                    }}
                                >
                                    Vaccine Code [code]
                                </InputLabel>
                                <Input
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <SourceIcon />
                                        </InputAdornment>
                                    }
                                    value={props.immunization.vaccineCodeCode || ""}
                                    readOnly
                                    sx={{
                                        fontSize: 19,
                                        color: "gray",
                                    }}
                                />
                            </FormControl>
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
                                onClick={props.handleOpenJoinImmunization}
                            >
                                <Typography
                                    component={"h2"}
                                    sx={{
                                        fontSize: 22,
                                        fontWeight: 600,
                                    }}
                                >
                                    {"Join Immunization Group"}
                                </Typography>
                            </Button>
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
                                onClick={props.onClickGenerateProof}
                            >
                                <Typography
                                    component={"h2"}
                                    sx={{
                                        fontSize: 22,
                                        fontWeight: 600,
                                    }}
                                >
                                    {"Generate Proof"}
                                </Typography>
                            </Button>
                            {props.solidityProof && (
                                <Box
                                    sx={{
                                        color: "white",
                                        mt: 3,
                                        borderRadius: 1,
                                        textAlign: "center",
                                        fontSize: "1rem",
                                        fontWeight: "700",
                                    }}
                                >
                                    <QRcode
                                        id="proofQRCode"
                                        value={props.solidityProof}
                                        size={300}
                                        style={{
                                            margin: "auto",
                                        }}
                                    />
                                    <IconButton 
                                        aria-label="download"
                                        size="large"
                                        onClick={downloadQR}
                                    >
                                        <DownloadIcon />
                                    </IconButton>
                                    <IconButton 
                                        aria-label="copy"
                                        size="large"
                                        onClick={async () => {
                                            await copyTextToClipboard(props.solidityProof?? "");
                                            enqueueSnackbar("Copied!");
                                        }}
                                    >
                                        <ContentCopyIcon />
                                    </IconButton>
                                </Box>
                            )}
                        </Stack>
                    </Container>
                </Grid>
            </Grid>
            <Dialog
                open={props.eDialogOpen}
                onClose={props.handleCloseJoinImmunization}
            >
                <DialogTitle>Join Immunization Group</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Scan your SMART Health Cards to join the immunization group.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="SMART Health Cards"
                        fullWidth
                        variant="standard"
                        placeholder="shc:/"
                        value={props.rawSHC}
                        onChange={props.onUpdateRawSHC}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleCloseJoinImmunization}>Cancel</Button>
                    <Button onClick={props.onClickJoinImmunization}>Join Immunization</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}