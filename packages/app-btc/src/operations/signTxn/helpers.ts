import { assert, isHex } from '@cypherock/sdk-utils';
import { ISignTxnParams } from './types';
import { assertDerivationPath } from '../../utils';

export const assertSignTxnParams = (params: ISignTxnParams) => {
  assert(params, 'params should be defined');
  assert(params.walletId, 'walletId should be defined');

  assert(params.derivationPath, 'derivationPath should be defined');
  assert(
    params.derivationPath.length === 3,
    'derivationPath should be of depth 3',
  );
  assertDerivationPath(params.derivationPath);

  assert(params.txn, 'txn be defined');
  assert(params.txn.inputs, 'txn.inputs should be defined');
  assert(params.txn.inputs.length > 0, 'txn.inputs should not be empty');
  assert(params.txn.outputs, 'txn.outputs should be defined');
  assert(params.txn.outputs.length > 0, 'txn.outputs should not be empty');

  for (let i = 0; i < params.txn.inputs.length; i += 1) {
    const input = params.txn.inputs[i];

    assert(input.value, `txn.inputs[${i}].value should be defined`);
    assert(input.address, `txn.inputs[${i}].address should be define`);
    assert(input.changeIndex, `txn.inputs[${i}].changeIndex should be define`);
    assert(
      input.addressIndex,
      `txn.inputs[${i}].addressIndex should be define`,
    );
    assert(input.prevIndex, `txn.inputs[${i}].addressIndex should be define`);

    assert(input.prevTxnId, `txn.inputs[${i}].prevTxnId should not be empty`);
    assert(
      isHex(input.prevTxnId),
      `txn.inputs[${i}].prevTxnId should be valid hex string`,
    );

    if (input.prevTxn) {
      assert(
        isHex(input.prevTxn),
        `txn.inputs[${i}].prevTxn should be valid hex string`,
      );
    }
  }

  for (let i = 0; i < params.txn.outputs.length; i += 1) {
    const output = params.txn.outputs[i];

    assert(output.value, `txn.outputs[${i}].value should be defined`);
    assert(output.address, `txn.outputs[${i}].address should be define`);

    if (output.isChange) {
      assert(
        output.addressIndex,
        `txn.outputs[${i}].addressIndex should be define when it's a change output`,
      );
    }
  }
};
