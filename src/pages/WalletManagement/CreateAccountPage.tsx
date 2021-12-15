// Copyright 2018 - 2021 The Alephium Authors
// This file is part of the alephium project.
//
// The library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with the library. If not, see <http://www.gnu.org/licenses/>.

import { ChangeEvent, useState, useContext } from 'react'
import { AlertTriangle } from 'lucide-react'
import styled from 'styled-components'
import zxcvbn from 'zxcvbn'

import { GlobalContext } from '../../App'
import { StepsContext } from '../MultiStepsController'
import { WalletManagementContext } from './WalletManagementContext'
import {
  Section,
  FooterActionsContainer,
  FloatingPanel,
  PanelContentContainer
} from '../../components/PageComponents/PageContainers'
import { Input } from '../../components/Inputs'
import InfoBox from '../../components/InfoBox'
import Paragraph from '../../components/Paragraph'
import { Button } from '../../components/Buttons'
import PanelTitle from '../../components/PageComponents/PanelTitle'
import { getStorage } from 'alephium-js'

const Storage = getStorage()

const CreateAccountPage = ({ isRestoring = false }: { isRestoring?: boolean }) => {
  const { setCurrentUsername } = useContext(GlobalContext)
  const { setContext, username: existingUsername, password: existingPassword } = useContext(WalletManagementContext)
  const { onButtonBack, onButtonNext } = useContext(StepsContext)

  const [state, setState] = useState({
    username: existingUsername,
    usernameError: '',
    password: existingPassword,
    passwordError: '',
    passwordCheck: existingPassword
  })
  const { username, usernameError, password, passwordError, passwordCheck } = state

  const usernames = Storage.list()

  const onUpdatePassword = (e: ChangeEvent<HTMLInputElement>): void => {
    const password = e.target.value
    let passwordError = ''

    if (password.length === 0) {
      passwordError = ''
    } else {
      const strength = zxcvbn(password)
      if (strength.score < 1) {
        passwordError = 'Password is too weak'
      } else if (strength.score < 3) {
        passwordError = 'Insecure password'
      }
    }
    setState({ ...state, password, passwordError })
  }

  const onUpdateUsername = (e: ChangeEvent<HTMLInputElement>) => {
    const username = e.target.value
    let usernameError = ''

    if (username.length < 3) {
      usernameError = 'Account name is too short'
    } else if (usernames?.includes(username)) {
      usernameError = 'Account name already taken'
    }

    setState({ ...state, username, usernameError })
  }

  // Is next button activated?
  const isNextButtonActive = () =>
    password.length > 0 &&
    passwordError.length === 0 &&
    password === passwordCheck &&
    username.length > 0 &&
    usernameError.length === 0

  const handleNextButtonClick = () => {
    setContext((prevContext) => ({ ...prevContext, username, password }))
    setCurrentUsername(username)
    onButtonNext()
  }

  return (
    <FloatingPanel>
      <PanelTitle color="primary">{isRestoring ? 'Import Account' : 'New Account'}</PanelTitle>
      <PanelContentContainer>
        <Section inList>
          <Input
            value={username}
            placeholder={isRestoring ? 'New account name' : 'Account name'}
            onChange={onUpdateUsername}
            error={usernameError}
            isValid={username.length > 0 && usernameError.length === 0}
          />
          <Input
            value={password}
            placeholder={isRestoring ? 'New password' : 'Password'}
            type="password"
            onChange={onUpdatePassword}
            error={passwordError}
            isValid={!passwordError && password.length > 0}
          />
          <Input
            value={passwordCheck}
            placeholder="Retype password"
            type="password"
            onChange={(e) => setState({ ...state, passwordCheck: e.target.value })}
            error={passwordCheck && password !== passwordCheck ? 'Passwords are different' : ''}
            isValid={password.length > 0 && password === passwordCheck}
            disabled={!password || passwordError.length > 0}
          />
          <InfoBox
            Icon={AlertTriangle}
            importance="alert"
            text={'Make sure to keep your password secured as it cannot be changed in the future.'}
          />
          <WarningNote>{'Alephium doesn’t have access to your account.\nYou are the only owner.'}</WarningNote>
        </Section>
      </PanelContentContainer>
      <FooterActionsContainer apparitionDelay={0.3}>
        <Button secondary onClick={onButtonBack}>
          Back
        </Button>
        <Button disabled={!isNextButtonActive()} onClick={handleNextButtonClick} submit>
          Continue
        </Button>
      </FooterActionsContainer>
    </FloatingPanel>
  )
}

const WarningNote = styled(Paragraph)`
  text-align: center;
  color: ${({ theme }) => theme.font.secondary};
  margin-bottom: 0;
`

export default CreateAccountPage
