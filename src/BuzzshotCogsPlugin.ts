import {
  CogsConnection
} from "@clockworkdog/cogs-client";
import { TypedEventTarget } from 'typescript-event-target';

import { BuzzshotApi, Game } from "@buzzshot/api";

interface CogsConnectionParams {
  config: {
    "API Key": string;
  };
  inputPorts: {
    "Team Name": string;
  };
  outputPorts: {
    "Team Name": string;
    "Game Selected": boolean;
    "Player Count": number;
    "Player 1 Name": string;
    "Player 2 Name": string;
    "Player 3 Name": string;
    "Player 4 Name": string;
    "Player 5 Name": string;
    "Player 6 Name": string;
    "Player 7 Name": string;
    "Player 8 Name": string;
    "Player 9 Name": string;
  };
  outputEvents: {
    "Game Selected": string;
  };
  inputEvents: {
    "Set Team Name": string;
    "Set Did Win": boolean;
    "Set Completion Time (milliseconds)": number;
    "Set Hints": number;
    "Complete Game": string;
  };
}

type Events = {
  game: CustomEvent<Game|undefined>;
  api: CustomEvent<BuzzshotApi>;
  configError: CustomEvent<string>;
  configSuccess: CustomEvent<void>;
};

export class BuzzshotCogsPlugin extends TypedEventTarget<Events> {
  connection: CogsConnection<CogsConnectionParams>;
  api?: BuzzshotApi
  game?: Game;

  constructor() {
    super()
    this.connection = new CogsConnection<CogsConnectionParams>();
    this.connection.addEventListener('config', (event) => {
      const apiKey = event.detail["API Key"];
      if (!apiKey) {
        this.dispatchTypedEvent("configError", new CustomEvent("configError", {detail: "Please supply a Buzzshot API Key in the plugin settings"}));
        return;
      }
      const api = new BuzzshotApi(apiKey);
      this.api = api;
      this.dispatchTypedEvent("api", new CustomEvent("api", {detail: api}));
      this.updateOutputPortValues();
      this.forceWindow();
        this.dispatchTypedEvent("configSuccess", new CustomEvent("configSuccess", {}));
    });
    this.connection.addEventListener('open', () => this.updateOutputPortValues());
    this.connection.addEventListener('event', event => this.handleCogsEvent(event.detail.key, event.detail.value));
    this.connection.addEventListener('message', e => console.log(e));
    this.connection.addEventListener('event', e => console.log(e));
  }

  private forceWindow() {
    this.connection.setPluginWindowVisible(false);
    setTimeout(() => {
      this.connection.setPluginWindowVisible(true);
    }, 100);
  }

  private handleCogsEvent<K extends keyof CogsConnectionParams["inputEvents"], V extends CogsConnectionParams["inputEvents"][K]>(key: K, value: V) {
    if (this.api == null || this.game == null) return;
    const api = this.api;
    const game = this.game;

    const events:Record<keyof CogsConnectionParams["inputEvents"], (v:any) => Game> = {
      "Set Team Name": (name:string) => {
        api.games.update({id: game.id}, {name});
        return {...game, name};
      },
      "Set Did Win": (did_win:boolean) => {
        api.games.update({id: game.id}, {game_result: {did_win}});
        return {...game, game_result: {...game.game_result, did_win}};
      },
      "Set Completion Time (milliseconds)": (completion_time:number) => {
        completion_time = Math.round(completion_time/1000);
        api.games.update({id: game.id}, {game_result: {completion_time}});
        return {...game, game_result: {...game.game_result, completion_time}};
      },
      "Set Hints": (hints:number) => {
        api.games.update({id: game.id}, {game_result: {hints}});
        return {...game, game_result: {...game.game_result, hints}};
      },
      "Complete Game": () => {
        api.games.update({id: game.id}, {is_complete: true});
        return {...game, is_complete: true};
      }
    } as const;
    if (key in events) {
      this.setGame(events[key](value));
    }
  }

  private updateOutputPortValues() {
    if (this.connection == null) return;
    const values:Partial<CogsConnectionParams["outputPorts"]> = {
      "Game Selected": !!this.game,
      "Team Name": this.game?.name,
      "Player Count": this.game?.group.players.length,
      "Player 1 Name": this.game?.group.players[0]?.first_name,
      "Player 2 Name": this.game?.group.players[1]?.first_name,
      "Player 3 Name": this.game?.group.players[2]?.first_name,
      "Player 4 Name": this.game?.group.players[3]?.first_name,
      "Player 5 Name": this.game?.group.players[4]?.first_name,
      "Player 6 Name": this.game?.group.players[5]?.first_name,
      "Player 7 Name": this.game?.group.players[6]?.first_name,
      "Player 8 Name": this.game?.group.players[7]?.first_name,
      "Player 9 Name": this.game?.group.players[8]?.first_name,
    }
    this.connection.setOutputPortValues(values);
  }

  setGame(game:Game|undefined) {
    this.game = game;
    this.updateOutputPortValues();
    this.dispatchTypedEvent("game", new CustomEvent("game", {detail: game}));
  }

  reset() {
    this.connection.close();
  }

  close() {
    this.connection.close();
  }
}
