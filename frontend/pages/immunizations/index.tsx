import React from "react";
import { useAccount, useSigner } from "wagmi";
import { utils, BigNumber } from "ethers";
import MainLayout from "../../layouts/Main";
import { useRouter } from "next/router";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import ImmunizationsTemplate from "../../templates/Immunizations";

import { TForm } from "../../components/Form";
import {
    ZKSmartHealthCards,
    ZKSmartHealthCards__factory,
} from "../../utilities/typechain";
import { SNARK_LIMIT, ZK_SHC_ADDRESS } from "../../utilities/constants";
import { useSnackbar } from "notistack";

export default function Immunizations() {
    /**
     * 0. if not wallet connected, or no identityCommitment, redirect to top page
     * 1. create an immunization
     * 2. send a transaction to the ZKTokenProof contract
     * 3. await the transaction included to the block
     * 4. redirect to the immunization page
     */
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();

    const { address: account } = useAccount();
    const { data: signer } = useSigner();
    const [address, setAddress] = React.useState("");
    const [identityCommitment] = useLocalStorage("identityCommitment", "");
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [sDialogOpen, setSDialogOpen] = React.useState(false);
    const [eDialogOpen, setEDialogOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [contract, setContract] = React.useState<ZKSmartHealthCards | null>(null);
    const [immunizationId, setImmunizationId] = React.useState<string>("immunizationId");
    const [inputImmunizationId, setInputImmunizationId] = React.useState<string>("");

    const handleClickDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleSDialogOpen = () => {
        setSDialogOpen(true);
    };

    const handleSDialogClose = () => {
        setSDialogOpen(false);
    };

    const handleEDialogOpen = () => {
        setEDialogOpen(true);
    };

    const handleEDialogClose = () => {
        setEDialogOpen(false);
    };

    const handleSubmit = async (form: TForm) => {
        if (!contract || !signer) {
            return;
        }
        setLoading(true);

        try {
            let id;
            while (id === undefined) {
                const candidate = BigNumber.from(utils.randomBytes(32));
                if (candidate.lt(SNARK_LIMIT)) {
                    id = candidate;
                    break;
                }
            }
            setImmunizationId(id.toString());
            const tx = await contract.createImmunization(
                id,
                20,
                0,
                form.vaccineType,
                form.vaccineCodeSystem,
                form.vaccineCodeCode
            );
            handleDialogClose();
            setLoading(false);
            setSDialogOpen(true);
        } catch (e) {
            console.error(e);
            setLoading(false);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            enqueueSnackbar(e.message || "User denied.", { variant: "error" });
        }
    };

    React.useEffect(() => {
        if (!identityCommitment || !account) {
            router.push("/");
        }

        if (account) {
            setAddress(account);
        } else {
            setAddress("");
        }

        if (signer) {
            setContract(
                ZKSmartHealthCards__factory.connect(ZK_SHC_ADDRESS, signer)
            );
        }
    }, [account, identityCommitment, router, signer]);

    const onClickVerify = () => {
        router.push("/verify");
    };

    const onUpdateInputImmunization = (immunization: React.ChangeEvent<HTMLInputElement>) => {
        setInputImmunizationId(immunization.target.value);
    };

    const onClickJoinImmunization = React.useCallback(() => {
        setLoading(true);
        router.push(`/immunizations/${inputImmunizationId}`);
    }, [inputImmunizationId, router]);

    return (
        <MainLayout loading={loading} setLoading={setLoading}>
            <ImmunizationsTemplate
                immunizationId={immunizationId}
                handleSubmit={handleSubmit}
                adminAddress={address}
                dialogOpen={dialogOpen}
                sDialogOpen={sDialogOpen}
                eDialogOpen={eDialogOpen}
                handleClickDialogOpen={handleClickDialogOpen}
                handleDialogClose={handleDialogClose}
                handleSDialogOpen={handleSDialogOpen}
                handleSDialogClose={handleSDialogClose}
                onClickVerify={onClickVerify}
                handleOpenJoinImmunization={handleEDialogOpen}
                handleCloseJoinImmunization={handleEDialogClose}
                onClickJoinImmunization={onClickJoinImmunization}
                onUpdateInputImmunization={onUpdateInputImmunization}
                inputImmunizationId={inputImmunizationId}
            />
        </MainLayout>
    );
}