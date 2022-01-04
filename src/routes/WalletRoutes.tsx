/*
Copyright 2018 - 2021 The Alephium Authors
This file is part of the alephium project.

The library is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

The library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with the library. If not, see <http://www.gnu.org/licenses/>.
*/

import { AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { Route, Switch, useHistory, useLocation } from 'react-router-dom'

import Modal from '../components/Modal'
import { useGlobalContext } from '../contexts/global'
import { TransactionsContextProvider } from '../contexts/transactions'
import SettingsPage from '../pages/Settings/SettingsPage'
import AddressPage from '../pages/Wallet/AddressPage'
import SendPage from '../pages/Wallet/SendPage'
import WalletHomePage from '../pages/Wallet/WalletHomePage'

const WalletRoutes = () => {
  const { wallet } = useGlobalContext()
  const history = useHistory()
  const location = useLocation()

  // Redirect if wallet is not set
  useEffect(() => {
    if (!wallet) {
      history.push('/')
    }
  }, [history, wallet])

  return (
    <TransactionsContextProvider>
      <Route path="/wallet">
        <WalletHomePage />
      </Route>
      <AnimatePresence exitBeforeEnter initial={false}>
        <Switch location={location} key={location.pathname}>
          <Route path="/wallet/send" key="send">
            <Modal title="Send" onClose={() => history.push('/wallet')}>
              <SendPage />
            </Modal>
          </Route>
          <Route path="/wallet/address" key="address">
            <Modal title="Your address" onClose={() => history.push('/wallet')}>
              <AddressPage />
            </Modal>
          </Route>
          <Route path="/wallet/settings">
            <Modal title="Settings" onClose={() => history.push(history.location.pathname.replace('/settings', ''))}>
              <SettingsPage />
            </Modal>
          </Route>
        </Switch>
      </AnimatePresence>
    </TransactionsContextProvider>
  )
}

export default WalletRoutes
