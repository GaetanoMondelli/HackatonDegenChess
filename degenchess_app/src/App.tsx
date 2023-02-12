import React, { useEffect, useState } from 'react';
import {
  Link,
  ETHTokenType,
  ImmutableXClient,
  ERC721TokenType,
} from '@imtbl/imx-sdk';

import logo from './logo.svg';
import { Chess } from 'chess.js';
// import track from "chess.js-track-pieces";
import { Card, Avatar, Layout, Button, Popover, Select, Space } from 'antd';
import { Chessboard } from 'react-chessboard';
import { DegenChessSDK } from './degenchess-sdk';
import { boardNotation, processGame, pieceTracking } from './track';
import './App.css';
const { Content } = Layout;

const sdk = new DegenChessSDK();

function App() {
  const [game, setGame] = useState<any>(new Chess());
  const [gamePos, setGamePos] = useState<any>(game.fen());
  const [positions, setPositions] = useState<any>(boardNotation);
  const [piecesWrapping, setPieceWrapping] = useState<any>(pieceTracking);
  const [captured, setCaptured] = useState<any>({});
  const [player, setPlayer] = useState<any>(null);
  const [address, setAddress] = useState<string>('');
  const [client, setClient] = useState<any>(null);
  const [tokenBalance, setTokenBalance] = useState<any>(null);
  const [selectedPiece, setSelectedPiece] = useState<string>('');
  const [selectIcon, setSelectedIcon] = useState<string>('');
  const [selectToRide, setSelectedToRide] = useState<string>();

  const hasGameStatarted = game.history().length > 0;

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
    console.log('piece shape', piece);
    setSelectedIcon(piece);
  }

  function onSquareClick(square: any) {
    console.log('square', square);
    // check key inside final object that has value of square and return the key
    let piece = Object.keys(positions).find(key => positions[key] === square);
    console.log('piece', piece);
    setSelectedPiece(piece || '');
  }

  function onDrop(sourceSquare: any, targetSquare: any) {
    console.log('move', sourceSquare, targetSquare);

    const targetSquareIndex = [
      targetSquare.charCodeAt(0) - 97,
      parseInt(targetSquare[1]) - 1,
    ];

    try {
      console.log(
        'before',
        [7 - targetSquareIndex[1]],
        [7 - targetSquareIndex[0]],
        game.board(),
        game.board()[7 - targetSquareIndex[1]][targetSquareIndex[0]],
      );
      // burn here
      game.move({ from: sourceSquare, to: targetSquare });
      console.log(
        'gp',
        [7 - targetSquareIndex[1]],
        [7 - targetSquareIndex[0]],
        game.board(),
        game.board()[7 - targetSquareIndex[1]][targetSquareIndex[0]],
      );

      console.log('hisotry', game.history().join(' '));
      let chessMoves = game.history().join();
      let final = processGame(chessMoves, { verbose: true });
      let captured = processGame(chessMoves, { verbose: false });
      setPositions({ ...positions, ...final });
      setCaptured(captured);
      console.log('final', final, captured);
    } catch (e) {
      console.log('error', e);
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
        <Popover
          trigger="click"
          title={'Wrapping ' + selectedPiece}
          content={
            <>
              <Card
                style={{ width: 350 }}
                extra={
                  <>
                    <Space >
                      <Avatar src={
                        selectToRide? `http://localhost:3000/${selectToRide}.png` : `http://localhost:3000/${selectIcon}.png`} />
                      <Select
                        style={{ width: 170 }}
                        placeholder="NFT 2 ride the piece"
                        options={
                          tokenBalance?.map((token: any) => {
                            //  do ellipsis on token_address
                            let address =
                              token.token_address.slice(0, 2) +
                              '...' +
                              token.token_address.slice(-2);
                            return {
                              label: token.collection.name + '- ' +address + ' - ' + token.token_id,
                              value: address + ' - ' + token.token_id,
                            };
                          }) || []
                        }
                      ></Select>
                      <Button
                        disabled={hasGameStatarted}
                        onClick={() => {
                          console.log('wrap', selectedPiece);
                        }}
                      >
                        Ride {selectedPiece}
                      </Button>
                    </Space>
                  </>
                }
              >
                <Card.Meta
                  avatar={
                    <Avatar src={`http://localhost:3000/${selectIcon}.png`} />
                  }
                  description="This is the degenchess piece you want your NFT to ride"
                />
              </Card>
            </>
          }
        >
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
        {hasGameStatarted ? <p>Started</p> : <p>Not Started</p>}
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
            onSquareClick={onSquareClick}
            boardWidth={500}
            customDarkSquareStyle={{ backgroundColor: '#0033FF' }}
            customLightSquareStyle={{ backgroundColor: '#FF00FF' }}
          />
          Selected Piece
          {selectedPiece}
          <br></br>
          Positions
          {JSON.stringify(positions)}
          <br></br>
          Captured
          {JSON.stringify(captured)}
          <hr></hr>
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
