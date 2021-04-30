import { Asset } from '@force-bridge/commons';
import { useMutation, UseMutationResult } from 'react-query';
import { boom } from 'interfaces/errors';
import { BridgeDirection, useForceBridge } from 'state';
import { EthWalletSigner } from 'xchain/eth/EthWalletSigner';

export interface BridgeInputValues {
  asset: Asset;
  recipient: string;
}

export function useBridgeTransaction(): UseMutationResult<{ txId: string }, unknown, BridgeInputValues> {
  const { api, signer, direction, network } = useForceBridge();

  return useMutation(['sendTransaction'], async (input: BridgeInputValues) => {
    if (!signer) boom('signer is not load');

    let generated;
    if (direction === BridgeDirection.In) {
      // TODO refactor to life-time style? beforeTransactionSending / afterTransactionSending
      if (network === 'Ethereum') {
        const ethSigner = signer as EthWalletSigner;
        console.log(input.asset.ident);
        const isAllowanceEnough = await ethSigner
          .getAllowance(input.asset.ident)
          .then((allowance) => allowance.gte(input.asset.amount));

        if (!isAllowanceEnough) {
          const confirmed = window.confirm(
            'The allowance is not enough for bridging, we need to approve before we can execute the Bridge operation',
          );
          if (!confirmed) {
            boom('Not yet approved, we need to approve before we can execute the Bridge operation');
          }

          await ethSigner.approve(input.asset.ident);
          boom('Waiting for the approving successfully');
        }
      }

      generated = await api.generateBridgeInNervosTransaction({
        asset: { network: input.asset.network, ident: input.asset.ident, amount: input.asset.amount },
        recipient: input.recipient,
        sender: signer.identityXChain(),
      });
    } else {
      console.log(input.asset.amount);
      generated = await api.generateBridgeOutNervosTransaction({
        network,
        amount: input.asset.amount,
        asset: input.asset.ident,
        recipient: input.recipient,
        sender: signer.identityNervos(),
      });
    }

    return signer.sendTransaction(generated.rawTransaction);
  });
}
