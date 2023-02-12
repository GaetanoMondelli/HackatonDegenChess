export class DegenChessSDK {
    static ENDPOINT: string = 'http://localhost'
    static SERVER_PORT: number = 8000
    static BASE_URL: string = `${DegenChessSDK.ENDPOINT}:${DegenChessSDK.SERVER_PORT}`

    getUser1Wallet = async (): Promise<any> => {
        console.log(`${DegenChessSDK.BASE_URL}/users/player1`)
        const response = await fetch(`${DegenChessSDK.BASE_URL}/users/player1`)
        const data = await response.json()
        return data
    }

}
