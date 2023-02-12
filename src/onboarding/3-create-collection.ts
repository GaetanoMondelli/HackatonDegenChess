import { AlchemyProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { ImLogger, WinstonLogger } from '@imtbl/imlogging';
import { CreateCollectionParams, ImmutableXClient, UpdateCollectionParams } from '@imtbl/imx-sdk';
import { requireEnvironmentVariable } from 'libs/utils';

import env from '../config/client';
import { loggerConfig } from '../config/logging';

const provider = new AlchemyProvider(env.ethNetwork, env.alchemyApiKey);
const log: ImLogger = new WinstonLogger(loggerConfig);

const component = '[IMX-CREATE-COLLECTION]';

(async (): Promise<void> => {
  const privateKey = requireEnvironmentVariable('OWNER_ACCOUNT_PRIVATE_KEY');
  const collectionContractAddress = requireEnvironmentVariable(
    'COLLECTION_CONTRACT_ADDRESS',
  );
  const projectId = requireEnvironmentVariable('COLLECTION_PROJECT_ID');

  const wallet = new Wallet(privateKey);
  const signer = wallet.connect(provider);
  const ownerPublicKey = wallet.publicKey;

  const user = await ImmutableXClient.build({
    ...env.client,
    signer,
    enableDebug: true,
  });

  log.info(component, 'Creating collection...', collectionContractAddress);

  /**
   * Edit your values here
   */
  const params: CreateCollectionParams = {
    name: 'Little Yodas',
    // description: 'ENTER_COLLECTION_DESCRIPTION (OPTIONAL)',
    contract_address: collectionContractAddress,
    owner_public_key: ownerPublicKey,
    // icon_url: '',
    metadata_api_url: 'https://gateway.pinata.cloud/ipfs/Qma2bDnrhtz2NhKXmwmFzZ86t2fjUe7uwiz2CS5ViTMkNu',
    // collection_image_url: '',
    project_id: parseInt(projectId, 10),
  };

  const updateparams: UpdateCollectionParams = {
    name: 'Little Yodas',
    description: 'Test collection of baby yodas chess', 
    icon_url:  'https://gateway.pinata.cloud/ipfs/QmS3o9xgrMBg3zUJhvUQSDF7WWfXfDgq5DXKuF6e5SnwfD',
    metadata_api_url: 'https://gateway.pinata.cloud/ipfs/Qma2bDnrhtz2NhKXmwmFzZ86t2fjUe7uwiz2CS5ViTMkNu',
    collection_image_url:  'https://gateway.pinata.cloud/ipfs/QmS3o9xgrMBg3zUJhvUQSDF7WWfXfDgq5DXKuF6e5SnwfD'
    // project_id: parseInt(projectId, 10),
  };

  let collection;
  try {
    collection = await user.updateCollection("0xD314b8E99CadF438a00c7975A92B89ddB524Aa65", updateparams);
  } catch (error) {
    throw new Error(JSON.stringify(error, null, 2));
  }

  log.info(component, 'Created collection');
  console.log(JSON.stringify(collection, null, 2));
})().catch(e => {
  log.error(component, e);
  process.exit(1);
});
