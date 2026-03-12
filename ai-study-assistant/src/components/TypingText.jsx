
import { useEffect, useState } from "react";

const TypingText = ({ text }) => {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      setDisplayed(text.slice(0, index));
      index++;
      if (index > text.length) clearInterval(interval);
    }, 15);

    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayed}</span>;
};

export default TypingText;
