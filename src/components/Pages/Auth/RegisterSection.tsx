import MyTransition from "@/components/MyTransition";
import {Input, SubmitButton} from "@/components/UI";
import {RegisterPayload} from "@/helpers/shared/interfaces/apiInterface";
import {TransitionStyles} from "@/helpers/shared/interfaces/commonInterface";
import {showToast} from "@/helpers/utils/utils";
import AuthService from "@/services/AuthService";
import {Formik} from "formik";
import {useTranslations} from "next-intl";
import {FaKey, FaUser} from "react-icons/fa";
import * as Yup from "yup";

interface Props {
    show: boolean;
    onShowLogin: () => void;
    transition: {
        timeout: number;
        defaultStyle: React.CSSProperties;
        transitionStyles: TransitionStyles;
    };
}

interface FormValues extends RegisterPayload {
    rePassword: string;
}

export default function RegisterSection(props: Props) {
    const pageTranslation = useTranslations("page.auth.register");
    const commonTranslation = useTranslations("common");

    const handleRegister = async (values: FormValues) => {
        const trimmedValues: FormValues = {
            name: values.name.trim(),
            username: values.username.trim(),
            password: values.password.trim(),
            rePassword: values.rePassword.trim(),
        };

        const response = await AuthService.register(trimmedValues);

        if (!response) {
            showToast(pageTranslation("error.unknown"), "error");
            return;
        }

        switch (response.status) {
            case 201:
                showToast(pageTranslation("success"));
                props.onShowLogin();
                break;
            case 409:
                showToast(pageTranslation("usernameTaken"), "error");
                break;
            default:
                showToast(pageTranslation("error.unknown"), "error");
        }
    };

    const validationSchema = Yup.object({
        name: Yup.string()
            .required(commonTranslation("error.requiredField"))
            .max(50, commonTranslation("error.maxLength", {max: 50})),
        username: Yup.string()
            .required(commonTranslation("error.requiredField"))
            .max(20, commonTranslation("error.maxLength", {max: 20}))
            .test("no-whitespace", commonTranslation("error.noWhitespace"), (value) =>
                Boolean(value && value.indexOf(" ") === -1)
            )
            .matches(/^[a-zA-Z0-9_]+$/, commonTranslation("error.noSpecialCharacters")),
        password: Yup.string()
            .required(commonTranslation("error.requiredField"))
            .min(6, pageTranslation("error.passwordLength"))
            .max(18, pageTranslation("error.passwordLength"))
            .test("no-whitespace", commonTranslation("error.noWhitespace"), (value) =>
                Boolean(value && value.indexOf(" ") === -1)
            ),
        rePassword: Yup.string()
            .required(commonTranslation("error.requiredField"))
            .max(50, commonTranslation("error.maxLength", {max: 50}))
            .oneOf([Yup.ref("password"), ""], pageTranslation("error.passwordNotMatch"))
            .test("no-whitespace", commonTranslation("error.noWhitespace"), (value) =>
                Boolean(value && value.indexOf(" ") === -1)
            ),
    });

    return (
        <MyTransition
            in={props.show}
            timeout={props.transition.timeout}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-4"
            defaultStyles={props.transition.defaultStyle}
            transitionStyles={props.transition.transitionStyles}
        >
            <div className="w-full h-max max-h-[90vh] overflow-auto rounded-box bg-base-100 shadow-custom-1 p-8 sm:p-14">
                <div className="mb-8">
                    <h5 className="text-3xl font-bold text-center">{pageTranslation("title")}</h5>
                </div>
                <Formik
                    initialValues={{name: "", username: "", password: "", rePassword: ""}}
                    validationSchema={validationSchema}
                    onSubmit={async (values: FormValues, {setSubmitting}) => {
                        setSubmitting(true);
                        await handleRegister(values);
                        setSubmitting(false);
                    }}
                >
                    {(formik) => (
                        <form onSubmit={formik.handleSubmit} className="w-full">
                            <div className="mb-4">
                                <Input
                                    type="text"
                                    id="name"
                                    name="name"
                                    icon={<FaUser />}
                                    placeholder={pageTranslation("fullNameInput")}
                                    maxLength={50}
                                    required={true}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.name}
                                    invalid={formik.touched.name && formik.errors.name ? "true" : "false"}
                                    disabled={formik.isSubmitting}
                                />
                                {formik.touched.name && formik.errors.name && (
                                    <small className="text-red-400">* {formik.errors.name}</small>
                                )}
                            </div>
                            <div className="mb-4">
                                <Input
                                    type="text"
                                    id="username"
                                    name="username"
                                    icon={<FaUser />}
                                    placeholder={pageTranslation("usernameInput")}
                                    maxLength={20}
                                    required={true}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.username}
                                    invalid={formik.touched.username && formik.errors.username ? "true" : "false"}
                                    disabled={formik.isSubmitting}
                                />
                                {formik.touched.username && formik.errors.username && (
                                    <small className="text-red-400">* {formik.errors.username}</small>
                                )}
                            </div>
                            <div className="mb-4">
                                <Input
                                    type="password"
                                    id="password"
                                    name="password"
                                    icon={<FaKey />}
                                    placeholder={pageTranslation("passwordInput")}
                                    minLength={6}
                                    maxLength={18}
                                    required={true}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.password}
                                    invalid={formik.touched.password && formik.errors.password ? "true" : "false"}
                                    disabled={formik.isSubmitting}
                                />
                                {formik.touched.password && formik.errors.password && (
                                    <small className="text-red-400">* {formik.errors.password}</small>
                                )}
                            </div>
                            <div className="mb-4">
                                <Input
                                    type="password"
                                    id="rePassword"
                                    name="rePassword"
                                    icon={<FaKey />}
                                    placeholder={pageTranslation("reEnterPasswordInput")}
                                    minLength={6}
                                    maxLength={18}
                                    required={true}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.rePassword}
                                    invalid={formik.touched.rePassword && formik.errors.rePassword ? "true" : "false"}
                                    disabled={formik.isSubmitting}
                                />
                                {formik.touched.rePassword && formik.errors.rePassword && (
                                    <small className="text-red-400">* {formik.errors.rePassword}</small>
                                )}
                            </div>
                            <div className="mb-4">
                                <SubmitButton
                                    label={pageTranslation("registerBtn")}
                                    isSubmitting={formik.isSubmitting}
                                />
                            </div>
                            <div className="flex justify-center">
                                <div className="flex items-center gap-2 text-sm">
                                    <span>{pageTranslation("haveAccountText")}</span>
                                    <span className="font-semibold cursor-pointer" onClick={props.onShowLogin}>
                                        {pageTranslation("loginBtn")}
                                    </span>
                                </div>
                            </div>
                        </form>
                    )}
                </Formik>
            </div>
        </MyTransition>
    );
}
