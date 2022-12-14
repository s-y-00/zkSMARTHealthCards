import React from "react";
import { useRouter } from "next/router";
import { useAccount, useSigner } from "wagmi";
import { useSnackbar } from "notistack";
import { Buffer } from "buffer";
import MainLayout from "../../layouts/Main";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { 
    ZKSmartHealthCards,
    ZKSmartHealthCards__factory
} from "../../utilities/typechain";
import { ZK_SHC_ADDRESS } from "../../utilities/constants";
import { QR } from "../../utilities/entities";
import VerifyTemplate from "../../templates/Verify";

/**
 * 1. scan QR code to read data
 * 2. call contract verifyProof function
 * 3. show result
 */

export default function VerifyMembership() {
    const router = useRouter();
    const { address: account } = useAccount();
    const { data: signer } = useSigner();
    const { enqueueSnackbar } = useSnackbar();

    const [identityCommitment] = useLocalStorage("identityCommitment", "");
    const [contract, setContract] = React.useState<ZKSmartHealthCards | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [qrData, setQRData] = React.useState<QR>({});
    const [proof, setProof] = React.useState("");

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
    }, [account, identityCommitment, router, signer]);

    React.useEffect(() => {
        if (proof) {
            try {
                onUpdateQR(proof);
            } catch (e) {
                enqueueSnackbar("Invalid proof data", { variant: "error" });
                setQRData({});
            }
        }
    }, [enqueueSnackbar, proof]);

    const onUpdateQR = (qrDataBase64: string) => {
        const data = Buffer.from(qrDataBase64, "base64").toString("utf8");
        const qr = JSON.parse(data);
        setQRData(qr);
    };

    const onUpdateProof = (event: React.ChangeEvent<HTMLInputElement>) => {
        setProof(event.target.value);
    };

    const onClickVerify = React.useCallback(async () => {
        if (
            !qrData.id ||
            !qrData.signal ||
            !qrData.nullifierHash ||
            !qrData.externalNullifier ||
            !qrData.proof ||
            !contract
        ) {
            return;
        }

        setLoading(true);

        console.log("id:", qrData.id);
        console.log("sig:", qrData.signal);
        console.log("nullifierHash:", qrData.nullifierHash);
        console.log("externalNullifier:", qrData.externalNullifier);
        console.log("proof");
        console.log(qrData.proof);

        try {
            await contract.verifyMembership(
                qrData.id,
                qrData.signal,
                qrData.nullifierHash,
                qrData.externalNullifier,
                qrData.proof
            );
            enqueueSnackbar("Verified!!", { variant: "success" });
        } catch (e) {
            console.log(e);
            enqueueSnackbar("Verification Failed!", { variant: "error" });
        }
        setLoading(false);
    }, [
        contract,
        enqueueSnackbar,
        qrData.externalNullifier,
        qrData.id,
        qrData.nullifierHash,
        qrData.proof,
        qrData.signal,
    ]);

    return (
        <MainLayout loading={loading} setLoading={setLoading}>
            <VerifyTemplate
                onUpdateProof={onUpdateProof}
                onClickVerify={onClickVerify}
                qrData={qrData}
                proof={proof}
            />
        </MainLayout>
    );
}