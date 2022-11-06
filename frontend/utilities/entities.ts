import { BigNumberish } from "@semaphore-protocol/proof";
import { SolidityProof } from "@semaphore-protocol/proof/dist/types/types";

export type Immunization = {
    adminAddress?: string;
    vaccineType?: string;
    vaccineCodeSystem?: string;
    vaccineCodeCode?: string;
};

export type QR = {
    id?: string;
    signal?: string;
    nullifierHash?: BigNumberish;
    externalNullifier?: string;
    proof?: SolidityProof;
};