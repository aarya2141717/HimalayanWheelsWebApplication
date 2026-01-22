
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const schema = z
  .object({
    fullName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().regex(/^\d{10}$/),
    password: z.string().min(6),
    confirmPassword: z.string(),
    accountType: z.enum(["CUSTOMER", "PROVIDER"]),
    companyName: z.string().optional(),
    companyAddress: z.string().optional(),
    securityQuestion: z.string().min(1),
    securityAnswer: z.string().min(1),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })
  .refine(
    (d) =>
      d.accountType === "CUSTOMER" ||
      (d.companyName && d.companyAddress),
    {
      path: ["companyName"],
      message: "Company details required",
    }
  );

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const type = watch("accountType");

  const onSubmit = async (data) => {
    await signup(data);
    navigate("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input placeholder="Full Name" {...register("fullName")} />
      <input placeholder="Email" {...register("email")} />
      <input placeholder="Phone" {...register("phone")} />

      <h4>Account Type</h4>
      <label>
        <input type="radio" value="CUSTOMER" {...register("accountType")} />
        Rent Vehicle
      </label>

      <label>
        <input type="radio" value="PROVIDER" {...register("accountType")} />
        Provide Vehicles
      </label>

      {type === "PROVIDER" && (
        <>
          <input placeholder="Company Name" {...register("companyName")} />
          <input placeholder="Company Address" {...register("companyAddress")} />
        </>
      )}

      <input type="password" placeholder="Password" {...register("password")} />
      <input
        type="password"
        placeholder="Confirm Password"
        {...register("confirmPassword")}
      />

      <input placeholder="Security Question" {...register("securityQuestion")} />
      <input placeholder="Security Answer" {...register("securityAnswer")} />

      <button type="submit">Signup</button>

      <p style={{ color: "red" }}>{errors.companyName?.message}</p>
    </form>
  );
}
