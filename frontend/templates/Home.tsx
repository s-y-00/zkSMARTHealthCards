import React from "react";

import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import PublishIcon from "@mui/icons-material/Publish";
import { Avatar, Box, Button, Grid, Typography } from "@mui/material";
import Container from "../components/Container";
import Link from "next/link";

const howTo = [
    {
        title: "Connect",
        color: "#e94709",
        subtitle: "Connect wallet and generate your ID",
        icon: (
            <svg
                height={24}
                width={24}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                />
            </svg>
        ),
    },
    {
        title: "Create Proof",
        subtitle:
            "If you have a certain certificate, you can create a proof",
        icon: <LocalFireDepartmentIcon />,
        color: "blue",
    },
    {
        title: "Verify Proof",
        subtitle:
            "You can verify that your proof is valid",
        icon: <PublishIcon />,
        color: "green",
    },
];

type Props = {
    address: string;
};

export default function HomeTemplate(props: Props) {
    return (
        <Container>
            <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={2}
            >
                <Grid item
                    style={{
                        background: "#6EBDBD"
                    }}>
                    <Box>
                        <Box marginBottom={4}>
                            <Box marginBottom={2}>
                                <Typography
                                    fontSize="46px"
                                    variant="h4"
                                    color="white"
                                    align={"center"}
                                    gutterBottom
                                    sx={{
                                        fontWeight: 700,
                                    }}
                                >
                                    zkSMARTHealthCards
                                </Typography>
                                <Typography
                                    fontSize="24px"
                                    variant="h6"
                                    component="p"
                                    color="#003636"
                                    sx={{ fontWeight: 600 }}
                                    align={"center"}
                                >
                                    A Zero Knowledge proof solution that enables users proving<br/>
                                    <Link href="https://smarthealth.cards/en/" target="_blank" rel="noopener noreferrer">the SMART Health Cards</Link> without revealing their personal information. People can prove their COVID-19 vaccination or test result without revealing their Name, Age, Residence.
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
                <Grid item>
                    <Grid container spacing={2}>
                        {howTo.map((item, i) => (
                            <Grid item xs={12} md={4} key={i}>
                                <Box width={1} height={1}>
                                    <Box
                                        display={"flex"}
                                        flexDirection={"column"}
                                        alignItems={"center"}
                                    >
                                        <Box
                                            component={Avatar}
                                            width={60}
                                            height={60}
                                            marginBottom={2}
                                            bgcolor={"lightgray"}
                                            color={item.color}
                                        >
                                            {item.icon}
                                        </Box>
                                        <Typography
                                            fontSize={"24px"}
                                            variant={"h6"}
                                            gutterBottom
                                            sx={{ fontWeight: "bold" }}
                                            align={"center"}
                                            color={"black"}
                                        >
                                            {item.title}
                                        </Typography>
                                        <Typography
                                            color={"#003636"}
                                            align={"center"}
                                            sx={{ fontWeight: 1000 }}
                                        >
                                            {item.subtitle}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
                <Grid
                    item
                    sx={{
                        mt: {
                            xs: 2,
                            md: 8,
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
                    >
                        <Link
                            href={
                                props.address ? "/immunizations" : "/docs/introduction"
                            }
                        >
                            <Typography
                                component={"h2"}
                                sx={{
                                    fontSize: 32,
                                    fontWeight: 600
                                }}
                            >
                                {props.address ? "Launch App" : "Learn More"}
                            </Typography>
                        </Link>
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
}