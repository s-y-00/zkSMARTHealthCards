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
    onClickConnect?: () => void;
};

export function Bar(props: Props) {
    const { chain } = useNetwork();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { switchNetwork } = useSwitchNetwork();
    const [identityCommitment] = useLocalStorage("identityCommitment", "");

    const { address: useAccountAddress } = useAccount();
    const [address, setAddress] = React.useState("");

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

    React.useEffect(() => {
        if (useAccountAddress) {
            const shortAddress = `${useAccountAddress.slice(
                0,
                4
            )}...${useAccountAddress.slice(-4)}`;
            setAddress(shortAddress);
        } else {
            setAddress("");
        }
    }, [useAccountAddress]);

    const ConnectOrLaunchApp = React.useMemo(() => {
        if (address) {
            return (
                <Typography component={"h2"} sx={{ 
                    cursor: "pointer",
                    color: "#003939",
                    fontSize: 20,
                    }}>
                    {address}
                </Typography>
            );
        } else {
            return (
                <Button
                    color="inherit"
                    variant={"outlined"}
                    sx={{
                        color: "#003939",
                        borderRadius: 50,
                        textTransform: "lowercase",
                        "&:hover": {
                            color: "rgba(62,51,62,1)",
                        },
                    }}
                    onClick={props.onClickConnect}
                >
                    <Typography component={"h2"}>{"connect"}</Typography>
                </Button>
            );
        }
    }, [address, props.onClickConnect]);

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
                    sx={{ alignItems: "center", cursor: "pointer", marginRight: "50%" }}
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
                <Box className="fixed flex w-full justify-end px-8 pt-10" 
                    style={{
                        display: "flex",
                        paddingLeft: 35,
                        paddingRight: 35,
                        paddingTop: 22,
                        justifyContent: "end",
                    }}
                    >
                        {/* <ConnectKitButton /> */}
                        <Box sx={{ flexGrow: 0 }}>{ConnectOrLaunchApp}</Box>
                    </Box>
            </Toolbar>
        </AppBar>
    );
}