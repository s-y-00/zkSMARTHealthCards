import type { NextApiRequest, NextApiResponse } from "next";
import * as ethers from "ethers";
import { ZKSmartHealthCards__factory } from "../../utilities/typechain";
import { ZK_SHC_ADDRESS } from "../../utilities/constants";
import { parseShc } from "../../utilities/shc/parsers";

// const provider = new ethers.providers.AlchemyProvider(
//     process.env.NETWORK,
//     process.env.ALCHEMY_APIKEY
// );
const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");

const signer = new ethers.Wallet(process.env.SIGNER_PK as string, provider);
const contract = ZKSmartHealthCards__factory.connect(ZK_SHC_ADDRESS, signer);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { identityCommitment, immunizationId, rawSHC } = JSON.parse(req.body);
    const extractedData = await parseShc(rawSHC);

    try {
        extractedData.payload.vc.credentialSubject.fhirBundle.entry.forEach((entry: { resource: any; }) => {
            const resource = entry.resource;
            if (resource.resourceType == "Immunization" && resource.status == "completed") {
                resource.vaccineCode.coding.forEach(async (coding: { system: string; code: string; }) => {
                    console.log(coding);

                    const isEligible = await contract.isEligible(immunizationId, coding.system, coding.code);
                    if (isEligible) {
                        const feeData = await provider.getFeeData();

                        if (!feeData.gasPrice) {
                            return res.status(500).send("Failed to fetch fee data!");
                        }

                        const tx = await contract.addMember(immunizationId, identityCommitment, {
                            gasPrice: feeData.gasPrice,
                        });
                        return res.status(200).end();
                    }
                })
            }
        });
        return res.status(400).send("Not eligible to join this immunization.");

    } catch (error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // const { message } = JSON.parse(error.body).error;
        // const reason = message.substring(
        //     message.indexOf("'") + 1,
        //     message.lastIndexOf("'")
        // );
        const reason = error.reason;
        return res.status(500).send(reason || "Unknown error!");
    }
}
