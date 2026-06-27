import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import generateTokenAndSetCookie from '../utils/generateToken.js';

export const signup = async (request, response) => {
   try {

      const { fullName, username, password, confirmPassword, gender } = request.body;

      if( password !== confirmPassword ) {
         return response.status(400).json({ error: `Passwords don't match.` });
      };

      const user = await User.findOne({ username });

      if (user) {
         return response.status(400).json({ error: 'Username already in exists.' });
      };

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const boyProfilePic =  `https://avatar.iran.liara.run/public/boy?username=${username}`;
      const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

      const newUser = new User ({
         fullName,
         username,
         password: hashedPassword,
         gender,
         profilePic: gender === 'male' ? boyProfilePic : girlProfilePic,
      });

      if (newUser) {
      
         generateTokenAndSetCookie( newUser._id, response );

         await newUser.save();

         response.status(201).json({
            _id: newUser._id,
				fullName: newUser.fullName,
				username: newUser.username,
				profilePic: newUser.profilePic,
         });

      } else {
         response.status(400).json({ error: 'Invalid user data' });
      };

   } catch (error) {
      console.log('Error in signup controller, ', error.message);
      response.status(500).json({ error: 'Internal Server Error' });
   }   
};

export const login = async (request, response) => {
   try {
      
      const { username, password } = request.body;
      const user = await User.findOne({ username });
      const isPasswordCorrect = await bcrypt.compare(password, user?.password || '');

      if ( !user || !isPasswordCorrect ) {
         return response.status(400).json({ error: 'Invalid username or password' });
      };

      generateTokenAndSetCookie( user._id, response );
      
      response.status(200).json({
         _id: user._id,
         fullName: user.fullName,
         username: user.username,
         profilePic: user.profilePic,
      });

   } catch (error) {
      console.log('Error in login controller, ', error.message);
      response.status(500).json({ error: 'Internal Server Error' });
   };
   
};

export const logout = (request, response) => {
   try {
      response.cookie('jwt', '', { maxAge: 0 });
      response.status(200).json({ message: 'Logged out successfully' });
   } catch (error) {
      console.log('Error in logout controller, ', error.message);
      response.status(500).json({ error: 'Internal Server Error' });
   }
};