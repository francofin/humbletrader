import React from "react"
import Layout from "@components/Layout"
import { DjangoAuthProvider} from '@context/authContext';
import { AccountContextProvider } from "@context/accountContext";
import { Provider } from "react-redux";
import { wrapper, theStore, persistor } from "@src/store";
import { PersistGate } from 'redux-persist/integration/react'
import "swiper/css/bundle"
// swiper core styles
import "swiper/css"

// modules styles
import "swiper/css/pagination"
import "swiper/css/navigation"

import "@fortawesome/fontawesome-svg-core/styles.css"
import "../src/scss/style.default.scss"

const App = ({ Component, pageProps, ...rest }) => {
  const { store, props } = wrapper.useWrappedStore(rest);

  return (
    <DjangoAuthProvider>
      <AccountContextProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Layout {...pageProps}>
              <Component {...pageProps} />
            </Layout>
          </PersistGate>
        </Provider>
      </AccountContextProvider>
    </DjangoAuthProvider>
  )
}

// This default export is required in a new `pages/_app.js` file.
// export default wrapper.withRedux(App);
export default App;
