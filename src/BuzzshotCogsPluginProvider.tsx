import React, { useEffect, useRef, useState, useContext } from "react";
import {BuzzshotApiException, ResponsePage, type Game} from "@buzzshot/api";
import { BuzzshotCogsPlugin } from "./BuzzshotCogsPlugin";

const BuzzshotCogsPluginContext = React.createContext<BuzzshotCogsPlugin|undefined>(undefined);

export function BuzzshotCogsPluginProvider(props: { children: React.ReactNode }) {
  const ref = useRef<BuzzshotCogsPlugin>();
  const plugin = ref.current || (ref.current = new BuzzshotCogsPlugin());
  return (
    <BuzzshotCogsPluginContext.Provider value={plugin}>
      {props.children}
    </BuzzshotCogsPluginContext.Provider>
  )
}

export function useBuzzshotCogsPlugin() {
    const plugin = useContext(BuzzshotCogsPluginContext);
    if (plugin == null) {
        throw new Error("Make sure you wrap your components in BuzzshotCogsPlugin")
    }
    return plugin;
}

export function useGame() {
  const plugin = useBuzzshotCogsPlugin();
  const [, forceUpdate] = useState({});
  const update = () => forceUpdate({});
  useEffect(() => {
    plugin.addEventListener('game', update);
    return () => {
      plugin.removeEventListener('game', update);
    };
  })
  return plugin.game;
}


export function useBuzzshotApi() {
  const plugin = useBuzzshotCogsPlugin();
  const [, forceUpdate] = useState({});
  const update = () => forceUpdate({});
  useEffect(() => {
    plugin.addEventListener('api', update);
    return () => {
      plugin.removeEventListener('api', update);
    };
  })
  return plugin.api;
}

export function useBuzzshotConfigError() {
  const plugin = useBuzzshotCogsPlugin();
  const [error, setError] = useState<string|undefined>(undefined);
  const update = (event:CustomEvent<string>) => setError(event.detail);
  const remove = () => setError(undefined);
  useEffect(() => {
    plugin.addEventListener('configError', update);
    plugin.addEventListener('configSuccess', remove);
    return () => {
      plugin.removeEventListener('configError', update);
      plugin.removeEventListener('configSuccess', remove);
    };
  })
  return error;
}

export function useBuzzshotConfig() {
  const plugin = useBuzzshotCogsPlugin();
  const [, forceUpdate] = useState({});
  const update = () => forceUpdate({});
  useEffect(() => {
    plugin.addEventListener('configError', update);
    plugin.addEventListener('configSuccess', update);
    return () => {
      plugin.removeEventListener('configError', update);
      plugin.removeEventListener('configSuccess', update);
    };
  })
  return plugin.config;
}


export function useGamesToday() {
  const config = useBuzzshotConfig();
  const api = useBuzzshotApi();

  const [refresh, setRefresh] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<ResponsePage<Game>|undefined>();
  const [error, setError] = useState<BuzzshotApiException|undefined>();

  useEffect(() => {
    if (api) {
      setLoading(true);
      const room = config ? config["Room Name (leave blank for all)"] : "";
      api.games.list({page, date: "today", complete: false, room}).then(
        r => {setError(undefined); setResults(r); setLoading(false)},
        e => {setError(e); setLoading(false)}
      );

    }
  }, [config, api, page, refresh, setLoading, setError, setResults]);

  return {
    page,
    loading: loading,
    results: results?.results() || [],
    error,
    nextPage: !loading && results?.hasNext() ? () => setPage(p => p + 1) : undefined,
    previousPage: !loading && results?.hasPrevious() ? () => setPage(p => p - 1) : undefined,
    refresh: () => setRefresh(x => x + 1)
  };
}

