import { useEffect, useState } from "react";

export default function Search({ setResults, queryUrl, onFocus }) {
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    const timeOutId = setTimeout(() => {
      window &&
        fetch(`${queryUrl}?name=${searchTerm}`)
          .then((r) => r.json())
          .then((j) => {
            if (j == null) setResults([]);
            else setResults(j);
          })
          .catch((e) => setResults([]));
    }, 500);
    return () => clearTimeout(timeOutId);
  }, [searchTerm]);
  return (
    <div className="Container">
      <input
        onFocus={onFocus}
        className="SearchInput"
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <style jsx>{`
        .Container {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .SearchInput {
          width: 60%;
          padding: 8px 20px;
          margin: 8px 0;
          display: inline-block;
          border: 1px solid #ccc;
          border-radius: 4px;
          box-sizing: border-box;
          margin: 5px 15px 5px 15px;
        }
      `}</style>
    </div>
  );
}
