import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../services/api";
import "../../css/auth.css";

const ForgotPassword = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [securityQuestion, setSecurityQuestion] = useState("");
	const [securityAnswer, setSecurityAnswer] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [step, setStep] = useState("email");
	const [error, setError] = useState("");
	const [info, setInfo] = useState("");
	const [loading, setLoading] = useState(false);

	const handleEmailSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setInfo("");
		if (!email.trim()) {
			setError("Email is required");
			return;
		}

		setLoading(true);
		try {
			const res = await authAPI.getSecurityQuestion({ email });
			setSecurityQuestion(res.data.securityQuestion);
			setStep("security");
			setInfo("We found your account. Please answer the security question.");
		} catch (err) {
			setError(err.response?.data?.message || "Could not find that email.");
		} finally {
			setLoading(false);
		}
	};

	const handleSecuritySubmit = async (e) => {
		e.preventDefault();
		setError("");
		setInfo("");
		if (!securityAnswer.trim()) {
			setError("Please provide your security answer");
			return;
		}

		setLoading(true);
		try {
			await authAPI.verifySecurity({ email, securityAnswer });
			setStep("reset");
			setInfo("Security answer verified. Set a new password.");
		} catch (err) {
			setError(err.response?.data?.message || "Incorrect answer. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleResetSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setInfo("");

		if (!newPassword || !confirmPassword) {
			setError("Please enter and confirm your new password");
			return;
		}
		if (newPassword !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}
		if (newPassword.length < 6) {
			setError("Password must be at least 6 characters");
			return;
		}

		setLoading(true);
		try {
			await authAPI.resetPassword({ email, newPassword });
			setInfo("Password updated. Redirecting to login...");
			setTimeout(() => navigate("/login"), 1000);
		} catch (err) {
			setError(err.response?.data?.message || "Could not reset password");
		} finally {
			setLoading(false);
		}
	};

	const renderStep = () => {
		if (step === "email") {
			return (
				<form onSubmit={handleEmailSubmit}>
					<div className="form-group-custom">
						<label className="form-label-custom">Enter your account email</label>
						<input
							type="email"
							className="form-control"
							placeholder="your.email@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<button type="submit" disabled={loading} className="btn-submit-custom">
						{loading ? "Checking..." : "Next"}
					</button>
				</form>
			);
		}

		if (step === "security") {
			return (
				<form onSubmit={handleSecuritySubmit}>
					<div className="form-group-custom">
						<label className="form-label-custom">Security Question</label>
						<div className="form-control" style={{ background: "#f8f9fa" }}>
							{securityQuestion}
						</div>
					</div>
					<div className="form-group-custom">
						<label className="form-label-custom">Your Answer</label>
						<input
							type="text"
							className="form-control"
							placeholder="Type your answer"
							value={securityAnswer}
							onChange={(e) => setSecurityAnswer(e.target.value)}
						/>
					</div>
					<button type="submit" disabled={loading} className="btn-submit-custom">
						{loading ? "Verifying..." : "Verify"}
					</button>
				</form>
			);
		}

		return (
			<form onSubmit={handleResetSubmit}>
				<div className="form-group-custom">
					<label className="form-label-custom">New Password</label>
					<input
						type="password"
						className="form-control"
						placeholder="Enter new password"
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
					/>
				</div>
				<div className="form-group-custom">
					<label className="form-label-custom">Confirm Password</label>
					<input
						type="password"
						className="form-control"
						placeholder="Confirm new password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>
				</div>
				<button type="submit" disabled={loading} className="btn-submit-custom">
					{loading ? "Updating..." : "Reset Password"}
				</button>
			</form>
		);
	};

	return (
		<div className="auth-container">
			<div className="auth-card">
				<div className="auth-header">
					<div className="logo-container">
						<img src="/images/logo.png" alt="Himalayan Wheels" />
					</div>
					<h2>Forgot Password</h2>
					<p>Recover access using your security question</p>
				</div>

				<div className="auth-form-container">
					{error && <div className="alert-custom">{error}</div>}
					{info && <div className="alert-custom" style={{ background: "#e8f5e9", color: "#1b5e20" }}>{info}</div>}

					{renderStep()}

					<div className="divider-text">
						<span>Remembered it?</span>
					</div>

					<div className="link-text">
						<button type="button" className="link-custom" onClick={() => navigate("/login")}>Back to Login</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ForgotPassword;
