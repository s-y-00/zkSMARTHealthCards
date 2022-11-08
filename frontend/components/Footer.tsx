import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

const Footer = (): JSX.Element => {
    return (
        <Grid 
            container 
            spacing={2}
            paddingX={2}
            paddingY={{ xs: 4, sm: 6, md: 8 }}
        >
            <Grid item xs={12}>
                <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    width={1}
                    flexDirection={{ xs: "column", sm: "row" }}
                    fontFamily= "Source Sans Pro"
                >
                    <Box
                        display={"flex"}
                        component="a"
                        href="/"
                        title="theFront"
                    >
                        <Box component={"img"} src={"/zkshc.png"} height={28} />
                    </Box>
                    <Box display="flex" flexWrap={"wrap"} alignItems={"center"}>
                        <Box marginTop={1} marginRight={2}>
                            <Link
                                underline="none"
                                component="a"
                                href="https://mumbai.polygonscan.com/address/0x33cc7d698550E8d35596Cb7d38a8227EeD94dcd6#code"
                                color="white"
                                target={"_blank"}
                                variant={"subtitle2"}
                            >
                                Contract
                            </Link>
                        </Box>
                        <Box marginTop={1} marginRight={2}>
                            <Link
                                underline="none"
                                component="a"
                                href="https://github.com/s-y-00/zktp"
                                color="white"
                                target={"_blank"}
                                variant={"subtitle2"}
                            >
                                Documentation
                            </Link>
                        </Box>
                    </Box>
                </Box>
            </Grid>
            <Grid item xs={12}>
                <Typography
                    align={"center"}
                    variant={"subtitle2"}
                    color="white"
                    gutterBottom
                >
                    &copy; zkSMARTHealthCards. 2022, All rights reserved
                </Typography>
            </Grid>
        </Grid>
    );
};

export default Footer;