import { Skeleton } from 'antd';
import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import { StyledCardWrapper } from 'components/Styled';
import { BridgeOperationFormContainer } from 'containers/BridgeOperationFormContainer';
import { BindNetworkDirectionWithRoute } from 'views/Bridge/BindNetworkDirectionWithRoute';

const EthereumBridge = lazy(async () => import('./Ethereum'));

export const BridgeView: React.FC = () => {
  // useBindRouteAndBridgeState();

  return (
    <BridgeOperationFormContainer.Provider>
      <BindNetworkDirectionWithRoute />

      <Suspense
        fallback={
          <StyledCardWrapper>
            <Skeleton active />
          </StyledCardWrapper>
        }
      >
        <Switch>
          <Route path={['/bridge/Ethereum/Nervos', '/bridge/Nervos/Ethereum']} component={EthereumBridge} />
        </Switch>
      </Suspense>
    </BridgeOperationFormContainer.Provider>
  );
};
