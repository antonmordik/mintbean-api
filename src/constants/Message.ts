enum Message {
  Connect = "CONNECT",
  Connected = "CONNECTED",
  RoomFound = 'ROOM_FOUND',
  FindOpponent = 'FIND_OPPONENT',
  ContactsSend = 'CONTACTS_SEND',
  SendMessage = 'SEND_MESSAGE',
  ReceiveMessage = 'RECEIVE_MESSAGE',
  GetHistory = 'GET_HISTORY',
  Error = "ERROR",
}

export default Message;
