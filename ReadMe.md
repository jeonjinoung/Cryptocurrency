# 코인 빌드

### 팀원 : 전진영 <a href="https://github.com/jeonjinoung"><img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=GitHub&logoColor=white"/></a> , 박준혁 <a href="https://github.com/berrypjh"><img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=GitHub&logoColor=white"/></a> , 곽지현 <a href="https://github.com/TsukinoHikari"><img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=GitHub&logoColor=white"/></a> 
---------------------------------------

## 목적
블록체인, POW, 지갑생성 이해하기

---------------------------------------

## 서버 폴더 구조
> blockchain
>> blockclass.js
>> blocks.js
>
> config
>> config.json
>
> models
>> block.js
>> index.js
>> user.js
>
> network
>> message
>>> massage.js
>>> type.js
>>
>> route
>>> BlockRouter.js
>>> PeerRouter.js
>>> UserRouter.js
>>> WalletRouter.js
>>
>> main.js
>> networks.js
>
> passport
>> index.js
>> local.js
>
> scripts
>> average-work.js
>
> utils
>> hash.js
>> isValidBlock.js
>
> wallet
>> wallet.js
>
> package-lock.json
> package.json
> yarn.lock

# 작업일정
## 01.27~28 계획수립 및 복습 ##
1. 이전 프로젝트 서버 및 폴더 재정리 및 내용 파악
2. trensection의 이해 및 구성하기위한 계획
3. 필요코드 및 참고 코드 확인 -> blockclass 구조체부터 wallet까지 확인

# 목표 #
◎각각의 블록 지갑화 -> 01.27 완료 -> 각 포트별 지각 생성화
◎각각의 서버 address 연결 -> 01.27 완료 -> 각 포트 소켓 포트 get peer를 통한 소켓연결
◎node서버 3개를 만들고 각 서버를 client와 연결 -> 01.27 완료 -> 각 포트 서버단 node1, node2, node3 생성 client json 연결

◎기존 블록의 트랜잭션 내용 삽입
◎naivecoin을 내가 작업했던 blockchain과 우선 비교 그리고 주석처리 후 재기능 확인

블록구조체
class BlockHeader {
  constructor (version, index, previousHash, timestamp, merkleRoot, difficulty, nonce) {
    this.index = index
    this.merkleRoot = merkleRoot
    this.previousHash = previousHash
    this.timestamp = timestamp
    this.version = version //버전 없고
    //this.data = Transactionp[]; 트랜잭션 빈배열 추가
    this.difficulty = difficulty
    this.nonce = nonce
  }
}
naivecoin 블록 구조체
class Block {
    public index: number;
    public hash: string;
    public previousHash: string;
    public timestamp: number;
    public data: Transaction[];
    public difficulty: number;
    public nonce: number;

    constructor(index: number, hash: string, previousHash: string,
                timestamp: number, data: Transaction[], difficulty: number, nonce: number) {
        this.index = index;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
        this.hash = hash;
        this.difficulty = difficulty;
        this.nonce = nonce;
    }
}

# naivecoin #
## 최초의 블럭 ## 
const genesisBlock: Block = new Block(
    0, '91a73664bc84c0baa1fc75ea6e4aa6d1d20c5df664c724e3159aefc2e1186627', '', 1465154705, [], 0, 0
);//index, previousHash, timestamp, data, hash, difficulty, nonce,
차이점은 버전을 가져오는것과 머클루트를 선언하는것이 naivecoin에는 없었다.



## 목적
블록체인, POW, 지갑생성 이해하기

---------------------------------------

## 서버 폴더 구조
> blockchain
>> blockclass.js
>> blocks.js
>
> config
>> config.json
>
> models
>> block.js
>> index.js
>> user.js
>
> network
>> message
>>> massage.js
>>> type.js
>>
>> route
>>> BlockRouter.js
>>> PeerRouter.js
>>> UserRouter.js
>>> WalletRouter.js
>>
>> main.js
>> networks.js
>
> passport
>> index.js
>> local.js
>
> scripts
>> average-work.js
>
> utils
>> hash.js
>> isValidBlock.js
>
> wallet
>> wallet.js
>
> package-lock.json
> package.json
> yarn.lock
