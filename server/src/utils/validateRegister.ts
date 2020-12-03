import { RegisterInput } from "src/resolvers/RegisterInput";

export const validateRegister = ({ email, password, username }: RegisterInput) => {
    if (!email.includes("@")) {
        return [
            { field: "username", message: "Invalid email" },
        ]
    }
    if (username.includes("@")) {
        return [
            { field: "username", message: "Cannot include an @" },
        ]
    }
    if (username.length <= 2) {
        return [
            { field: "username", message: "length must be greater thant 2" },
        ]
    }

    if (password.length <= 3) {
        return [
            { field: "password", message: "length must be greater thant 3" },
        ]
    }

    return null;
}