import { DatePipe } from '@angular/common'
import { Injectable } from '@angular/core'
import { pki, util } from 'node-forge'
import { environment } from 'environments/environment'

@Injectable()
export class CryptoService {

  private datePipe
  
  private publicKey = `-----BEGIN PUBLIC KEY-----
  MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAg4jN1WF1y/NexPQLzGMf
  x724TG9SlniETKvSm5kdShOgGYiNvoOnPd7yBqD0q6ZSI/7Sl+M1Kcnri+PKMcA0
  3GTEyKkL87swhPYBnx2cku1VUV9dZTK9S0bhNlzuqbk1D5wsD6nNd2o1SqShD3BP
  DrBhCEEs4sYzJOtLl/BpOx0aWh6vsXXNFxtZ3xR7T+EcfbpCWuej88TzztF3uQZF
  aGa53VoN4vLHPob2OKVfzCv0sssNxzP/3ZHV+BiqEqm0o/i6+2ZIX/z5idkNNLZi
  QJ1wI+biFFFioD+XR/6DhzyjN7NH+UCw6K38gxAPPBs5wZdeeluM6yxCef0t3vm5
  jipL1ZGvH+bInNBYNak+wNK/qte5z1fz4O+MmoR0hM9Cr0Vges0LXZK6QX8Qscfd
  wnniKTjBE3qqMq+0N/BKkz40b8tdRvm2wnHcuXR8w53usXkCBsqKYcvnuP8xZy9l
  hJ42wDnAWe4Kcl5HRkxKMzGJ9SbVJOjjw5srfBhmhtVaypRpDGVBLUNVkHxY+bah
  6eJrTTVs74LTY4xCDvNPqlF2DFSRt01x7edAwgaBy+JaTMgsC+Zs4B2oLtoHagnL
  wqm6R62LmHgFWd0qMHrbtLvh+9BH8W2S3wN/Nw3oPpRQkeYQHPj6/VXvHLmcWt1w
  V8qtoCDs3pCqS4LJZazbD0UCAwEAAQ==
  -----END PUBLIC KEY-----
  `;
  constructor() {
   
    this.datePipe = new DatePipe('en-US')

  }

  encryptHttp(text: string){
 // for future use to encript decirtp full request 
    return text;
  }

  decryptHttp(text: string){
    // for future use to encript decirtp full request 
       return text;
     }

  encryptRSA(text: string): string {
    const mov = this.datePipe.transform(new Date(), 'yyyyMMddhhmmssSSS') + text
    const pk = pki.publicKeyFromPem(this.publicKey) as pki.rsa.PublicKey
    const buffer = util.createBuffer(mov, 'utf8')
    const bytes = buffer.getBytes()

    // encrypt data with a public key using RSAES PKCS#1 v1.5
    const encrypted = pk.encrypt(bytes, 'RSAES-PKCS1-V1_5')

    // base64-encode encrypted data to send to server
    const b64Encoded = util.encode64(encrypted)

    return b64Encoded
  }

  decryptRSA(text: string): string {
    // base64-encode encrypted data to send to server
   
    const PKBody = util.decode64(environment.privateKey);
    const pk = pki.privateKeyFromPem(PKBody);
    return util.decodeUtf8(pk.decrypt(util.decode64(text)));
   
  }



}
