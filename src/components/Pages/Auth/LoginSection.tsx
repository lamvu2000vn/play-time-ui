import {SubmitButton} from "@/components/UI";
import {Checkbox, Input} from "@/components/UI";
import {TransitionStyles} from "@/helpers/shared/interfaces/commonInterface";
import {Formik} from "formik";
import {FaKey, FaUser} from "react-icons/fa";
import * as Yup from "yup";
import {useEffect} from "react";
import {showToast} from "@/helpers/utils/utils";
import {useRouter} from "next/navigation";
import {useAuth} from "@/helpers/hooks/useAuth";
import MyTransition from "@/components/MyTransition";
import AuthService from "@/services/AuthService";
import {ApiResponse, LoginDataResponse, LoginPayload} from "@/helpers/shared/interfaces/apiInterface";
import {useTranslations} from "next-intl";

interface Props {
    show: boolean;
    onShowRegister: () => void;
    transition: {
        timeout: number;
        defaultStyle: React.CSSProperties;
        transitionStyles: TransitionStyles;
    };
}

export default function LoginSection(props: Props) {
    const router = useRouter();
    const {auth, login} = useAuth();

    const pageTranslation = useTranslations("page.auth.login");
    const commonTranslation = useTranslations("common");

    const handleLogin = async (payload: LoginPayload) => {
        const response = await AuthService.login(payload);

        if (!response) {
            showToast(pageTranslation("error.unknown"), "error");
            return;
        }

        const {status, data} = response as ApiResponse<LoginDataResponse>;

        if (status !== 200) {
            switch (status) {
                case 404:
                    showToast(pageTranslation("error.invalidCredentials"), "error");
                    return;
                default:
                    showToast(pageTranslation("error.unknown"), "error");
                    return;
            }
        }

        login(data.user, data.accessToken);
        showToast(
            <div>
                {commonTranslation("welcome")} <b>{data.user.name}</b>
            </div>
        );
    };

    useEffect(() => {
        if (auth?.isAuthenticated) {
            return router.push("/");
        }
    }, [auth?.isAuthenticated, router]);

    const validationSchema = Yup.object({
        username: Yup.string()
            .required(commonTranslation("error.requiredField"))
            .max(50, commonTranslation("error.maxLength", {max: 50}))
            .test("no-whitespace", commonTranslation("error.noWhitespace"), (value) =>
                Boolean(value && value.indexOf(" ") === -1)
            )
            .matches(/^[a-zA-Z0-9_]+$/, commonTranslation("error.noSpecialCharacters")),
        password: Yup.string()
            .required(commonTranslation("error.requiredField"))
            .max(50, commonTranslation("error.maxLength", {max: 50}))
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
                    initialValues={{username: "", password: "", rememberMe: true}}
                    validationSchema={validationSchema}
                    onSubmit={async (values: LoginPayload, {setSubmitting}) => {
                        setSubmitting(true);
                        await handleLogin(values);
                        setSubmitting(false);
                    }}
                >
                    {(formik) => (
                        <form onSubmit={formik.handleSubmit} className="w-full">
                            <div className="mb-4">
                                <Input
                                    type="text"
                                    id="username"
                                    name="username"
                                    icon={<FaUser />}
                                    placeholder={pageTranslation("usernameInput")}
                                    maxLength={50}
                                    required={true}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.username}
                                    disabled={formik.isSubmitting}
                                    invalid={formik.touched.username && formik.errors.username ? "true" : "false"}
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
                                    maxLength={50}
                                    required={true}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.password}
                                    disabled={formik.isSubmitting}
                                    invalid={formik.touched.password && formik.errors.password ? "true" : "false"}
                                />
                                {formik.touched.password && formik.errors.password && (
                                    <small className="text-red-400">* {formik.errors.password}</small>
                                )}
                            </div>
                            <div className="mb-4 flex items-center justify-between text-sm">
                                <h5 className="font-semibold cursor-pointer text-primary">
                                    {pageTranslation("forgotPasswordBtn")}
                                </h5>
                                <Checkbox
                                    label={pageTranslation("rememberMeText")}
                                    id="rememberMe"
                                    name="rememberMe"
                                    checked={formik.values.rememberMe}
                                    onChange={formik.handleChange}
                                    disabled={formik.isSubmitting}
                                />
                            </div>
                            <div className="mb-4">
                                <SubmitButton label="Đăng nhập" isSubmitting={formik.isSubmitting} />
                            </div>
                            <div className="flex justify-center text-sm">
                                <div className="flex items-center gap-2">
                                    <span>{pageTranslation("haveNoAccountText")}</span>
                                    <span
                                        className="font-semibold cursor-pointer"
                                        onClick={() => !formik.isSubmitting && props.onShowRegister()}
                                    >
                                        {pageTranslation("registerBtn")}
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
