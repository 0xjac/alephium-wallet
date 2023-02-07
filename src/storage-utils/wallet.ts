/*
Copyright 2018 - 2022 The Alephium Authors
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

import { Wallet } from '@alephium/sdk'

import AddressMetadataStorage from '@/persistent-storage/address-metadata'
import WalletStorage from '@/persistent-storage/wallet'
import { walletSaved } from '@/store/activeWalletSlice'
import { syncAddressesData } from '@/store/addressesSlice'
import { store } from '@/store/store'
import { getRandomLabelColor } from '@/utils/colors'

interface SaveNewWalletProps {
  walletName: string
  password: string
  wallet: Wallet
}

export const saveNewWallet = ({ walletName, password, wallet }: SaveNewWalletProps) => {
  const initialAddressSettings = {
    isDefault: true,
    color: getRandomLabelColor()
  }

  WalletStorage.store(walletName, password, wallet)
  AddressMetadataStorage.store({
    index: 0,
    settings: initialAddressSettings,
    dataKey: {
      mnemonic: wallet.mnemonic,
      walletName: walletName
    }
  })

  store.dispatch(
    walletSaved({
      name: walletName,
      mnemonic: wallet.mnemonic,
      initialAddress: {
        index: 0,
        hash: wallet.address,
        publicKey: wallet.publicKey,
        privateKey: wallet.privateKey,
        ...initialAddressSettings
      }
    })
  )
  store.dispatch(syncAddressesData())
}
