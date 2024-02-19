const { bytesToUtf8, hexToBytes, utf8ToBytes, toHex } = require("ethereum-cryptography/utils")
const signedMsg = JSON.parse(bytesToUtf8(hexToBytes("7b226275636b65745f6e616d65223a227575756c6c222c22636861726765645f726561645f71756f7461223a2230222c2263726561746f72223a22307862623930306561636461383832633763326661356331653534386437653731343964333163636565222c227061796d656e745f61646472657373223a22307862623930306561636461383832633763326661356331653534386437653731343964333163636565222c227072696d6172795f73705f61646472657373223a22307838394131434339314236343244454362433437383934373436393443363036453045306334323062222c227072696d6172795f73705f617070726f76616c223a7b22657870697265645f686569676874223a2234353135303732222c22676c6f62616c5f7669727475616c5f67726f75705f66616d696c795f6964223a34362c22736967223a22467278626c3879474d3446343362766d49737842534366375644677144506f3439616f59686e57614d393879476e5a34476b32485058466631675946586b456c2b766431462b62456a3467774b7054593350474e4b51453d227d2c227669736962696c697479223a225649534942494c4954595f545950455f5055424c49435f52454144227d")))

const json = { "bucket_name": "yyuui", "charged_read_quota": 0, "creator": "0xbb900eacda882c7c2fa5c1e548d7e7149d31ccee", "payment_address": "0xbb900eacda882c7c2fa5c1e548d7e7149d31ccee", "primary_sp_address": "0x89A1CC91B642DECbC4789474694C606E0E0c420b", "primary_sp_approval": { "expired_height": "0", "global_virtual_group_family_id": 0, "sig": "" }, "visibility": 1 }

const unsignedMsg = toHex(utf8ToBytes(JSON.stringify(json)))

console.log(signedMsg, unsignedMsg)