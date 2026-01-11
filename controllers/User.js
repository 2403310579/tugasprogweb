import Users from '../models/UserModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const getUsers = async (req,res) => {
    try {
        const users = await Users.findAll({
          attributes: ['id', 'name', 'email']
        });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Internal Server Error`});
    }
};

export const Register = async (req, res) => {
    const { name, email, password, confPassword } = req.body;
    
    // 1. Validasi kecocokan password
    if (password !== confPassword) return res.status(400).json({ msg: "Password tidak cocok" });

    try {
        // 2. CEK APAKAH EMAIL SUDAH TERDAFTAR (Penting!)
        const userExists = await Users.findOne({ where: { email: email } });
        if (userExists) return res.status(400).json({ msg: "Email sudah terdaftar, gunakan email lain" });

        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);

        await Users.create({
            name: name,
            email: email,
            password: hashPassword,
        });
        res.json({ msg: 'Register Berhasil' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Terjadi kesalahan pada server" });
    }
    
};

export const Login = async (req, res) => {
    try{
      // Cari user berdasarkan email
        const user = await Users.findOne({
            where: {
                email: req.body.email,
            }
        })
        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) return res.status(400).json({msg: 'Password'})
        const userId = user.id;
        const name = user.name;
        const accessToken = jwt.sign({ userId, name}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '20s'
        });
        const refreshToken = jwt.sign({userId, name}, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1s'
        });
        // Simpan refreshToken ke database
        await Users.update(
            { refreshToken: refreshToken },
            {
            where: {
                id: userId,
            },
        }
        )
        res.cookie('refreshToken', refreshToken,{
            httpOnly: true,
            maxAge: 24 * 60 * 80 * 1000,
        });//cookie disimpan di browser
        res.json({ accessToken});
    } catch (error) {
        res.status(404).json({ msg: "User Tidak ditemukan"});
    }
};

//forgot password
export const forgot = async (req, res) => {
  const { id, name ,email, password, confPassword} = req.body;
  if (password !== confPassword)
      return res
          .status(400)
          .json({ msg: `Password dan Confirm Password tidak cocok`});
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
      await Users.update({
          name: name,
          email: email,
          password: hashPassword,
      },{where: {id}
    });
      res.json({ smg: 'Update Berhasil'})
  } catch (error){
      console.log(error);
  }

};


export const Logout = async (req, res) => {
    try {
      const userId = req.userId;
  
      // Validasi: pastikan userId ada
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID tidak tersedia',
        });
      }
  
      // Cek apakah user ada (opsional, tapi baik untuk logging)
      const user = await Users.findByPk(userId);
      if (!user) {
        // User mungkin sudah dihapus, tapi tetap clear cookie
        console.warn(`Logout attempt for non-existent user: ${userId}`);
      } else {
        // Update refresh_token ke null
        const [affectedRows] = await Users.update(
          { refresh_token: null },
          {
            where: { id: userId },
          }
        );
  
        // Logging untuk debugging
        if (affectedRows === 0) {
          console.warn(`No user updated for logout: ${userId}`);
        }
      }
  
      // Clear cookie dengan konfigurasi yang sama saat login
      const cookieOptions = {
        httpOnly: true,
        sameSite: 'strict', // atau 'lax' tergantung frontend/backend domain
        path: '/',
      };
  
      // Jika menggunakan secure cookie di production
      if (process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true;
      }
  
      res.clearCookie('refreshToken', cookieOptions);
  
      // Juga clear cookie lainnya jika ada (accessToken, dll)
      res.clearCookie('accessToken', cookieOptions);
  
      res.status(200).json({
        success: true,
        message: 'Logout berhasil',
      });
    } catch (error) {
      console.error('Logout error:', error);
  
      // Tetap coba clear cookie meski ada error
      try {
        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');
      } catch (clearError) {
        console.error('Error clearing cookies:', clearError);
      }
  
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server saat logout',
      });
    }
  };

  export const deleteUser = async (req, res) => {
    const { id } = req.body;
    try {
          await Users.destroy({
           where: {id}
        });
        res.json({ smg: 'Delete Berhasil'})
    } catch (error){
        console.log(error);
        res.status(500).json({msg:"user tidak ditemukan"});
    }
  
  };