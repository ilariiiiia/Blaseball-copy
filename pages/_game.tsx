import style from '../styles/game.module.css'
import { useEffect, useState } from 'react';
import GameModal from './_gameModal';
import { GameClass, TeamClass, LogClass, PlayerClass } from '@/public/static/scripts/gameMechanics';
import modalStyles from 'styles/gameModal.module.css';

function TeamWrapper({team, gameScore, finished, won, draw} : {team: TeamClass, gameScore: number, finished: boolean, won: boolean, draw:boolean}) {
    let className = style.team;
    if(finished && won) {
        className = `${style.team} ${style.teamWon}`;
    } else if(finished && draw) {
        className = `${style.team} ${style.teamdraw}`;
    } else if(finished && !won) {
        className = `${style.team} ${style.teamLost}`;
    }
    return <>
    <div className={className}>
        <p>{team.emoji}</p>
        <div>
            <div>
                <h3>
                    {team.name}
                </h3>
                <p><span>{team.wins}</span>-<span>{team.ties}</span>-<span>{team.losses}</span></p>
            </div>
            <p>Score: {gameScore}</p>
        </div>
    </div>
    </>
}

function LogWrapper({ log } : { log: LogClass }) {
    let seconds = Math.round(log.date / 1000).toString() + "s";
    return <>
    <div className={style.log}>
        <p className={style.logTime}>{seconds}</p>
        <p className={style.logContent}>{log.content}</p>
    </div>
    </>
}

export default function Game({ game, homeScore, awayScore, id } : { game: GameClass, homeScore: number, awayScore: number, id: number }) {
  const [showModal, setShowModal] = useState(false);

  function showModalOnClick() {
    setShowModal(true);
  }

  function hideModalOnClick() {
    setShowModal(false);
  }

  if (!game || !game.home || !game.away || homeScore === undefined || awayScore === undefined || id === undefined) {
    return null;
  }

  const getBestPlayerStat = (players: PlayerClass[], stat:"points"|"rebounds"|"assists"|"steals"|"blocks") => {
    const maxPointsPlayer = players.reduce((maxPlayer, player) => {
      return player.stats[stat] > maxPlayer.stats[stat] ? player : maxPlayer;
    }, players[0]);

    return maxPointsPlayer.stats[stat];
  };

  const bestHomePlayerPoints = getBestPlayerStat(game.home.players, "points");
  const bestHomePlayerRebounds = getBestPlayerStat(game.home.players, "rebounds");
  const bestHomePlayerAssists = getBestPlayerStat(game.home.players, "assists");
  const bestHomePlayerSteals = getBestPlayerStat(game.home.players, "steals");
  const bestHomePlayerBlocks = getBestPlayerStat(game.home.players, "blocks");

  const bestAwayPlayerPoints = getBestPlayerStat(game.away.players, "points");
  const bestAwayPlayerRebounds = getBestPlayerStat(game.away.players, "rebounds");
  const bestAwayPlayerAssists = getBestPlayerStat(game.away.players, "assists");
  const bestAwayPlayerSteals = getBestPlayerStat(game.away.players, "steals");
  const bestAwayPlayerBlocks = getBestPlayerStat(game.away.players, "blocks");

  return (
    <>
      {showModal && (
        <>
          <GameModal home={game.home} away={game.away} homeScore={homeScore} awayScore={awayScore} logs={game.logs} />
          <button className={modalStyles.button} onClick={hideModalOnClick} type="button">
            X
          </button>
        </>
      )}

      <div className={style.wrapper} onClick={showModalOnClick}>
        <h1>{id}</h1>
        <div className={style.contentWrapper}>
          <div className={style.teamswrapper}>
            <TeamWrapper team={game.home} gameScore={game.homepoints} finished={game.finished} won={game.homeWon} draw={game.draw} />
            <TeamWrapper team={game.away} gameScore={game.awaypoints} finished={game.finished} won={game.awayWon} draw={game.draw} />
          </div>
          <div className={style.logs}>
            {game.logs.length ? (
              game.logs.map((l, key) => <LogWrapper log={l} key={key}></LogWrapper>)
            ) : (
              <p>No logs available yet...</p>
            )}
          </div>
          <div className={style.conditions}>
            <h3>Game conditions:</h3>
            <p>Location: {game.homeStadium ? game.home.city + " stadium" : game.away.city + " stadium"}</p>
            <p>Weather: {game.weather}</p>
          </div>
          <div className={style.gameStats}>
            <table className={style.statsTable}>
              <thead>
                <tr>
                  <th></th>
                  <th>Home</th>
                  <th>Away</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Points:</td>
                  <td>{bestHomePlayerPoints}</td>
                  <td>{bestAwayPlayerPoints}</td>
                </tr>
                <tr>
                  <td>Rebounds:</td>
                  <td>{bestHomePlayerRebounds}</td>
                  <td>{bestAwayPlayerRebounds}</td>
                </tr>
                <tr>
                  <td>Assists:</td>
                  <td>{bestHomePlayerAssists}</td>
                  <td>{bestAwayPlayerAssists}</td>
                </tr>
                <tr>
                  <td>Steals:</td>
                  <td>{bestHomePlayerSteals}</td>
                  <td>{bestAwayPlayerSteals}</td>
                </tr>
                <tr>
                  <td>Blocks:</td>
                  <td>{bestHomePlayerBlocks}</td>
                  <td>{bestAwayPlayerBlocks}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
