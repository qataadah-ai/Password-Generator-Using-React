import { useState, useCallback, useEffect, useRef } from "react";

function App() {
  // State management
  const [Length, setLength] = useState(8);
  const [numberAllow, setnumbersAllow] = useState(false);
  const [charsAllow, setcharsAllow] = useState(false);
  const [Password, setPassword] = useState("");

  // Reference to password input field for copying
  const passwordRef = useRef(null);

  /**
   * Callback function to generate a random password
   * Creates password based on selected options (length, numbers, special chars)
   * Dependencies: Length, numberAllow, charsAllow, setPassword
   */
  const passwordGenerator = useCallback(() => {
    let pass = "";

    let str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    if (numberAllow) str += "0123456789";

    if (charsAllow) str += "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    // Loop to build password of specified length
    for (let i = 0; i < Length; i++) {
      // Generate random index within character set length
      let char = Math.floor(Math.random() * str.length);
      // Add random character to password
      pass += str.charAt(char);
    }

    setPassword(pass);
  }, [Length, numberAllow, charsAllow, setPassword]); // Dependencies for callback memoization

  /*
   Callback function to copy password to clipboard
    */
  const copyPasswordToClipboard = useCallback(() => {
    passwordRef.current?.select();

    passwordRef.current?.setSelectionRange(0, 100);

    // Write selected password to clipboard
    window.navigator.clipboard.writeText(Password);
  }, [Password]);

  /**
   * Effect hook to regenerate password whenever dependencies change
   */
  useEffect(() => {
    passwordGenerator();
  }, [Length, numberAllow, charsAllow, passwordGenerator]);

  return (
    <>
      <div className="w-full max-w-md mx-auto shadow-md rounded-lg px-4 py-1 my-8 text-black bg-red-300 ">
        <h1 className="text-black text-center my-3">Password Generator</h1>

        {/* Password display section with copy button */}
        <div className="flex shadow rounded-lg overflow-hidden mb-4">
          <input
            type="text"
            value={Password}
            className="outline-none w-full py-1 px-3 bg-white"
            placeholder="Password"
            readOnly
            ref={passwordRef}
          />
          {/* Copy button triggers copyPasswordToClipboard callback */}
          <button
            onClick={copyPasswordToClipboard}
            className="bg-green-700 outline-none text-white px-3 py-0.5 shrink-0 hover:bg-blue-900 transition-colors"
          >
            Copy
          </button>
        </div>

        {/* Controls section for password options */}
        <div className="flex text-sm gap-x-2">
          {/* Length slider - updates Length state and triggers passwordGenerator */}
          <div className="flex items-center gap-x-1">
            <input
              type="range"
              min={6}
              max={100}
              value={Length}
              className="cursor-pointer"
              onChange={(e) => {
                setLength(Number(e.target.value));
              }} // Convert to number and update state
            />
            <label>Length:{Length}</label>
          </div>

          {/* Numbers checkbox - toggles numberAllow state */}
          <div className="flex items-center gap-x-2">
            <input
              type="checkbox"
              defaultChecked={numberAllow}
              id="numberInput"
              onChange={() => {
                setnumbersAllow((prev) => !prev);
              }} // Toggle previous state
            />
            <label htmlFor="numberInput">Numbers</label>
          </div>

          {/* Special characters checkbox - toggles charsAllow state */}
          <div className="flex items-center gap-x-2">
            <input
              type="checkbox"
              defaultChecked={charsAllow}
              id="charactersInput"
              onChange={() => {
                setcharsAllow((prev) => !prev);
              }} // Toggle previous state
            />
            <label htmlFor="charactersInput">Characters</label>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
