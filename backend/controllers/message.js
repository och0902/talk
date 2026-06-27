import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import { getReceiverSocketId, io } from '../socket/socket.js';

export const sendMessage = async (request, response) => {

   try {

      const senderId = request.user._id;
      const receiverId = request.params.id;
      const { message } = request.body;

      let conversation = await Conversation.findOne({
         participants: { $all: [ senderId, receiverId ] },
      });
      if (!conversation) {
         conversation = await Conversation.create({
            participants: [ senderId, receiverId ], 
         });
      };

      const newMessage = new Message({
         senderId, receiverId, message,
      });
      if ( newMessage ) {
         conversation.messages.push( newMessage._id );
      };

		// await conversation.save();
		// await newMessage.save();
      await Promise.all([conversation.save(), newMessage.save()]);

      // SOCKET IO FUNCTIONALITY WILL GO HERE
		const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId) {
			// io.to(<socket_id>).emit() used to send events to specific client
			io.to(receiverSocketId).emit('newMessage', newMessage);
		};

      response.status(201).json(newMessage);

   } catch (error) {
      console.log('Error in sendMessage controller, ', error.message);
      response.status(500).json({ error: 'Internal Server Error' });
   }

};


export const getMessages = async (request, response) => {
   try {
      const userToChatId = request.params.id;
      const senderId = request.user._id;

      // console.log('userToChatId: ', userToChatId, 'senderId: ', senderId)

      const conversation = await Conversation.findOne({
         participants: { $all: [ senderId, userToChatId ] },
      }).populate('messages');

      // console.log('conversation: ', conversation);

      if (!conversation) {
         return response.status(200).json([]);
      };

      const messages = conversation.messages;
      response.status(200).json(messages);

   } catch (error) {
      console.log('Error in getMessage controller, ', error.message);
      response.status(500).json({ error: 'Internal Server Error' });
   }
};