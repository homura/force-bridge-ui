import { CashIcon } from '@heroicons/react/solid';
import { Button, ButtonProps } from '@mui/material';
import React, { useMemo } from 'react';
import { UserIdent } from 'components/UserIdent';
import { BridgeDirection, ForceBridgeContainer } from 'containers/ForceBridgeContainer';
import { useGlobalSetting } from 'hooks/useGlobalSetting';
import { ConnectStatus } from 'interfaces/WalletConnector';

export interface WalletConnectorButtonProps extends ButtonProps {
  disconnectedContent?: React.ReactNode;
  connectingContent?: React.ReactNode;
}

export const WalletConnectorButton: React.FC<WalletConnectorButtonProps> = (props) => {
  const { disconnectedContent = 'Connect Wallet', connectingContent = 'Connecting...', ...btnProps } = props;
  const { signer, walletConnectStatus, wallet, direction } = ForceBridgeContainer.useContainer();
  const [globalSetting] = useGlobalSetting();

  const userIdentityMode = globalSetting.userIdentityMode;

  const buttonContent = useMemo(() => {
    if (walletConnectStatus === ConnectStatus.Disconnected) return disconnectedContent;
    if (walletConnectStatus === ConnectStatus.Connecting) return connectingContent;
    if (!signer) return connectingContent;

    if (userIdentityMode === 'alwaysXChain') return <UserIdent ident={signer.identityXChain()} />;
    if (userIdentityMode === 'alwaysNervos') return <UserIdent ident={signer.identityNervos()} />;

    if (direction === BridgeDirection.In) return <UserIdent ident={signer.identityXChain()} />;
    return <UserIdent ident={signer.identityNervos()} />;
  }, [walletConnectStatus, disconnectedContent, signer, connectingContent, userIdentityMode, direction]);

  function onClick() {
    wallet?.connect();
    if (signer) {
      direction === BridgeDirection.In
        ? navigator.clipboard.writeText(signer.identityXChain())
        : navigator.clipboard.writeText(signer.identityNervos());
    }
  }

  const isConnected = walletConnectStatus === ConnectStatus.Connected;

  return (
    <Button
      onClick={onClick}
      variant={isConnected ? 'outlined' : 'contained'}
      color="secondary"
      startIcon={isConnected && <CashIcon />}
      sx={{ padding: '0.5rem 1rem' }}
      {...btnProps}
    >
      {buttonContent}
    </Button>
  );
};
