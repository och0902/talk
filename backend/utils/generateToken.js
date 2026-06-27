import jwt from 'jsonwebtoken';

const generateTokenAndSetCookie = ( userId, response ) => {

   const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

   response.cookie('jwt', token, {
      maxAge: 1 * 1 * 60 * 60 * 1000, //MS
      httpOnly: true, //prevent xss cross-site scripting attacks
      sameSite: 'strict',
      secure: process.env.NODE_ENV !== 'production',
   });

};

export default generateTokenAndSetCookie;