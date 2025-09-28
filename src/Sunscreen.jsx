import React, { useEffect, useState } from "react";

const SHEET_ID = "1lftj3GMGro99Lxx5-UdLINTR0_tMKcOuLP93eFRfJfM"; 
const API_KEY = "AIzaSyCstFACzQUc4eMykMbV819mCkHQr4f2TTc"; 
const RANGE = "Sunscreens!A2:A"; // Only grab sunscreen names from column A

function Sunscreen() {
  const [sunscreens, setSunscreens] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`
      );
      const data = await res.json();

      if (data.values) {
        setSunscreens(data.values.flat()); // Flatten array [[Banana Boat], [Neutrogena]] → ["Banana Boat", "Neutrogena"]
      }
    }

    fetchData();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <ul>
        {sunscreens.map((name, index) => (
          <li key={index}>{name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Sunscreen;
