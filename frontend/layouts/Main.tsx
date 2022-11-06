import Head from "next/head";
import { 
    Backdrop, 
    CircularProgress, 
    Container, 
    Divider 
} from "@mui/material";
import React from "react";
import Box from "@mui/material/Box";
import { Bar } from "../components/AppBar";
import Footer from "../components/Footer";
import Contaier2 from "../components/Container";

type Props = {
    loading: boolean;
    setLoading: (loading: boolean) => void;
    children: React.ReactNode;
    title?: string;
};

export default function MainLayout(props: Props) {
    return (
        <div>
            <Bar />

            <Container>
                <Head>
                    <title>{props.title || "zkSMARTHealthCards"}</title>
                    <meta
                        name="description"
                        content="ZKSmartHealthCards is a Zero Knowledge based SmartHealthCards proof application."
                    />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <Backdrop
                    sx={{
                        color: "#fff",
                        zIndex: theme => theme.zIndex.modal + 100,
                    }}
                    open={props.loading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
                {props.children}
                <Contaier2 maxWidth={800} paddingY={"0 !important"}>
                    <Divider />
                </Contaier2>
            </Container>
            <Box sx={{ gridArea: 'footer', bgcolor: '#333333' }}>
                <Footer />
            </Box>
        </div>
    );
}