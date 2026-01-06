import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // backend URL

socket.on("connect", () => {
  console.log("connected", socket.id);
});

export default function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [region, setRegion] = useState("All");
  const [gameMode, setGameMode] = useState("All");

  useEffect(() => {
    // Initial leaderboard fetch
    socket.emit("leaderboard:get", {
      limit: 10,
      region,
      gameMode,
    });

    socket.on("leaderboard:data", (data) => {
      setPlayers(data);
    });

    socket.on("leaderboard:update", (data) => {
      console.log("got it ");
      
      setPlayers(data);
    });

    return () => {
      socket.off("leaderboard:data");
      socket.off("leaderboard:update");
    };
  }, [region, gameMode]);

  return (
    <div className="container">
      <h2>🏆 Live Leaderboard</h2>

      {/* Filters */}
      <div className="filters">
        <select value={region} onChange={(e) => setRegion(e.target.value)}>
          <option value="All">ALL</option>
          <option value="Asia">Asia</option>
          <option value="South America">South America</option>
          <option value="Europe">Europe</option>
          <option value="North America">North America</option>
        </select>

        <select value={gameMode} onChange={(e) => setGameMode(e.target.value)}>
          <option value="All">All</option>
          <option value="Solo">Solo</option>
          <option value="Duo">Duo</option>
          <option value="Squad">Squad</option>
        </select>
      </div>

      {/* Table */}
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Score</th>
            <th>Region</th>
            <th>Mode</th>
          </tr>
        </thead>
        <tbody>
          {players.length === 0 && (
            <tr>
              <td colSpan="5">No data</td>
            </tr>
          )}

          {players.map((player, index) => (
            <tr key={player._id}>
              <td>{index + 1}</td>
              <td>{player.playerName}</td>
              <td>{player.score}</td>
              <td>{player.region}</td>
              <td>{player.gameMode}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
