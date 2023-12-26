import clsx from "clsx";
import { useState } from "react";

const NOISE = new RegExp("(,\\s*)?type\\.fit", "g");

type Quote = {
  text: string;
  author: string;
};

export default function App() {
  const [quote, setQuote] = useState<Quote>({
    text: "Perhaps the mission of an artist is to interpret beauty to people—the beauty within themselves.",
    author: "Langston Hughes",
  });

  const [isProcessing, setIsProcessing] = useState(false);

  // const [err, setErr] = useState("");

  const [index, setIndex] = useState(0);

  const buttonHandler = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      const response = await fetch("https://type.fit/api/quotes", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }

      const result = await response.json();

      const random = Math.floor(Math.random() * result.length);

      setIndex(
        random !== index
          ? random
          : index === result.length - 1
            ? random - 1
            : random + 1,
      );

      const selected: Quote = result[index];
      selected.author = selected.author.replace(NOISE, "");
      if (selected.author === "") selected.author = "Unknown author";

      setQuote(selected);
    } catch (err: any) {
      throw new Error(`Error! ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-600 p-8">
      {/* User Story #1: I can see a wrapper element with a corresponding id="quote-box". */}
      <div
        className="w-full max-w-prose rounded bg-slate-50 p-8 text-center"
        id="quote-box"
      >
        <div className="mb-0 mt-12 text-9xl font-extrabold leading-10 text-fuchsia-500">
          &ldquo;
        </div>
        {/* User Story #2: Within #quote-box, I can see an element with a corresponding id="text". */}
        <h1 className="mb-6 text-3xl font-semibold text-slate-800" id="text">
          {quote.text}
        </h1>
        {/*User Story #3: Within #quote-box, I can see an element with a corresponding id="author".*/}
        <h3 className="ml-auto mr-0 w-full text-xl text-slate-800" id="author">
          &mdash;&nbsp;{quote.author}
        </h3>
        {/* User Story #4: Within #quote-box, I can see a clickable element with a corresponding id="new-quote". */}
        <div className="mt-12 flex flex-col items-center justify-center">
          <button
            className={clsx(
              "mx-auto mb-6 block w-40 rounded bg-black px-5 py-2 font-semibold text-white shadow hover:bg-indigo-800 active:bg-indigo-400",
              {
                "cursor-not-allowed bg-indigo-600 text-white hover:bg-indigo-600 active:bg-indigo-600":
                  isProcessing,
              },
            )}
            onClick={buttonHandler}
            id="new-quote"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <svg
                  className="-ml-1 mr-2 h-5 w-5 animate-spin text-white"
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
                Processing...
              </span>
            ) : (
              <span>New Quote</span>
            )}
          </button>
          {/* User Story #5: Within #quote-box, I can see a clickable a element with a corresponding id="tweet-quote". */}
          <a
            className="flex h-9 w-9 items-center justify-center rounded-full border border-black/0 underline hover:border-black/100"
            href="https://twitter.com/intent/tweet?hashtags=quotes&amp;related=freecodecamp&amp;text=%22Life%20shrinks%20or%20expands%20in%20proportion%20to%20one%E2%80%99s%20courage.%22%20Anais%20Nin"
            id="tweet-quote"
            target="_top"
            title="Post this quote on X!"
          >
            <svg
              className="inline-block h-5 w-auto fill-black"
              width="1200"
              height="1227"
              viewBox="0 0 1200 1227"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" />
            </svg>
          </a>
        </div>
      </div>
    </main>
  );
}
