import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import { chain as chains, useAccount, useSwitchNetwork, useNetwork } from "wagmi";
import { useSnackbar } from "notistack";
import { ConnectKitButton } from "connectkit";
import { useLocalStorage } from "../hooks/useLocalStorage";

type Props = {
    // onClickConnect?: () => void;
};

export function Bar(props: Props) {
    const { chain } = useNetwork();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { switchNetwork } = useSwitchNetwork();
    const [identityCommitment] = useLocalStorage("identityCommitment", "");

    React.useEffect(() => {
        if (
            process.env.NEXT_PUBLIC_NETWORK === "MUMBAI" &&
            chain &&
            chain.id !== chains.polygonMumbai.id
        ) {
            enqueueSnackbar("Invalid Network", { variant: "error" });
            switchNetwork?.(chains.polygonMumbai.id);
        }
    }, [chain, enqueueSnackbar, identityCommitment, switchNetwork]);

    return (
        <AppBar
            position="static"
            sx={{
                background: "inherit",
            }}
            elevation={0}
        >
            <Toolbar>
                <Box
                    display="flex"
                    flexGrow={1}
                    sx={{ alignItems: "center", cursor: "pointer" }}
                    onClick={() => {
                        window.location.href = "/";
                    }}
                >
                    <Box
                        component="img"
                        sx={{
                            height: "29px",
                            padding: 0,
                            imageRendering: "-webkit-optimize-contrast",
                        }}
                        alt="top"
                        src={"/zkshc.png"}
                    />
                </Box>
                <div className="fixed z-50 flex w-full justify-end px-8 pt-10" 
                    style={{
                        display: "flex",
                        zIndex: 50,
                        paddingLeft: 35,
                        paddingRight: 35,
                        paddingTop: 22,
                        justifyContent: "end",
                    }}
                    >
                        <ConnectKitButton />
                    </div>
            </Toolbar>
        </AppBar>
    );
}