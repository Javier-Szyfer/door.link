import { useState } from "react";

import { AiOutlineClose } from "react-icons/ai";

export default function Subscribers({ setShowForm }) {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const subscribeToNewsletter = async (e) => {
    e.preventDefault();

    if (email === "") {
      setError("Enter your email to subscribe");
      return;
    }
    setLoading(true);
    try {
      const { API_URL } = process.env;
      const res = await fetch(`${API_URL}/subscribers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });
      const data = await res.json();
      setSuccess(true);
      setEmail("");
      setLoading(false);
    } catch (err) {
      setError("Not a valid email");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col min-h-screen justify-center items-center w-full bg-white dark:bg-[#121212] text-[#444444] dark:text-[#f1f1f1]">
      <div
        onClick={() => setShowForm(false)}
        className="fixed z-50 right-[1rem] top-[1rem] md:top-[2rem] md:right-[2rem]  cursor-pointer "
      >
        <AiOutlineClose className="text-[#1500FF] h-8 w-8" />
      </div>

      <form onSubmit={subscribeToNewsletter}>
        <div className="flex flex-col py-8">
          <h2>Sign up for updates — no spam, just music.</h2>

          <input
            type="email"
            required
            value={email}
            placeholder="Email"
            onChange={(e) => {
              setEmail(e.target.value), setSuccess(false), setError(false);
            }}
            className="border border-[#1500FF] py-2 px-2 mt-4 placeholder:text-[#1500FF] bg-white dark:bg-[#121212]"
            autoComplete="true"
          />

          <div className="flex justify-between mt-4 ">
            <button
              onClick={() => setShowForm(false)}
              className="bg-stone-200 w-[40%] hover:bg-stone-300 dark:text-stone-800 "
            >
              Back
            </button>
            <button
              type="submit"
              className="bg-[#1500FF] w-[40%] hover:bg-[#0e0eb6] text-white py-2 flex items-center justify-center"
            >
              {loading && (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              Join
            </button>
          </div>
          {success && <span className="mt-5 text-[#1500FF]">: ) thx!</span>}
          {error && <span className="mt-5">{error}</span>}
        </div>
      </form>
    </div>
  );
}
