import React, { useEffect, useState } from 'react';
import {
  Link,
  ETHTokenType,
  ImmutableXClient,
  ERC721TokenType,
} from '@imtbl/imx-sdk';

import logo from './logo.svg';
import { Chess } from 'chess.js';
import { Layout, Button, Popover } from 'antd';
import { Chessboard } from 'react-chessboard';
import { DegenChessSDK } from './degenchess-sdk';
import './App.css';
const { Content } = Layout;

const sdk = new DegenChessSDK();

function App() {
  const [game, setGame] = useState<any>(new Chess());
  const [gamePos, setGamePos] = useState<any>(game.fen());
  const [player, setPlayer] = useState<any>(null);
  const [address, setAddress] = useState<string>('');
  const [client, setClient] = useState<any>(null);
  const [tokenBalance, setTokenBalance] = useState<any>(null);
  const [selectedPiece, setSelectedPiece] = useState<string>('');

  useEffect(() => {
    const getClient = async () => {
      const client = await ImmutableXClient.build({
        publicApiUrl: 'https://api.sandbox.x.immutable.com/v1',
      });
      setClient(client);
    };
    getClient();
  }, []);

  useEffect(() => {
    const getBalance = async () => {
      if (client) {
        let assetCursor;
        let assets: any = [];
        do {
          let assetRequest: any = await client.getAssets({
            user: '0x4858B03A389Fd505252CA002Df1Dc73443642192',
            cursor: assetCursor,
          });
          assets = assets.concat(assetRequest.result);
          assetCursor = assetRequest.cursor;
        } while (assetCursor);

        setTokenBalance(assets);
      }
    };
    getBalance();
  }, [address, client]);

  function onPieceClick(piece: any) {
    console.log('piece', piece);
    setSelectedPiece(piece);
  }

  function onDrop(sourceSquare: any, targetSquare: any) {
    console.log('move', sourceSquare, targetSquare);

    const targetSquareIndex = [
      targetSquare.charCodeAt(0) - 97,
      parseInt(targetSquare[1]) - 1,
    ];


    try {
      console.log('before', [7-targetSquareIndex[1]],[7-targetSquareIndex[0]], game.board(),  game.board()[7-targetSquareIndex[1]][targetSquareIndex[0]]);
// burn
      game.move({ from: sourceSquare, to: targetSquare });
      console.log('gp', [7-targetSquareIndex[1]],[7-targetSquareIndex[0]], game.board(),  game.board()[7-targetSquareIndex[1]][targetSquareIndex[0]]);
    } catch (e) {
      return false;
    }

    setGamePos(game.fen());
    return true;
  }

  const pieces = [
    'wP',
    'wN',
    'wB',
    'wR',
    'wQ',
    'wK',
    'bP',
    'bN',
    'bB',
    'bR',
    'bQ',
    'bK',
  ];

  const customPieces = () => {
    const returnPieces: any = {};
    pieces.map(p => {
      returnPieces[p] = ({ squareWidth }: any) => (
        <Popover trigger="click" title="Wrapping" content={<>Ciao</>}>
          <div
            style={{
              width: squareWidth,
              height: squareWidth,
              backgroundImage: `url(/${p}.png)`,
              backgroundSize: '100%',
            }}
          />
        </Popover>
      );
      return null;
    });
    return returnPieces;
  };

  return (
    <div className="App">
      {/* <header className="App-header"></header> */}
      <Content style={{ margin: '5%' }}>
        <h1>Degen Chess</h1>
        <div>
          <Button
            onClick={async () => {
              const player = await sdk.getUser1Wallet();
              console.log('player', player);
              setPlayer(player);
            }}
          >
            Login Player 1
          </Button>
          <Button
            onClick={async () => {
              const link = new Link('https://link.sandbox.x.immutable.com');

              // Register user, you can persist address to local storage etc.
              const { address } = await link.setup({});
              localStorage.setItem('address', address);
              setAddress(address);
              console.log('address', address);
            }}
          >
            Login Player 2
          </Button>
          <Chessboard
            id="BasicBoard"
            position={gamePos}
            customPieces={customPieces()}
            onPieceDrop={onDrop}
            onPieceClick={onPieceClick}
            boardWidth={500}
            customDarkSquareStyle={{ backgroundColor: '#0033FF' }}
            customLightSquareStyle={{ backgroundColor: '#FF00FF' }}
          />
          {JSON.stringify(player)}
          Address
          {address}
          TokenAddress
          {JSON.stringify(tokenBalance)}
        </div>
      </Content>
    </div>
  );
}

export default App;
