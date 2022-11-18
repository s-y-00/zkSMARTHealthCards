import React from "react";
import { Identity } from "@semaphore-protocol/identity";
import { useConnect, useSignMessage, useAccount, useBalance } from "wagmi";
import { utils } from "ethers";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useSnackbar } from "notistack";
// import { ConnectKitButton } from "connectkit";

import type { NextPage } from 'next'
import HomeTemplate from "../templates/Home";
import MainLayout from "../layouts/Main";
import "@fontsource/inter/400.css"
import detectEthereumProvider from "@metamask/detect-provider"
import { Contract, providers, Signer } from "ethers"
import { hexlify } from "ethers/lib/utils"
import { useEffect, useState } from "react"
import Immunization from "../abis/ZKSmartHealthCards.json"

const Home: NextPage = () => {
    const { enqueueSnackbar } = useSnackbar();

    const [address, setAddress] = React.useState("");

    const { address: account, isConnected } = useAccount();

    const [identityCommitment, setIdentityCommitment] = useLocalStorage(
        "identityCommitment",
        ""
    );

    const { signMessage } = useSignMessage({
        onSettled(data) {
            const identityCommitment = new Identity(data);
            setIdentityCommitment(identityCommitment.toString());
        },
    });

    const { connect, connectors } = useConnect({
        onSettled() {
            if (!identityCommitment) {
                const message = {
                    app: "zkSMARTHealthCards",
                    operation: "Generate Identity",
                    nonce: utils.hexlify(utils.randomBytes(32)),
                };
                const messageToSign = JSON.stringify(message, null, 2);
                signMessage({ message: messageToSign });
            }
        },
    });

    React.useEffect(() => {
        if (isConnected) {
            setAddress(account || "");
        } else {
            setAddress("");
        }
    }, [account, enqueueSnackbar, isConnected]);

  return (
    <MainLayout
            loading={false}
            setLoading={() => {
                // do nothing
            }}
            onClickConnect={() => {
                connect({ connector: connectors[0] });
            }}
            title={"zkSMARTHealthCards"}
        >
            <HomeTemplate address={address} />
        </MainLayout>
  )
}

export default Home
