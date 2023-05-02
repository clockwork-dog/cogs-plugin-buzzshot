import { Game } from "@buzzshot/api";
import React, { useCallback, useEffect } from "react";
import "./App.css";
import { useBuzzshotCogsPlugin, useGame, useBuzzshotApi, useGamesToday, useBuzzshotConfigError} from "./BuzzshotCogsPluginProvider";

function classNames(
  ...classes: (string | null | boolean | undefined)[]
) {
  return classes.filter(Boolean).join(" ");
}

export default function App() {
  const plugin = useBuzzshotCogsPlugin();
  const selectedGame = useGame();
  const api = useBuzzshotApi();
  const selectedGameId = selectedGame?.id;
  const configError = useBuzzshotConfigError();

  const refreshGame = () => {
    if (api && selectedGameId) {
      api.games.retrieve({id: selectedGameId}).then(game => plugin.setGame(game));
    }
  };

  return (
    <div className="flex flex-col items-stretch ">
      {!api ? <Message>{configError || 'Connecting to COGS...'}</Message> : null }
      {!selectedGame && api ? <SelectGame onSelectGame={game => plugin.setGame(game)}/> : null }
      {selectedGame && api && <Header selectedGame={selectedGame} onClickChange={() => plugin.reset()} onClickRefresh={refreshGame}/>}
    </div>
  );
}

function SelectGame(props: { onSelectGame: (g: Game) => void }) {
  const games = useGamesToday();

  // Refresh each time the page becomes visible
  useEffect(() => {
    const onVisibilityChange = () => {
      if (!document.hidden) {
        games.refresh();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange, false);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [games]);

  return (
    <div className="fixed inset-0 bg-white flex flex-col">
      {games.loading && <Message>Loading games</Message>}
      {games.error && <Message><div>Failed to load games</div><BlueButton onClick={games.refresh}>Try Again</BlueButton></Message>}
      <h1 className="text-3xl text-center text-gray-500 font-bold p-4">Select the Buzzshot group playing</h1>
      { games.results.length === 0 ? (
          <div className="grow flex items-center justify-center">
            <div className="text-gray-400 text-xl">No pending groups for today</div>
          </div>
      ) : (
      <ul className="grow flex flex-col items-stretch gap-1 p-4 ">
        {games.results.map((game) => (
          <li key={game.id} className="flex flex-col items-stretch">
            <GameButton game={game} onClick={props.onSelectGame} />
          </li>
        ))}
      </ul>
      )}
      <div className="flex flex-row justify-between bg-gray-100 p-4 ">
        <div>
          <BlueButton onClick={games.previousPage}>Prev</BlueButton>
        </div>
        <div>
          <BlueButton onClick={games.refresh}>Refresh</BlueButton>
        </div>
        <div>
          <BlueButton onClick={games.nextPage}>Next</BlueButton>
        </div>
      </div>
    </div>
  )
}

function Header({selectedGame, onClickChange, onClickRefresh}: {selectedGame:Game, onClickChange: () => void, onClickRefresh: () => void}) {
  return (
    <div className="flex flex-col bg-gray-50 p-3 text-lg">
      <div className="mb-2">
        <div className="uppercase text-gray-500 font-bold">Room</div>
        <div className="flex flex-row items-center gap-1">
          <img src={selectedGame.room.logo.url} className="w-8 h-8 object-cover rounded-full" alt="Logo for room" />
          { selectedGame.room.name }
        </div>
      </div>
      <div className="mb-2">
        <div className="uppercase text-gray-500 font-bold">Play Time</div>
        { selectedGame.time || "No Time" }
      </div>
      <div className="mb-2">
        <div className="uppercase text-gray-500 font-bold">Team Name</div>
        { selectedGame.name || "<no name>" }
      </div>

      <div className="absolute right-3 top-3 flex flex-col gap-2">
        <BlueButton onClick={onClickChange} className="">Reset</BlueButton>
        <BlueButton onClick={onClickRefresh} className="">Refresh</BlueButton>
      </div>
    </div>
  );
}

function BlueButton({className, children, onClick}:{className?: string, children: React.ReactNode, onClick?: () => void}) {
  return (
    <button type="button" onClick={onClick} disabled={!onClick} className={classNames(className, onClick ? "bg-blue-600" : "bg-blue-400", "rounded-md  px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600")}>
      {children}
    </button>
  );
}

function Message(props:{children: React.ReactNode}) {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 flex flex-col items-stretch justify-center">
      <div className="bg-black bg-opacity-50 text-gray-200 text-center py-16 text-5xl shadow-xl">
        {props.children}
      </div>
    </div>
  )
}

function GameButton({
  game,
  onClick,
}: {
  game: Game
  onClick?: (game: Game) => void;
}) {
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      onClick?.(game);
    },
    [game, onClick]
  );

  return (
    <button className="p-3 flex flex-row gap-2 items-center text-left rounded-lg border border-gray-200 hover:bg-gray-200 hover:border-gray-400" onClick={handleClick}>
      <img src={game.room.logo.url} className="w-16 h-16 object-cover rounded-full" alt="Logo for room" />
      <div className="flex flex-col flex-grow">
        <div>
          {game.room.name}
        </div>
        <div className="text-xl">
          {game.time}
        </div>
      </div>
      <div className="text-right">
        <div className="truncate">
          {game.name || ""}
        </div>
        <div className="italic truncate">
          {game.group.players.map((player, i) => (
            <span key={player.player}>{i === 0 ? "" : ", "}{player.first_name}</span>
          ))}
        </div>
      </div>
    </button>
  );
}
