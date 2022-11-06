import React from "react";
import { Identity } from "@semaphore-protocol/identity";
import { useConnect, useSignMessage, useAccount, useBalance } from "wagmi";
import { utils } from "ethers";
import { useLocalStorage } from "../hooks/useLocalStorage";
// import { useSnackbar } from "notistack";
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
    // const { enqueueSnackbar } = useSnackbar();

    const [address, setAddress] = React.useState("");

    const { address: account, isConnected } = useAccount();

    const [identityCommitment, setIdentityCommitment] = useLocalStorage(
        "identityCommitment",
        ""
    );

    const { connect, connectors } = useConnect({
        onSettled() {
            if (!identityCommitment) {
                const message = {
                    app: "ZK-SMARTHealthCards",
                    operation: "Generate Identity",
                    nonce: utils.hexlify(utils.randomBytes(32)),
                };
                const messageToSign = JSON.stringify(message, null, 2);
                signMessage({ message: messageToSign });
            }
        },
    });

    const { signMessage } = useSignMessage({
        onSettled(data) {
            const identityCommitment = new Identity(data);
            setIdentity(identityCommitment);
        },
    });

  const [_identity, setIdentity] = useState<Identity>()
  const [_signer, setSigner] = useState<Signer>()
  const [_contract, setContract] = useState<Contract>()

  useEffect(() => {
      ;(async () => {
          const ethereum = (await detectEthereumProvider()) as any
          const accounts = await ethereum.request({ method: "eth_requestAccounts" })

          await ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [
                  {
                      chainId: hexlify(Number(process.env.ETHEREUM_CHAIN_ID!)).replace("0x0", "0x")
                  }
              ]
          })

          const ethersProvider = new providers.Web3Provider(ethereum)

          if (accounts[0]) {
              setSigner(ethersProvider.getSigner())

              setContract(new Contract(process.env.CONTRACT_ADDRESS!, Immunization.abi, ethersProvider.getSigner()))
          }

          ethereum.on("accountsChanged", (newAccounts: string[]) => {
              if (newAccounts.length !== 0) {
                  setSigner(ethersProvider.getSigner())

                  setContract(new Contract(process.env.CONTRACT_ADDRESS!, Immunization.abi, ethersProvider.getSigner()))
              } else {
                  setSigner(undefined)
              }
          })
      })()

      if (isConnected) {
        setAddress(account || "");
    } else {
        setAddress("");
    }
  }, [account, isConnected]);

  return (
    <MainLayout
            loading={false}
            setLoading={() => {
                // do nothing
            }}
            title={"zkSMARTHealthCards"}
        >
            <HomeTemplate address={address} />
        </MainLayout>
  )
}

export default Home
