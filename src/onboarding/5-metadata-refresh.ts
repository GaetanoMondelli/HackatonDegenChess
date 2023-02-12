import { AlchemyProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { ImLogger, WinstonLogger } from '@imtbl/imlogging';
import {
  AddMetadataSchemaToCollectionParams,
  ImmutableXClient,
  MetadataTypes,
} from '@imtbl/imx-sdk';
import { ImmutableX, Config } from '@imtbl/core-sdk';
import { requireEnvironmentVariable } from 'libs/utils';

import env from '../config/client';
import { loggerConfig } from '../config/logging';

const provider = new AlchemyProvider(env.ethNetwork, env.alchemyApiKey);
const log: ImLogger = new WinstonLogger(loggerConfig);

const component = '[IMX-ADD-COLLECTION-METADATA-SCHEMA]';

(async (): Promise<void> => {
  const privateKey = requireEnvironmentVariable('OWNER_ACCOUNT_PRIVATE_KEY');
  const collectionContractAddress = requireEnvironmentVariable(
    'COLLECTION_CONTRACT_ADDRESS',
  );

  const wallet = new Wallet(privateKey);
  const signer = wallet.connect(provider);

  const user = await ImmutableXClient.build({
    ...env.client,
    signer,
    enableDebug: true,
  });

  const config = Config.SANDBOX;
  const client = new ImmutableX(config);

  const createRefreshRequestParams = {
    collection_address: '0xD314b8E99CadF438a00c7975A92B89ddB524Aa65',
    token_ids: ['1', '2', '3'], // Token ids for metadata refresh, limit to 1000 per request
  };

  // const createMetadataRefreshResponse = await client.createMetadataRefresh(
  //   wallet,
  //   createRefreshRequestParams,
  // );
  // Example response
  const getMetadataRefreshResultsResponse = await client.getMetadataRefreshResults(wallet, "d705f1a8-dbfe-49a5-8d6d-11f35e1497cd");


  log.info(component, 'Refreshed metadata', getMetadataRefreshResultsResponse);
})().catch(e => {
  log.error(component, e);
  process.exit(1);
});
