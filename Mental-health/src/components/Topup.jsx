import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/logo.svg";
import upiIcon from "../assets/upi.png";
import cardIcon from "../assets/card.jpeg";
import bankIcon from "../assets/bank.jpeg";

const Topup = () => {
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState("0.0");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [netBankingBank, setNetBankingBank] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const walletBalance = localStorage.getItem("wallet_balance") || "0.0";
    setBalance(walletBalance);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!amount || isNaN(amount) || Number(amount) < 1) {
      setError("Please enter a valid amount (minimum ₹1)");
      return;
    }
    if (paymentMethod === "upi" && !upiId) {
      setError("Please enter your UPI ID");
      return;
    }
    if (paymentMethod === "card" && (!card.number || !card.name || !card.expiry || !card.cvv)) {
      setError("Please fill all card details");
      return;
    }
    if (paymentMethod === "netbanking" && !netBankingBank) {
      setError("Please select your bank");
      return;
    }
    setLoading(true);

    setTimeout(() => {
      // Add recharge amount to existing balance
      const prev = parseFloat(localStorage.getItem("wallet_balance") || "0");
      const add = parseFloat(amount);
      const newBalance = (prev + add).toFixed(2);
      localStorage.setItem("wallet_balance", newBalance);
      setBalance(newBalance);
      toast.success("Recharge successful! 🎉");
      setLoading(false);
      setTimeout(() => navigate("/user"), 1500);
    }, 1800);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#f5f7fa] via-[#e9e6f7] to-[#f5f7fa] dark:from-[#181825] dark:via-[#232336] dark:to-[#181825] px-2 py-8">
      <div className="w-full max-w-lg mx-auto">
        <button
          onClick={handleGoBack}
          className="mb-8 flex items-center gap-2 px-5 py-2 rounded-xl bg-white dark:bg-gray-800 text-purple-700 dark:text-purple-200 font-bold shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 border border-purple-100 dark:border-purple-700 transition-all"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M15 18l-6-6 6-6" /></svg>
          Go Back
        </button>
        <div className="bg-white dark:bg-[#232336] rounded-3xl shadow-2xl p-10 flex flex-col gap-8 border border-purple-100 dark:border-[#39396a]">
          <div className="flex flex-col items-center gap-3">
            <img src={logo} alt="MindMates" className="h-14 w-14 rounded-full mb-1 shadow-lg border-2 border-purple-200 dark:border-purple-700 bg-white dark:bg-[#232336]" />
            <h2 className="text-3xl font-extrabold text-purple-700 dark:text-purple-200 tracking-tight">Wallet Top-Up</h2>
            <span className="text-base text-gray-600 dark:text-gray-300">Current Balance: <span className="font-bold text-yellow-600 dark:text-yellow-200">₹{balance}</span></span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-200 mb-1">Quick Add</span>
            <div className="flex flex-wrap gap-3 justify-center">
              {[10, 20, 50, 80, 100, 150, 200].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  className={`px-5 py-2 rounded-xl border font-semibold shadow-sm transition-all duration-150 text-lg ${Number(amount) === amt ? 'bg-purple-600 text-white border-purple-600 scale-105' : 'bg-gray-50 dark:bg-[#232336] text-purple-700 dark:text-purple-100 border-purple-200 dark:border-[#39396a] hover:bg-purple-100 dark:hover:bg-[#39396a]'}`}
                  onClick={() => setAmount(amt.toString())}
                  disabled={loading}
                >
                  ₹{amt}
                </button>
              ))}
            </div>
          </div>
          <form className="flex flex-col gap-6 mt-2" onSubmit={handleSubmit}>
            <label className="text-base font-semibold text-purple-700 dark:text-purple-200" htmlFor="amount">Enter Amount</label>
            <input
              id="amount"
              type="number"
              min="1"
              step="0.1"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="Other amount (e.g. 100)"
              className="p-4 rounded-xl border-2 border-purple-200 dark:border-[#39396a] focus:outline-none focus:ring-2 focus:ring-purple-400 text-lg bg-gray-50 dark:bg-[#181825] text-gray-900 dark:text-gray-100 transition-all focus:shadow-lg"
              required
              disabled={loading}
            />
            <div className="flex flex-col gap-2 mt-2">
              <span className="text-base font-semibold text-purple-700 dark:text-purple-200">Select Payment Method</span>
              <div className="flex gap-4 justify-center">
                <label className={`flex items-center gap-2 cursor-pointer px-4 py-3 rounded-xl border-2 ${paymentMethod === 'upi' ? 'border-purple-500 bg-purple-50 dark:bg-[#39396a]' : 'border-gray-300 dark:border-[#39396a]'}`}>
                  <input type="radio" name="paymentMethod" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} disabled={loading} />
                  <img src={upiIcon} alt="UPI" className="w-6 h-6" />
                  <span className="font-medium text-gray-700 dark:text-gray-100">UPI</span>
                </label>
                <label className={`flex items-center gap-2 cursor-pointer px-4 py-3 rounded-xl border-2 ${paymentMethod === 'card' ? 'border-purple-500 bg-purple-50 dark:bg-[#39396a]' : 'border-gray-300 dark:border-[#39396a]'}`}>
                  <input type="radio" name="paymentMethod" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} disabled={loading} />
                  <img src={cardIcon} alt="Card" className="w-6 h-6" />
                  <span className="font-medium text-gray-700 dark:text-gray-100">Card</span>
                </label>
                <label className={`flex items-center gap-2 cursor-pointer px-4 py-3 rounded-xl border-2 ${paymentMethod === 'netbanking' ? 'border-purple-500 bg-purple-50 dark:bg-[#39396a]' : 'border-gray-300 dark:border-[#39396a]'}`}>
                  <input type="radio" name="paymentMethod" value="netbanking" checked={paymentMethod === 'netbanking'} onChange={() => setPaymentMethod('netbanking')} disabled={loading} />
                  <img src={bankIcon} alt="Net Banking" className="w-6 h-6" />
                  <span className="font-medium text-gray-700 dark:text-gray-100">Net Banking</span>
                </label>
              </div>
            </div>
            {/* Payment Inputs */}
            {paymentMethod === "upi" && (
              <div className="flex flex-col gap-2 mt-2">
                <label htmlFor="upiId" className="text-sm font-medium text-gray-700 dark:text-gray-200">UPI ID</label>
                <input
                  id="upiId"
                  type="text"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  placeholder="yourname@bank"
                  className="p-3 rounded-lg border border-gray-300 dark:border-[#39396a] focus:outline-none focus:ring-2 focus:ring-purple-400 text-base bg-gray-50 dark:bg-[#181825] text-gray-900 dark:text-gray-100 transition-all focus:shadow"
                  disabled={loading}
                  required
                />
              </div>
            )}
            {paymentMethod === "card" && (
              <div className="flex flex-col gap-2 mt-2">
                <label htmlFor="cardNumber" className="text-sm font-medium text-gray-700 dark:text-gray-200">Card Number</label>
                <input
                  id="cardNumber"
                  type="text"
                  maxLength={19}
                  value={card.number}
                  onChange={e => setCard({ ...card, number: e.target.value })}
                  placeholder="1234 5678 9012 3456"
                  className="p-3 rounded-lg border border-gray-300 dark:border-[#39396a] focus:outline-none focus:ring-2 focus:ring-purple-400 text-base bg-gray-50 dark:bg-[#181825] text-gray-900 dark:text-gray-100 transition-all focus:shadow"
                  disabled={loading}
                  required
                />
                <label htmlFor="cardName" className="text-sm font-medium text-gray-700 dark:text-gray-200">Name on Card</label>
                <input
                  id="cardName"
                  type="text"
                  value={card.name}
                  onChange={e => setCard({ ...card, name: e.target.value })}
                  placeholder="Cardholder Name"
                  className="p-3 rounded-lg border border-gray-300 dark:border-[#39396a] focus:outline-none focus:ring-2 focus:ring-purple-400 text-base bg-gray-50 dark:bg-[#181825] text-gray-900 dark:text-gray-100 transition-all focus:shadow"
                  disabled={loading}
                  required
                />
                <div className="flex gap-2">
                  <div className="flex flex-col flex-1">
                    <label htmlFor="cardExpiry" className="text-sm font-medium text-gray-700 dark:text-gray-200">Expiry</label>
                    <input
                      id="cardExpiry"
                      type="text"
                      maxLength={5}
                      value={card.expiry}
                      onChange={e => setCard({ ...card, expiry: e.target.value })}
                      placeholder="MM/YY"
                      className="p-3 rounded-lg border border-gray-300 dark:border-[#39396a] focus:outline-none focus:ring-2 focus:ring-purple-400 text-base bg-gray-50 dark:bg-[#181825] text-gray-900 dark:text-gray-100 transition-all focus:shadow"
                      disabled={loading}
                      required
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <label htmlFor="cardCvv" className="text-sm font-medium text-gray-700 dark:text-gray-200">CVV</label>
                    <input
                      id="cardCvv"
                      type="password"
                      maxLength={4}
                      value={card.cvv}
                      onChange={e => setCard({ ...card, cvv: e.target.value })}
                      placeholder="123"
                      className="p-3 rounded-lg border border-gray-300 dark:border-[#39396a] focus:outline-none focus:ring-2 focus:ring-purple-400 text-base bg-gray-50 dark:bg-[#181825] text-gray-900 dark:text-gray-100 transition-all focus:shadow"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>
              </div>
            )}
            {paymentMethod === "netbanking" && (
              <div className="flex flex-col gap-2 mt-2">
                <label htmlFor="bankSelect" className="text-sm font-medium text-gray-700 dark:text-gray-200">Select Bank</label>
                <select
                  id="bankSelect"
                  value={netBankingBank}
                  onChange={e => setNetBankingBank(e.target.value)}
                  className="p-3 rounded-lg border border-gray-300 dark:border-[#39396a] focus:outline-none focus:ring-2 focus:ring-purple-400 text-base bg-gray-50 dark:bg-[#181825] text-gray-900 dark:text-gray-100 transition-all focus:shadow"
                  disabled={loading}
                  required
                >
                  <option value="">Choose your bank</option>
                  <option value="SBI">State Bank of India</option>
                  <option value="HDFC">HDFC Bank</option>
                  <option value="ICICI">ICICI Bank</option>
                  <option value="Axis">Axis Bank</option>
                </select>
              </div>
            )}
            {error && <div className="text-red-500 text-sm font-semibold text-center mt-2">{error}</div>}
            <button
              type="submit"
              className="mt-2 bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-500 hover:from-purple-800 hover:to-blue-600 text-white font-semibold py-3 rounded-xl shadow-lg transition-all text-lg tracking-wide disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-purple-400"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2"><svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><circle cx="11" cy="11" r="10" /></svg>Processing...</span>
              ) : (
                "Recharge Now"
              )}
            </button>
          </form>
          <div className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500 italic">Simulated payment gateway • Not a real transaction</div>
        </div>
      </div>
    </div>
  );
};

export default Topup;
