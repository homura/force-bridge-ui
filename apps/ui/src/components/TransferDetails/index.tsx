import { Asset } from '@force-bridge/commons';
import { Divider, Grid, Tooltip, Typography } from '@mui/material';
import React from 'react';
import { Details } from './styled';
import { HumanizeAmount } from 'components/AssetAmount';
import { BridgeOperationFormContainer } from 'containers/BridgeOperationFormContainer';
import { useBridgeFeeQuery } from 'hooks/bridge-operation';
import { formatAddress } from 'utils';

interface TransferDetailsProps {
  selectedAsset: Asset;
}

export const TransferDetails: React.FC<TransferDetailsProps> = (props) => {
  const { selectedAsset } = props;

  const { asset, bridgeToAmount, bridgeFromAmount, recipient } = BridgeOperationFormContainer.useContainer();
  const feeQuery = useBridgeFeeQuery();

  return (
    <Details>
      <Grid container justifyContent="space-between">
        <Grid item display="flex">
          <Typography fontWeight={400} color="text.secondary">
            To
          </Typography>
          <Tooltip title={recipient}>
            <Typography marginLeft={0.5} fontWeight={700} color="primary.light">
              {formatAddress(recipient)}
            </Typography>
          </Tooltip>
        </Grid>
        <Grid item>
          <Typography fontWeight={400} color="primary.light">
            {bridgeFromAmount} {selectedAsset.info?.name}
          </Typography>
        </Grid>
      </Grid>
      <Grid container justifyContent="space-between">
        <Grid item>
          <Typography fontWeight={400} color="text.secondary">
            Bridge fee
          </Typography>
        </Grid>
        <Grid item>
          {feeQuery.data && <HumanizeAmount asset={{ ...asset, amount: feeQuery.data.fee.amount }} showSymbol />}
        </Grid>
      </Grid>
      <Divider />
      <Grid container justifyContent="space-between">
        <Grid item>
          <Typography fontWeight={700} color="primary.light">
            Amount after fees
          </Typography>
        </Grid>
        <Grid item>
          <Typography fontWeight={700} color="primary.light">
            {bridgeToAmount} {selectedAsset.info?.name}
          </Typography>
        </Grid>
      </Grid>
    </Details>
  );
};
