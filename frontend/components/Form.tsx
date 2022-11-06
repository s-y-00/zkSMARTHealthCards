import * as React from "react";
import * as yup from "yup";
import * as ethers from "ethers";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Stack, TextField } from "@mui/material";

const formSchema = yup
    .object()
    .required()
    .shape({
        vaccineType: yup.string().required("Input vaccine type of the immunization!"),
        adminAddress: yup
            .string()
            .test("isAddress", "You should input valid address", value =>
                ethers.utils.isAddress(value || "")
            )
            .required(),
        vaccineCodeSystem: yup
            .string()
            .required(),
        vaccineCodeCode: yup
            .string()
            .required(),
    });

export type TForm = Readonly<{
    adminAddress: string;
    vaccineType: string;
    vaccineCodeSystem: string;
    vaccineCodeCode: string;
}>;

type Props = {
    address: string;
    onSubmit: (form: TForm) => void;
};

export default function Form(props: Props) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TForm>({
        resolver: yupResolver(formSchema),
        defaultValues: {
            adminAddress: props.address,
        },
    });

    return (
        <Stack
            spacing={3}
            sx={{
                minWidth: {
                    sm: 420,
                },
            }}
        >
            <TextField
                required
                fullWidth={true}
                label="adminAddress"
                error={"adminAddress" in errors}
                aria-readonly={true}
                helperText={errors.adminAddress?.message}
                {...register("adminAddress")}
            />
            <TextField
                required
                fullWidth={true}
                label="vaccineType"
                error={"vaccineType" in errors}
                helperText={errors.vaccineType?.message}
                {...register("vaccineType")}
            />
            <TextField
                required
                fullWidth={true}
                label="vaccineCode [system]"
                type="string"
                error={"vaccineCodeSystem" in errors}
                helperText={errors.vaccineCodeSystem?.message}
                {...register("vaccineCodeSystem")}
            />
            <TextField
                required
                fullWidth={true}
                label="vaccineCode [code]"
                type="string"
                error={"vaccineCodeCode" in errors}
                helperText={errors.vaccineCodeCode?.message}
                {...register("vaccineCodeCode")}
            />
            <Button
                size="large"
                sx={{
                    backgroundColor: "#FFC749",
                    border: "none",
                    color: "#463B2A",
                    "&:hover": {
                        backgroundColor: "#2BA9E0",
                        color: "rgba(62,51,62,1)",
                    },
                    textTransform: "none",
                }}
                onClick={handleSubmit(props.onSubmit)}
            >
                Register
            </Button>
        </Stack>
    );
}