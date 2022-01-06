/*
//22.01.05
//비밀키와 공개키를 관리. 지갑에서부터 비밀키를 가져오거나 공개키를 생성,
//새로운 비밀키를 생성하거나 기존 파일에서 읽어오기 가능
function generatePrivateKey(){
}
function initWallet(){    
}
*/

//22.01.04
const fs = require("fs");
const ecdsa = require("elliptic"); // 타원 곡선 디지털 서명 알고리즘
//라이브러리를가지고 암호화 알고리즘을 하나를 명시를 해줍시다.
const ec = new ecdsa.ec("secp256k1");

//키만들기
//console.log(ec.genKeyPair().getPrivate().toString());

//저장할위치가 필요하다
//환경변수를지정해서
const privateKeyLocation = "wallet/" + (process.env.PRIVATE_KEY || "default");
const privateKeyFile = privateKeyLocation + "/private_key";

function initWallet() {
  //예외처리
  if (fs.existsSync(privateKeyFile)) {
    console.log("기존 지갑 private key 경로" + privateKeyFile);
    return;
  }
  if (!fs.existsSync("wallet/")) {
    fs.mkdirSync("wallet/");
  }
  if (!fs.existsSync(privateKeyFile)) {
    fs.mkdirSync(privateKeyLocation);
  }

  //새로운 공개키는 공개키를 만들수있고
  const newPrivateKey = generatePrivatekey();
  fs.writeFileSync(privateKeyFile, newPrivateKey);
  console.log("새로운 지갑 생성 private key 경로 : " + privateKeyFile);
}
initWallet();

//비밀키를 만드는가장 쉬운방법
function generatePrivatekey() {
  const keyPair = ec.genKeyPair();
  //비밀키는 키페어에서 가져온다.
  const privateKey = keyPair.getPrivate();
  //16진수로 바꿔서 표현해줬다.
  return privateKey.toString(16);
}

//외부에서 비밀키를 가져다 쓰고싶을때?
function getPrivateKeyFromWallet() {
  //fs파일에서 파일을 읽어준다. privateKeyfile을 utf8로 인코딩한거를 buffer에 담아서
  const buffer = fs.readFileSync(privateKeyFile, "utf8");
  //buffer에 담은걸 toString으로 바꿔서 표현
  return buffer.toString();
}

//외부에서 공개키를 가져오려면?
function getPublicKeyFromWallet() {
  //공개키를 가져오려면 일단 비밀키를 getPrivatekeyFromWallet에서 가져온다음에
  const privateKey = getPrivateKeyFromWallet();
  //ec.keyFromPrivate안에 인자로 비밀키를 넣어주면 우리가 원하는 퍼블릭 키가된다.
  //키 생성하더라도 16진수로 생성해주고
  const key = ec.keyFromPrivate(privateKey, "hex");
  //key.getPublic을 통해서 호출한다음 hex로 인코딩을 해줘야한다.
  key.getPublic().encode("hex");
}

module.exports = { getPublicKeyFromWallet, initWallet };

//22.01.04
//타원 곡선 디지털 서명 알고리즘 ?? / 영지식증명
//영지식증명
//암호학에서 누군가가 상대방에게 어떤 사항이 참이라는것을 증명할 때
//그 문장의 참 거짓 여부를 제외한 어떤 것도 노출되지 않는 절차

//비밀키를 만드는가장 쉬운방법
/*
0 or 1 bit를 놓고 256번 돌리는거지 256의 비밀값이 나온다. 2의 256승의 가지수를 나올거다 
2

//비밀키를 내보내준다.
//export PRIVATE_KEY="private_user4"

//환경변수파일에서 ㅁ비밀키를 선정해준다.
//env | grep PRIVATE_KEY

//지갑에서 비밀키를 
//cat wallet/private_user4/private_key

//curl http://localhost:3001/address

*/
