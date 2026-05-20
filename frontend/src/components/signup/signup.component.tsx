import { useForm, SubmitHandler } from "react-hook-form";
import SSInput from "../ui-component/ss-input/ss-input";
import SSButton from "../ui-component/ss-button/ss-button";
import { useState } from "react";
import { storeUserInfo } from "../../services/auth.service";
import toast, { Toaster } from "react-hot-toast";
import { useEmailVerifyMutation } from "../../redux/apis/otp.verify.api";
import { useRegisterUserMutation } from "../../redux/apis/auth.api";
import { useNavigate } from "react-router-dom";

interface IRegisterInfo {
  name: string;
  email: string;
  password: string;
}

interface Inputs extends IRegisterInfo {
  confirmPassword: string;
  otp: string;
}

const SignUpComponent = () => {
  const navigate = useNavigate();
  const [emailVerify] = useEmailVerifyMutation();
  const [registerUser] = useRegisterUserMutation();
  const { register, handleSubmit, watch } = useForm<Inputs>();
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [showOtpField, setShowOtpField] = useState<boolean>(false);
  const [registerInfo, setRegisterInfo] = useState<IRegisterInfo>();
  const [expiredAt, setExpiredAt] = useState(0);
  const [serverOtp, setServerOtp] = useState<string | null>(null);

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const otp = watch("otp");

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (data) {
      const user = {
        name: data.name,
        email: data.email,
        password: data.password,
      };
      const otpPayload = {
        name: data.name,
        email: data.email,
      };
      if (password !== confirmPassword) {
        toast.error("Passwords do not match!");
        return;
      }
      setIsBusy(true);
      try {
        const res = await emailVerify({ ...otpPayload }).unwrap();
        if (res) {
          const { otp, expiresAt } = res;
          setServerOtp(otp);
          setExpiredAt(expiresAt);
          toast.success("OTP sent to your email");
          setRegisterInfo(user);
          setShowOtpField(true);
        }
      } catch (error) {
        console.log("error: ", error);
      } finally {
        setIsBusy(false);
      }
    }
  };

  const handleOtpValidation = async () => {
    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }
    if (Date.now() > expiredAt) {
      toast.error("OTP expired. Please request a new one.");
      return;
    }
    if (otp !== serverOtp) {
      toast.error("Invalid OTP. Please try again.");
      return;
    }
    if (!registerInfo) {
      toast.error("Something went wrong. Please restart the process.");
      return;
    }
    setIsBusy(true);
    try {
      const res = await registerUser({ ...registerInfo }).unwrap();
      if (res.data.accessToken) {
        toast.success("OTP validated successfully!");
        storeUserInfo({ accessToken: res.data.accessToken });
        navigate("/");
      }
    } catch (err: unknown) {
      console.log("error: ", err);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center relative overflow-hidden">
      {/* Ambient background glows for a modern AI feel */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="flex w-full max-w-md flex-col justify-center px-6 py-12 lg:px-8 relative z-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-center text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 drop-shadow-sm">
            STORY SPARK AI
          </h2>
        </div>
        
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          <h3 className="mb-6 text-center text-2xl font-bold tracking-tight text-slate-200">
            Create your account
          </h3>
          {!showOtpField ? (
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <SSInput
                label="Name"
                name="name"
                placeholder="Enter your name"
                required={true}
                icon="fas fa-user"
                register={register}
              />
              <SSInput
                label="Email address"
                name="email"
                type="email"
                placeholder="Enter your email"
                required={true}
                icon="fas fa-envelope"
                register={register}
              />
              <SSInput
                label="Password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required={true}
                icon="fas fa-lock"
                register={register}
              />
              <SSInput
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                required={true}
                icon="fas fa-eye"
                register={register}
              />
              <SSButton text="Sign Up" type="submit" isLoading={isBusy} />
            </form>
          ) : (
            <div className="space-y-4">
              <SSInput
                label="OTP"
                name="otp"
                placeholder="Enter your OTP"
                required={true}
                icon="fas fa-key"
                register={register}
              />
              <SSButton
                text="Verify OTP"
                type="button"
                onClick={handleOtpValidation}
                isLoading={isBusy}
              />
            </div>
          )}
          {!showOtpField && (
            <p className="mt-6 text-center text-sm text-slate-400">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-semibold text-blue-400 hover:text-blue-300 transition-colors duration-200"
              >
                Sign in
              </a>
            </p>
          )}
        </div>
      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default SignUpComponent;
