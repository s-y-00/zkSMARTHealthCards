import React from "react";
import { useAccount, useSigner, useProvider, useNetwork } from "wagmi";
import { BigNumber, Contract, ethers, providers, utils } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider"
import MainLayout from "../../../layouts/Main";
import ImmunizationDetailTemplate from "../../../templates/ImmunizationDetail";
import { useRouter } from "next/router";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import { Identity } from "@semaphore-protocol/identity";
import { Group } from "@semaphore-protocol/group";
import {
    ZKSmartHealthCards,
    ZKSmartHealthCards__factory
} from "../../../utilities/typechain";
import { ZK_SHC_ADDRESS } from "../../../utilities/constants";
import { Immunization } from "../../../utilities/entities";
import { useSnackbar } from "notistack";
import { Buffer } from "buffer";
import dynamic from "next/dynamic";
import { parseShc } from "../../../utilities/shc/parsers";

const {
    generateProof,
    packToSolidityProof,
} = require("@semaphore-protocol/proof");
// const QrReader = dynamic(() => import("react-qr-reader"), { ssr: false });

/**
 * 0. retrieve Immunization from _id.
 *    a. if Immunization not found, redirect 404.
 *    b. if found, retrieve whole params from contract.
 * 1. retrieve Immunizations to build merkle tree
 * 2. if you have at least one appropriate NFT, you can register your identityCommitment by calling registrant contract's register function.
 * 3. if you submitted the Immunization, wait until the relayers submit your identityCommitment to the ZKSmartHealthCards contract.
 * 4. if your identity
 */
export default function ImmunizationDetail() {
    const router = useRouter();
    const { chain } = useNetwork();
    const { address: account } = useAccount();
    const { data: signer } = useSigner();
    const provider = useProvider();
    const { enqueueSnackbar } = useSnackbar();
    const { id } = router.query;
    const [identityCommitment] = useLocalStorage("identityCommitment", "");
    const [contract, setContract] = React.useState<ZKSmartHealthCards | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [immunization, setImmunization] = React.useState<Immunization>({});
    const [identity, setIdentity] = React.useState<Identity | null>(null);
    const [solidityProof, setSolidityProof] = React.useState("");

    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [eDialogOpen, setEDialogOpen] = React.useState(false);

    const [inputedRawSHC, setInputedRawSHC] = React.useState<string>("");

    const handleClickDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleEDialogOpen = () => {
        setEDialogOpen(true);
    };

    const handleEDialogClose = () => {
        setEDialogOpen(false);
    };

    const onUpdateRawSHC = (rawSHC: React.ChangeEvent<HTMLInputElement>) => {
        setInputedRawSHC(rawSHC.target.value);
    };

    const ImmunizationGroup = React.useMemo(() => {
        return new Group();
    }, []);

    React.useEffect(() => {
        if (!identityCommitment || !account) {
            router.push("/");
        }
        if (signer) {
            const contract = ZKSmartHealthCards__factory.connect(
                ZK_SHC_ADDRESS,
                signer
            );
            setContract(contract);
        }
    }, [identityCommitment, provider, router, signer, account]);

    React.useEffect(() => {
        if (contract && id && chain && chain.id === 31337 && chain.id == process.env.CHAIN_ID as Number|unknown) {
            contract.immunizations(id as string).then((r: any) => {
                if (!r) return;
                setImmunization({
                    adminAddress: r.adminAddress,
                    vaccineType: r.vaccineType,
                    vaccineCodeSystem: r.vaccineCodeSystem,
                    vaccineCodeCode: r.vaccineCodeCode
                });
            });
        }
    }, [chain, contract, id]);

    React.useEffect(() => {
        if (identityCommitment) {
            const identity = new Identity(identityCommitment);
            setIdentity(identity);
        }
    }, [identityCommitment]);

    // listen MemberAdded(groupId, identityCommitment, root)
    React.useEffect(() => {
        if (contract && id && identity && chain && chain.id == process.env.CHAIN_ID as Number|unknown) {
            const filter = contract.filters.MemberAdded(BigNumber.from(id), null, null);
            contract.on(filter, (groupId: any, identityCommitment: any) => {
                
                const memberIndex = ImmunizationGroup.indexOf(
                    identityCommitment.toString()
                );
                if (memberIndex === -1) {
                    ImmunizationGroup.addMember(identityCommitment.toString());
                    enqueueSnackbar(
                        "You are included in the members.",
                        {
                            variant: "success",
                        }
                    );
                }
            });
        }
        return () => {
            contract?.removeAllListeners();
        };
    }, [chain, contract, enqueueSnackbar, ImmunizationGroup, id, identity]);

    const onClickJoinImmunization = React.useCallback(async () => {
        if (!contract || !id || !identity || !signer || !chain || chain.id !== 31337) return;
        const commitment = identity.generateCommitment();

        const memberIndex = ImmunizationGroup.indexOf(commitment);
        // console.log(inputedRawSHC);
        console.log("memberIndex", memberIndex);
        if (memberIndex !== -1) {
            enqueueSnackbar("You are already a member.", { variant: "info" });
            await handleEDialogClose();
            return;
        }

        // FIXME
        // if (!inputedRawSHC || !inputedRawSHC.startsWith('shc:/')) {
        //     enqueueSnackbar("Invalid SmartHealthCards", { variant: "error" });
        //     return;
        // }
        setLoading(true);

        console.log(`inputedRawSHC: ${inputedRawSHC}`);

        try {
            const extractedData = await parseShc(inputedRawSHC);
            const isAnyEligible = extractedData.payload.vc.credentialSubject.fhirBundle.entry.findIndex((entry: { resource: any; }) => {
                const resource = entry.resource;
                if(resource.resourceType == "Immunization" && resource.status == "completed"){
                    return -1 !== resource.vaccineCode.coding.findIndex(async (coding: { system: string; code: string; }) => {
                        return await contract.isEligible(BigNumber.from(id), coding.system, coding.code);
                    });
                }
            });
            if(isAnyEligible !== -1){
                const tx = await contract.addMember(Number(id), BigNumber.from(commitment).toString());
                await handleEDialogClose();
            } 
            else {
                enqueueSnackbar("Not eligible to join this immunization.", { variant: "error" });
            }

        } catch (e) {
            console.error(e);
            setLoading(false);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            enqueueSnackbar(e.message || "Unknown error!", { variant: "error" });
        }
            // } else {
            //     await handleEDialogClose();
            //     enqueueSnackbar(
            //         "Successfully joined!",
            //         { variant: "success" }
            //     );
            // }
        setLoading(false);
    }, [chain, contract, enqueueSnackbar, ImmunizationGroup, id, identity, signer]);

    const onClickGenerateProof = React.useCallback(async () => {
        if (!identity) return;
        const commitment = identity.generateCommitment();
        const memberIndex = ImmunizationGroup.indexOf(commitment);
        if (memberIndex === -1) {
            enqueueSnackbar("You are not a member.", { variant: "error" });
            return;
        }
        setLoading(true);

        console.log(ImmunizationGroup.root);

        // TODO what would be appropriate to set below the variables.
        const externalNullifier = "1";
        const signal = "42";

        const proof = await generateProof(
            identity,
            ImmunizationGroup,
            externalNullifier,
            signal,
            {
                zkeyFilePath: "/semaphore.zkey",
                wasmFilePath: "/semaphore.wasm",
            }
        );
        const proofQR = Buffer.from(
            JSON.stringify({
                id,
                signal: ethers.utils.formatBytes32String(signal),
                nullifierHash: proof.publicSignals.nullifierHash,
                externalNullifier,
                proof: packToSolidityProof(proof.proof),
            })
        ).toString("base64");
        setSolidityProof(proofQR);
        setLoading(false);
        console.log(proofQR);
    }, [enqueueSnackbar, ImmunizationGroup, id, identity]);

    return (
        <MainLayout loading={loading} setLoading={setLoading}>
            <ImmunizationDetailTemplate
                immunization={immunization}
                dialogOpen={dialogOpen}
                eDialogOpen={eDialogOpen}
                handleClickDialogOpen={handleClickDialogOpen}
                handleDialogClose={handleDialogClose}
                handleOpenJoinImmunization={handleEDialogOpen}
                handleCloseJoinImmunization={handleEDialogClose}
                onClickJoinImmunization={onClickJoinImmunization}
                onClickGenerateProof={onClickGenerateProof}
                solidityProof={solidityProof}
                rawSHC={inputedRawSHC}
                onUpdateRawSHC={onUpdateRawSHC}         
            />
        </MainLayout>
    );
}