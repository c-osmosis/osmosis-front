import React, { FunctionComponent } from "react";

import { Observer } from "mobx-react";

import { createRootStore, RootStore } from "./root";

const storeContext = React.createContext<RootStore | null>(null);

export const StoreProvider: FunctionComponent = ({ children }) => {
  return (
    <storeContext.Provider value={createRootStore()}>
      {children}
    </storeContext.Provider>
  );
};

export const StoreConsumer: FunctionComponent<{
  children: (rootStore: RootStore) => React.ReactNode;
}> = ({ children }) => {
  return (
    <storeContext.Consumer>
      {rootStore => {
        if (!rootStore) {
          throw new Error("You have forgot to use StoreProvider");
        }

        return (
          <Observer>
            {() => {
              return children(rootStore) as any;
            }}
          </Observer>
        );
      }}
    </storeContext.Consumer>
  );
};

export const useStore = () => {
  const store = React.useContext(storeContext);
  if (!store) {
    throw new Error("You have forgot to use StoreProvider");
  }
  return store;
};
